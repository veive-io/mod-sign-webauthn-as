### Veive SCA Webauthn Signature Validation Module

The `ModSignWebauthn` class is a WebAuthn signature validation module designed for the Koinos blockchain. It extends the `ModSign` module from the Veive protocol, providing functionality to register WebAuthn credentials and validate signatures.

## Overview

The `ModSignWebauthn` module allows users to register their WebAuthn credentials, including the credential ID and public key, and validate WebAuthn signatures. This is useful for integrating WebAuthn-based authentication and signature validation in decentralized applications on the Koinos blockchain.

## How It Works

### Credential Registration

When a user registers their WebAuthn credential, the module stores the credential ID and public key. This information is used later to validate signatures.

### Signature Validation

When validating a signature, the module performs the following steps:
1. Decode the authentication data from the signature.
2. Retrieve the registered credential using the credential ID.
3. Extract the public key and signature from the authentication data.
4. Verify the signature using the public key and the message.
5. Check that the transaction ID matches the challenge from the client data.

## Installation

To install the package, use npm or yarn:

```bash
npm install @veive/mod-sign-webauthn
```

## Usage

### Importing the Package

First, import the necessary components from the package:

```typescript
import { ModSignWebauthn } from '@veive/mod-sign-webauthn';
```

## Interface and Methods

The `ModSignWebauthn` class provides several methods for managing WebAuthn credentials and validating signatures. Below is a brief overview of the key methods:

### `register`
Registers a WebAuthn credential by storing the credential ID and public key.

### `is_valid_signature`
Validates a WebAuthn signature by decoding the authentication data and verifying the signature using the registered public key.

### `manifest`
Returns the manifest of the module, including the name, description, and type ID.

## Scripts

### Build

To compile the package, run:

```bash
yarn build
```

### Test

To run the tests, run:

```bash
yarn jest
```

### Dist

To create a distribution, run:

```bash
yarn dist
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request on the [GitHub repository](https://github.com/veiveprotocol).

## License

This project is licensed under the MIT License. See the LICENSE file for details.