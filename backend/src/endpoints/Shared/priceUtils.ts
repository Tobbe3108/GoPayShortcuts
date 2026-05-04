export function formatAmount(amount?: number, scale?: number): number {
  if (amount === undefined || amount === null || scale === undefined || scale === null) return 0;
  return amount / Math.pow(10, scale);
}
