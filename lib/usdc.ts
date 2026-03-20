// ClearMarket Labs — USDC transfer utilities for Solana
import {
  PublicKey,
  Transaction,
  type Connection,
} from "@solana/web3.js";
import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  getAccount,
} from "@solana/spl-token";

// USDC mint address on Solana mainnet
export const USDC_MINT = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");

// USDC has 6 decimals
export const USDC_DECIMALS = 6;

/** Convert a human-readable USDC amount (e.g. 100.50) to raw token units */
export function usdcToRaw(amount: number): bigint {
  return BigInt(Math.round(amount * 10 ** USDC_DECIMALS));
}

/** Convert raw USDC token units to human-readable amount */
export function rawToUsdc(raw: bigint): number {
  return Number(raw) / 10 ** USDC_DECIMALS;
}

/**
 * Build an SPL USDC transfer transaction from investor to escrow wallet.
 *
 * This creates the Associated Token Account for the destination if it doesn't exist,
 * then adds a transfer instruction.
 *
 * @returns A Transaction ready to be signed by the investor's wallet
 */
export async function buildUsdcTransferTx(
  connection: Connection,
  fromWallet: PublicKey,
  toWallet: PublicKey,
  amountUsdc: number
): Promise<Transaction> {
  const tx = new Transaction();

  // Get associated token accounts for sender and receiver
  const fromAta = await getAssociatedTokenAddress(USDC_MINT, fromWallet);
  const toAta = await getAssociatedTokenAddress(USDC_MINT, toWallet);

  // Check if destination ATA exists, create if not
  try {
    await getAccount(connection, toAta);
  } catch {
    // ATA doesn't exist, create it (sender pays for account creation)
    tx.add(
      createAssociatedTokenAccountInstruction(
        fromWallet,        // payer
        toAta,             // associated token account
        toWallet,          // owner
        USDC_MINT          // mint
      )
    );
  }

  // Add the transfer instruction
  const rawAmount = usdcToRaw(amountUsdc);
  tx.add(
    createTransferInstruction(
      fromAta,             // source
      toAta,               // destination
      fromWallet,          // owner/authority
      rawAmount
    )
  );

  // Set recent blockhash and fee payer
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
  tx.recentBlockhash = blockhash;
  tx.lastValidBlockHeight = lastValidBlockHeight;
  tx.feePayer = fromWallet;

  return tx;
}

/**
 * Get USDC balance for a wallet
 */
export async function getUsdcBalance(
  connection: Connection,
  wallet: PublicKey
): Promise<number> {
  try {
    const ata = await getAssociatedTokenAddress(USDC_MINT, wallet);
    const account = await getAccount(connection, ata);
    return rawToUsdc(account.amount);
  } catch {
    return 0;
  }
}
