# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fyndmaskinen is a Swedish aggregated search engine for second-hand marketplaces (Tradera, Blocket, Auctionet, Bukowskis, Uppsala Auktionskammare, and smaller auction houses). Users can search across all sources simultaneously and set up watched searches with email notifications. The UI is in Swedish.

## Commands

- `npm start` / `npm run dev` — Start dev server (Create React App)
- `npm run build` — Production build (runs postbuild script that generates sitemap)
- `npm run pretest` — Lint with ESLint (`eslint src/**/*.js --fix`)
- `npm test` — Run tests (react-scripts test)
- `npm run analyze` — Bundle analysis

## Architecture

**Create React App** project (react-scripts 5) with React 18, no TypeScript.

### Backend communication
All API calls go through a **GraphQL endpoint** at `window.API_HOSTNAME` (`https://d2cmhnbxvwhy7s.cloudfront.net/graphql`). Queries are built as raw template-literal strings in `src/features/` and sent via `fetch` — there is no GraphQL client library. Authenticated requests use Auth0 Bearer tokens.

### Key libraries
- **Auth0** (`@auth0/auth0-react`) — authentication, token management
- **React Query v3** (`react-query`) — server state, caching, refetch logic. Query functions receive `{ queryKey }` and use array elements for parameters.
- **MUI v5** (`@mui/material`) — UI components. Grid uses `@mui/material/Unstable_Grid2`.
- **React Router v6** — routing

### Source structure
- `src/features/` — API call functions (search, add/remove/get watches, get watch limit). Each exports a single function.
- `src/sources.js` — Defines the marketplace sources with IDs, labels, and icon components.
- `src/hooks/` — `useApi` (authenticated fetch wrapper), `useDebounce`, `useStateWithLocalStorage`
- `src/components/` — Reusable UI components (each in its own directory with `index.js`)
- `src/pages/` — Route-level pages: main (landing/search), search (results), profile (watches), deals, admin

### Global state
- `window.API_HOSTNAME`, `window.PORTAL_URL`, `window.PURCHASE_URL` are set in `src/index.js`
- Source filter preferences are persisted to localStorage via `useStateWithLocalStorage`

## ESLint

Uses `eslint-config-kokarn/react` with `plugin:react/jsx-runtime`. Notable enforced rules:
- JSX props must be sorted alphabetically (`react/jsx-sort-props`)
- No inline functions in JSX props (`react/jsx-no-bind`, DOM components exempt)
- Closing brackets line-aligned
- Comma-dangle warnings

## Conventions

- Components use `.jsx` extension for files with JSX, `.js` for plain logic
- Spaces around `=` in JSX props: `prop = {value}` (not `prop={value}`)
- Array bracket spacing: `queryKey[ 1 ]` (spaces inside brackets)
- Pages return arrays of React elements (with `key` props) rather than wrapping fragments
