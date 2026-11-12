"""Low-memory person matte: streams frames through Robust Video Matting and writes the alpha as a greyscale video.

Unlike matte.py (which keeps every frame for the clean plate and stray-blob cleanup), this holds one frame at a time,
so long cuts (90 s+) fit in a few hundred MB. The recurrent state is reset on hard cuts (frame difference spike).
usage: python matte_stream.py <in.mp4> <alpha.mp4> --model rvm_mobilenetv3_fp32.onnx [--ratio 0.4]
Then: ffmpeg -i in.mp4 -i alpha.mp4 -filter_complex "[0:v][1:v]alphamerge" -c:v libvpx-vp9 -pix_fmt yuva420p out.webm"""
import argparse, subprocess
import numpy as np
import onnxruntime as ort

ap = argparse.ArgumentParser()
ap.add_argument("src"); ap.add_argument("out")
ap.add_argument("--model", required=True); ap.add_argument("--ratio", type=float, default=0.4)
a = ap.parse_args()
probe = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,r_frame_rate",
                        "-of", "csv=p=0", a.src], capture_output=True, text=True).stdout.strip().split(",")
W, H = int(probe[0]), int(probe[1]); fps = probe[2]
rd = subprocess.Popen(["ffmpeg", "-v", "error", "-i", a.src, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
wr = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "gray", "-s", f"{W}x{H}", "-r", fps, "-i", "-",
                       "-c:v", "libx264", "-crf", "12", "-pix_fmt", "yuv420p", a.out], stdin=subprocess.PIPE)
so = ort.SessionOptions(); so.intra_op_num_threads = 4
sess = ort.InferenceSession(a.model, so, providers=["CPUExecutionProvider"])
zero = lambda: [np.zeros((1, 1, 1, 1), np.float32)] * 4
rec = zero(); ratio = np.array([a.ratio], np.float32); prev = None; n = 0
while True:
    buf = rd.stdout.read(W * H * 3)
    if len(buf) < W * H * 3: break
    img = np.frombuffer(buf, np.uint8).reshape(H, W, 3)
    small = img[::8, ::8].astype(np.float32)
    if prev is not None and np.abs(small - prev).mean() > 28: rec = zero()  # hard cut: reset the recurrent state
    prev = small
    src = (img.astype(np.float32) / 255.0).transpose(2, 0, 1)[None]
    fgr, pha, *rec = sess.run(None, {"src": src, "r1i": rec[0], "r2i": rec[1], "r3i": rec[2], "r4i": rec[3], "downsample_ratio": ratio})
    alpha = np.clip(pha[0, 0] * 255, 0, 255).astype(np.uint8)
    wr.stdin.write(alpha.tobytes()); n += 1
    if n % 240 == 0: print(n, flush=True)
wr.stdin.close(); wr.wait(); rd.wait()
print("done", n)
