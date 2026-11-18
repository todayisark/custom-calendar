# Agent guide

## Architecture

- `registry/default/calendar/calendar.tsx` is the published Registry source and public API.
- `stories/` imports that source directly; it contains deterministic Storybook scenarios only.
- `registry/**/*.test.tsx` contains observable component behavior tests.
- `.storybook/` and `vitest.config.ts` configure development and browser verification.
- `public/r/` and `storybook-static/` are generated outputs. Do not edit them by hand.

## Change rules

- Preserve `CalendarProps` and exported types unless the task explicitly changes the public API.
- Keep Storybook and test packages in `devDependencies`; consumers receive only Registry files.
- Keep dates, images, and content in tests and stories deterministic.
- Add or update a regression test for every reproducible bug. Test behavior, not DOM structure.
- Do not change Calendar business behavior merely to satisfy a test. Document unexpected existing
  behavior before widening the task.

Follow the repository's existing TypeScript, ESLint, and Prettier rules. Components are arrow
functions, types use `type`, strings use single quotes, and multiline structures keep trailing
commas.

## Verification

- During UI work, run `npm run storybook` and inspect the relevant deterministic Story.
- After source or configuration changes, run `npm run check`.
- Run `npm run test:browser` when rendering, interaction, CSS, stories, or Storybook configuration
  changes. Run `npm run build-storybook` when Storybook build configuration changes.
- If a check fails, fix the cause; do not disable rules, skip tests, or accept stale snapshots.
- At handoff, report each command actually run and its result. Clearly separate unrun checks and
  environment blockers from passing checks.
