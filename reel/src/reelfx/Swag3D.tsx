/**
 * Realistic 3D promo swag for the Chocolate Box edit: a clear plastic water bottle, a branded click pen and an open box
 * of foil-wrapped chocolates, lit like the speaker's grey studio (soft key from the left, fill, rim) with studio
 * reflections from a RoomEnvironment. Everything is placed in screen pixels: the camera is set so the z = 0 plane maps
 * 1:1 onto the 1080x1920 frame, so a caller positions an item by its bottom-centre pixel and its height in pixels.
 * All motion comes from props the caller derives from useCurrentFrame(); nothing animates on its own.
 */
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import React, { useMemo } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export type SwagKind = "bottle" | "pen" | "choc";
export type SwagItem = {
  kind: SwagKind;
  /** bottom-centre of the item, in frame pixels */
  x: number;
  y: number;
  /** pixels per model unit (bottle and pen are 1 unit tall; the chocolate box is 1.6 units wide) */
  size: number;
  /** turn about the vertical axis and lean in the picture plane, radians */
  turn: number;
  lean: number;
};

const W = 1080;
const H = 1920;
const FOV = 18;
const DIST = H / 2 / Math.tan((FOV / 2) * (Math.PI / 180));

const Env: React.FC = () => {
  const { gl, scene } = useThree();
  // built during render (not in an effect) so the very first rendered frame already has reflections
  useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.85;
    pmrem.dispose();
  }, [gl, scene]);
  return null;
};

const labelTexture = (draw: (c: CanvasRenderingContext2D, w: number, h: number) => void, w: number, h: number) => {
  const cv = document.createElement("canvas");
  cv.width = w;
  cv.height = h;
  draw(cv.getContext("2d")!, w, h);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};

