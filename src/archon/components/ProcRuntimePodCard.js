import React from 'react';
import {Link} from 'react-router';
import Radium from 'radium';
import MDL from './MdlComponents';
import DescriptionList from './DescriptionList';

let ProcRuntimePodCard = React.createClass({

  contextTypes: {
    theme: React.PropTypes.object,
  },

  render() {
    const {theme} = this.context; 
    const {appName, proc, pod, procName, instance} = this.props;
    const isHealthy = pod.status === 'True';
    const titleColor = isHealthy ? 'proc' : 'error';
    const envs = _.map(pod.envs, (env) => {
      let index = env.indexOf('=');
      if (index >= 0) {
        return { k: env.substring(0, index), v: env.substring(index+1) };
      } else {
        return { k: env, v: '-' };
      }
    });

    return (
      <MDL.Card depth={2} style={theme.card}>
        <MDL.CardTitle title={`运行实例 - ${pod.containername}`} style={_.assign({}, this.styles.cardTitle, theme.colorStyle(titleColor, true))} />

        <div style={{ padding: 16 }}>
          <h6 style={{ padding: '0 16px', margin: 0 }}>容器信息</h6>
          <DescriptionList style={{ margin: '8px 16px', paddingLeft: 16 }} titleWidth={120}
            list={[
              {k: '容器ID', v: pod.containerid }, 
              {k: '容器名称', v: pod.containername }, 
              {k: '节点IP', v: pod.nodeip }, 
              {k: '容器IP', v: pod.containerip }, 
              {k: '容器端口', v: pod.containerport }, 
              {k: '启动时间', v: pod.uptime }, 
            ]} />
          <div style={{ height: 16 }}></div>
          <h6 style={{ padding: '0 16px', margin: 0 }}>环境变量</h6>
          <DescriptionList style={{ margin: '8px 16px', paddingLeft: 16 }} titleWidth={280} list={envs} />
        </div>
        <MDL.CardActions 
          buttons={[
            { title: '历史状态', color: 'colored', to: `/apps/${appName}/proc/${procName}/instance/${instance}/histories` },
            { title: '返回应用', color: 'colored', to: `/apps/${appName}` },
          ]}
          border={true} align='right' />
      </MDL.Card>
    );
  },

  styles: {
    cardTitle: {
      height: 56,
      color: 'white',
    },
  },
});

export default Radium(ProcRuntimePodCard);
