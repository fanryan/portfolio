# Ryan Fan — Portfolio

Standalone Astro + TypeScript portfolio, with locally hosted fonts and photos. No database, backend service or external font requests.

## Develop

Requires Node.js 22.12+ (Node 24 LTS recommended).

```sh
npm ci
npm run dev
```

## Validate and build

```sh
npm run build
npm run preview
```

## Content

- `src/data/content.ts`: experience and project summaries, details, stacks and links.
- `src/pages/index.astro`: introduction, education, hall activities and personal copy.
- `src/styles/global.css`: forest + sky palette and responsive styling.
- `public/images`: photos and organisation logos. Keep names stable to replace assets.

Keep TikTok marked incoming until the role starts; update the description only when there is completed work to describe. CSIT is intentionally abstracted, with the correct Python/FastMCP/SQLite stack. Do not publish the private architecture diagram. The removed F1 photograph is not included.

## Vercel

Push this directory as the root of its own GitHub repository. Import the repository into Vercel and select Astro. Build command: `npm run build`; output directory: `dist`. No environment variables are required. If importing the parent workspace instead, set the Root Directory to `portfolio`.

Preview deployments can be reviewed before merging to the production branch. Connect a custom domain in Vercel when selected; then add the production `site` URL to `astro.config.mjs` and absolute canonical/social sharing URLs to the page head. No placeholder domain is configured.

## Assets

Personal photographs supplied by Ryan. Organisation logos sourced from their public websites; see `ASSET-SOURCES.json`. Branding does not imply endorsement. Font licenses are included in their Fontsource packages. Photos open in a keyboard-accessible viewer, with direct image links as a no-JavaScript fallback. Native details controls work without JavaScript.

## Adding photos

Put the image in `public/images/`, then add one entry to `src/data/photos.ts` with its path, caption, category, descriptive alt text and pixel dimensions. The horizontal photo journal and viewer include it automatically; no layout changes are needed. Landscape photos are shown in full so group photos do not lose people at the edges. Portrait thumbnails can set a focal point using `position`; the viewer always shows the full image.
