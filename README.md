# Rapid Cheapskate

Rapid Cheapskate is a My50 Unlimited Travel Pass utilization calculator for Rapid KL
commuters. It estimates how many days in a 30-day pass period you are likely to travel and
compares the pass period with the equivalent cash and Touch 'n Go fares for a selected route.

Try it at [arthurchiakh.github.io/rapidcheapskate](https://arthurchiakh.github.io/rapidcheapskate/).

## What it does

- Calculates usable commuting days during a 30-day My50 pass period.
- Lets you choose an activation date and customize your working days.
- Accounts for public holidays in Kuala Lumpur or Selangor.
- Supports Rapid KL stations across the LRT, MRT, Monorail, and BRT networks included in the
  bundled station data.
- Compares cash and Touch 'n Go costs for single or round trips.
- Displays the pass period as a calendar, separating working days, public holidays, and off days.

The calculator is intended as a planning aid. Fare and holiday information is stored in this
repository and may not reflect later changes by transport operators or government agencies.

## How the calculation works

The application starts with the selected activation date and evaluates the next 30 calendar days.
Each date is classified in this order:

1. Public holiday for the selected region
2. Selected working day
3. Off day

The working-day count becomes the estimated number of travel days. Route costs are calculated by
multiplying the selected route fare by that count and by either one trip or two trips per day.
The result does not model leave, service disruptions, special fares, or journeys made on holidays
and off days.

## Tech stack

- Vue 3 and TypeScript
- Vite
- Vue Router
- Bulma and Sass
- Vitest and Vue Test Utils
- ESLint and Prettier

## Getting started

### Prerequisites

Install [Node.js](https://nodejs.org/) and npm.

### Install and run

```sh
npm install
npm run dev
```

The development server runs at `http://localhost:5173/` by default.

### Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot reload. |
| `npm run build` | Type-check the application and create a production build in `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm run test:unit -- --run` | Run the Vitest suite once. |
| `npm run lint` | Check and automatically fix supported source files. |
| `npm run format` | Format files under `src/` with Prettier. |

## Project structure

```text
src/
  assets/data/       Station metadata
  components/        Reusable selectors, navigation, and result UI
  router/            Application routes
  scss/              Global styles
  services/          Fare, holiday, and utilization calculations
  views/             Home and About pages
public/
  publicHolidays/    Kuala Lumpur and Selangor holiday JSON
  routeFares/        Fare JSON keyed by station-code pair
  img/               Static images and icons
graphic_design/      Editable design sources
```

Fare files use the canonical `<from-station-code>-<to-station-code>.json` naming convention.
Holiday files use `<region>-<year>.json`. The current date picker and bundled holiday data cover
2023 through 2026.

## Configuration and deployment

`VITE_BASE_URL` controls the base URL used by Vite and by requests for fare and holiday JSON:

- `.env` points local development to `http://localhost:5173/`.
- `.env.production` points production to the GitHub Pages project URL.

The application uses hash-based routing so it works when hosted from a GitHub Pages subpath.
Pushes to `main` run the workflow in `.github/workflows/static.yml`, which builds the project and
deploys `dist/` to GitHub Pages.

## Contributing

Keep changes focused and run the following checks before opening a pull request:

```sh
npm run test:unit -- --run
npm run build
```

When changing fare or holiday data, validate the JSON and preserve the existing file naming
conventions. Report bugs or request enhancements through
[GitHub Issues](https://github.com/arthurchiakh/rapidcheapskate/issues).

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE).
