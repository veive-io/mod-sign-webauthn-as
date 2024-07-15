import { System, Protobuf, StringBytes } from "@koinos/sdk-as";
import { verifier } from "./verifier";

export class IVerifier {
    _contractId: Uint8Array;

    /**
     * Create an instance of a verifier contract
     * @example
     * ```ts
     *   const contract = new Verifier(Base58.decode("13VKJR5siD6vMYGCt9U2s8FnpLrejUAiTB"));
     * ```
     */
    constructor(contractId: Uint8Array) {
        this._contractId = contractId;
    }

    /**
     * Verify p256 signature
     * @external
     */
    verify(args: verifier.verify_arguments): verifier.verify_result {
        const argsBuffer = Protobuf.encode(args, verifier.verify_arguments.encode);
        const callRes = System.call(this._contractId, 0xa12dd3a7, argsBuffer);
        if (callRes.code != 0) {
            const errorMessage = `failed to call 'Verifier.verify': ${callRes.res.error && callRes.res.error!.message ? callRes.res.error!.message : "unknown error"}`;
            System.exit(callRes.code, StringBytes.stringToBytes(errorMessage));
        }
        if (!callRes.res.object) return new verifier.verify_result();
        return Protobuf.decode<verifier.verify_result>(callRes.res.object, verifier.verify_result.decode);
    }
}