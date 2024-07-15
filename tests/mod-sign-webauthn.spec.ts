import { LocalKoinos } from "@roamin/local-koinos";
import { Contract, Signer, Transaction, utils, Provider } from "koilib";
import path from "path";
import { randomBytes } from "crypto";
import { beforeAll, afterAll, it, expect } from "@jest/globals";
import * as dotenv from "dotenv";
import * as modAbi from "../build/modsignwebauthn-abi.json";
import { promises as fs } from 'fs';

dotenv.config();

jest.setTimeout(600000);

const verifierAbiPath = path.join(__dirname, "/../node_modules/@veive/verifier-p256/abi/verifier.koilib.abi");

const TEST_DATA = {
    CREDENTIAL_ID: "fDy_0augtGWmEyId1pKCNfiJgh7PHpM9ma3QiEjRlY4",
    PUBLIC_KEY: "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEkOe-rg0JSTZXpREXYNFPSzI3i1uj1NP2041_oYHd9FKwPOowTrf6nP1vD8qkQv5G0CHVoKkTR6ua6FFPuHLLtQ==",
    SIGNATURE: "CitmRHlfMGF1Z3RHV21FeUlkMXBLQ05maUpnaDdQSHBNOW1hM1FpRWpSbFk0EkYwRAIgc6P7ynTGRZrC-zUnLol6gmwF7tKkwTQR5BUG7iYs2HICICDa1yU_Bstlk50hL10ETjk7xEWEoS_YBz9txsZfKTmRGiVJlg3liA6MaHQ0Fw9kdmBbj-SuuaKGMseZXPO6gx2XYwUAAAACIrkBeyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiTUhneE1qSXdZakZsTmpsaVpUQTFZelZsWkRGbU5HWm1aalk0WldZMFl6TXhOamd4TkRKbE5XTTVaV0prTVRnMU5tWmxNamRpWVdGaU4yTmtObUZpTlRZd09XSTBZZyIsIm9yaWdpbiI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCIsImNyb3NzT3JpZ2luIjpmYWxzZX0=",
    TX_ID: "0x1220b1e69be05c5ed1f4fff68ef4c3168142e5c9ebd1856fe27baab7cd6ab5609b4b"
};

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

const verifireSign = Signer.fromWif(process.env.VERIFIER_PRIVATE_KEY);
verifireSign.provider = provider;

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

    const verifierAbiContent = await fs.readFile(verifierAbiPath, 'utf8');
    const verifierAbi = JSON.parse(verifierAbiContent);

    // deploy verifier
    await localKoinos.deployContract(
        verifireSign.getPrivateKey("wif"),
        path.join(__dirname, "../node_modules/@veive/verifier-p256/build/src/verifier.wasm"),
        verifierAbi
    );
});

afterAll(() => {
    // stop local-koinos node
    localKoinos.stopNode();
});

it("register credential", async () => {
    const { operation } = await modContract['register']({
        credential_id: TEST_DATA.CREDENTIAL_ID,
        public_key: TEST_DATA.PUBLIC_KEY
    }, { onlyOperation: true });

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

it("validate signature", async () => {
    const { operation } = await modContract['is_valid_signature']({
        sender: accountSign.address,
        signature: TEST_DATA.SIGNATURE,
        tx_id: TEST_DATA.TX_ID
    }, { onlyOperation: true });

    //send operations
    const tx = new Transaction({
        signer: accountSign,
        provider
    });

    //await tx.pushOperation(setAllowances);
    await tx.pushOperation(operation);
    const rc = await tx.send();
    await tx.wait();

    console.log(rc);
    expect(rc).toBeDefined();
    expect(rc.logs).toContain('[mod-sign-webauthn] valid signature found');
})