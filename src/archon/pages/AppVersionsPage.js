import React from 'react';
import {History} from 'react-router';

import * as AppActions from '../models/actions/Apps'
import MDL from '../components/MdlComponents'
import AppVersionsCard from '../components/AppVersionsCard';
import AuthorizeMixin from '../mixins/AuthorizeMixin';
import ApiMixin from '../mixins/ApiMixin';
import FlashMessageMixin from '../mixins/FlashMessageMixin'

let AppVersionsPage = React.createClass({

  mixins: [History, AuthorizeMixin, FlashMessageMixin, ApiMixin],
  
  //contextTypes: {
  //  theme: React.PropTypes.object,
  //},

  componentDidMount(){
    this.authorize(()=>{
      this.refreshVersions();
    });
  },

  componentWillReceiveProps(nextProps){
    const name = this.getAppName();
    const newName = nextProps.params.appName;
  },

  refreshVersions(props = this.props){
    const {dispatch} = props;
    const name = this.getAppName(props);
    if (name) {
      dispatch(AppActions.getVersions(name));
    }
  },

  render(){
    const name = this.getAppName();
    const request = this.getRequest(['GET_APPVERSIONS_REQUEST']);
    const versions = request.data;
    return (
      <MDL.Grid>
        <MDL.GridCell col={8}>
          <AppVersionsCard appname={name} versions={versions} callback={this.deployAppWithVersion}/>
          <MDL.CardActions border buttons={[
            { title: '刷新', to: `/apps/${name}/versions`, color: 'colored'  },
            { title: '返回应用', to: `/apps/${name}`, color: 'colored' },
          ]}
            border={true} align='right'
          />
        </MDL.GridCell>
      </MDL.Grid>
    );
  },
  
  getAppName(props = this.props) { return props.params.appName;
  },

  deployAppWithVersion(version){
    const {dispatch} = this.props;
    const name = this.getAppName();
    name && dispatch(AppActions.upgrade(name,version));
    this.history.replaceState(null, `/apps/${name}`);
  },

});

export default AppVersionsPage;
