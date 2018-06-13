import Fetch from './Fetch'

const {apiServer} = window.assets;
const apiConsole = `${apiServer}/api/v1/`;

export function isAuthOpen() {
  return Fetch.json(`${apiConsole}authorize/status/`, 'GET', null)
    .then(({statusCode, data}) => {
      if (statusCode === 200 && data.auth) {
        const opened = data.auth ? data.auth.status === "opened" : false;
        return Fetch.wrap(statusCode, opened);
      }
      const rej = Fetch.wrap(statusCode, data.msg || `无法获取验证信息，返回代码：${statusCode}`)
      return Promise.reject(rej);
    });
}
