/**
 * Simulate a transaction via Solana RPC before sending.
 * Returns a human-friendly success/error so the UI can warn or block send.
 */

export type SimulateResult =
  | { success: true }
  | { success: false; message: string }

/**
 * Simulates a wire-format transaction (unsigned or signed) via the RPC.
 * @param rpcUrl - Solana RPC URL
 * @param transactionBytes - Transaction in wire format (e.g. from getTransactionEncoder().encode(compiled))
 */
export async function simulateTransaction(
  rpcUrl: string,
  transactionBytes: Uint8Array,
): Promise<SimulateResult> {
  const base64 = typeof btoa !== 'undefined'
    ? btoa(String.fromCharCode(...transactionBytes))
    : Buffer.from(transactionBytes).toString('base64')

  try {
    const res = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'simulate',
        method: 'simulateTransaction',
        params: [base64, { encoding: 'base64', replaceRecentBlockhash: true }],
      }),
    })
    const json = (await res.json()) as { result?: { value?: { err: unknown }[] }; error?: { message: string } }
    if (json.error) {
      return { success: false, message: json.error.message ?? 'RPC error' }
    }
    const value = json.result?.value
    if (!value || !Array.isArray(value)) {
      return { success: false, message: 'Invalid simulation response' }
    }
    const first = value[0] as { err?: unknown } | undefined
    if (first?.err != null) {
      const err = first.err
      let message: string
      if (typeof err === 'object' && err !== null && 'InstructionError' in (err as object)) {
        const ie = (err as { InstructionError: [number, unknown] }).InstructionError
        message = formatInstructionError(ie)
      } else {
        message = String(err)
      }
      return { success: false, message }
    }
    return { success: true }
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : 'Simulation request failed',
    }
  }
}

function formatInstructionError([index, err]: [number, unknown]): string {
  if (typeof err === 'string') return `Instruction ${index}: ${err}`
  if (typeof err === 'object' && err !== null && 'Custom' in (err as object)) {
    return `Instruction ${index}: Custom(${(err as { Custom: number }).Custom})`
  }
  return `Instruction ${index}: ${JSON.stringify(err)}`
}
