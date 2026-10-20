# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

## Portfolio and Verdantry routing

The Vercel project serves Verdantry at `/verdantry/` and forwards other paths
(including `/`, `/admin`, and the portfolio assets) to the existing Sites portfolio.
Vite builds into `dist/verdantry`; Vercel must publish **dist**, not
`dist/verdantry`. Existing files are served directly, while nested application
routes fall back to `dist/verdantry/index.html`. Legacy `/shared/:token` links
redirect to `/verdantry/shared/:token`.

- Local development: `npm run dev`, then open `/verdantry/`.
- Production build: `npm run build`.
- Routing checks: `npm run test:routing` after building.
- Compiled Vercel route checks: run `vercel build`, then
  `npm run test:vercel-routing`. The explicit `/` rewrite is necessary: Vercel
  can compile `/:path*` without matching the literal homepage slash.
- Keep using the original Sites URL for portfolio administration until proxy
  sign-in and saving have been verified. The portfolio is currently owner-private;
  the Vercel rewrite does not change its access policy.

Before switching DNS, verify the Vercel preview: `/` and portfolio assets,
`/verdantry/`, direct shared-link reloads, application images/fonts, sign-in,
and cloud synchronization. Confirm Supabase Site URL and redirect allowlists
use the intended `/verdantry/` URL where applicable. Browser-local collection
and session data on another origin do not migrate with DNS; export any local
collection that needs to move.

After verification, add `heinrichnowak.work` in the Vercel project's domain
settings and enter **Vercel's returned DNS records** at the DNS provider.
Do not point this domain directly to Sites for this combined routing setup.
These rules apply to every domain attached to this Vercel deployment;
review the existing `.com` assignment before merging. No DNS, domain,
Supabase, or portfolio sharing settings are changed by this repository update.
