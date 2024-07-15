import { System } from "@koinos/sdk-as";
import { modsignwebauthn } from "./proto/modsignwebauthn";

export class ModSignWebauthn {
  callArgs: System.getArgumentsReturn | null;

  contractId: Uint8Array = System.getContractId();

  register(args: modsignwebauthn.register_arguments): modsignwebauthn.register_result {
    return new modsignwebauthn.register_result(1);
  }
}