import { LocalKoinos } from "@roamin/local-koinos";
import { Contract, Signer, Transaction, utils, Provider } from "koilib";
import path from "path";
import { randomBytes } from "crypto";
import { beforeAll, afterAll, it, expect } from "@jest/globals";
import * as dotenv from "dotenv";
import * as modAbi from "../build/modsignwebauthn-abi.json";

dotenv.config();

jest.setTimeout(600000);

const localKoinos = new LocalKoinos();
const provider = localKoinos.getProvider() as unknown as Provider;

const modSign = new Signer({
    privateKey: randomBytes(32).toString("hex"),
    provider
});

const modContract = new Contract({
    id: modSign.getAddress(),
    abi: modAbi,
    provider
}).functions;

const accountSign = new Signer({
    privateKey: randomBytes(32).toString("hex"),
    provider
});

beforeAll(async () => {
    // start local-koinos node
    await localKoinos.startNode();
    await localKoinos.startBlockProduction();

    // deploy mod contract
    await localKoinos.deployContract(
        modSign.getPrivateKey("wif"),
        path.join(__dirname, "../build/release/ModSignWebauthn.wasm"),
        modAbi
    );
});

afterAll(() => {
    // stop local-koinos node
    localKoinos.stopNode();
});

it("register", async () => {
    const register_args = {
        user: accountSign.address,
        credential_id: "fDy_0augtGWmEyId1pKCNfiJgh7PHpM9ma3QiEjRlY4",
        public_key: "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEkOe-rg0JSTZXpREXYNFPSzI3i1uj1NP2041_oYHd9FKwPOowTrf6nP1vD8qkQv5G0CHVoKkTR6ua6FFPuHLLtQ=="
    };

    const { operation } = await modContract['register'](register_args, { onlyOperation: true });

    //send operations
    const tx = new Transaction({
        signer: accountSign,
        provider
    });

    //await tx.pushOperation(setAllowances);
    await tx.pushOperation(operation);
    const rc = await tx.send();

    expect(rc).toBeDefined();
    await tx.wait();
});