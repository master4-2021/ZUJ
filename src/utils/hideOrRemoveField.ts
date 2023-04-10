function setObjectValue(obj: Record<string, any>, path: string[], value?: any) {
  let current = obj;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (!current.hasOwnProperty(key)) {
      current[key] = {};
    }
    current = current[key];
  }
  if (!value) {
    delete current[path[path.length - 1]];
  } else {
    current[path[path.length - 1]] = value;
  }
}

function hideOrRemoveField(
  obj: Record<string, any>,
  target: string,
  isDelete = false,
) {
  const fields = [];

  function traverse(obj: Record<string, any>, prefix = '') {
    for (const [key, value] of Object.entries(obj)) {
      const field = prefix ? `${prefix}.${key}` : key;
      fields.push(field);

      if (typeof value === 'object' && value !== null) {
        traverse(value, field);
      }
    }
  }

  traverse(obj);

  fields.forEach((field) => {
    const fieldArray = field.split('.');
    if (fieldArray.includes(target)) {
      setObjectValue(obj, fieldArray, isDelete ? undefined : '*****');
    }
  });

  return obj;
}

export default hideOrRemoveField;
