import { Writer, Reader } from "as-proto";

export namespace modsignwebauthn {
  export class credential {
    static encode(message: credential, writer: Writer): void {
      const unique_name_public_key = message.public_key;
      if (unique_name_public_key !== null) {
        writer.uint32(10);
        writer.bytes(unique_name_public_key);
      }
    }

    static decode(reader: Reader, length: i32): credential {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new credential();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.public_key = reader.bytes();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    public_key: Uint8Array | null;

    constructor(public_key: Uint8Array | null = null) {
      this.public_key = public_key;
    }
  }

  export class register_arguments {
    static encode(message: register_arguments, writer: Writer): void {
      const unique_name_credential_id = message.credential_id;
      if (unique_name_credential_id !== null) {
        writer.uint32(18);
        writer.string(unique_name_credential_id);
      }

      const unique_name_public_key = message.public_key;
      if (unique_name_public_key !== null) {
        writer.uint32(26);
        writer.bytes(unique_name_public_key);
      }
    }

    static decode(reader: Reader, length: i32): register_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new register_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 2:
            message.credential_id = reader.string();
            break;

          case 3:
            message.public_key = reader.bytes();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    credential_id: string | null;
    public_key: Uint8Array | null;

    constructor(
      credential_id: string | null = null,
      public_key: Uint8Array | null = null
    ) {
      this.credential_id = credential_id;
      this.public_key = public_key;
    }
  }

  export class authentication_data {
    static encode(message: authentication_data, writer: Writer): void {
      const unique_name_credential_id = message.credential_id;
      if (unique_name_credential_id !== null) {
        writer.uint32(10);
        writer.string(unique_name_credential_id);
      }

      const unique_name_signature = message.signature;
      if (unique_name_signature !== null) {
        writer.uint32(18);
        writer.bytes(unique_name_signature);
      }

      const unique_name_authenticator_data = message.authenticator_data;
      if (unique_name_authenticator_data !== null) {
        writer.uint32(26);
        writer.bytes(unique_name_authenticator_data);
      }

      const unique_name_client_data = message.client_data;
      if (unique_name_client_data !== null) {
        writer.uint32(34);
        writer.bytes(unique_name_client_data);
      }
    }

    static decode(reader: Reader, length: i32): authentication_data {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new authentication_data();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.credential_id = reader.string();
            break;

          case 2:
            message.signature = reader.bytes();
            break;

          case 3:
            message.authenticator_data = reader.bytes();
            break;

          case 4:
            message.client_data = reader.bytes();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    credential_id: string | null;
    signature: Uint8Array | null;
    authenticator_data: Uint8Array | null;
    client_data: Uint8Array | null;

    constructor(
      credential_id: string | null = null,
      signature: Uint8Array | null = null,
      authenticator_data: Uint8Array | null = null,
      client_data: Uint8Array | null = null
    ) {
      this.credential_id = credential_id;
      this.signature = signature;
      this.authenticator_data = authenticator_data;
      this.client_data = client_data;
    }
  }
}
