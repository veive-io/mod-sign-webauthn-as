### Veive SCA ECDSA Validation Module

This package provides the interface and implementation for an ECDSA signature validation module that adds functionality to the Veive smart account on the Koinos blockchain. It is inspired by the ERC-7579 standard.

ERC-7579 defines a standard interface for modular smart accounts. In this context, a module represents a pluggable unit that adds specific functionality to a smart account. The ECDSA validation module specifically handles the task of validating ECDSA signatures, ensuring the authenticity of transactions.

## Installation

To install the package, use npm or yarn:

```bash
npm install @veive/mod-validate-ecdsa
```

## Scripts

### Build

To compile the package, run:

```bash
yarn build
```

### Release

To create a dist, run:

```bash
yarn dist
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on the [GitHub repository](https://github.com/veiveprotocol).

## License

This project is licensed under the MIT License. See the LICENSE file for details.