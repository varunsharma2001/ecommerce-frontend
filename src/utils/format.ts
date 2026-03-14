/** Format a number as Indian Rupee — used on every price display */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate discount % between original price and discounted price.
 * Maps to variant.price (original) and variant.discountedPrice (sale).
 * Returns 0 when there is no discount.
 */
export function getDiscountPercent(original: number, sale: number): number {
  if (original <= 0 || sale >= original) return 0;
  return Math.round(((original - sale) / original) * 100);
}
