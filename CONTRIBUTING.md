# Working on the portfolio

## Common edits

| Change                                                 | File                           |
| ------------------------------------------------------ | ------------------------------ |
| Name, contact links, résumé path, intro and about copy | `src/data/site.ts`             |
| Roles and internship descriptions                      | `src/data/experience.ts`       |
| Projects, repository URLs, stacks and card colours     | `src/data/projects.ts`         |
| Qualifications, awards, activities and exchange        | `src/data/education.ts`        |
| Gallery images, captions and focal points              | `src/data/photos.ts`           |
| Palette, fonts and page widths                         | `src/styles/theme.css`         |
| Section order                                          | `src/pages/index.astro`        |
| Gallery interactions                                   | `src/scripts/photo-journal.ts` |

## Content and components

Content arrays implement the interfaces in `src/types/content.ts`. Add entries to the appropriate data file; existing loops render the additional content. Role status and project colour are explicit fields, so reordering entries does not change their meaning. Project flow diagrams support any number of steps.

`BaseLayout.astro` owns the document shell, fonts, metadata, header and footer. Section components render content using shared headings, disclosures and tags. `EducationCard.astro` handles the common school structure. Keep copy and external URLs in data files rather than scattering them across templates.

## Theme and styling

`src/styles/theme.css` is the source of truth for colour, typography and page-width tokens. The browser theme colour is derived from its `--forest` token at build time. Use these CSS variables in section styles rather than adding literal colours. The static favicon is an independent SVG asset in `public/` and should be updated separately for a full rebrand.

`global.css` defines the stylesheet import order: theme, reset/base, shared UI, section styles, then reduced-motion overrides. Section rules and their responsive adjustments live together. Breakpoints remain literal CSS media queries near the affected components; CSS custom properties cannot be used directly in media-query conditions.

Use `base.css` for element defaults, `shared.css` for reusable UI, and a section stylesheet for layout-specific changes. Avoid appending overrides to unrelated files or using array positions to encode content state. Not every component measurement needs a theme token.

## Add a photo

1. Put an appropriately compressed image in `public/images/`.
2. Add its public path, caption, category, alt text, width, height and focal position to `src/data/photos.ts`.
3. Check its thumbnail and full-photo view on desktop and mobile.

The journal and viewer populate automatically. Landscape images are contained rather than cropped; portrait thumbnails support a focal point. Full images are always contained in the viewer. The gallery also accepts a `photos` prop; use a distinct `id` for each instance if adding another gallery to a page.

## Checks

```sh
npm run format
npm run format:check
npm run test:content
npm run build
```

Formatting uses Prettier and the Astro plugin. Content validation checks local assets, HTTPS links, résumé naming, unique gallery images and required photo metadata. `astro check` verifies TypeScript and component contracts before building. GitHub Actions runs these checks on pushes and pull requests.

For layout or viewer changes, also check narrow/mobile and desktop widths, keyboard opening/navigation, Escape closing, focus return, reduced motion and the résumé download. Do not treat a successful build as a visual check.

## Deployment

Import this repository into Vercel using the repository root (`.`), the Astro preset, `npm run build`, and output directory `dist`. Node.js 24 is recommended. No environment variables are required.

After choosing a production domain, set `site.url` in `src/data/site.ts` to enable canonical and Open Graph URLs. Preview deployments should be reviewed before merging to the production branch. A deployment does not require moving project repositories into this repository.