const useMaterials = () =>
  useMemo(() => {
    const chrome = new THREE.MeshStandardMaterial({ color: "#eef0f4", metalness: 1, roughness: 0.14 });
    // clear PET: the front faces carry the gloss and reflections, the back faces only a faint tint
    const plastic = new THREE.MeshPhysicalMaterial({
      color: "#f2f9ff", metalness: 0, roughness: 0.03, transparent: true, opacity: 0.1, clearcoat: 1, clearcoatRoughness: 0.02,
      ior: 1.5, specularIntensity: 1, envMapIntensity: 0.9, depthWrite: false,
    });
    const plasticBack = new THREE.MeshPhysicalMaterial({ color: "#dcecff", roughness: 0.1, transparent: true, opacity: 0.06, side: THREE.BackSide, depthWrite: false });
    // soft vertical highlight streaks: what makes clear plastic read as clear
    const streak = new THREE.MeshBasicMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      map: labelTexture((c, w, h) => {
        const g = c.createLinearGradient(0, 0, w, 0);
        g.addColorStop(0, "rgba(255,255,255,0)");
        g.addColorStop(0.5, "rgba(255,255,255,0.85)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        c.fillStyle = g;
        c.fillRect(0, 0, w, h);
        const v = c.createLinearGradient(0, 0, 0, h);
        v.addColorStop(0, "rgba(0,0,0,1)");
        v.addColorStop(0.15, "rgba(0,0,0,0)");
        v.addColorStop(0.85, "rgba(0,0,0,0)");
        v.addColorStop(1, "rgba(0,0,0,1)");
        c.globalCompositeOperation = "destination-out";
        c.fillStyle = v;
        c.fillRect(0, 0, w, h);
      }, 64, 256),
    });
    const water = new THREE.MeshPhysicalMaterial({ color: "#9fd0ff", roughness: 0.05, transparent: true, opacity: 0.12, envMapIntensity: 0.6, depthWrite: false });
    const cap = new THREE.MeshPhysicalMaterial({ color: "#2f63d8", roughness: 0.35, clearcoat: 0.6, clearcoatRoughness: 0.2 });
    const bottleLabel = new THREE.MeshStandardMaterial({
      roughness: 0.55,
      map: labelTexture((c, w, h) => {
        c.fillStyle = "#ffffff";
        c.fillRect(0, 0, w, h);
        c.fillStyle = "#2f63d8";
        c.beginPath();
        c.moveTo(0, h * 0.72);
        for (let x = 0; x <= w; x += 8) c.lineTo(x, h * 0.72 + Math.sin(x / 38) * h * 0.06);
        c.lineTo(w, h);
        c.lineTo(0, h);
        c.fill();
        c.font = `800 ${h * 0.26}px Inter, Arial, sans-serif`;
        c.textAlign = "center";
        c.textBaseline = "middle";
        // centred at u = 0.5; the label mesh is turned half a revolution so this side faces the camera
        c.fillText("YOUR LOGO", w * 0.5, h * 0.4);
      }, 1024, 256),
    });
    const penBody = new THREE.MeshPhysicalMaterial({
      roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.05,
      map: labelTexture((c, w, h) => {
        c.fillStyle = "#d42f27";
        c.fillRect(0, 0, w, h);
        // the logo runs along the barrel: the texture's v axis is the pen's length
        c.save();
        c.translate(w * 0.5, h * 0.5);
        c.rotate(-Math.PI / 2);
        c.fillStyle = "#ffffff";
        c.font = `800 ${w * 0.075}px Inter, Arial, sans-serif`;
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText("YOUR LOGO", 0, 0);
        c.restore();
      }, 512, 1024),
    });
    const grip = new THREE.MeshStandardMaterial({ color: "#1d1d22", roughness: 0.85 });
    const tray = new THREE.MeshPhysicalMaterial({ color: "#3a1a10", roughness: 0.42, clearcoat: 0.7, clearcoatRoughness: 0.25 });
    const lid = new THREE.MeshPhysicalMaterial({ color: "#4b1d16", roughness: 0.4, clearcoat: 0.8, clearcoatRoughness: 0.2 });
    const insert = new THREE.MeshStandardMaterial({ color: "#24110a", roughness: 0.9 });
    const cup = new THREE.MeshStandardMaterial({ color: "#5a3420", roughness: 0.75, side: THREE.DoubleSide });
    // low-poly flat shading reads as crinkled foil
    const foil = new THREE.MeshStandardMaterial({ color: "#d9a83c", metalness: 1, roughness: 0.3, flatShading: true });
    const dark = new THREE.MeshPhysicalMaterial({ color: "#3b1f12", roughness: 0.38, clearcoat: 0.5, clearcoatRoughness: 0.3 });
    const gold = new THREE.MeshStandardMaterial({ color: "#d6ad55", metalness: 0.9, roughness: 0.28, side: THREE.DoubleSide });
    const lining = new THREE.MeshStandardMaterial({ color: "#eadcc0", roughness: 0.7, side: THREE.DoubleSide });
    return { chrome, plastic, plasticBack, streak, water, cap, bottleLabel, penBody, grip, tray, lid, insert, cup, foil, dark, gold, lining };
  }, []);
type Mats = ReturnType<typeof useMaterials>;

