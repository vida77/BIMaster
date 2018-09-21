const carTypes = {
  all: {
    types: [],
    name: '全部',
  },
  yida_plus: {
    types: [37, 78],
    name: '易达+',
  },
  comfort_plus: {
    types: [2, 3],
    name: '舒适+',
  },
  business_plus: {
    types: [5],
    name: '商务+',
  },
  taxi: {
    types: [78],
    name: '出租车',
  },
  other: {
    types: [-1],
    name: '其他',
  },
};

export const getCarTypeIds = (carType) => {
  if (carType === 'all') {
    return '';
  }
  if (carType === 'other') {
    return [...getCarTypeIds('yida_plus'), ...getCarTypeIds('comfort_plus'), ...getCarTypeIds('business_plus')].join();
  }
  let arr = carTypes[carType].types;
  return arr.join(",");
};

export const getCarTypes = () => {
  let types = {};
  for (let carKey in carTypes) {
    types[carKey] = carTypes[carKey].name
  }
  return types;
};

