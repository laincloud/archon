import Cookie from '../models/Cookie';
import Fetch from '../models/apis/Fetch';
import * as ConsoleApi from '../models/apis/Console';
import {ACCESS_TOKEN_COOKIE} from '../models/apis/Types';

const {apiServer, ssoServer, ssoClientId} = window.assets;

let AuthorizeMixin = {
  
  authorize(callback) {
    if (this.isSessionValid()) {
      callback && callback();
    } else {
      ConsoleApi.isAuthOpen().then(({statusCode, data}) => {
        const isAuthOpen = data;
        if (isAuthOpen) {
          this.toAuth();
        } else {
          callback && callback();
        }
      }).catch((err) => {
        console.log(err)
        this.toAuth();
      });
    }  
  },

  isSessionValid() {
    const token = Cookie.get(ACCESS_TOKEN_COOKIE);
    return !!token;
  },

  toAuth() {
    let consoleApiServer = apiServer;
    if(apiServer == ""){
      consoleApiServer = `${location.protocol}//${location.host}`; 
    }
    const redirectUrl = `${consoleApiServer}/api/v1/authorize/`; 
    let params = {
      response_type: 'code',
      redirect_uri: redirectUrl,
      realm: 'archon',
      client_id: ssoClientId,
      scope: 'read:group write:group',
      state: Math.random(),
    };
    const oauthUrl = `${ssoServer}/oauth2/auth?${Fetch.toQuery(params)}`;
    window.location.href = oauthUrl;
  },

};

export default AuthorizeMixin;
