import { DateTime } from 'luxon';

function getDateOrValue(value: any | any[]) {
  if (Array.isArray(value)) {
    return value.map((v) => getDateOrValue(v));
  }
  const date = DateTime.fromISO(value);
  return date.isValid ? date.toJSDate() : value;
}

export default getDateOrValue;
