# Repository instructions

- The application is in `frontend/`; its `package.json` and `package-lock.json` are the only app manifest and lockfile. Run its scripts from `frontend/`: `npm run dev`, `npm run build`, `npm run lint`; use `npm run start` after building. No test or typecheck script is declared.
- This is a single-route app: `frontend/app/page.tsx` composes the character, season, and book sections. Their catalog content comes from `frontend/data/{characters,seasons,books}.json`; the matching loaders normalize it against `frontend/types/content.ts` using `frontend/data/guards.ts`. For content-only changes, edit the JSON and preserve that typed validation boundary.
- Before changing frontend code, follow `frontend/AGENTS.md`; its Next.js-specific rules require consulting the installed guides under `frontend/node_modules/next/dist/docs/`.

## Code comments

- Never write comments in code: no line comments, no block comments, no JSDoc/TSDoc.
- Hard rule with no exceptions: code must be self-explanatory through naming and structure.

## Styling

- Never use the `style` prop or inline styles in JSX.
- Style exclusively with Tailwind CSS utility classes through `className`.
- Hard rule with no exceptions.
