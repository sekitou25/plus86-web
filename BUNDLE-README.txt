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
content/: editable Chinese and English copy and web-ready media.
sources/: map source data and attribution.

The ZIP includes all web-ready videos, screenshots, photographs and fonts.
Original recordings under content/works/, historical source archives, original
travel photographs, macOS metadata and local deployment identity are omitted.
Building and previewing do not require those originals. The optional Swift media
preparation script needs the original recordings if you want to re-encode them.

Machine-readable editions are included:
  dist/llms.txt and dist/llms-full.txt
  dist/read/index.json
  dist/read/zh/ and dist/read/en/ (standalone HTML and Markdown)
They regenerate from content/ without changing the interactive navigation.
The 7 recently added posts have full bilingual editions; the original 8
investment posts retain explicitly labeled Chinese-body fallbacks in English.

Deploy only the CONTENTS of dist/ as the server document root, not this entire
source bundle. Deploying the entire bundle could expose drafts and source files.
The optional site.json url setting enables sitemap generation for your domain.

SHA256SUMS.txt lists checksums for included project files. Git internals and
macOS metadata are omitted. Run a production build to refresh checksums.
