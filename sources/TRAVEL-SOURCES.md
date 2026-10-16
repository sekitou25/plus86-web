# Travel photographs

The travel gallery contains photographs supplied by the site owner in `travel-materials/01-inbox`. Originals remain unchanged and are excluded from Git and deployment archives.

## Import

- Trips: May–October 2026, Italy, Spain, China and Vietnam.
- 63 source files, 60 unique images, 3 exact duplicate copies.
- 59 images prepared for the site, including 22 new images in the October 16 import.
- One JPEG remains pending re-export because its pixel stream cannot be decoded completely.
- DateTimeOriginal is used for chronology; filenames can refer to a later export date.
- Captions describe visible subjects. Personal diary text has not been invented.
- Locations are city or regional labels; precise capture GPS is not published.
- Web derivatives are converted to sRGB and contain no EXIF metadata.
- Full JPEGs use a 2200-pixel maximum dimension; WebP thumbnails use 960 pixels.
- Local import receipt: `travel-materials/03-organized/2026-05-italy-spain/import-manifest.json`.

- Additional import receipt: `travel-materials/03-organized/2026-08-10-china-vietnam/import-manifest.json`.
- Two new photos have no confirmed location and appear under Location pending.
- One exported photo has no recorded capture date; its date is not inferred from its export filename.

## Map

Natural Earth 110m land, public domain:
https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson

Country outlines: Natural Earth 1:10m Admin 0 countries, public domain. Italy, Spain, China and Vietnam are simplified and bundled locally in `dist/assets/travel-atlas-data.js`. Small offshore islands are omitted for this illustrative travel view.
https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_10m_admin_0_countries.geojson

The atlas supports world → country → destination navigation, animated zoom, panning, pinch zoom, keyboard selection and linked photo filters. Locations are approximate destination centers, not precise capture locations. No map tiles, geocoding API or external map service is used at runtime.

D3 7.9.0 is vendored locally at `dist/assets/vendor/d3-7.9.0.min.js`, copyright Mike Bostock, ISC license.
https://github.com/d3/d3/blob/v7.9.0/LICENSE
