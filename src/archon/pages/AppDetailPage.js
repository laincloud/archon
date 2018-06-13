import React from 'react';
import {History} from 'react-router';

import * as AppActions from '../models/actions/Apps';
import * as ProcActions from '../models/actions/Procs';
import MDL from '../components/MdlComponents';
import AppSummaryCard from '../components/AppSummaryCard';
import CreateAppCard from '../components/CreateAppCard';
import AppProcDetailCard from '../components/AppProcDetailCard';
import AppServicePortalCard from '../components/AppServicePortalCard';
import LoadHud from '../components/LoadHud';
import NoticeInforCard from '../components/NoticeInforCard';
import AuthorizeMixin from '../mixins/AuthorizeMixin';
import FlashMessageMixin from '../mixins/FlashMessageMixin';
import ApiMixin from '../mixins/ApiMixin';
import AppView from '../models/views/App';
import ProcView from '../models/views/Proc';

let AppDetailPage = React.createClass({

  mixins: [History, AuthorizeMixin, FlashMessageMixin, ApiMixin],

  componentDidMount() {
    this.authorize(() => {
      this.refreshApp();
    });
  },

  componentWillReceiveProps(nextProps) {
    const name = this.getAppName();
    const newName = nextProps.params.name;
    if (newName !== name) {
      this.authorize(() => {
        this.refreshApp(nextProps);
      });
    } else {
      const request = this.getRequestFromProps(nextProps, 'DELETE_APP_REQUEST');
      if (request.statusCode === 202) {
        // app got deleted
        this.history.pushState(null, '/apps');
      }
    }
  },

  render() {
    const name = this.getAppName();
    const { requests, isFetching, error } = 
      this.getPageRequests(['GET_APP_REQUEST', 'UPGRADE_APP_REQUEST', 'DELETE_APP_REQUEST', 'ROLLBACK_APP_REQUEST', 'GET_APPLOGS_REQUEST']);
    const [request, upgradeReq, deleteReq, rollbackReq] = requests;
    return (
      <MDL.Grid>
        <MDL.GridCell col={8}>
          { this.renderFlash(upgradeReq.opFlash, AppActions.resetApiFlash('UPGRADE_APP_REQUEST')) }
          { 
            !error ? null :
              <NoticeInforCard title='请求出错了'
                noticeType='error'
                buttons={[
                  { title: '刷新', color: 'colored', onClick: this.refreshApp },
                ]}
                message={`应用操作 - ${name} 失败：${error}`} />
          }
          { this.renderApp(request) }
        </MDL.GridCell>
        <MDL.GridCell col={4}>
          <CreateAppCard />
          {
            error || isFetching ? null :
              <NoticeInforCard title={`升级应用`}
                noticeType='info'
                buttons={[
                  { title: '升级', icon: 'trending_up', color: 'accent', onClick: (evt) => this.upgradeApp(name) },
                ]}
                message={`推送最新版的应用Image之后，可以点击升级按钮对本应用进行升级。`} />
          }
          { 
            error || isFetching ? null : 
              <NoticeInforCard title={`部署应用`}
                noticeType='info'
                buttons={[
                  { title: '选择版本部署', icon: 'trending_up', color: 'accent', onClick: (evt) => this.rollbackApp(name) },
                ]}
                message={`部署应用将会使用指定的应用版本进行部署，用户需要在详情页面认真核对版本，是否对应正确的代码提交。`} />
          }
          { 
            error || isFetching ? null : 
              <NoticeInforCard title={`删除应用`}
                noticeType='error'
                buttons={[
                  { title: '删除', icon: 'highlight_remove', color: 'accent', onClick: (evt) => this.deleteApp(name) },
                ]}
                message={`删除应用将会移除所有本App在集群中的运行容器，但是会保留本应用的注册信息，之后还可以重新部署。`} />
          }
          { 
            error || isFetching ? null : 
              <NoticeInforCard title={`应用操作日志`}
                noticeType='info'
                buttons={[
                  { title: '查看日志', icon: 'trending_up', color: 'accent', onClick: (evt) => this.showAppLogs(name) },
                ]}
                message={`显示应用的操作日志，目前只显示最新的 50 条日志`} />
          }
        </MDL.GridCell>
        { isFetching ? <LoadHud /> : null }
      </MDL.Grid>
    );
  },

  renderApp(request) {
    const appName = this.getAppName();
    if (request.statusCode !== 200) {
      return null;
    }
    const app = request.data;
    return (
      <div>
        <AppSummaryCard app={app} inDetail={true} onRefreshClick={this.refreshApp} />
        { 
          app.procs.map((proc, index) => 
            <AppProcDetailCard proc={ProcView(proc)} app={AppView(app)} key={index} procOpHandler={this.operateProc}/>) }
        {
          app.useservices.map((us, index) => {
            const service = us.service;
            if (!service.portals) {
              return null;
            }
            return (
              <div key={index}>
                { service.portals.map((portal, pIndex) => 
                    <AppServicePortalCard service={service} app={AppView(app)} portal={ProcView(portal)} key={pIndex} procOpHandler={this.operateProc} />) }
              </div>
            );
          })
        }
      </div>
    );
  },

  refreshApp(props = this.props) {
    const {dispatch} = props;
    const name = this.getAppName(props);
    if (name) {
      dispatch(AppActions.resetApiCall('UPGRADE_APP_REQUEST'));
      dispatch(AppActions.resetApiCall('DELETE_APP_REQUEST'));
      dispatch(AppActions.resetApiCall('ROLLBACK_APP_REQUEST'));
      dispatch(AppActions.get(name));
    } else {
      this.history.replaceState(null, '/'); 
    }
  },

  operateProc(procname, instance, operation) {
    const {dispatch} = this.props;
    const appname = this.getAppName(this.props);
    if (appname) {
      dispatch(ProcActions.procOperation(appname, procname, instance, operation));
      dispatch(AppActions.get(appname));
    } else {
      this.history.replaceState(null, '/'); 
    }
  },

  upgradeApp(name) {
    if (confirm(`确定要升级应用－${name}吗？`)) {
      const {dispatch} = this.props;
      dispatch(AppActions.resetApiCall('UPGRADE_APP_REQUEST'));
      dispatch(AppActions.resetApiCall('DELETE_APP_REQUEST'));
      dispatch(AppActions.resetApiCall('ROLLBACK_APP_REQUEST'));
      dispatch(AppActions.resetApiCall('GET_APPLOGS_REQUEST'));
      name && dispatch(AppActions.upgrade(name));
    }
  },

  deleteApp(name) {
    if (confirm(`确定要删除应用－${name}吗？`)) {
      const {dispatch} = this.props;
      dispatch(AppActions.resetApiCall('UPGRADE_APP_REQUEST'));
      dispatch(AppActions.resetApiCall('DELETE_APP_REQUEST'));
      dispatch(AppActions.resetApiCall('ROLLBACK_APP_REQUEST'));
      dispatch(AppActions.resetApiCall('GET_APPLOGS_REQUEST'));
      name && dispatch(AppActions.remove(name));
    } 
  },

  rollbackApp(name){
    const {dispatch} = this.props;
    dispatch(AppActions.resetApiCall('UPGRADE_APP_REQUEST'));
    dispatch(AppActions.resetApiCall('DELETE_APP_REQUEST'));
    dispatch(AppActions.resetApiCall('ROLLBACK_APP_REQUEST'));
    dispatch(AppActions.resetApiCall('GET_APPLOGS_REQUEST'));
    this.history.pushState(null, `/apps/${name}/versions`); 
  },
  
  showAppLogs(name){
    const {dispatch} = this.props;
    dispatch(AppActions.resetApiCall('UPGRADE_APP_REQUEST'));
    dispatch(AppActions.resetApiCall('DELETE_APP_REQUEST'));
    dispatch(AppActions.resetApiCall('ROLLBACK_APP_REQUEST'));
    dispatch(AppActions.resetApiCall('GET_APPLOGS_REQUEST'));
    this.history.pushState(null, `/apps/${name}/logs`); 
  },

  getAppName(props = this.props) {
    return props.params.name;
  },

});

export default AppDetailPage;
