import {
  rpc as StellarRpc,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  Contract,
  Address,
  nativeToScVal,
  scValToNative
} from "@stellar/stellar-sdk";

const contractId = "YOUR_CONTRACT_ID";
const server = new StellarRpc.Server("https://soroban-testnet.stellar.org");

// 🔐 get wallet
export async function getUser() {
  if (!window.freighter) {
    alert("Install Freighter");
    throw new Error("Freighter not found");
  }

  return await window.freighter.getPublicKey();
}

// 🚀 send tx
async function sendTx(method, args) {
  const user = await getUser();
  const account = await server.getAccount(user);
  const contract = new Contract(contractId);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();

  const prepared = await server.prepareTransaction(tx);

  console.log("Prepared TX:", prepared);

  const signed = await window.freighter.signTransaction(
    prepared.toXDR(),
    Networks.TESTNET
  );

  return await server.sendTransaction(
    TransactionBuilder.fromXDR(signed, Networks.TESTNET)
  );
}

//
// ➕ CREATE TASK
//
export async function createTask(content) {
  const user = await getUser();

  return sendTx("create_task", [
    Address.fromString(user).toScVal(),        // ✅ FIXED
    nativeToScVal(content)                     // ✅ FIXED
  ]);
}

//
// 🔁 TOGGLE TASK
//
export async function toggleTask(index) {
  const user = await getUser();

  return sendTx("toggle_task", [
    Address.fromString(user).toScVal(),        // ✅ FIXED
    nativeToScVal(index, { type: "u32" })      // ✅ FIXED
  ]);
}

//
// 📥 GET TASKS
//
export async function getTasks() {
  const user = await getUser();
  const contract = new Contract(contractId);
  const account = await server.getAccount(user);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET
  })
    .addOperation(
      contract.call(
        "get_tasks",
        Address.fromString(user).toScVal() // ✅ FIXED
      )
    )
    .setTimeout(30)
    .build();

  const result = await server.simulateTransaction(tx);

  console.log("RAW RESULT:", result);

  if (!result.result?.retval) return [];

  const decoded = scValToNative(result.result.retval);

  return decoded.map((t) => ({
    content: t.content,
    completed: t.completed,
    timestamp: Number(t.timestamp)
  }));
}