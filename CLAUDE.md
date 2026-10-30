@AGENTS.md

Short version for Claude Code:

- Read `docs/modernization/BASELINE.md` before touching build, deps or API.
- The build rewrites `src/d3.js` and exits 0 on errors: build in an isolated
  copy, then check the log, `git status` and the 8 `dist/` files.
- No dependency/lockfile updates, no `dist/` commits, no npm publish, no
  `gh-pages` deploy unless the task explicitly asks for it.
- PRs for the modernization program target `modernize/odc-d3`.
