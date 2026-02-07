# Contributing to ZyntraJS

First off, thanks for taking the time to contribute! ❤️

All types of contributions are encouraged and valued. See the [Table of Contents](#table-of-contents) for different ways to help and details about how this project is handled.

Please make sure to read the relevant section before making your contribution. It will make it a lot easier for us maintainers and smooth out the experience for all involved. The community looks forward to your contributions.

## Table of Contents

- [I Have a Question](#i-have-a-question)
- [I Want To Contribute](#i-want-to-contribute)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)
- [Your First Code Contribution](#your-first-code-contribution)
- [Development Setup](#development-setup)
- [Styleguides](#styleguides)

## Development Setup

This repository is a **monorepo** managed with `turborepo` and `npm workspaces`.

### 1. Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/matheuszwilk/zyntra-js.git

# Install dependencies
npm install
```

### 3. Workflow Commands

We use `turbo` to run tasks across packages.

```bash
# Build all packages
npm run build

# Run tests
npm test

# Run tests for a specific package (e.g., core)
npm test --filter=@zyntra-js/core

# Lint code
npm run lint

# Format code
npm run format
```

## Pull Request Process

1.  Fork the repo and create your branch from `main`.
2.  If you've added code that should be tested, add tests.
3.  If you've changed APIs, update the documentation.
4.  Ensure the test suite passes (`npm test`).
5.  Make sure your code lints (`npm run lint`).
6.  Open a Pull Request!

## Code Style

- **TypeScript**: We use strict TypeScript. No `any` unless absolutely necessary.
- **Formatting**: We use Prettier. Run `npm run format` before committing.
- **Linting**: We use ESLint.

## Reporting Bugs

Report bugs using [GitHub Issues](https://github.com/matheuszwilk/zyntra-js/issues).

## License

By contributing, you agree that your contributions will be licensed under its MIT License.