# Reel videos

Put one short vertical clip per reel here. File names must match `RVID` in `js/components.js`:

| Reel (order in `R`) | File |
| --- | --- |
| Shark Restaurant | `shark.mp4` |
| Burger Shot | `burger.mp4` |
| Dim Sum Ting | `dimsum.mp4` |
| Skyline Studio | `skyline.mp4` |
| Pixel Pour | `pixel.mp4` |

If a file is missing, that reel just shows its photo, so you can add clips one at a time.

## Recommended format
9:16 vertical, 5-15 seconds, H.264 MP4, about 720x1280, under ~3 MB each. Audio isn't needed (reels play muted).

Compress a clip:

    ffmpeg -i input.mov -vf "scale=720:-2" -c:v libx264 -crf 28 -preset slow -an -movflags +faststart shark.mp4

Make a clip from one of your photos (slow zoom, 8 seconds):

    ffmpeg -loop 1 -i photo.jpg -t 8 -vf "scale=1440:2560:force_original_aspect_ratio=increase,crop=1440:2560,zoompan=z='min(zoom+0.0008,1.15)':d=200:s=720x1280:fps=25" -c:v libx264 -pix_fmt yuv420p -an -movflags +faststart shark.mp4

GitHub blocks files over 100 MB, so keep clips small (or host them on a CDN and change the URLs in `RVID`).
