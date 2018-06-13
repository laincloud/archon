import * as AppApi from '../apis/Apps';

export function resetApiFlash(apiType) {
  return {
    type: 'RESET_APP_OP_FLASH',
    apiType,
  };
}

export function resetApiCall(apiType) {
  return {
    type: 'RESET_API_CALL',
    apiType,
  };
}

export function list() {
  return {
    type: 'LOAD_APPS_REQUEST',
    async: true,
    shouldCallApi: (state) => true,
    callApi: () => AppApi.list(),
    payload: {},
  };  
}

export function get(name) {
  return {
    type: 'GET_APP_REQUEST',
    async: true,
    shouldCallApi: (state) => true,
    callApi: () => AppApi.get(name),
    payload: { name },
  };
}

export function upgrade(name, metaVersion='') {
  return {
    type: 'UPGRADE_APP_REQUEST',
    async: true,
    shouldCallApi: (state) => true,
    callApi: () => AppApi.upgrade(name, metaVersion),
    payload: { name },
  };
}

export function remove(name) {
  return {
    type: 'DELETE_APP_REQUEST',
    async: true,
    shouldCallApi: (state) => true,
    callApi: () => AppApi.remove(name),
    payload: { name },
  };
}

export function isDeployable(name) {
  return {
    type: 'CHECK_APP_DEPLOY_REQUEST',
    async: true,
    shouldCallApi: (state) => true,
    callApi: () => AppApi.isDeployable(name),
    payload: { name },
  };
}

export function register(name) {
  return {
    type: 'REGISTER_APP_REQUEST',
    async: true,
    shouldCallApi: (state) => true,
    callApi: () => AppApi.register(name),
    payload: { name },
  };
}

export function deploy(name) {
  return {
    type: 'DEPLOY_APP_REQUEST',
    async: true,
    shouldCallApi: (state) => true,
    callApi: () => AppApi.deploy(name),
    payload: { name },
  };
}

export function getVersions(name) {
  return {
    type: 'GET_APPVERSIONS_REQUEST',
    async: true,
    shouldCallApi: (state) => true,
    callApi: () => AppApi.getVersions(name),
    payload: {},
  };
}

export function getLogs(name) {
  return {
    type: 'GET_APPLOGS_REQUEST',
    async: true,
    shouldCallApi: (state) => true,
    callApi: () => AppApi.getLogs(name),
    payload: {},
  };
}


export function getPorts() {
  return {
    type: 'GET_PORTS_REQUEST',
    async: true,
    shouldCallApi: (state) => true,
    callApi: () => AppApi.getPorts(),
    payload: {},
  };
}
