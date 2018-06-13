import React from 'react';
import Radium from 'radium';

import Mdl from './MdlComponents';
import ProcRuntimeSection from './ProcRuntimeSection';
import ProcSpecSection from './ProcSpecSection';

const {Card, CardTitle, CardMenuIcon, CardActions} = Mdl;

let AppServicePortalCard = React.createClass({
  
  contextTypes: {
    theme: React.PropTypes.object,
  },

  render() {
    const {theme} = this.context;
    const {app, portal, service} = this.props;
    const lifescore = portal.lifescore();
    const titleStyle = _.assign({}, this.styles.cardTitle, theme.colorStyle('service', true));
    return (
      <Card style={theme.card}>
        <CardTitle style={titleStyle} title={`Service[${service.appname}] Portal - ${portal.procname}`} />
        <div style={{ padding: '16px 0' }}>
          <ProcRuntimeSection proc={portal} fullname={app.procFullname(portal)} procOpHandler={this.operateProc} />
          <ProcSpecSection proc={portal} />
        </div>
        { this.renderMenuIcon(app, portal, theme, lifescore) }
        <CardActions 
          buttons={[
            { title: '服务详情', to: `/apps/${service.appname}`, color: 'colored' },
            { title: 'Portal详情', to: `/apps/${app.appname}/portal/${portal.procname}`, color: 'colored' },
          ]}
          border align='right' />
      </Card>
    );
  },

  renderMenuIcon(app, proc, theme, lifescore) {
    if (lifescore === 100) {
      return ( 
        <CardMenuIcon style={{ color: 'white' }} icon='open_in_new'
          to={`/apps/${app.appname}/portal/${proc.procname}`} />
      );
    } else {
      return (
        <CardMenuIcon style={theme.colorStyle('error')} icon='warning'
          to={`/apps/${app.appname}/portal/${proc.procname}`} />
      );
    }
  },

  operateProc(instance, operation) {
    const {app, portal, procOpHandler} = this.props;
    const proc = portal;
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
    let name = `${app.appname}.${proc.proctype}.${proc.procname}`
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

export default Radium(AppServicePortalCard);
