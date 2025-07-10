export function formatAmount(amount: number, scale: number): number {
  return amount / Math.pow(10, scale);
}
