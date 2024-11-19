export function formatCurrency(
  amount: number,
  options?: Intl.NumberFormatOptions
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    ...options,
  }).format(amount);
}
