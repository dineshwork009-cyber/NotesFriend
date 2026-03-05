export function flatten(object: { [name: string]: any }) {
  const flattenedObject: { [name: string]: any } = {};

  for (const innerObj in object) {
    if (typeof object[innerObj] === "object") {
      if (typeof object[innerObj] === "function") continue;

      const newObject = flatten(object[innerObj]);
      for (const key in newObject) {
        flattenedObject[innerObj + "." + key] = newObject[key];
      }
    } else {
      if (typeof object[innerObj] === "function") continue;
      flattenedObject[innerObj] = object[innerObj];
    }
  }
  return flattenedObject;
}

export function unflatten(data: any) {
  const result = {};
  for (const i in data) {
    const keys = i.split(".");
    keys.reduce(function (r: any, e, j) {
      return (
        r[e] ||
        (r[e] = isNaN(Number(keys[j + 1]))
          ? keys.length - 1 == j
            ? data[i]
            : {}
          : [])
      );
    }, result);
  }
  return result;
}
