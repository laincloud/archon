import Fetch from './Fetch';

const {apiServer} = window.assets;
const apiProcs = (appName) => `${apiServer}/api/v1/apps/${appName}/procs/`;
const apiProcHistories = (appName, procName, instance) => `${apiServer}/api/v1/apps/${appName}/procs/${procName}/instance/${instance}/histories/`;

export function patchInstance(appName, procName, numInstance) {
  let payload = {
    num_instances: numInstance,
  };  
  return Fetch.json(`${apiProcs(appName)}${procName}/`, 'PATCH', payload)
    .then(({statusCode, data}) => {
      if (statusCode === 202) {
        return Fetch.wrap(statusCode, data, `调度成功：\n${data.msg}\n请稍后点击刷新查看调度结果`);
      }
      const rej = Fetch.wrap(statusCode, data.msg || `调度失败，返回代码：${statusCode}`);
      return Promise.reject(rej);
    });
}

export function patchSpec(appName, procName, cpu, memory) {
  let payload = { cpu, memory };
  return Fetch.json(`${apiProcs(appName)}${procName}/`, 'PATCH', payload)
    .then(({statusCode, data}) => {
      if (statusCode === 202) {
        return Fetch.wrap(statusCode, data, `调度成功：\n${data.msg}\n请稍后点击刷新查看调度结果`);
      }
      const rej = Fetch.wrap(statusCode, data.msg || `调度失败，返回代码：${statusCode}`);
      return Promise.reject(rej);
    });
}

export function remove(appName, procName) {
  return Fetch.json(`${apiProcs(appName)}${procName}/`, 'DELETE', null)
    .then(({statusCode, data}) => {
      if (statusCode === 202) {
        return Fetch.wrap(statusCode, data.proc, `调度删除Proc成功：\n${data.msg}\n请稍后点击刷新查看结果`);
      }
      const rej = Fetch.wrap(statusCode, data.msg || `删除Proc失败，返回代码：${statusCode}`);
      return Promise.reject(rej);
    });
}

export function deploy(appName, procName) {
  let payload = { procname: procName };
  return Fetch.json(apiProcs(appName), 'POST', payload)
    .then(({statusCode, data}) => {
      if (statusCode === 201) {
        return Fetch.wrap(statusCode, data.proc, `调度部署Proc成功：\n${data.msg}\n请稍后点击刷新查看结果`);
      }
      const rej = Fetch.wrap(statusCode, data.msg || `部署Proc失败，返回代码：${statusCode}`);
      return Promise.reject(rej);
    });
}

export function getProcHistories(appName, procName, instance) {
  return Fetch.json(apiProcHistories(appName, procName, instance), 'GET', null)
    .then(({statusCode, data}) => {
      if (statusCode === 200 && data.proc) {
        return Fetch.wrap(statusCode, data.proc, `获取数据信息成功`);
      } 
      const rej = Fetch.wrap(statusCode, data.msg || `无法获取Proc历史状态列表，返回代码: ${statusCode}`);
      return Promise.reject(rej);
    });
}

export function procOperation(appName, procName, instance, operation) {
  let payload = {
    operation: operation,
    instance: instance,
  };
  return Fetch.json(`${apiProcs(appName)}${procName}/`, 'PATCH', payload)
    .then(({statusCode, data}) => {
      if (statusCode === 202) {
        return Fetch.wrap(statusCode, data, `操作成功：\n${data.msg}\n请稍后点击刷新查看操作结果`);
      }
      const rej = Fetch.wrap(statusCode, data.msg || `操作失败，返回代码：${statusCode}`);
      return Promise.reject(rej);
    });
}

export function patchCanaryProc(appName, procName, action, imageVersion, secretFiles) {
  const payload = {
    canary_proc: {
      action: action,
      image_version: imageVersion,
      secret_files: secretFiles
    }
  };
  return Fetch.json(`${apiProcs(appName)}${procName}/`, 'PATCH', payload)
    .then(({statusCode, data}) => {
      if (statusCode === 202) {
        return Fetch.wrap(statusCode, data, `调度成功：\n${data.msg}\n请稍后点击刷新查看调度结果`);
      }
      const rej = Fetch.wrap(statusCode, data.msg || `调度失败，返回代码：${statusCode}`);
      return Promise.reject(rej);
    })
}

export function patchCanaryPolicy(appName, procName, action, mountpoints, divType, divData) {
  const payload = {
    canary_policy_group: {
      action: action,
      mountpoints: mountpoints,
      rules: {
        1: {
          divtype: divType,
          divdata: divData
        }
      }
    }
  };
  return Fetch.json(`${apiProcs(appName)}${procName}/`, 'PATCH', payload)
    .then(({statusCode, data}) => {
      if (statusCode === 202) {
        return Fetch.wrap(statusCode, data, `调度成功：\n${data.msg}\n请稍后点击刷新查看调度结果`);
      }
      const rej = Fetch.wrap(statusCode, data.msg || `调度失败，返回代码：${statusCode}`);
      return Promise.reject(rej);
    })
}
