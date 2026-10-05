# Ryan Fan — Portfolio

My personal portfolio, featuring software engineering projects, internship experience, education and a photo journal of life outside work.

The site uses a forest-green and sky-blue visual theme, locally hosted typography, and a responsive layout. Project and experience details expand on demand, while the photo journal supports horizontal browsing and a keyboard-accessible full-image viewer.

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
npm run build
npm run preview
```

## Project structure

```text
src/
  components/        Reusable UI and page sections
  data/              Profile, experience, projects, education and photos
  layouts/           Page shell and metadata
  pages/             Routes and section order
  scripts/           Photo viewer behaviour
  styles/            Theme tokens and section styles
  types/             Content contracts
public/              Photographs, logos and résumé
scripts/             Content validation
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the content model, styling conventions and deployment setup.

## Assets

Personal photographs and résumé belong to Ryan Fan. Organisation marks belong to their respective owners and identify education and experience; their use does not imply endorsement. Sources are recorded in [ASSET-SOURCES.json](ASSET-SOURCES.json). Fonts retain the licenses supplied with their Fontsource packages.

[GitHub](https://github.com/fanryan) · [LinkedIn](https://linkedin.com/in/fanryan)
