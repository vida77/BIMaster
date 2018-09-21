import * as hash from './hashes';

const ranking = {
  name: '排行榜',
  children: {
    rank_order: {
      name: '订单',
      children: {
        complete_count: {
          name: '完成订单数',
          hash: ['complete_count'],
        },
        complete_amount: {
          name: '完成订单金额(元)',
          hash: ['complete_amount'],
        },
        average_amount: {
          name: '订单平均金额(元)',
          hash: ['average_amount'],
        },
        average_time: {
          name: '订单平均时长(分钟)',
          hash: ['average_time'],
        },
        average_distance: {
          name: '平均行驶距离(km)',
          hash: ['average_distance'],
        },
        complete_rate: {
          name: '订单完成率(%)',
          hash: ['complete_rate'],
        },
        create_total: {
          name: '创建订单',
          hash: ['create_total'],
        },
        dispatch_success_rate: {
          name: '派单成功率(%)',
          hash: ['dispatch_success_rate'],
        },
        billing_difference: {
          name: '计费差额(元)',
          hash: ['billing_difference'],
        },
        service_cost: {
          name: '服务成本(元)',
          hash: ['service_cost']
        },
        no_car_can_dispatch: {
          name: '无车可派',
          hash: ['no_car_can_dispatch']
        },
      }
    },
    rank_driver: {
      name: '司机',
      children: {
        active_total: {
          name: '活跃司机',
          hash: ['active_total']
        },
        average_orders: {
          name: '司机均单量',
          hash: ['average_orders']
        },
        registered_total: {
          name: '新注册司机',
          hash: ['registered_total'],
          showCarType: false,
        },
        activation_total: {
          name: '新增激活司机',
          hash: ['activation_total'],
          showCarType: false,
        },
        negative_rate: {
          name: '差评率',
          hash: ['negative_rate']
        },
        lose_rate: {
          name: '司机流失率',
          hash: ['lose_rate']
        },
      }
    },
    rank_user: {
      name: '用户',
      children: {
        active_total: {
          name: '活跃用户',
          hash: ['active_total'],
          showCarType: false,
        },
        average_total: {
          name: '乘客单均量',
          hash: ['average_total'],
          showCarType: false,
        },
        registered_total: {
          name: '新注册用户',
          hash: ['registered_total'],
          showCarType: false,
        },
        activation_total: {
          name: '新激活用户',
          hash: ['activation_total'],
          showCarType: false,
        },
        recharge_amount: {
          name: '充值金额',
          hash: ['recharge_amount'],
          showCarType: false,
        },
        lose_rate: {
          name: '用户流失率',
          hash: ['lose_rate'],
          showCarType: false,
        },
        place_order_user_total: {
          name: '下单用户数',
          hash: ['place_order_user_total'],
          showCarType: false,
        },
      }
    }
  }
};

const navs = {
  app: ranking,
};

export function getPageInfo(urlPath) {
  const pathArray = urlPath.split('/').slice(1);
  const pathDepth = pathArray.length;
   //console.log(pathArray[2],pathDepth) //["app", "ranking", "order", "order_0"], 4
  let pathPart = navs[pathArray[0]]; // navs.app --> ranking
  for (let i = 1; i < pathDepth-1; i++) {
    pathPart = pathPart.children[pathArray[i+1]];
  }
  return pathPart;
}

export const getPageName = (urlPath) => {
  return getPageInfo(urlPath).name
};

export const getPageHashKey = (urlPath) => {
  return getPageInfo(urlPath).hash
};

export const getPageHashString = (urlPath) => {
  const hashKeys = getPageInfo(urlPath).hash;
  return hash.getHashString(hashKeys)
};

export const checkPageShowCarTypeSelection = (urlPath) => {
  const pageInfo = getPageInfo(urlPath);
  return !(pageInfo.hasOwnProperty('showCarType') && pageInfo.showCarType === false);
};