import moment from 'moment';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

export const convertDateGMT = (value) => {
  const date = moment(value, "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (Z)");
  const year = date.year().toString();
  const formattedYear = parseInt(year, 10);
  return date.format(`DD/MM/${formattedYear}`);
}

export const convertDateParam = (value) => {
  return value ? dayjs(value).format('DD-MM-YYYY') : null
}
