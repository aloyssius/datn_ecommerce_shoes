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

export const convertDateTimeParam = (value) => {
  console.log(dayjs(value).format('DD-MM-YYYY HH:mm'))
  return value ? dayjs(value).format('DD-MM-YYYY HH:mm') : null;
}

export const convertDatePicker = (value) => {
  if (!value) {
    return null;
  }

  const parsedDate = parse(value, "dd-MM-yyyy", new Date());
  const formattedDate = format(parsedDate, "yyyy-MM-dd");

  return dayjs(formattedDate);
}

export const convertDateTimePicker = (value) => {
  if (!value) {
    return null;
  }

  // Định dạng đầu vào khớp với chuỗi "00:00:00 19-09-2024"
  const parsedDate = parse(value, "HH:mm:ss dd-MM-yyyy", new Date());

  // Định dạng đầu ra mong muốn
  const formattedDate = format(parsedDate, "yyyy-MM-dd HH:mm");

  // Chuyển đổi định dạng thành dayjs object
  return dayjs(formattedDate);
}
