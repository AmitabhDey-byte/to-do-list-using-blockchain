// freighter.js
import { requestAccess, signTransaction } from "@stellar/freighter-api";

export async function connectWallet() {
  const res = await requestAccess();
  if (typeof res === "string") return res;
  if (res?.address) return res.address;
  throw new Error("Wallet connection failed");
}

export async function signTx(xdr, networkPassphrase) {
  const result = await signTransaction(xdr, {
    networkPassphrase,          // ← pass the FULL passphrase here, not the short name
  });

  // newer Freighter versions return an object { signedTxXdr, signerAddress }
  if (typeof result === "string") return result;
  if (result?.signedTxXdr) return result.signedTxXdr;

  throw new Error("Signing failed");
}