/**
 * Fetch recent prioritization fees from Solana RPC to suggest a priority fee for transactions.
 * Simple helper for DX; transfer SOL does not require priority fee but complex txs may.
 */

export type PriorityFeeResult =
  | { ok: true; suggestedMicroLamports: number; slot: number }
  | { ok: false; message: string }

/**
 * Returns a suggested priority fee (median of recent fees) in micro-lamports.
 * Use with setComputeUnitPrice when building transactions that need priority.
 */
export async function getSuggestedPriorityFee(rpcUrl: string): Promise<PriorityFeeResult> {
  try {
    const res = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'priority-fee',
        method: 'getRecentPrioritizationFees',
        params: [],
      }),
    })
    const json = (await res.json()) as {
      result?: { prioritizationFee: number; slot: number }[]
      error?: { message: string }
    }
    if (json.error) {
      return { ok: false, message: json.error.message ?? 'RPC error' }
    }
    const list = json.result
    if (!Array.isArray(list) || list.length === 0) {
      return { ok: true, suggestedMicroLamports: 0, slot: 0 }
    }
    const fees = list.map((x) => x.prioritizationFee).filter((n) => typeof n === 'number')
    const slots = list.map((x) => x.slot).filter((n) => typeof n === 'number')
    if (fees.length === 0) {
      return { ok: true, suggestedMicroLamports: 0, slot: slots[0] ?? 0 }
    }
    fees.sort((a, b) => a - b)
    const median = fees[Math.floor(fees.length / 2)] ?? 0
    const maxSlot = Math.max(...slots)
    return { ok: true, suggestedMicroLamports: median, slot: maxSlot }
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : 'Failed to fetch priority fee',
    }
  }
}
