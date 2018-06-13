import Cookie from '../Cookie';
import {ACCESS_TOKEN_COOKIE} from './Types';

const Fetch = {
  
  toQuery(kv) {
    return !_.isObject(kv) ? '' :
      _(kv).keys().map(k => `${k}=${encodeURIComponent(kv[k])}`).join("&");
  },

  wrap(statusCode, data, flash='') {
    return { statusCode, data, flash };
  },

  text(api, method, payload, debug=true) {
    let code = 314159;
    let headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };
    const token = Cookie.get(ACCESS_TOKEN_COOKIE);
    if (token) {
      headers['access-token'] = token;
    }
    let options = { method, headers };
    if (payload) {
      options['body'] = JSON.stringify(payload);
    }
    return fetch(api, options).then(response => {
      code = response.status;
      return response.text();
    }).then(txt => {
      if (process.env.NODE_ENV === "development") {
        console.log(`Fetched: ${method} ${api} - ${code}`, payload);
        if (debug) {
          console.log('Text Data:', txt);
        }
      }
      return this.wrap(code, txt);
    }).catch(err => {
      console.error(`Error when ${method} ${api} - ${err}`, payload);
      return Promise.reject(this.wrap(code, `Server got hacked, ${err}`));
    });
  },

  json(api, method, payload) {
    return this.text(api, method, payload, false)
      .then(({statusCode, data}) => {
        try {
          const obj = JSON.parse(data);
          if (process.env.NODE_ENV === "development") {
            console.log(`JSON Data:`, obj);
          }
          return this.wrap(statusCode, obj);
        } catch (err) {
          console.error(`Failed to parse json, please call Fetch.text method, ${err}`);
          return Promise.reject(this.wrap(statusCode, `Not a json api. Server returned code ${statusCode}`));
        } 
      });
  },

};

export default Fetch;