const Bottle: React.FC<{ m: Mats }> = ({ m }) => {
  const shell = useMemo(() => {
    // radius against height, bottom to neck
    const pts = [
      [0, 0], [0.17, 0], [0.2, 0.015], [0.205, 0.05], [0.198, 0.2], [0.205, 0.24], [0.198, 0.28], [0.205, 0.62], [0.198, 0.66],
      [0.205, 0.7], [0.19, 0.76], [0.14, 0.82], [0.09, 0.86], [0.078, 0.89], [0.078, 0.905],
    ].map(([r, y]) => new THREE.Vector2(r, y));
    return new THREE.LatheGeometry(pts, 64);
  }, []);
  const waterGeo = useMemo(() => {
    const pts = [[0, 0.01], [0.185, 0.01], [0.19, 0.05], [0.19, 0.7], [0, 0.7]].map(([r, y]) => new THREE.Vector2(r, y));
    return new THREE.LatheGeometry(pts, 48);
  }, []);
  return (
    <group>
      <mesh geometry={waterGeo} material={m.water} renderOrder={1} />
      <mesh geometry={shell} material={m.plasticBack} renderOrder={0} />
      <mesh position={[0, 0.45, 0]} rotation={[0, Math.PI, 0]} material={m.bottleLabel} renderOrder={2}>
        <cylinderGeometry args={[0.2065, 0.2065, 0.22, 64, 1, true]} />
      </mesh>
      <mesh geometry={shell} material={m.plastic} renderOrder={3} />
      {/* highlight streaks from the key (left) and the fill (right), on the body and the shoulder */}
      {[
        [-0.62, 0.22, 0.14, 0.2, 0.9],
        [0.85, 0.1, 0.08, 0.2, 0.6],
        [-0.62, 0.16, 0.7, 0.2, 0.9],
      ].map(([theta, len, y0, r, opacity], k) => (
        <mesh key={k} position={[0, y0 + (k === 2 ? 0.04 : len * 2.4), 0]} material={m.streak} renderOrder={4} scale={[1, 1, 1]}>
          <cylinderGeometry args={[r + 0.012, r + 0.012, k === 2 ? 0.1 : 0.42, 12, 1, true, theta - len / 2, len]} />
          <meshBasicMaterial attach="material" {...{ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, map: m.streak.map, opacity, side: THREE.DoubleSide }} />
        </mesh>
      ))}
      <mesh position={[0, 0.95, 0]} material={m.cap}>
        <cylinderGeometry args={[0.088, 0.088, 0.09, 40]} />
      </mesh>
      {/* the cap's grip ridges */}
      {Array.from({ length: 28 }, (_, k) => {
        const a = (k / 28) * Math.PI * 2;
        return (
          <mesh key={k} position={[Math.cos(a) * 0.088, 0.95, Math.sin(a) * 0.088]} rotation={[0, -a, 0]} material={m.cap}>
            <boxGeometry args={[0.006, 0.082, 0.012]} />
          </mesh>
        );
      })}
      <mesh position={[0, 0.9, 0]} material={m.cap}>
        <torusGeometry args={[0.09, 0.008, 8, 40]} />
      </mesh>
    </group>
  );
};

