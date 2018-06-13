import React from 'react';
import Radium from 'radium';
import {Router, Route, Redirect} from 'react-router';
import createHistory from 'history/lib/createBrowserHistory';
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
import AppLogsPage from './pages/AppLogsPage';
import ContainerTerminalPage from './pages/ContainerTerminalPage'
import ProcStatusHstryPage from './pages/ProcStatusHstryPage'

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
    const match = this.props;
    return (
      <Provider store={store}>
        <div style={this.styles.pageContent}>
          <Router history={history} onUpdate={this.onRouterUpdate}>
            <Redirect from='/' to='/apps' />

            <Route path='/authorize/logout' component={UserLogoutPage} />
            <Redirect from='/authorize/complete' to='/' />
            <Route path='/apps' component={this.connectApi(AppListPage)} onEnter={this.onEnterApps}/>
            <Route path='/apps/:name' component={this.connectApi(AppDetailPage)} />
            <Route path='/apps/:name/deploy' component={this.connectApi(AppDeployPage)} />
            <Route path='/apps/:appName/proc/:procName' component={this.connectApi(ProcDetailPage)} />
            <Route path='/apps/:appName/portal/:procName' component={this.connectApi(PortalDetailPage)} />
            <Route path='/apps/:appName/versions' component={this.connectApi(AppVersionsPage)} />
            <Route path='/apps/:appName/logs' component={this.connectApi(AppLogsPage)} />
            <Route path='/apps/:appName/proc/:procName/instance/:instanceNo/enter' component={this.connectApi(ContainerTerminalPage)} />
            <Route path='/apps/:appName/proc/:procName/instance/:instanceNo/attach' component={this.connectApi(ContainerTerminalPage)} />
            <Route path='/apps/:appName/proc/:procName/instance/:instanceNo/histories' component={this.connectApi(ProcStatusHstryPage)} />
          </Router>
        </div>
      </Provider>
    );
  },

  onEnterApps(nextState, replaceState) {
    if (window.location.search.length > 0) {
      const params = new URLSearchParams(window.location.search.substring(1));
      const accessToken = params.get('access_token');
      if (accessToken) {
        const expiresIn = params.get('expires_in');

        var cookie = 'ACCESS_TOKEN=' + accessToken;
        var expires = new Date();
        expires.setTime(expires.getTime() + expiresIn * 1000);
        cookie += '; expires=' + expires.toUTCString();
        cookie += '; Max-Age=' + expiresIn;
        cookie += '; Path=/';
        document.cookie = cookie;
        history.replaceState(null, '/apps');
      }
    }
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
