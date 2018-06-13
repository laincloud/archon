import React from 'react';
import {History} from 'react-router';

import * as ProcActions from '../models/actions/Procs'
import MDL from '../components/MdlComponents'
import ProcStatusHstryCard from '../components/ProcStatusHstryCard';
import AuthorizeMixin from '../mixins/AuthorizeMixin';
import ApiMixin from '../mixins/ApiMixin';
import FlashMessageMixin from '../mixins/FlashMessageMixin'

let ProcStatusHstryPage = React.createClass({

  mixins: [History, AuthorizeMixin, FlashMessageMixin, ApiMixin],
  
  componentDidMount(){
    this.authorize(()=>{
      this.refreshHistroies();
    });
  },

  componentWillReceiveProps(nextProps){
    const procname = this.getProcName();
    const instance = this.getInstance();
  },

  refreshHistroies(props = this.props){
    const {dispatch} = props;
    const appname = this.getAppName(props);
    const procname = this.getProcName(props);
    const instance = this.getInstance(props);
    if (procname && instance) {
      dispatch(ProcActions.getProcHistories(appname, procname, instance));
    }
  },

  render(){
    const appname = this.getAppName(this.props);
    const procname = this.getProcName(this.props);
    const instance = this.getInstance(this.props);
    const request = this.getRequest(['GET_PROCHISTORY_REQUEST']);
    const proc = request.data;
    return (
      <MDL.Grid>
        <MDL.GridCell col={12}>
          <ProcStatusHstryCard procname={procname} instance={instance} proc={proc} />
          <MDL.CardActions border buttons={[
            { title: '刷新', color: 'colored', onClick: this.refreshHistroies },
            { title: '返回应用', to: `/apps/${appname}`, color: 'colored' },
          ]}
            border={true} align='right'
          />
        </MDL.GridCell>
      </MDL.Grid>
    );
  },
  
  getAppName(props = this.props) {
    return props.params.appName;
  },

  getProcName(props = this.props) {
    return props.params.procName;
  },

  getInstance(props = this.props) {
    return props.params.instanceNo;
  },

});

export default ProcStatusHstryPage;
