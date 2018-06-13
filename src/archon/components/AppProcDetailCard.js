import React from 'react';
import {Link} from 'react-router';
import Radium from 'radium';

import MDL from './MdlComponents';
import ProcRuntimeSection from './ProcRuntimeSection';
import ProcSpecSection from './ProcSpecSection';

let AppProcDetailCard = React.createClass({

  contextTypes: {
    theme: React.PropTypes.object,
  },

  render() {
    const {theme} = this.context;
    const {app, proc, procOpHandler} = this.props;
    const lifescore = proc.lifescore();
    const titleStyle = _.assign({}, this.styles.cardTitle, theme.colorStyle('proc', true));
    return (
      <MDL.Card depth={2} style={theme.card}>
        <MDL.CardTitle style={titleStyle} title={`Proc - ${app.procFullname(proc)}`} />
        <div style={{ padding: '16px 0' }}>
          <ProcRuntimeSection proc={proc} fullname={app.procFullname(proc)} procOpHandler={this.operateProc} />
          <ProcSpecSection proc={proc} />
        </div>
        { this.renderMenuIcon(app, proc, theme, lifescore) }
        <MDL.CardActions 
          buttons={[
            { title: '全部启动', icon: 'play_arrow', onClick: (evt) => 
              this.operateProc(0, 'start'), color: 'colored' },
            { title: '全部停止', icon: 'stop', onClick: (evt) => 
              this.operateProc(0, 'stop'), color: 'colored' },
            { title: '全部重启', icon: 'replay', onClick: (evt) => 
              this.operateProc(0, 'restart'), color: 'colored' },
            { title: '管理', icon: 'settings', to: `/apps/${app.appname}/proc/${proc.procname}`, color: 'colored' },
          ]}
          border={true} align='right' />
      </MDL.Card>
    );
  },

  renderMenuIcon(app, proc, theme, lifescore) {
    if (lifescore === 100) {
      return ( 
        <MDL.CardMenuIcon style={{ color: 'white' }} icon='settings'
          to={`/apps/${app.appname}/proc/${proc.procname}`} />
      );
    } else {
      return ( 
        <MDL.CardMenuIcon style={theme.colorStyle('error')} icon='warning'
          to={`/apps/${app.appname}/proc/${proc.procname}`} />
      );
    }
  },

  operateProc(instance, operation) {
    const { app, proc, procOpHandler } = this.props;
    let desc = '';
    switch(operation){
      case 'start':
        desc = '启动';
        break;
      case 'stop':
        desc = '停止';
        break;
      case 'restart':
        desc = '重启';
        break;
    }
    let type = 'proc';
    let name = `${app.appname}.${proc.proctype}.${proc.procname}`;
    if (instance !== 0) {
      type = '容器';
      name = proc.pods[instance-1].containername;
    }
    if (confirm(`确定要${desc}${type}－${name}吗？`)) {
      procOpHandler(proc.procname, instance, operation)
    }
  },

  styles: {
    cardTitle: {
      height: 56,
      color: 'white',
    },
  },

});

export default Radium(AppProcDetailCard);
