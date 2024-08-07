export const isVietnamesePhoneNumberValid = (phoneNumber) => {
  return /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/.test(phoneNumber);
};
