# **Mod Sign Webauthn**

## **Overview**

`ModSignWebauthn` is a module within the Veive protocol that introduces the WebAuthn standard for signing transactions. WebAuthn, part of the FIDO2 project, enables strong authentication using public key cryptography. This module allows users to register their devices and authenticate using passkeys, enhancing security and usability.

Full documentation: https://docs.veive.io/veive-docs/framework/core-modules/mod-sign-webauthn

## **Purpose**

WebAuthn is a web standard for secure authentication, using devices like security keys, smartphones, or built-in platform authenticators (like Windows Hello or Touch ID). Passkeys are the credentials generated during the registration process, comprising a public-private key pair. The public key is stored on the server (or, in this case, on the blockchain), while the private key remains securely on the user's device.

### **Key Components in WebAuthn**

- **Credential ID**: A unique identifier for each registered credential, used to retrieve the public key associated with a user.
- **Public Key**: The public portion of the key pair, used by the server to verify signatures created by the private key.
- **Authenticator Data**: Information provided by the authenticator, including the signature.

### **How `ModSignWebauthn` Works**

1. **Registration**:
   - Users register their devices, generating a public-private key pair. The `register` method stores the public key and the credential ID on the blockchain, linking them to the user's account.

2. **Signature Validation**:
   - When a transaction is signed using WebAuthn, the `is_valid_signature` method is called to validate the signature. This method checks if the signature is valid by:
     - Decoding the transaction's signature data to extract the `credential_id`, `authenticator_data`, and `client_data`.
     - Retrieving the stored public key using the `credential_id`.
     - Verifying the signature against the extracted message using the public key.

This module does not implement the actual cryptographic checks but rather delegates this task to a verifier contract specified by `VERIFIER_CONTRACT_ID`. This separation of concerns allows for the integration of various cryptographic verification methods while keeping the `ModSignWebauthn` module focused on managing WebAuthn credentials and invoking the signature verification process.

## **Usage**

### **Installation**

To install the `ModSignWebauthn` module, first ensure that the Veive protocol is set up on your Koinos blockchain environment. Install the module using yarn:

```bash
yarn add @veive-io/mod-sign-webauthn-as
```

Deploy the module contract on the Koinos blockchain and install it on the desired account using the `install_module` method provided by the Veive account interface. The `on_install` method initializes necessary settings, including the account ID.

### **Scripts**

#### Build

To compile the package, run:

```bash
yarn build
```

#### Dist

To create a distribution, run:

```bash
yarn dist
```

#### Test

To test the package, use:

```bash
yarn jest
```

## **Contributing**

Contributions are welcome! Please open an issue or submit a pull request on the [GitHub repository](https://github.com/veiveprotocol).

## **License**

This project is licensed under the MIT License. See the LICENSE file for details.
