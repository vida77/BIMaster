
import { hashHistory } from 'react-router';
import axios from 'axios'
import * as Auth from './Auth'
import {message} from 'antd';
import qs from 'qs'
import 'promise'

// const API_DATAMART_BASE_URL = 'https://datamart1.yongche.com/bi_web_api';
const API_BI_BASE_URL = 'https://api_bi.yongche.com';
// const API_GRAB_BASE_URL = 'https://grab.yongche.com/api';

const domain = window.location.host;
let BI_API_BASE_URL = '';
// if(domain === 'localhost:3000'){
//     BI_API_BASE_URL = 'http://test.bi.yongche.com';
// }else {
//     BI_API_BASE_URL = 'http://'+domain;
// }

if(window.location.hostname === 'localhost'){
    BI_API_BASE_URL = 'http://test.bi.yongche.com'
}else if(window.location.hostname === 'test.bi.yongche.com'){
    BI_API_BASE_URL = 'http://test.bi.yongche.com'
}else if(window.location.hostname === 'bi.yongche.com'){
    BI_API_BASE_URL = 'https://bi.yongche.com'
}
const REQUEST_METHOD_GET = 'GET';
const REQUEST_METHOD_POST = 'POST';

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.withCredentials = true;
function objectToQueryString(queryObject) {
  let queryArray = [];
  for (let queryKey in queryObject) {
    if (queryObject.hasOwnProperty(queryKey)) {
      queryArray.push(`${queryKey}=${queryObject[queryKey]}`);
    }
  }
//   console.log(queryArray)
  return queryArray.join('&');
}

function request(url, method, params) {
  let fetchData = {
    method: method,
    mode: 'cors',
    xhrFields: {withCredentials: true},
    credentials: 'include',
  };

  if (method === REQUEST_METHOD_GET) {
      console.log(params)
    url = url + '?' + objectToQueryString(params)
    // console.log(url)
  }


  if (method === REQUEST_METHOD_POST) {
    fetchData.body = params;
  }

  return new Promise((resolve, reject) => {
    fetch(url, fetchData).then(response => {
      if (response.statusText === "OK") {
        response.json().then(data => {
          resolve(data);
        });
      } else {
        message.error('请求失败');
        reject(-2);
      }
    }).catch((err) => {
      message.error('请求错误: ' + err);
      reject(-1);
    });
  });
}

export const getDatamartData = (params) => {
    let path = window.location.hash.split('/').slice(3).join('/').trim();
    //console.log(path)
    return new Promise((resolve, reject) => {
        //request(API_DATAMART_BASE_URL + '/bi_data', REQUEST_METHOD_GET, params).then((data) => {
        request(BI_API_BASE_URL + '/' +path, REQUEST_METHOD_GET, params).then((data) => {
            if (data.status) {
                resolve(data.data);
            } else {
                if (data.msg === '用户未登陆') {
                    // Auth.redirectLogin();
                } else {
                    //message.error(data.msg);
                    reject(-3);
                }
            }
        }).catch(errCode => {
            reject(errCode);
        });
    });
};

export const getDatamartDim = (params) => {
  return new Promise((resolve, reject) => {
    request(BI_API_BASE_URL + '/web_api/dim_info/city', REQUEST_METHOD_GET, params).then((data) => {

        resolve(data.data);

    }).catch(errCode => {
      reject(errCode);
    });
  });
};

export const getBiData = (url, params) => {
  return new Promise((resolve, reject) => {
    request(API_BI_BASE_URL + url, REQUEST_METHOD_GET, params).then((data) => {
      switch (data.code) {
        case 200:
          resolve(data.data);
          break;
        case 400:
          message.error('参数错误');
          reject(400);
          break;
        case 401:
            Auth.redirectLogin();
          break;
        case 402:
          message.error('BI访问权限已过期');
          reject(402);
          break;
        case 403:
          message.error('无权访问该页面');
          reject(403);
          break;
        default:
          message.error(data.code);
          reject(data.code);
          break;
      }
    }).catch(errCode => {
      reject(errCode);
    });
  });
};


export function getFun(url, params) {
    const result = get(url, params);
    return result;
}


export function get(url, params) {
    return new Promise((resolve, reject) => {
        request(BI_API_BASE_URL + url, REQUEST_METHOD_GET, params).then((res) => {
            switch (res.code) {
                case 0:
                    resolve(res);
                    break;
                case 100:
                    // message.error('用户未登录');
                    window.location.href='/index.php/index/login'
                    break;
                case 105:
                    resolve(res);
                    // message.error('用户账户已过有效期');
                    hashHistory.push({
                        pathname: '/app/pageError',
                        query: {
                            code: res.code
                        },
                    })
                    break;
                case 106:
                    resolve(res);
                    // message.error('用户账户已被禁用');
                    hashHistory.push({
                        pathname: '/app/pageError',
                        query: {
                            code: res.code
                        },
                    })
                    break;
                case 10002:
                    resolve(res);
                    // message.error('用户没有相关操作权限');
                    hashHistory.push({
                        pathname: '/app/pageError',
                        query: {
                            code: res.code
                        },
                    })
                    break;
                case 30001:
                    resolve(res);
                    console.log(res.code)
                    // message.error('用户没有相关操作权限');
                    hashHistory.push({
                        pathname: '/app/pageError',
                        query: {
                            code: res.code
                        },
                    })
                    break;
                default:
                    message.error(res.code);
                    reject(res.code);
                    break;
            }
        }).catch(err => {
            console.log(err)
            message.error(err);
        })
    })
}
export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(BI_API_BASE_URL+url, qs.stringify(params)).then(res => {
            switch (res.data.code) {
                case 0:
                    resolve(res.data);
                    break;
                case 1:
                    message.error(res.data.message);
                    resolve(res.data);
                    break;
                case 100:
                    // message.error('用户未登录');
                    window.location.href='/index.php/index/login'
                    break;
                case 105:
                    resolve(res.data);
                    // message.error('用户账户已过有效期');
                    hashHistory.push({
                        pathname: '/app/pageError',
                        query: {
                            code: res.code
                        },
                    })

                    break;
                case 106:
                    resolve(res.data);
                    // message.error('用户账户已被禁用');
                    hashHistory.push({
                        pathname: '/app/pageError',
                        query: {
                            code: res.code
                        },
                    })
                    resolve(res.data);
                    break;
                case 10002:
                    resolve(res.data);
                    // message.error('用户没有相关操作权限');
                    hashHistory.push({
                        pathname: '/app/pageError',
                        query: {
                            code: res.code
                        },
                    })
                    break;
                case 30001:
                    resolve(res);
                    // message.error('用户没有相关操作权限');
                    hashHistory.push({
                        pathname: '/app/pageError',
                        query: {
                            code: res.code
                        },
                    })
                    break;
                default:
                    message.error(res.data.code);
                    break;
            }
        }).catch(err => {
            message.error(err);
        })
    })
}
export function getRankFun(params) {
    let path = window.location.hash.split('/').slice(3).join('/').trim();
    return new Promise((resolve, reject) => {
        axios.get(BI_API_BASE_URL + '/web_api/' +path, {
            params: params
        }).then(res => {
            resolve(res.data)
        }).catch(err => {
            message.error(err);
        })
    })
}
