/**
 * @description Fetch模块
 */
//
import {message} from 'antd';
import {LOGOUT_URL} from '../../constants';
import Config from './config.js';
import VerifyLogin from './verifyLogin';
import CommonFunc from './common';

const commonFunc = new CommonFunc();

class Fetch extends Config {

  constructor(url, params, successFunc, errorFunc, urlType) {
    super();
    if (urlType && urlType == 2) {
      this.url = super()._URL2 + url;
    } else {
      this.url = super()._URL + url;
    }
    this.params = params;
    this.successFunc = successFunc;
    this.errorFunc = errorFunc;
  }

  //发送GET请求
  getFetch() {
    var that = this;
    var str = '';
    if (typeof this.params === 'object' && this.params) {
      str += '?';
      Object.keys(this.params).forEach(function (val) {
        str += val + '=' + encodeURIComponent(this.params[val]) + '&';
      })
    }

    fetch(that.url + str, {
      xhrFields: {withCredentials: true},
      method: 'GET',
      credentials: 'include',
      mode: 'cors'
    }).then(function (res) {
      if (res.ok) {
        res.json().then(function (data) {
          if (data.code === 401) {
            message.error(data.message || '登陆失败');
            commonFunc.removeCookie('BI_LOGIN');
            window.location.href = LOGOUT_URL;
            return;
          }
          that.successFunc(data);
        })
      } else {
        message.error('请求失败');
        that.errorFunc();
      }
    }).catch(function (e) {
      message.error('请求失败');
      that.errorFunc();
    })
  }

  //发送POST请求
  postFetch() {
    var that = this;
    var formData = new FormData();
    for (let k in that.params) {
      formData.append(k, that.params[k]);
    }
    // formData.append('user_id', '0');
    // formData.append('user_name', 'test');

    const login = new VerifyLogin(function (data) {
      fetch(this.url, {
        method: 'POST',
        mode: 'cors',
        xhrFields: {withCredentials: true},
        credentials: 'include',
        body: formData,
      }).then(function (res) {
        if (res.ok) {
          res.json().then(function (data) {
            if (data.code == 401) {
              message.error(data.message || '登陆失败');
              window.location.href = LOGOUT_URL;
              return;
            }
            that.successFunc(data);
          })
        } else {
          message.error('请求失败');
          that.errorFunc();
        }
      }).catch(function (e) {
        message.error('请求失败');
        that.errorFunc();
      })
    }, function () {
      message.error('请求失败');
      window.clearInterval(that.Timer);
    });
    login.verifyStatus();

  }
}

export default Fetch;
