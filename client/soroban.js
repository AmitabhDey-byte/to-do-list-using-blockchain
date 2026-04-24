import {
  rpc as StellarRpc,
  TransactionBuilder,
  BASE_FEE,
  Contract,
  nativeToScVal,
  scValToNative,
  Networks,
} from "@stellar/stellar-sdk";

import { connectWallet, signTx } from "./freighter";

const NETWORK_PASSPHRASE = Networks.TESTNET;

const contractId =
  "CAZQ35K7MHUJJ3DDF5UIRYIW55A37JAXG4TMQ5YBNXW4DZ3DGZNVHQAS";

const server = new StellarRpc.Server(
  "https://soroban-testnet.stellar.org"
);

let userCache = null;

export async function getUser() {
  if (userCache) return userCache;
  userCache = await connectWallet();
  return userCache;
}

async function sendTx(method, args = []) {
  const user = await getUser();
  const account = await server.getAccount(user);
  const contract = new Contract(contractId);

  let tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();

  const sim = await server.simulateTransaction(tx);

  if (sim.error) {
    console.error("Simulation failed:", sim);
    throw new Error("Simulation failed");
  }

  tx = StellarRpc.assembleTransaction(tx, sim).build();

  const signed = await signTx(tx.toXDR(), NETWORK_PASSPHRASE);

  return await server.sendTransaction(
    TransactionBuilder.fromXDR(signed, NETWORK_PASSPHRASE)
  );
}

export async function createTask(text) {
  return sendTx("add_task", [
    nativeToScVal(text, { type: "string" }),
  ]);
}

export async function toggleTask(index) {
  return sendTx("complete_task", [
    nativeToScVal(index, { type: "u32" }),
  ]);
}

export async function getTasks() {
  const user = await getUser();
  const account = await server.getAccount(user);
  const contract = new Contract(contractId);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call("get_tasks"))
    .setTimeout(30)
    .build();

  const sim = await server.simulateTransaction(tx);

  if (!sim.result?.retval) return [];

  const decoded = scValToNative(sim.result.retval);

  return decoded.map((t) => ({
    content: t[0],
    completed: t[1],
  }));
}