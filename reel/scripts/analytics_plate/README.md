# Analytics video: edit of the real screen recording

Instead of rebuilding the page, the real recording (screen-capture_4, 1920x842, Windows Chrome at 125% scale) is kept
and only the data is changed, so fonts, spacing, icons, scroll, cursor and compression are the original ones.

1. `register.py` - per-frame scroll offset of the page (30 fps), by matching each frame to the stitched page.
2. `plate.py` - stitched full page (4785 px tall), per-pixel median of all aligned frames, chat button excluded.
3. `build.py` (+ `lib.py`, `util.py`) - edits the page plate into the dataset in `src/data/analytics-demo.json`
   (made by `scripts/analytics_data.py`). Text is drawn with Inter by Chrome at device scale 1.25, with sizes,
   weights, colours and baselines calibrated against the original glyphs (`fit.py`).
4. `comp.py` - writes the video: each original frame, with the edited pixels of the page at that frame's scroll
   offset; the real cursor, chat button, scrollbar and hover tints stay from the recording.

Client rules applied: no doctor names (header user is Amanda, status board shows patients), no red (notification
badge purple, leak rows amber, closed segment grey), staff Amanda / Tanya / Barbara.
