export const formatCurrencyVnd = (data, prefix = " VNĐ") => {
  const hasNonZeroNumber = /\d*[1-9]\d*/.test(data);

  if (hasNonZeroNumber) {
    return String(data)
      .replace(/[^0-9]+/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + prefix;
  }
  return ""
};