const Pen: React.FC<{ m: Mats }> = ({ m }) => (
  <group>
    <mesh position={[0, 0.003, 0]} material={m.chrome}>
      <sphereGeometry args={[0.006, 12, 12]} />
    </mesh>
    <mesh position={[0, 0.065, 0]} rotation={[Math.PI, 0, 0]} material={m.chrome}>
      <coneGeometry args={[0.046, 0.12, 40]} />
    </mesh>
    <mesh position={[0, 0.225, 0]} material={m.grip}>
      <cylinderGeometry args={[0.05, 0.047, 0.2, 40]} />
    </mesh>
    <mesh position={[0, 0.33, 0]} material={m.chrome}>
      <cylinderGeometry args={[0.051, 0.051, 0.014, 40]} />
    </mesh>
    <mesh position={[0, 0.615, 0]} rotation={[0, Math.PI, 0]} material={m.penBody}>
      <cylinderGeometry args={[0.049, 0.05, 0.56, 48]} />
    </mesh>
    <mesh position={[0, 0.94, 0]} material={m.chrome}>
      <cylinderGeometry args={[0.046, 0.05, 0.09, 40]} />
    </mesh>
    <mesh position={[0, 0.985, 0]} material={m.chrome}>
      <sphereGeometry args={[0.046, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
    </mesh>
    {/* clip */}
    <mesh position={[0, 0.8, 0.066]} material={m.chrome}>
      <boxGeometry args={[0.03, 0.3, 0.012]} />
    </mesh>
    <mesh position={[0, 0.94, 0.058]} material={m.chrome}>
      <boxGeometry args={[0.03, 0.04, 0.02]} />
    </mesh>
    <mesh position={[0, 0.655, 0.064]} material={m.chrome}>
      <sphereGeometry args={[0.017, 16, 12]} />
    </mesh>
  </group>
);

const ChocBox: React.FC<{ m: Mats }> = ({ m }) => {
  const trayGeo = useMemo(() => new RoundedBoxGeometry(1.6, 0.2, 1.0, 4, 0.035), []);
  const lidGeo = useMemo(() => new RoundedBoxGeometry(1.62, 0.05, 1.02, 4, 0.022), []);
  const truffle = useMemo(() => new THREE.SphereGeometry(0.14, 11, 8), []);
  const smooth = useMemo(() => new THREE.SphereGeometry(0.14, 32, 20), []);
  const cupGeo = useMemo(() => new THREE.CylinderGeometry(0.165, 0.13, 0.07, 24, 1, true), []);
  return (
    // tipped towards the camera so the chocolates show, with the lid open and leaning back
    <group rotation={[0.62, 0, 0]} position={[0, 0.06, 0]}>
      <mesh geometry={trayGeo} material={m.tray} position={[0, 0.1, 0]} />
      <mesh material={m.insert} position={[0, 0.201, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.5, 0.9]} />
      </mesh>
      {[0, 1, 2, 3].map((c) =>
        [0, 1].map((r) => {
          const foilWrapped = (c + r) % 2 === 0;
          return (
            <group key={`${c}${r}`} position={[-0.555 + c * 0.37, 0.2, -0.205 + r * 0.41]}>
              <mesh geometry={cupGeo} material={m.cup} position={[0, 0.03, 0]} />
              <mesh geometry={foilWrapped ? truffle : smooth} material={foilWrapped ? m.foil : m.dark} position={[0, 0.1, 0]} scale={[1, 0.82, 1]} rotation={[0.3 * c, 0.7 * r + c, 0]} />
            </group>
          );
        }),
      )}
      <group position={[0, 0.2, -0.5]} rotation={[-1.95, 0, 0]}>
        <mesh geometry={lidGeo} material={m.lid} position={[0, 0, 0.51]} />
        <mesh material={m.gold} position={[0, 0.028, 0.51]}>
          <boxGeometry args={[0.1, 0.012, 1.03]} />
        </mesh>
        <mesh material={m.gold} position={[0, 0.028, 0.51]}>
          <boxGeometry args={[1.63, 0.012, 0.1]} />
        </mesh>
        {/* inside of the lid: a cream card lining with a thin gold border */}
        <mesh material={m.gold} position={[0, -0.027, 0.51]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.5, 0.92]} />
        </mesh>
        <mesh material={m.lining} position={[0, -0.03, 0.51]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.44, 0.86]} />
        </mesh>
      </group>
    </group>
  );
};

const Scene: React.FC<{ items: SwagItem[] }> = ({ items }) => {
  const m = useMaterials();
  return (
    <>
      <Env />
      <ambientLight intensity={0.25} />
      {/* the studio key comes from frame left, a soft fill from the right, a cool rim from behind */}
      <directionalLight position={[-1600, 1400, 2600]} intensity={2.4} color="#fff6ec" />
      <directionalLight position={[1800, 200, 1800]} intensity={0.7} color="#eef2ff" />
      <directionalLight position={[300, 1600, -2400]} intensity={1.6} color="#e6ecff" />
      {items.map((it, i) => (
        <group key={i} position={[it.x - W / 2, H / 2 - it.y, 0]} scale={it.size} rotation={[0, 0, it.lean]}>
          <group rotation={[0, it.turn, 0]}>
            {it.kind === "bottle" ? <Bottle m={m} /> : it.kind === "pen" ? <Pen m={m} /> : <ChocBox m={m} />}
          </group>
        </group>
      ))}
    </>
  );
};

/** Full-frame transparent 3D layer; the camera maps z = 0 onto frame pixels. */
export const Swag3D: React.FC<{ items: SwagItem[] }> = ({ items }) => (
  <ThreeCanvas
    width={W}
    height={H}
    style={{ position: "absolute", inset: 0 }}
    camera={{ fov: FOV, position: [0, 0, DIST], near: DIST * 0.7, far: DIST * 1.3 }}
    gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
  >
    <Scene items={items} />
  </ThreeCanvas>
);
