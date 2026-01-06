---
description: Runs ESLint and Prettier - checks code formatting, lints for errors, and auto-fixes issues
---

## Purpose

Ensures code quality and consistency across the codebase. This command validates code formatting with Prettier, checks for linting errors with ESLint, and automatically fixes issues where possible.

## What It Does

1. Runs Prettier to check code formatting consistency
2. Runs ESLint to identify code quality issues
3. Auto-fixes formatting and some linting issues (via `bun run format`)
4. Reports any remaining linting violations
5. Uses shared ESLint and Prettier configurations from project root

## Usage Examples

```bash
# Check formatting and lint (no changes)
cd frontend && bun run lint

# Auto-fix formatting and linting issues
cd frontend && bun run format

# Check and format in one go
cd frontend && bun run format && bun run lint

# Run Prettier check only
cd frontend && bunx prettier --check .

# Run ESLint check only
cd frontend && bunx eslint .

# Auto-fix ESLint issues
cd frontend && bunx eslint . --fix
```

## Related Skills

- [Prettier Code Formatter](../../skill/prettier.md) - Automatic code formatting
- [ESLint](../../skill/eslint.md) - JavaScript linter for code quality
- [Code Quality](../../skill/code-quality.md) - Best practices and standards
- [Svelte Linting](../../skill/eslint-svelte.md) - Svelte-specific linting rules
