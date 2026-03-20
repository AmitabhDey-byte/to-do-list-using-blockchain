import {
  rpc as StellarRpc,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  Contract,
  Address,
  nativeToScVal,
  scValToNative,
} from "@stellar/stellar-sdk";

import { connectWallet, signTx } from "./freighter";

const contractId = "CCLOGIBS3JGU5HQ2J3HCH2B4QPMKKFOTRBMW25SZS65O7JE3NPHQO5RW"; // 🔴 replace
const server = new StellarRpc.Server("https://soroban-testnet.stellar.org");

export async function getUser() {
  return await connectWallet();
}

// 🚀 send tx
async function sendTx(method, args) {
  const user = await getUser();
  const account = await server.getAccount(user);
  const contract = new Contract(contractId);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();

  const prepared = await server.prepareTransaction(tx);

  const signedXDR = await signTx(prepared.toXDR(), Networks.TESTNET);

  return await server.sendTransaction(
    TransactionBuilder.fromXDR(signedXDR, Networks.TESTNET)
  );
}

// ➕ CREATE
export async function createTask(content) {
  const user = await getUser();

  return sendTx("create_task", [
    Address.fromString(user).toScVal(),
    nativeToScVal(content),
  ]);
}

// 🔁 TOGGLE
export async function toggleTask(index) {
  const user = await getUser();

  return sendTx("toggle_task", [
    Address.fromString(user).toScVal(),
    nativeToScVal(index, { type: "u32" }),
  ]);
}

// 📥 GET (FIXED DECODING)
export async function getTasks() {
  const user = await getUser();
  const contract = new Contract(contractId);
  const account = await server.getAccount(user);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      contract.call(
        "get_tasks",
        Address.fromString(user).toScVal()
      )
    )
    .setTimeout(30)
    .build();

  const result = await server.simulateTransaction(tx);

  if (!result.result?.retval) return [];

  const decoded = scValToNative(result.result.retval);

  console.log("DECODED:", decoded);

  return decoded.map((item) => ({
    content: item.content || item[0] || "",
    completed: item.completed ?? item[1] ?? false,
    timestamp: Number(item.timestamp ?? item[2] ?? 0),
  }));
}