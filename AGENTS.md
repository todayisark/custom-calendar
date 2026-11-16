# Project conventions

## Code style

- Declare React components with arrow functions.
- Prefer function expressions for ordinary functions; arrow functions are allowed.
- Prefer `type` for TypeScript type definitions. Do not use `interface`.
- Use single quotes and semicolons.
- Prefer lines no longer than 100 characters.
- Keep trailing commas in multiline structures.
- Always wrap arrow function parameters in parentheses.

## Static analysis

- TypeScript checks unused variables and parameters.
- ESLint reports unused imports as errors.
- Preserve the core lint rules appropriate for the installed framework and tool versions. Do not
  disable checks accidentally while migrating configuration.
- When Prettier and ESLint overlap, configure them using the compatibility mechanism supported by
  the installed versions. Prettier owns formatting; ESLint owns code-quality rules.

## Tooling changes

- Before upgrading or migrating a framework or tool, read the official documentation for the
  version installed in this repository.
- Do not copy configuration written for an older version, downgrade the core framework to silence
  warnings, or remove core checks merely to make a command pass.
- When cleaning generated templates, remove only confirmed unused demo assets and placeholder
  copy. Keep dependencies and project infrastructure that are planned for use.

## Required checks

Run `npm run check` after changing source code or project configuration.
