import moment from 'moment';

const utcFormat = 'YYYY-MM-DD[T]HH:mm:ss';
export const localFormat = 'YYYY-MM-DD HH:mm:ss';
export const localDateFormat = 'YYYY-MM-DD';
const localTimeFormat = 'HH:mm:ss';

export const getLocalStorageItem = (key: string, defaultValue: any) => {
  const {localStorage} = window;
  let val = null;
  if (localStorage) {
    val = localStorage.getItem(key);
  }
  return val || defaultValue;
};

export const setLocalStorageItem = (key: string, val: string) => {
  const {localStorage} = window;
  if (localStorage) {
    localStorage.setItem(key, val);
  }
};

export const showDateOrTime = (dateTime: string | number) => {
  const date = moment
    .utc(dateTime)
    .local()
    .format(localDateFormat);
  const time = moment
    .utc(dateTime)
    .local()
    .format(localTimeFormat);
  const currentDate = moment(new Date()).format(localDateFormat);
  return date < currentDate ? date : time;
};

export const localToUtc = (dateTime: string | number) => {
  return moment(dateTime)
    .utc()
    .format(utcFormat);
};
