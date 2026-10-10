# Ryan Fan — Portfolio

My personal portfolio, featuring software engineering projects, internship experience, education and a photo journal of life outside work.

The site alternates charcoal and warm beige chapters with locally hosted typography. A desktop scroll sequence reveals the portrait through large type, introduces Ryan, and travels across a photo reel. Work and education retain expandable details; each project has a dedicated detail page. The photo journal supports horizontal browsing and a keyboard-accessible full-image viewer.

At widths below 900px, short viewports, or with reduced motion enabled, the opening becomes a readable sequence with a swipeable photo reel. No wheel events are intercepted. The full content and native disclosures remain usable without JavaScript.

## Featured work

- **[PayCore](https://github.com/fanryan/paycore)** — payment processing and settlement in Go.
- **[LedgerFlow](https://github.com/fanryan/ledgerflow)** — double-entry accounting and reconciliation with Spring Boot.
- **[NUSpot](https://github.com/fanryan/nuspot)** — a team-built campus discovery app.

## Built with

- Astro and TypeScript
- Custom CSS with shared theme tokens
- A small vanilla TypeScript photo viewer
- Fontsource for locally hosted fonts

Pages are generated as static HTML. No database or backend service is required. Photo links and expandable content remain usable without JavaScript.

## Run locally

Use Node.js 24 (see `.nvmrc`).

```sh
npm ci
npm run dev
```

```sh
npm run format:check
npm run test:content
npm run test:motion
npm run build
npm run preview
```

## Project structure

```text
src/
  components/        Reusable UI and page sections
  data/              Profile, experience, projects, education, toolkit and photos
  layouts/           Page shell and metadata
  pages/             Routes and section order
  scripts/           Scroll scene and photo viewer behaviour
  styles/            Theme tokens and section styles
  types/             Content contracts
public/              Photographs and logos
scripts/             Content validation
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the content model, styling conventions and deployment setup.

## Assets

Personal photographs belong to Ryan Fan. Organisation marks belong to their respective owners and identify education and experience; their use does not imply endorsement. Sources are recorded in [ASSET-SOURCES.json](ASSET-SOURCES.json). Fonts retain the licenses supplied with their Fontsource packages.

[GitHub](https://github.com/fanryan) · [LinkedIn](https://linkedin.com/in/fanryan)
