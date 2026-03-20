import { requestAccess, signTransaction } from "@stellar/freighter-api";

// 🔌 Connect wallet (always return string)
export async function connectWallet() {
  try {
    const result = await requestAccess();

    if (typeof result === "string") return result;
    if (result?.address) return result.address;

    throw new Error("Invalid wallet response");
  } catch (e) {
    console.error("Connection error:", e);
    throw e;
  }
}

// ✍️ Sign transaction
export async function signTx(xdr, networkPassphrase) {
  try {
    return await signTransaction(xdr, {
      network: networkPassphrase,
    });
  } catch (e) {
    console.error("Sign error:", e);
    throw e;
  }
}