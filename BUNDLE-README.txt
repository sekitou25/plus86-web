SIYUAN WEBSITE

Edit only content/. Read content/README.md for the editing guide.
New Markdown files in content/posts/ are indexed automatically.

Preview with automatic indexing and browser reload:
  python3 scripts/preview.py
On macOS, you can also double-click preview.command.

Build for deployment:
  python3 scripts/preview.py --build
Deploy dist/ as the server document root. No runtime services are required.

src/: presentation templates. scripts/: offline builder and preview server.
dist/: generated content and static site assets.
travel-materials/: ignored original photographs, outside the website.
.openai/hosting.json: historical Sites deployment identity.

SHA256SUMS.txt lists checksums for included project files. Git internals and
macOS metadata are omitted. Run a production build to refresh checksums.
