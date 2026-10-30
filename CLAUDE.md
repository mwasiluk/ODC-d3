@AGENTS.md

Short version for Claude Code:

- Read `docs/modernization/BASELINE.md` before touching build, deps or API.
- Tests: `npm test` (dist/), `npm run test:build` (fresh build); see
  `docs/modernization/TESTING.md`.
- Build: `npm run build` (Rollup for JS, Dart Sass CLI for CSS; no Gulp or
  Browserify). It writes only `dist/` (tracked), fails with a non-zero exit
  code on JS/SCSS errors and does not replace `dist/` atomically. Build in an
  isolated copy and check the 8 `dist/` files.
- Keep `main` and `browserify.transform` in `package.json`: consumers
  (SilverDecisions) bundle `odc-d3/src/*` with them.
- Never revert files you did not change in this task; if `dist/` was already
  modified, ask first.
- No dependency/lockfile updates, no `dist/` commits, no npm publish, no
  `gh-pages` deploy unless the task explicitly asks for it.
- PRs for the modernization program target `modernize/odc-d3`.
