import Fetch from './Fetch';

const {apiServer} = window.assets;
const apiApps = `${apiServer}/api/v1/apps/`;
const apiRepos = `${apiServer}/api/v1/repos/`;

export function get(name) {
  return Fetch.json(`${apiApps}${name}/`, 'GET', null)
    .then(({statusCode, data}) => {
      if (statusCode === 200 && data.app) {
        return Fetch.wrap(statusCode, data.app);
      }
      const rej = Fetch.wrap(statusCode, data.msg || `无法获取App详细信息，返回代码：${statusCode}`);
      return Promise.reject(rej);
    });
}

export function list() {
  return Fetch.json(apiApps, 'GET', null)
    .then(({statusCode, data}) => {
      if (statusCode === 200 && data.apps) {
        let apps = {};
        _.forEach(data.apps, (app) => {
          apps[app.appname] = app;
        });
        return Fetch.wrap(statusCode, apps);
      } 
      const rej = Fetch.wrap(statusCode, data.msg || `无法获取App列表，返回代码: ${statusCode}`);
      return Promise.reject(rej);
    });
}

export function upgrade(name, metaVersion='') {
  let payload = {};
  if (metaVersion) {
    payload['meta_version'] = metaVersion;
  }
  return Fetch.json(`${apiApps}${name}/`, 'PUT', payload)
    .then(({statusCode, data}) => {
      if (statusCode === 202 && data.app) {
        return Fetch.wrap(statusCode, data.app, `成功升级应用：\n${data.msg}`);
      }
      const rej = Fetch.wrap(statusCode, data.msg || `触发应用更新失败，返回代码：${statusCode}`);
      return Promise.reject(rej);
    });
}

export function remove(name) {
  return Fetch.json(`${apiApps}${name}/`, 'DELETE', null)
    .then(({statusCode, data}) => {
      if (statusCode === 202) {
        return Fetch.wrap(statusCode, data.app, `成功删除应用：\n${data.msg}`);
      }
      const rej = Fetch.wrap(statusCode, data.msg || `删除应用失败，返回代码：${statusCode}`);
      return Promise.reject(rej);
    });
}

export function repo(name) {
  return Fetch.json(`${apiRepos}${name}/`, 'GET')
    .then(({statusCode, data}) => {
      if (statusCode === 200 && data.repo) {
        return Fetch.wrap(statusCode, data.repo);
      } 
      const rej = Fetch.wrap(statusCode, data.msg || `无法获取App注册信息，返回代码：${statusCode}`);
      return Promise.reject(rej);
    });
}

export function isDeployable(name) {
  return Promise.all([
    wrapPromiseWithStatusCode(get(name), [404, 403]),
    wrapPromiseWithStatusCode(repo(name)),
  ]).then(([getCode, repoCode]) => {
    let status = 'new';
    if (repoCode === 200) {
      if (getCode === 404) {
        status = 'registered';
      } else {
        // getCode == 200 or getCode == 403
        // user don't have the permission to check that apps state
        // but the app should be deployed
        status = 'deployed';
      }
    } else {
      status = 'new';
    }
    return Fetch.wrap(200, status);
  }).catch(err => {
    return Promise.reject(err);
  });
}

export function register(appname) {
  return Fetch.json(apiRepos, 'POST', { appname })
    .then(({statusCode, data}) => {
      if (statusCode === 201) {
        return Fetch.wrap(statusCode, 'registered');
      }
      const rej = Fetch.wrap(statusCode, data.msg || `注册App失败，返回代码：${statusCode}`);
      return Promise.reject(rej);
    });
}

export function deploy(appname) {
  return Fetch.json(apiApps, 'POST', { appname })
    .then(({statusCode, data}) => {
      if (statusCode === 202) {
        return Fetch.wrap(statusCode, 'deployed');
      }
      const rej = Fetch.wrap(statusCode, data.msg || `部署App失败，返回代码：${statusCode}`);
      return Promise.reject(rej);
    });
}

export function getVersions(appname){
  return Fetch.json(`${apiRepos}${appname}/versions/`,'GET',null)
    .then(({statusCode, data}) => {
      if (statusCode === 200 && data.version.tags) {
        return Fetch.wrap(statusCode, data.version.tags);
      }
      const rej = Fetch.wrap(statusCode, data.msg || `无法获取App详细信息，返回代码：${statusCode}`);
      return Promise.reject(rej);
    });
}

export function getLogs(appname){
  return Fetch.json(`${apiServer}/api/v1/oplogs/${appname}/`,'GET',null)
    .then(({statusCode, data}) => {
      if (statusCode === 200 && data.oplog) {
        return Fetch.wrap(statusCode, data.oplog);
      }
      const rej = Fetch.wrap(statusCode, data.msg || `无法获取App详细信息，返回代码：${statusCode}`);
      return Promise.reject(rej);
    });
}

export function getPorts(){
  return Fetch.json(`${apiServer}/api/v1/usedstreamrouterports/`,'GET',null)
    .then(({statusCode, data}) => {
      if (statusCode === 200) {
        return Fetch.wrap(statusCode, data.streamrouter);
      }
      const rej = Fetch.wrap(statusCode, data.msg || `无法获取Ports详细信息，返回代码：${statusCode}`);
      return Promise.reject(rej);
    });
}

function wrapPromiseWithStatusCode(promise, codes=[404]) {
  return promise.then(({statusCode, data}) => {
    return statusCode; // statusCode === 200
  }).catch(({statusCode, data}) => {
    if (_.indexOf(codes, statusCode) !== -1) {
      return statusCode;
    }
    return Promise.reject(Fetch.wrap(statusCode, data));
  });
}


