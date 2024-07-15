import { Writer, Reader } from "as-proto";

export namespace verifier {
  export class verify_arguments {
    static encode(message: verify_arguments, writer: Writer): void {
      const unique_name_signature = message.signature;
      if (unique_name_signature !== null) {
        writer.uint32(10);
        writer.bytes(unique_name_signature);
      }

      const unique_name_public_key = message.public_key;
      if (unique_name_public_key !== null) {
        writer.uint32(18);
        writer.bytes(unique_name_public_key);
      }

      const unique_name_msg = message.msg;
      if (unique_name_msg !== null) {
        writer.uint32(26);
        writer.bytes(unique_name_msg);
      }
    }

    static decode(reader: Reader, length: i32): verify_arguments {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new verify_arguments();

      while (reader.ptr < end) {
        const tag = reader.uint32();
        switch (tag >>> 3) {
          case 1:
            message.signature = reader.bytes();
            break;

          case 2:
            message.public_key = reader.bytes();
            break;

          case 3:
            message.msg = reader.bytes();
            break;

          default:
            reader.skipType(tag & 7);
            break;
        }
      }

      return message;
    }

    signature: Uint8Array | null;
    public_key: Uint8Array | null;
    msg: Uint8Array | null;

    constructor(
      signature: Uint8Array | null = null,
      public_key: Uint8Array | null = null,
      msg: Uint8Array | null = null
    ) {
      this.signature = signature;
      this.public_key = public_key;
      this.msg = msg;
    }
  }

  @unmanaged
  export class verify_result {
    static encode(message: verify_result, writer: Writer): void {
      if (message.value != 0) {
        writer.uint32(8);
        writer.int64(message.value);
      }
    }

    static decode(reader: Reader, length: i32): verify_result {
      const end: usize = length < 0 ? reader.end : reader.ptr + length;
      const message = new verify_result();

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