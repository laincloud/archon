import React from 'react';
import {History} from 'react-router';

import * as AppActions from '../models/actions/Apps';
import Mdl from '../components/MdlComponents';
import CreateAppCard from '../components/CreateAppCard';
import LoadHud from '../components/LoadHud';
import NoticeInforCard from '../components/NoticeInforCard';
import AuthorizeMixin from '../mixins/AuthorizeMixin';
import ApiMixin from '../mixins/ApiMixin';
import ProcSummaryCard from '../components/ProcSummaryCard';
import ProcRuntimePodCard from '../components/ProcRuntimePodCard';
import AppView from '../models/views/App';
import ProcView from '../models/views/Proc';

const {Grid, GridCell} = Mdl;

let PortalDetailPage = React.createClass({
   
  mixins: [History, AuthorizeMixin, ApiMixin],

  componentDidMount() {
    this.authorize(() => {
      this.refreshApp();
    });
  },

  render() {
    const { appName, procName } = this.getNames();
    const { requests, isFetching, error } = this.getPageRequests(['GET_APP_REQUEST']);
    const [request] = requests;
    const proc = this.getProc(request);
    return (
      <Grid>
        <GridCell col={8}>
          {
            isFetching || error || !proc ? null :
              <ProcSummaryCard appName={appName} proc={proc} onRefreshClick={this.refreshApp} />
          }
          {
            isFetching || error || !proc ? null : 
              _.map(proc.pods, (pod, index) => {
                return <ProcRuntimePodCard key={index} appName={appName} instance={index+1} proc={proc} pod={pod} /> 
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
                message={`应用Portal操作 - ${appName}.${proc.proctype}.${procName} 失败：${error}`} />
          }
        </GridCell>
        <GridCell col={4}>
          <CreateAppCard />
        </GridCell>
        { isFetching ? <LoadHud /> : null }
      </Grid>
    );
  },

  refreshApp() {
    const {appName, procName} = this.getNames();
    if (appName && procName) {
      const {dispatch} = this.props;
      dispatch(AppActions.get(appName));
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
      const portals = _(app.useservices).map(s => s.service.portals).flatten().value();
      let index = _.findIndex(portals, (proc) => proc.procname === procName);
      if (index === -1) {
        return null;
      }
      return ProcView(portals[index]);
    }
    return null;
  },

});

export default PortalDetailPage;
