@AGENTS.md

Short version for Claude Code:

- Read `docs/modernization/BASELINE.md` before touching build, deps or API.
- Tests: `npm test` (dist/), `npm run test:build` (fresh build); see
  `docs/modernization/TESTING.md`.
- The build rewrites `src/d3.js` (restored after compile errors, not after a
  kill signal) and exits 1 on JS/SCSS compile errors; `dist/` is not replaced
  atomically. Build in an isolated copy and check the 8 `dist/` files.
- Never revert files you did not change in this task; if `src/d3.js` or
  `dist/` were already modified, ask first.
- No dependency/lockfile updates, no `dist/` commits, no npm publish, no
  `gh-pages` deploy unless the task explicitly asks for it.
- PRs for the modernization program target `modernize/odc-d3`.
