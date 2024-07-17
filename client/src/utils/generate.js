export const generateSku = (code) => {
  const randomNumber = Math.floor(Math.random() * (999 - 100 + 1) + 100);
  const sku = code + randomNumber;
  return sku;
}
