import { StringBytes, System, Storage, Base58, Base64, Arrays, Protobuf } from "@koinos/sdk-as";
import { modsignwebauthn } from "./proto/modsignwebauthn";
import { ModSign, modsign, MODULE_SIGN_TYPE_ID } from "@veive/mod-sign-as";
import { base64urlToBase64, bytesToHexString, extractMsg, extractPublicKey, extractSignature, getValueFromJSON } from "./utils";
import { IVerifier } from "./verifier/IVerifier";
import { verifier } from "./verifier/verifier";

const CREDENTIAL_STORAGE_SPACE_ID = 1;
const VERIFIER_CONTRACT_ID = "13VKJR5siD6vMYGCt9U2s8FnpLrejUAiTB";

export class ModSignWebauthn extends ModSign {
  callArgs: System.getArgumentsReturn | null;

  contractId: Uint8Array = System.getContractId();

  credential_storage: Storage.Map<Uint8Array, modsignwebauthn.credential> =
    new Storage.Map(
      this.contractId,
      CREDENTIAL_STORAGE_SPACE_ID,
      modsignwebauthn.credential.decode,
      modsignwebauthn.credential.encode,
      () => new modsignwebauthn.credential()
    );

  /**
   * @external
   */
  register(args: modsignwebauthn.register_arguments): void {
    //const isAuthorized = System.checkAuthority(authority.authorization_type.contract_call, args.user!);
    //System.require(isAuthorized, `not authorized by ${Base58.encode(args.user!)}`);
  
    const public_key = args.public_key!;
    const credential_id = args.credential_id!;

    const credential = new modsignwebauthn.credential(public_key);
    const credential_id_bytes = StringBytes.stringToBytes(credential_id);
    this.credential_storage.put(credential_id_bytes, credential);
  }

  /**
 * Validates an WebauthN signature to ensure the authenticity of a transaction.
 * 
 * This method checks the length of the provided signature, recovers the public key from the signature
 * and transaction ID, and verifies that the recovered address matches the expected sender.
 * 
 * @external
 */
  is_valid_signature(args: modsign.is_valid_signature_args): modsign.is_valid_signature_result {
    const result = new modsign.is_valid_signature_result(false);

    // Check if the signature length is not ECDSA
    if (args.signature!.length != 65) {
      const tx_signature = args.signature!;
      const tx_id = args.tx_id!;

      const tx_signature_decoded = Protobuf.decode<modsignwebauthn.authentication_data>(tx_signature, modsignwebauthn.authentication_data.decode);
      const credential_id = tx_signature_decoded.credential_id!;
      const signature = tx_signature_decoded.signature!;
      const authenticator_data = tx_signature_decoded.authenticator_data!;
      const client_data = tx_signature_decoded.client_data!;

      const client_data_decoded = StringBytes.bytesToString(client_data);

      const challenge_base64url = getValueFromJSON(client_data_decoded, "challenge");
      const challenge_base64 = base64urlToBase64(challenge_base64url!);
      const tx_id_str = '0x' + bytesToHexString(tx_id);
      const tx_id_base64 = Base64.encode(StringBytes.stringToBytes(tx_id_str));
      //let origin = getValueFromJSON(client_data_decoded, "origin");
      //let crossOrigin = getValueFromJSON(client_data_decoded, "crossOrigin");

      // search for registered credential
      const credential_id_bytes = StringBytes.stringToBytes(credential_id);
      const credential = this.credential_storage.get(credential_id_bytes);
      if(credential == null || credential.public_key == null) {
        System.log(`[mod-sign-webauthn] credential not registered`);
        return result;
      }

      const t_public_key = extractPublicKey(credential.public_key!);
      const t_signature = extractSignature(signature);
      const t_msg = extractMsg(authenticator_data, client_data);

      // verify p256 signature
      const verifierContract = new IVerifier(Base58.decode(VERIFIER_CONTRACT_ID));
      const verify = verifierContract.verify(new verifier.verify_arguments(t_signature, t_public_key, t_msg)).value;
      if (verify != 1) {
        System.log(`[mod-sign-webauthn] invalid signature`);
        return result;
      }

      if (!Arrays.equal(Base64.decode(tx_id_base64), Base64.decode(challenge_base64))) {
        System.log(`[mod-sign-webauthn] txId mismatch [tx_id: ${tx_id_base64}] [challenge: ${challenge_base64}]`);
        return result;
      }

      // TODO attivare in produzione
      /*
      if (VEIVE_ORIGIN != origin) {
        System.log(`[mod-sign-webauthn] origin mismatch [origin: ${origin}] [VEIVE_ORIGIN: ${VEIVE_ORIGIN}]`);
        return result;
      }
      */

      // TODO attivare in produzione
      /*
      if ("false" != crossOrigin) {
        System.log(`[mod-sign-webauthn] crossOrigin not match [crossOrigin: ${crossOrigin}] [VEIVE_CROSSORIGIN: false]`);
        return result;
      }
      */

      System.log(`[mod-sign-webauthn] valid signature found`);
      result.value = true;
    }

    return result;
  }

  /**
   * @external
   * @readonly
   */
  manifest(): modsign.manifest {
    const result = new modsign.manifest();
    result.name = "WebauthN signature validator";
    result.description = "Module for validation of WebauthN signatures";
    result.type_id = MODULE_SIGN_TYPE_ID;
    return result;
  }
}