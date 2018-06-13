import React from 'react';
import {History} from 'react-router';

import * as AppActions from '../models/actions/Apps';
import * as ProcActions from '../models/actions/Procs';
import MDL from '../components/MdlComponents';
import CreateAppCard from '../components/CreateAppCard';
import LoadHud from '../components/LoadHud';
import NoticeInforCard from '../components/NoticeInforCard';
import AuthorizeMixin from '../mixins/AuthorizeMixin';
import FlashMessageMixin from '../mixins/FlashMessageMixin';
import ApiMixin from '../mixins/ApiMixin';
import ProcSummaryCard from '../components/ProcSummaryCard';
import ProcRuntimePodCard from '../components/ProcRuntimePodCard';
import ProcScheduleCanaryProcCard from '../components/ProcScheduleCanaryProcCard';
import ProcScheduleCanaryPolicyCard from '../components/ProcScheduleCanaryPolicyCard';
import ProcScheduleInstanceCard from '../components/ProcScheduleInstanceCard';
import ProcScheduleSpecCard from '../components/ProcScheduleSpecCard';
import AppView from '../models/views/App';
import ProcView from '../models/views/Proc';

let ProcDetailPage = React.createClass({
   
  mixins: [History, AuthorizeMixin, FlashMessageMixin, ApiMixin],

  componentDidMount() {
    this.authorize(() => {
      this.refreshApp();
    });
  },

  render() {
    const { appName, procName } = this.getNames();
    const { requests, isFetching, error } = 
      this.getPageRequests(['GET_APP_REQUEST',
                            'PATCH_PROC_INSTANCE_REQUEST',
                            'PATCH_PROC_SPEC_REQUEST',
                            'REMOVE_PROC_REQUEST',
                            'DEPLOY_PROC_REQUEST',
                            'PATCH_PROC_CANARY_PROC_REQUEST',
                            'PATCH_PROC_CANARY_POLICY_GROUP_REQUEST',
                            'GET_APPVERSIONS_REQUEST',
      ]);
    const [request, piReq, psReq, rmReq, deployReq, patchCanaryProcReq, patchCanaryPolicyReq, getAppVersionsReq] = requests;
    const proc = this.getProc(request);
    const appVersions = this.getAppVersions(getAppVersionsReq);
    const currentProcVersion = this.getCurrentProcVersion(proc);
    return (
      <MDL.Grid>
        <MDL.GridCell col={8}>
          { this.renderFlash(piReq.opFlash, AppActions.resetApiFlash('PATCH_PROC_INSTANCE_REQUEST')) }
          { this.renderFlash(psReq.opFlash, AppActions.resetApiFlash('PATCH_PROC_SPEC_REQUEST')) }
          { this.renderFlash(rmReq.opFlash, AppActions.resetApiFlash('REMOVE_PROC_REQUEST')) }
          { this.renderFlash(deployReq.opFlash, AppActions.resetApiFlash('DEPLOY_PROC_REQUEST')) }
          { this.renderFlash(patchCanaryProcReq.opFlash, AppActions.resetApiFlash('PATCH_PROC_CANARY_PROC_REQUEST')) }
          { this.renderFlash(patchCanaryPolicyReq.opFlash, AppActions.resetApiFlash('PATCH_PROC_CANARY_POLICY_GROUP_REQUEST')) }
          {
            isFetching || error || !proc ? null :
              <ProcSummaryCard appName={appName} proc={proc} onRefreshClick={this.refreshApp} />
          }
          {
            isFetching || error || !proc ? null : 
              _.map(proc.pods, (pod, index) => {
                return <ProcRuntimePodCard key={index} instance={index+1} appName={appName} proc={proc} procName={procName} pod={pod} /> 
              })
          }
          { 
            !error ? null :
              <NoticeInforCard title='请求出错了'
                noticeType='error'
                buttons={[
                  { title: '返回应用', onClick: (evt) => this.history.pushState(null, `/apps/${appName}`) },
                  { title: '刷新', color: 'colored', onClick: this.refreshApp },
                ]}
                message={`应用Proc操作 - ${appName}.${proc.proctype}.${procName} 失败：${error}`} />
          }
        </MDL.GridCell>
        <MDL.GridCell col={4}>
          <CreateAppCard />
          {
            !this.canAdmin(isFetching, error, proc, true) ? null :
              <ProcScheduleInstanceCard numInstance={proc.numinstances} 
                doSchedule={(numInstance) => this.scheduleInstance(appName, procName, numInstance)} />
          }
          {
            !this.canAdmin(isFetching, error, proc, true) ? null :
              <ProcScheduleSpecCard cpu={proc.cpu} memory={proc.memory} 
                doSchedule={(cpu, memory) => this.scheduleSpec(appName, procName, cpu, memory) } />
          }
          {
            !this.canAdmin(isFetching, error, proc, true) || !proc.canary ? null :
              <ProcScheduleCanaryProcCard
                imageVersion={proc.canary.canary_proc.image_version}
                secretFiles={proc.canary.canary_proc.secret_files}
                procVersions={appVersions}
                currentProcVersion={currentProcVersion}
                doSchedule={(action, imageVersion, secretFiles) => this.scheduleCanaryProc(appName, procName, action, imageVersion, secretFiles)}/>
          }
          {
            !this.canAdmin(isFetching, error, proc, true) || !proc.canary ? null :
              <ProcScheduleCanaryPolicyCard
                mountpoints={proc.canary.policy_group.mountpoints}
                divType={proc.canary.policy_group.rules['1'].divtype}
                divData={proc.canary.policy_group.rules['1'].divdata}
                doSchedule={(action, mountpoints, divType, divData) => this.scheduleCanaryPolicy(appName, procName, action, mountpoints, divType, divData)}/>
          }
          { 
            !this.canAdmin(isFetching, error, proc, false) ? null :
              <NoticeInforCard title={`重新部署`}
                noticeType='success'
                buttons={[
                  { title: '确认部署', color: 'accent', onClick: (evt) => this.deployProc(appName, procName) },
                ]}
                message={`Proc已经被移除部署，可以选择重新部署。`} />
          }
          { 
            !this.canAdmin(isFetching, error, proc, true) ? null :
              <NoticeInforCard title={`移除部署`}
                noticeType='error'
                buttons={[
                  { title: '删除', icon: 'highlight_remove', color: 'accent', onClick: (evt) => this.deleteProc(appName, procName) },
                ]}
                message={`删除应用的Proc将会移除所有本Proc在集群中的运行容器，还可以选择重新部署。`} />
          }
        </MDL.GridCell>
        { isFetching ? <LoadHud /> : null }
      </MDL.Grid>
    );
  },

  canAdmin(isFetching, error, proc, needPods) {
    if (error || isFetching || !proc) {
      return false;
    } 
    return proc.pods.length > 0 ? needPods : !needPods;
  },

  deployProc(appName, procName) {
    if (confirm(`确定要重新部署Proc－${procName}吗？`)) {
      const {dispatch} = this.props;
      dispatch(AppActions.resetApiCall('PATCH_PROC_INSTANCE_REQUEST'));
      dispatch(AppActions.resetApiCall('PATCH_PROC_SPEC_REQUEST'));
      dispatch(AppActions.resetApiCall('REMOVE_PROC_REQUEST'));
      dispatch(AppActions.resetApiCall('DEPLOY_PROC_REQUEST'));
      dispatch(AppActions.resetApiCall('PATCH_PROC_CANARY_PROC_REQUEST'));
      dispatch(AppActions.resetApiCall('PATCH_PROC_CANARY_POLICY_GROUP_REQUEST'));
      dispatch(ProcActions.deploy(appName, procName)); 
    } 
  },

  deleteProc(appName, procName) {
    if (confirm(`确定要移除Proc－${procName}的部署吗？`)) {
      const {dispatch} = this.props;
      dispatch(AppActions.resetApiCall('PATCH_PROC_INSTANCE_REQUEST'));
      dispatch(AppActions.resetApiCall('PATCH_PROC_SPEC_REQUEST'));
      dispatch(AppActions.resetApiCall('REMOVE_PROC_REQUEST'));
      dispatch(AppActions.resetApiCall('DEPLOY_PROC_REQUEST'));
      dispatch(AppActions.resetApiCall('PATCH_PROC_CANARY_PROC_REQUEST'));
      dispatch(AppActions.resetApiCall('PATCH_PROC_CANARY_POLICY_GROUP_REQUEST'));
      dispatch(ProcActions.remove(appName, procName));
    }
  },

  scheduleSpec(appName, procName, cpu, memory) {
    if (confirm(`确定要调整${procName}的运行预留资源吗？`)) {
      const {dispatch} = this.props;
      dispatch(AppActions.resetApiCall('PATCH_PROC_INSTANCE_REQUEST'));
      dispatch(AppActions.resetApiCall('PATCH_PROC_SPEC_REQUEST'));
      dispatch(AppActions.resetApiCall('REMOVE_PROC_REQUEST'));
      dispatch(AppActions.resetApiCall('DEPLOY_PROC_REQUEST'));
      dispatch(AppActions.resetApiCall('PATCH_PROC_CANARY_PROC_REQUEST'));
      dispatch(AppActions.resetApiCall('PATCH_PROC_CANARY_POLICY_GROUP_REQUEST'));
      dispatch(ProcActions.patchSpec(appName, procName, cpu, memory));
    }
  },

  scheduleInstance(appName, procName, numInstance) {
    if (confirm(`确定要调整${procName}的运行实例数量吗？`)) {
      const {dispatch} = this.props;
      dispatch(AppActions.resetApiCall('PATCH_PROC_INSTANCE_REQUEST'));
      dispatch(AppActions.resetApiCall('PATCH_PROC_SPEC_REQUEST'));
      dispatch(AppActions.resetApiCall('REMOVE_PROC_REQUEST'));
      dispatch(AppActions.resetApiCall('DEPLOY_PROC_REQUEST'));
      dispatch(AppActions.resetApiCall('PATCH_PROC_CANARY_PROC_REQUEST'));
      dispatch(AppActions.resetApiCall('PATCH_PROC_CANARY_POLICY_GROUP_REQUEST'));
      dispatch(ProcActions.patchInstance(appName, procName, numInstance));
    }
  },

  scheduleCanaryProc(appName, procName, action, imageVersion, secretFiles) {
    if (confirm(`确定要调度灰度 Proc 吗？`)) {
      const {dispatch} = this.props;
      dispatch(AppActions.resetApiCall('PATCH_PROC_INSTANCE_REQUEST'));
      dispatch(AppActions.resetApiCall('PATCH_PROC_SPEC_REQUEST'));
      dispatch(AppActions.resetApiCall('REMOVE_PROC_REQUEST'));
      dispatch(AppActions.resetApiCall('DEPLOY_PROC_REQUEST'));
      dispatch(AppActions.resetApiCall('PATCH_PROC_CANARY_PROC_REQUEST'));
      dispatch(AppActions.resetApiCall('PATCH_PROC_CANARY_POLICY_GROUP_REQUEST'));
      dispatch(ProcActions.patchCanaryProc(appName, procName, action, imageVersion, secretFiles));
    }
  },

  scheduleCanaryPolicy(appName, procName, action, mountpoints, divType, divData) {
    if (confirm(`确定要调度灰度策略吗？`)) {
      const {dispatch} = this.props;
      dispatch(AppActions.resetApiCall('PATCH_PROC_INSTANCE_REQUEST'));
      dispatch(AppActions.resetApiCall('PATCH_PROC_SPEC_REQUEST'));
      dispatch(AppActions.resetApiCall('REMOVE_PROC_REQUEST'));
      dispatch(AppActions.resetApiCall('DEPLOY_PROC_REQUEST'));
      dispatch(AppActions.resetApiCall('PATCH_PROC_CANARY_PROC_REQUEST'));
      dispatch(AppActions.resetApiCall('PATCH_PROC_CANARY_POLICY_GROUP_REQUEST'));
      dispatch(ProcActions.patchCanaryPolicy(appName, procName, action, mountpoints, divType, divData));
    }
  },

  refreshApp() {
    const {appName, procName} = this.getNames();
    if (appName && procName) {
      const {dispatch} = this.props;
      dispatch(AppActions.resetApiCall('PATCH_PROC_INSTANCE_REQUEST'));
      dispatch(AppActions.resetApiCall('PATCH_PROC_SPEC_REQUEST'));
      dispatch(AppActions.resetApiCall('REMOVE_PROC_REQUEST'));
      dispatch(AppActions.resetApiCall('DEPLOY_PROC_REQUEST'));
      dispatch(AppActions.resetApiCall('PATCH_PROC_CANARY_PROC_REQUEST'));
      dispatch(AppActions.resetApiCall('PATCH_PROC_CANARY_POLICY_GROUP_REQUEST'));
      dispatch(AppActions.get(appName));
      dispatch(AppActions.getVersions(appName));
    } else {
      if (appName) {
        this.history.replaceState(null, `/apps/${appName}`);
      } else {
        this.history.replaceState(null, '/'); 
      }
    }
  },

  getNames() {
    const {appName, procName} = this.props.params;
    return { appName, procName };
  },

  getProc(request) {
    const {appName, procName} = this.getNames();
    if (request.statusCode === 200) {
      const app = request.data;
      let index = _.findIndex(app.procs, (proc) => proc.procname === procName);
      if (index === -1) {
        return null;
      }
      let proc = ProcView(app.procs[index]);
      if (!procName.endsWith('_canary')) {
        let canary = app.canaries[procName];
        const emptyCanaryProc = {};
        const emptyPolicyGroup ={
          'rules': {
            '1': {}
          }
        };
        if (!canary) {
          canary = {};
        };
        if (!canary.canary_proc) {
          canary.canary_proc = emptyCanaryProc
        };
        if (!canary.policy_group) {
          canary.policy_group = emptyPolicyGroup;
        };
        console.log(canary);
        proc.canary = canary;
      }
      return proc;
    }
    return null;
  },

  getAppVersions(request) {
    if (request.statusCode === 200) {
      return request.data;
    }
  },

  getCurrentProcVersion(proc) {
    if (proc) {
      return proc.image.split('release')[1].substring(1);
    }

    return null;
  }

});

export default ProcDetailPage;
