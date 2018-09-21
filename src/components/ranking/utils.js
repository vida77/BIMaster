export const arrayUnique = arrArg => {
  return arrArg.filter((elem, pos, arr) => {
    return arr.indexOf(elem) === pos;
  });
};

export const flattenObject = (ob, keepKey) => {
  let toReturn = {};
  for (let i in ob) {
    if (!ob.hasOwnProperty(i)) continue;

    if ((typeof ob[i]) === 'object') {
      let flatObject = flattenObject(ob[i]);
      for (let x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;
        if (keepKey) {
          toReturn[i + '.' + x] = flatObject[x];
        } else {
          toReturn[x] = flatObject[x];
        }
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
};

//数字添加千分符
export const milliFormat = num => {
  return num && num.toString()
    .replace(/^\d+/g, (m) => m.replace(/(?=(?!^)(\d{3})+$)/g, ','))
};