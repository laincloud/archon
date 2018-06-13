import React from 'react';
import Radium from 'radium';
import {History} from 'react-router';
import classnames from 'classnames';

import MDL from './MdlComponents';

let CreateAppCard = React.createClass({

  mixins: [History],

  getInitialState() {
    return {
      isValid: true,
    };
  },

  contextTypes: {
    theme: React.PropTypes.object,
  },

  render() {
    const {theme} = this.context;
    const {isValid} = this.state;
    return (
      <MDL.Card depth={16} style={theme.card}>
        <div style={{ padding: "16px 16px 0" }}>
          <MDL.InputTextField style={{ width: '90%' }} floatingLabel={true}
              ref='appName' name='app-name' isValid={isValid}
              onEnterPressed={this.gotoDeployable}
              label="应用、服务、资源名称">
            <MDL.IconButton color='accent' icon='add' iconStyle={{ color: 'white' }}
              style={{ right: -40 }}
              onClick={this.gotoDeployable} />
          </MDL.InputTextField>
        </div>
        <MDL.CardSupportText>
          搜索或者添加新应用、服务、资源等到LAIN集群中，请在文字框中输入名称吧～
        </MDL.CardSupportText>
      </MDL.Card>
    ); 
  }, 

  onInputKeyDown(evt) {
    if (evt && evt.keyCode === 13) {
      this.gotoDeployable();
    }
  },

  gotoDeployable() {
    let value = this.refs.appName.getValue();
    if (!value) {
      this.setState({ isValid: false });
    } else {
      this.history.pushState(null, `/apps/${value}/deploy`);      
    }
  },

});

export default Radium(CreateAppCard);
