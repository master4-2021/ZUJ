import { DeepHideOrOmit } from '../common/types';
import { isPrimitive } from './isPrimitive';

export default function hideOrOmitDeep<T extends object, K extends string>(
  data: T | T[],
  keys: K[],
  isDelete = false,
):
  | DeepHideOrOmit<T, K, typeof isDelete>
  | DeepHideOrOmit<T, K, typeof isDelete>[] {
  if (Array.isArray(data)) {
    return data.map((item) =>
      !isPrimitive(item) ? hideOrOmitDeep(item, keys, isDelete) : item,
    ) as DeepHideOrOmit<T, K, typeof isDelete>[];
  }
  return Object.keys(data).reduce((acc, key) => {
    if (keys.includes(key as K)) {
      if (isDelete) {
        return acc;
      }
      return {
        ...acc,
        [key]: '*****',
      };
    }
    const val = data[key];
    if (Array.isArray(val)) {
      return {
        ...acc,
        [key]: val.map((item) =>
          !isPrimitive(item) ? hideOrOmitDeep(item, keys, isDelete) : item,
        ),
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
