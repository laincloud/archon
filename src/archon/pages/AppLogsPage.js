import React from 'react';
import {History} from 'react-router';

import * as AppActions from '../models/actions/Apps'
import MDL from '../components/MdlComponents'
import AppLogsCard from '../components/AppLogsCard';
import AuthorizeMixin from '../mixins/AuthorizeMixin';
import ApiMixin from '../mixins/ApiMixin';
import FlashMessageMixin from '../mixins/FlashMessageMixin'

let AppLogsPage = React.createClass({

  mixins: [History, AuthorizeMixin, FlashMessageMixin, ApiMixin],
  
  //contextTypes: {
  //  theme: React.PropTypes.object,
  //},

  componentDidMount(){
    this.authorize(()=>{
      this.refreshLogs();
    });
  },

  componentWillReceiveProps(nextProps){
    const name = this.getAppName();
    const newName = nextProps.params.appName;
  },

  refreshLogs(props = this.props){
    const {dispatch} = props;
    const name = this.getAppName(props);
    if (name) {
      dispatch(AppActions.getLogs(name));
    }
  },

  render(){
    const name = this.getAppName();
    const request = this.getRequest(['GET_APPLOGS_REQUEST']);
    const logs = request.data;
    return (
      <MDL.Grid>
        <MDL.GridCell col={12}>
          <AppLogsCard appname={name} logs={logs} />
          <MDL.CardActions border buttons={[
            { title: '刷新', to: `/apps/${name}/logs`, color: 'colored'  },
            { title: '返回应用', to: `/apps/${name}`, color: 'colored' },
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


});

export default AppLogsPage;
