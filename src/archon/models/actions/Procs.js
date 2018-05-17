import * as ProcApi from '../apis/Procs';

export function patchInstance(appName, procName, numInstance) {
  return {
    type: 'PATCH_PROC_INSTANCE_REQUEST',
    async: true,
    shouldCallApi: (state) => true,
    callApi: () => ProcApi.patchInstance(appName, procName, numInstance),
    payload: { appName, procName, numInstance },
  };
}

export function patchSpec(appName, procName, cpu, memory) {
  return {
    type: 'PATCH_PROC_SPEC_REQUEST',
    async: true,
    shouldCallApi: (state) => true,
    callApi: () => ProcApi.patchSpec(appName, procName, cpu, memory),
    payload: { appName, procName, cpu, memory },
  };
}

export function remove(appName, procName) {
  return {
    type: 'REMOVE_PROC_REQUEST',
    async: true,
    shouldCallApi: (state) => true,
    callApi: () => ProcApi.remove(appName, procName),
    payload: { appName, procName },
  };
}

export function deploy(appName, procName) {
  return {
    type: 'DEPLOY_PROC_REQUEST',
    async: true,
    shouldCallApi: (state) => true,
    callApi: () => ProcApi.deploy(appName, procName),
    payload: { appName, procName },
  };
}

export function getProcHistories(appName, procName, instance) {
  return {
    type: 'GET_PROCHISTORY_REQUEST',
    async: true,
    shouldCallApi: (state) => true,
    callApi: () => ProcApi.getProcHistories(appName, procName, instance),
    payload: {},
  };
}

export function procOperation(appName, procName, instance, operation) {
  return {
    type: 'OPERATE_PROC_REQUEST',
    async: true,
    shouldCallApi: (state) => true,
    callApi: () => ProcApi.procOperation(appName, procName, instance, operation),
    payload: {appName, procName},
  };
}

export function patchCanaryProc(appName, procName, action, imageVersion, numInstance, secretFiles) {
  return {
    type: 'PATCH_PROC_CANARY_PROC_REQUEST',
    async: true,
    shouldCallApi: (state) => true,
    callApi: () => ProcApi.patchCanaryProc(appName, procName, action, imageVersion, numInstance, secretFiles)
  };
}

export function patchCanaryPolicy(appName, procName, action, mountpoints, divType, divData) {
  return {
    type: 'PATCH_PROC_CANARY_POLICY_GROUP_REQUEST',
    async: true,
    shouldCallApi: (state) => true,
    callApi: () => ProcApi.patchCanaryPolicy(appName, procName, action, mountpoints, divType, divData)
  };
}
