// import * as Api from '../common/api';

function getCookieByName(name) {
  const value = "; " + document.cookie;
  let parts = value.split("; " + name + "=");
  if (parts.length === 2) {
    return parts.pop().split(";").shift()
  }
  return false;
}

function isLogin() {
  const cookie = getCookieByName('BI_LOGIN');
  return !(cookie === false || cookie.length === 0);
}
function checkSSOLogin() {
  if (!isLogin()) {
    redirectLogin();
  }
}

function redirectToLogin() {
  if (window.location.host === 'bi.yongche.com') {
    window.location.href = "https://sso.yongche.com/auth/login?app_id=67&done=https%3a%2f%2fbi.yongche.com%2f&cn=E&login=1";
  } else {
    window.location.href = "https://sso.yongche.org/auth/login?app_id=67&done=https%3a%2f%2ftest.bi.yongche.com%2f&cn=E&login=1";
  }
}

export const getCookie = (name) => getCookieByName(name);
export const checkAuth = () => checkSSOLogin();
export const redirectLogin = () => redirectToLogin();

export const isAuthed = () => isLogin();
// export const removeCookieByJsonp = () => Api.removeCookieByGrab();
// export const setCookieByJsonp = () => Api.setCookieByJsonp();

