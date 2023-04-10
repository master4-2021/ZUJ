function createObject(key: string, value: any) {
  const keys = key.split('.');
  const obj = {};

  let currentObj = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const currentKey = keys[i];
    if (!currentObj[currentKey]) {
      currentObj[currentKey] = {};
    }
    currentObj = currentObj[currentKey];
  }

  currentObj[keys[keys.length - 1]] = value;

  return obj;
}

export default createObject;
