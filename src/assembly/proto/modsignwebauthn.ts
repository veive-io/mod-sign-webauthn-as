import { Writer, Reader } from "as-proto";

export namespace modsignwebauthn {
  export class register_arguments {
    static encode(message: register_arguments, writer: Writer): void {
      const unique_name_user = message.user;
      if (unique_name_user !== null) {
        writer.uint32(10);
        writer.bytes(unique_name_user);
      }

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
          case 1:
            message.user = reader.bytes();
            break;

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

    user: Uint8Array | null;
    credential_id: string | null;
    public_key: Uint8Array | null;

    constructor(
      user: Uint8Array | null = null,
      credential_id: string | null = null,
      public_key: Uint8Array | null = null
    ) {
      this.user = user;
      this.credential_id = credential_id;
      this.public_key = public_key;
    }
  }

  @unmanaged
  export class register_result {
    static encode(message: register_result, writer: Writer): void {
      if (message.value != 0) {
        writer.uint32(8);
        writer.int64(message.value);
      }
    }

    static decode(reader: Reader, length: i32): register_result {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new register_result();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.value = reader.int64();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    value: i64;

    constructor(value: i64 = 0) {
      this.value = value;
    }
  }
}
