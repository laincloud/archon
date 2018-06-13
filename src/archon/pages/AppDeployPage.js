import React from 'react';
import {History} from 'react-router';

import * as AppActions from '../models/actions/Apps';
import MDL from '../components/MdlComponents';
import CreateAppCard from '../components/CreateAppCard';
import LoadHud from '../components/LoadHud';
import NoticeInforCard from '../components/NoticeInforCard';
import AuthorizeMixin from '../mixins/AuthorizeMixin';
import ApiMixin from '../mixins/ApiMixin';

let AppDeployPage = React.createClass({

  mixins: [History, AuthorizeMixin, ApiMixin],

  refresh() {
    this.authorize(() => {
      this.isDeployable(this.getAppName());
    });
  },

  componentDidMount() {
    this.refresh();
  },

  componentWillReceiveProps(nextProps) {
    const name = this.getAppName();
    const deploy = this.getDeploy(nextProps);
    if (deploy.data === 'deployed') {
      this.history.replaceState(null, `/apps/${name}`);
    }

    // Routing maybe changed
    const newName = nextProps.params.name;
    if (newName !== name) {
      this.authorize(() => {
        this.isDeployable(newName);
      });
    }
  },

  render() {
    const name = this.getAppName();
    const deploy = this.getDeploy(this.props);
    return (
      <MDL.Grid>
        <MDL.GridCell col={8}>
          { this.renderDeploy(name, deploy) }
          { 
            !deploy.error ? null :
              <NoticeInforCard title='请求出错了'
                noticeType='error'
                buttons={[
                  { title: '刷新', onClick: this.refresh, color: 'colored' },
                ]}
                message={`应用 - ${name} 部署失败：${deploy.error}`} />
          }
        </MDL.GridCell>
        <MDL.GridCell col={4}>
          <CreateAppCard />
        </MDL.GridCell>
        { deploy.isFetching ? <LoadHud /> : null }
      </MDL.Grid>
    );
  },

  renderDeploy(name, deploy) {
    if (deploy.isFetching || deploy.error) {
      return null;
    }
    switch(deploy.data) {
    case 'new':
      return (
        <NoticeInforCard title={`新建应用－${name}`}
          noticeType='success'
          buttons={[
            { title: '注册应用', color: 'primary', onClick: (evt) => this.doRegister(name) },
          ]}
          message={`应用－${name} 还没有被注册，是否注册该应用呢？`} />
      );
    case 'registered':
      return (
        <NoticeInforCard title={`部署应用－${name}`}
          noticeType='warning'
          buttons={[
            { title: '部署应用', color: 'accent', onClick: (evt) => this.doDeploy(name) },
          ]}
          message={`应用－${name} 还没有被部署，是否部署该应用？`} />
      );
    default: 
      return (
        <NoticeInforCard title={`应用－${name} 部署状态异常`}
          noticeType='error'
          message={`理论上不应该出现这种情况，:)`} />
      );
    }
  },

  isDeployable(name) {
    const {dispatch} = this.props;
    if (name) {
      dispatch(AppActions.resetApiCall('CHECK_APP_DEPLOY_REQUEST'));
      dispatch(AppActions.resetApiCall('REGISTER_APP_REQUEST'));
      dispatch(AppActions.resetApiCall('DEPLOY_APP_REQUEST'));
      dispatch(AppActions.isDeployable(name));
    } else {
      this.history.replaceState(null, '/'); 
    }
  },

  doRegister(name) {
    if (confirm(`确定要注册应用名称－${name}吗？`)) {
      const {dispatch} = this.props;
      dispatch(AppActions.resetApiCall('CHECK_APP_DEPLOY_REQUEST'));
      dispatch(AppActions.resetApiCall('REGISTER_APP_REQUEST'));
      dispatch(AppActions.resetApiCall('DEPLOY_APP_REQUEST'));
      name && dispatch(AppActions.register(name));
    }
  },

  doDeploy(name) {
    if (confirm(`确定要部署应用－${name}吗？`)) {
      const {dispatch} = this.props;
      dispatch(AppActions.resetApiCall('CHECK_APP_DEPLOY_REQUEST'));
      dispatch(AppActions.resetApiCall('REGISTER_APP_REQUEST'));
      dispatch(AppActions.resetApiCall('DEPLOY_APP_REQUEST'));
      name && dispatch(AppActions.deploy(name));
    }
  },

  getAppName() {
    return this.props.params.name;
  },

  getDeploy(props) {
    let requests = ['DEPLOY_APP_REQUEST', 'REGISTER_APP_REQUEST', 'CHECK_APP_DEPLOY_REQUEST'];
    let lastRequest = null;
    let isFetching = false;
    for (let i = 0; i < requests.length; i += 1) {
      const request = this.getRequestFromProps(props, requests[i]);
      if (request.isFetching) {
        isFetching = request.isFetching;
      }
      if (request.statusCode !== 0) {
        request.isFetching = isFetching;
        return request;
      }
      lastRequest = request;
    }
    lastRequest.isFetching = isFetching;
    return lastRequest;
  },

});

export default AppDeployPage;
