import {
  rpc as StellarRpc,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  Contract,
  nativeToScVal,
  scValToNative,
} from "@stellar/stellar-sdk";

import { connectWallet, signTx } from "./freighter";

const contractId =
  "CCLOGIBS3JGU5HQ2J3HCH2B4QPMKKFOTRBMW25SZS65O7JE3NPHQO5RW";

const server = new StellarRpc.Server(
  "https://soroban-testnet.stellar.org"
);

// 🔥 cache wallet (no repeated popups)
let cachedUser = null;

export async function getUser() {
  if (cachedUser) return cachedUser;
  cachedUser = await connectWallet();
  return cachedUser;
}

// 🚀 Send transaction
async function sendTx(method, args = []) {
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

// ➕ ADD TASK (matches Rust: add_task(env, task))
export async function createTask(content) {
  return sendTx("add_task", [
    nativeToScVal(String(content), { type: "string" }),
  ]);
}

// 🔁 COMPLETE TASK (matches Rust: complete_task(env, index))
export async function toggleTask(index) {
  return sendTx("complete_task", [
    nativeToScVal(Number(index), { type: "u32" }),
  ]);
}

// 📥 GET TASKS (matches Rust: get_tasks(env))
export async function getTasks() {
  const user = await getUser();
  const contract = new Contract(contractId);
  const account = await server.getAccount(user);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(contract.call("get_tasks"))
    .setTimeout(30)
    .build();

  const result = await server.simulateTransaction(tx);

  if (!result.result?.retval) return [];

  const decoded = scValToNative(result.result.retval);

  console.log("DECODED:", decoded);

  // 🔥 Convert [(string, bool)] → JS objects
  return decoded.map((item) => ({
    content: item?.[0] ?? "",
    completed: item?.[1] ?? false,
  }));
}