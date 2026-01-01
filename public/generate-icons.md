# PWA Icon Generation Guide

To enable PWA installation, you need to create two icon files:

1. **icon-192.png** - 192x192 pixels
2. **icon-512.png** - 512x512 pixels

## Quick Solution (Online Tool)

1. Go to https://realfavicongenerator.net/ or https://www.pwabuilder.com/imageGenerator
2. Upload your logo or create a simple "Z" icon
3. Generate the icons and download them
4. Place `icon-192.png` and `icon-512.png` in the `frontend/public/` directory

## Using ImageMagick (Command Line)

If you have ImageMagick installed:

```bash
# Create a simple 192x192 icon with "Z" text
convert -size 192x192 xc:#8409BD -gravity center -pointsize 120 -fill white -annotate +0+0 "Z" frontend/public/icon-192.png

# Create a simple 512x512 icon with "Z" text
convert -size 512x512 xc:#8409BD -gravity center -pointsize 320 -fill white -annotate +0+0 "Z" frontend/public/icon-512.png
```

## Using Node.js Script

You can also use a simple Node.js script with `canvas` package to generate the icons programmatically.

## Important Notes

- Icons must be PNG format
- Minimum size is 192x192 for installability
- 512x512 is recommended for better quality
- Icons should have a transparent or solid background
- The manifest.json is already configured to use these icons

