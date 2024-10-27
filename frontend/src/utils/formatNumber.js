export function formatNumber(value) {
  const number = Number(value);
  if (number === 0) return "0";
  const exponent = Math.floor(Math.log10(Math.abs(number)));
  const base = (number / Math.pow(10, exponent)).toFixed(2);
  return `${base} x 10^${exponent}`;
}
