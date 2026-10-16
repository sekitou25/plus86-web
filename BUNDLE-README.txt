SIYUAN WEBSITE - FULL BACKUP

Contents
- dist/: deployable static website, local scripts, logos, map data, photo derivatives.
- travel-materials/: original photographs, journals, import receipts and contact sheets.
- sources/: map source data and image/source notes.
- README.md: project editing and deployment information.
- .openai/hosting.json: existing Sites deployment identity.

Preview
From this extracted folder, run:
  python3 -m http.server 4173 --directory dist --bind 127.0.0.1
Then open http://127.0.0.1:4173/#/travel

Self-hosting
Use dist/ as the web server document root. No build step, database or map API is required.
The original-photo folder is backup material; it is not required for website hosting.

Integrity
SHA256SUMS.txt lists checksums for every included project file.
Git internals and macOS Finder metadata are omitted from this portable backup.
