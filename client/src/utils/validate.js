import moment from 'moment';

export const isValidColorHex = (color) => {
  const regex = /^#([0-9A-F]{3}){1,2}$/i;
  return regex.test(color);
};

export const isVietnamesePhoneNumberValid = (phoneNumber) => {
  return /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/.test(phoneNumber);
};

export const isPastOrPresentDate = (dateString) => {

  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(dateString)) {
    return false;
  }

  const currentDate = moment();
  const inputDate = moment(dateString, 'DD/MM/YYYY');

  return inputDate.isSameOrBefore(currentDate, 'day');
};
