import moment from 'moment';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { format, parse } from 'date-fns';

export const convertDateGMT = (value) => {
  return value.format("DD-MM-YYYY");
}

export const convertDateParam = (value) => {
  return value ? dayjs(value).format('DD-MM-YYYY') : null
}

export const convertDatePicker = (value) => {
  if (!value) {
    return null;
  }

  const parsedDate = parse(value, "dd-MM-yyyy", new Date());
  const formattedDate = format(parsedDate, "yyyy-MM-dd");

  return dayjs(formattedDate);
}
