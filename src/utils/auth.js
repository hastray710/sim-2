import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  let token = Cookies.get(TokenKey);
  // console.log("getToken() = "+token);
  return token;
}

export function setToken(token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken() {
  return Cookies.remove(TokenKey);
}
