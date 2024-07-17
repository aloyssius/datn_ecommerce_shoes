export const displayCurrencyVnd = (data) => {
  return data?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

export const formatCurrencyVnd = (data) => {
  const hasNonZeroNumber = /\d*[1-9]\d*/.test(data);

  if (hasNonZeroNumber) {
    return data
      .replace(/[^0-9]+/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return ""
};

export const formatNumberString = (data) => {
  const hasNonZeroNumber = /\d*[1-9]\d*/.test(data);

  if (hasNonZeroNumber) {
    return data
      .replace(/[^0-9]+/g, "");
  }
  return ""
};

export const formatNumber = (data) => {

  if (!data) {
    return null;
  }
  return parseFloat(data.replace(/[^0-9.-]+/g, ""));
};
