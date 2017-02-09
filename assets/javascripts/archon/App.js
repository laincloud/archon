import React from 'react';
import Radium from 'radium';
import {Router, Route, Redirect} from 'react-router';
import createHistory from 'history/lib/createBrowserHistory'
import {Provider, connect} from 'react-redux';

import store from './models/Store';
import ThemeStyles from './components/ThemeStyles';
import UserLogoutPage from './pages/UserLogoutPage';
import AppListPage from './pages/AppListPage';
import AppDetailPage from './pages/AppDetailPage';
import AppDeployPage from './pages/AppDeployPage';
import ProcDetailPage from './pages/ProcDetailPage';
import PortalDetailPage from './pages/PortalDetailPage';
import AppVersionsPage from './pages/AppVersionsPage';
import ContainerTerminalPage from './pages/ContainerTerminalPage'

let history = createHistory();

let ArchonApp = React.createClass({

  childContextTypes: {
    theme: React.PropTypes.object,
  },

  getChildContext() {
    return {
      'theme': ThemeStyles,
    };
  },

  render() {
    return (
      <Provider store={store}>
        <div style={this.styles.pageContent}>
          <Router history={history} onUpdate={this.onRouterUpdate}>
            <Redirect from='/archon' to='/archon/apps' />

            <Route path='/archon/authorize/logout' component={UserLogoutPage} />
            <Redirect from='/archon/authorize/complete' to='/archon' />

            <Route path='/archon/apps' component={this.connectApi(AppListPage)} />
            <Route path='/archon/apps/:name' component={this.connectApi(AppDetailPage)} />
            <Route path='/archon/apps/:name/deploy' component={this.connectApi(AppDeployPage)} />
            <Route path='/archon/apps/:appName/proc/:procName' component={this.connectApi(ProcDetailPage)} />
            <Route path='/archon/apps/:appName/portal/:procName' component={this.connectApi(PortalDetailPage)} />
            <Route path='/archon/apps/:appName/versions' component={this.connectApi(AppVersionsPage)} />
            <Route path='/archon/apps/:appName/proc/:procName/instance/:instanceNo/enter' component={this.connectApi(ContainerTerminalPage)} />
            <Route path='/archon/apps/:appName/proc/:procName/instance/:instanceNo/attach' component={this.connectApi(ContainerTerminalPage)} />
          </Router>
        </div>
      </Provider>
    );
  },

  onRouterUpdate() {
    document.getElementById("archon").scrollTop = 0;
  },

  connectApi(Component) {
    return connect((state) => state.apiCalls)(Component);
  },

  styles: {
    pageContent: {
      display: "block",
      maxWidth: 1960,
      margin: "0 auto",
      height: "100%",
    },
  },
});

export default Radium(ArchonApp);
