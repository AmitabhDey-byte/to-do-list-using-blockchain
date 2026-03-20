import { requestAccess, signTransaction } from "@stellar/freighter-api";

export async function connectWallet() {
  try {
    const publicKey = await requestAccess();
    return publicKey;
  } catch (e) {
    console.error("Connection error:", e);
    throw e;
  }
}

export async function signTx(xdr, networkPassphrase) {
  try {
    const signed = await signTransaction(xdr, {
      network: networkPassphrase,
    });
    return signed;
  } catch (e) {
    console.error("Sign error:", e);
    throw e;
  }
}