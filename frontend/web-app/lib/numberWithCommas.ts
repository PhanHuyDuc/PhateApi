export function numberWithCommas(
  amount: number,
  decimalPlaces: number = 2
): string {
  // Format number to fixed decimal places
  const formattedAmount = amount.toFixed(decimalPlaces);
  // Split into integer and decimal parts
  const [integerPart, decimalPart] = formattedAmount.split(".");

  // Add dots as thousands separators to the integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  // Check if the decimal part is all zeros
  const isDecimalZero = decimalPart && /^0+$/.test(decimalPart);

  // Return without decimal part if it's all zeros, otherwise include it
  return isDecimalZero
    ? formattedInteger
    : `${formattedInteger},${decimalPart}`;
}
