# @zyntra-js/eslint-config

[![npm version](https://badge.fury.io/js/@zyntra-js%2Feslint-config.svg)](https://www.npmjs.com/package/@zyntra-js/eslint-config)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A carefully crafted ESLint and Prettier configuration preset for modern JavaScript and TypeScript projects. Enforce consistent code style and catch potential errors before they make it to production.

## Features

- 🎯 Optimized for TypeScript and JavaScript
- ⚡ Works seamlessly with Prettier
- 🔧 Zero configuration needed
- 📦 Easy to extend and customize

## Installation & Usage

### React (with Next.js)
Install dependencies:

```bash
npm i -D eslint @zyntra-js/eslint-config
```

Inside `.eslintrc.json`:
```json
{
  "extends": [
    "@zyntra-js/eslint-config/next",
    "next/core-web-vitals"
  ]
}
```

### React (without Next.js)
Install dependencies:

```bash
npm i -D eslint @zyntra-js/eslint-config
```

Inside `.eslintrc.json`:
```json
{
  "extends": "@zyntra-js/eslint-config/react"
}
```

### Node.js
Install dependencies:

```bash
npm i -D eslint @zyntra-js/eslint-config
```

Inside `.eslintrc.json`:
```json
{
  "extends": "@zyntra-js/eslint-config/node"
}
```

### With Prettier

This config includes Prettier settings. Add a `prettier.config.js` to your project:

```javascript
module.exports = require('@zyntra-js/eslint-config/prettier')
```

## What's Included

This configuration includes settings for:

- ESLint recommended rules
- TypeScript ESLint rules
- React and JSX/TSX support
- Import/Export rules
- Prettier integration

## Customization

You can override any rules by adding them to your ESLint config file:

```json
{
  "extends": "@zyntra-js/eslint-config",
  "rules": {
    // Your custom rules here
  }
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details

## Support

- 📝 [Documentation](https://zyntrajs.com/docs)
- 🐛 [Issue Tracker](https://github.com/matheuszwilk/zyntra-js/issues)
- 💬 [Discussions](https://github.com/matheuszwilk/zyntra-js/discussions)

---

Made with ❤️ by Matheus Pereira
