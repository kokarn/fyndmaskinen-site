# AGENTS.md

## Cursor Cloud specific instructions

### Overview
Fyndmaskinen is a React SPA (Create React App) — a Swedish second-hand marketplace aggregator. It is a **frontend-only** repository; the backend GraphQL API (`api.fyndmaskinen.se`) and Auth0 are external services not included here.

### Running the dev server
```
npm run dev   # starts react-scripts on port 3000
```

### Lint
```
npx eslint src/**/*.js --fix
```
The ESLint config is inline in `package.json`. The warning about React version not being specified is benign.

### Tests
```
CI=true npx react-scripts test --watchAll=false
```
**Note:** `src/App.test.js` is a pre-existing failing test (uses deprecated React 17 `ReactDOM.render` API while the app uses React 18 `createRoot`). It is also listed in the ESLint ignore patterns, confirming it is known to be outdated. Do not attempt to fix it unless explicitly asked.

### Build
```
npm run build
```

### Key caveats
- **Backend API:** When running on `localhost`, `src/index.js` sets `window.API_HOSTNAME` to `http://192.168.1.218:4080` (a local network address). This API is not available in cloud environments. The app will load and be interactive, but search results and data will not populate. This is expected.
- **Auth0:** Authentication requires the external Auth0 tenant (`fyndmaskinen.eu.auth0.com`). Login flows will redirect externally but may not work without proper Auth0 configuration for the current origin.
- **Node version:** `package.json` specifies `engines.node: "^20.0.0"`. Node 22 works fine despite the engine warning during `npm install`.
