import moment from 'moment';
import dayjs from 'dayjs'
import { format, parse } from 'date-fns';

export const isValidColorHex = (color) => {
  const regex = /^#([0-9A-F]{3}){1,2}$/i;
  return regex.test(color);
};

export const isVietnamesePhoneNumberValid = (phoneNumber) => {
  return /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/.test(phoneNumber);
};

export const isPastOrPresentDate = (value) => {

  const dateString = value ? dayjs(value).format('DD/MM/') + parseInt(dayjs(value).format('YYYY'), 10) : null;

  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(dateString)) {
    return false;
  }

  const today = dayjs();
  if (dayjs(value)?.isAfter(today)) {
    return false;
  }

  return true;
};
