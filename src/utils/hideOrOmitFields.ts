import { DeepHideOrOmit } from '../common/types';

export default function hideOrOmitDeep<T extends object, K extends string>(
  obj: T,
  keys: string[],
  isDelete = false,
): DeepHideOrOmit<T, K, typeof isDelete> {
  return Object.keys(obj).reduce((acc, key) => {
    if (keys.includes(key)) {
      if (isDelete) {
        return acc;
      }
      return {
        ...acc,
        [key]: '*****',
      };
    }
    const val = obj[key];
    if (Array.isArray(val)) {
      return {
        ...acc,
        [key]: val.map((item) => hideOrOmitDeep(item, keys, isDelete)),
      };
    }
    if (typeof val === 'object' && val !== null) {
      if (val instanceof Date) {
        return {
          ...acc,
          [key]: val,
        };
      }
      return {
        ...acc,
        [key]: hideOrOmitDeep(val, keys, isDelete),
      };
    }

    return {
      ...acc,
      [key]: val,
    };
  }, {} as DeepHideOrOmit<T, K, typeof isDelete>);
}
