import 'es5-shim';
import 'whatwg-fetch';
import _ from 'lodash';
window._ = _;

import React from 'react';
import ReactDOM from 'react-dom';
import ArchonApp from './archon/App';

import LOGO from './logo.png';

window.assets['imgLogo'] = LOGO;

let domReady = () => {
  ReactDOM.render(<ArchonApp />, document.getElementById("archon"));
}

if (typeof document.onreadystatechange === "undefined") {
    window.onload = () => domReady();
} else {
    document.onreadystatechange = () => {
      if (document.readyState !== "complete") {
        return;
      }
      domReady();
    }
}
