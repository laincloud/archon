import React from 'react';
import Radium from 'radium';
import MDL from './MdlComponents';
import DescriptionList from './DescriptionList';

let ProcSpecSection = React.createClass({

  contextTypes: {
    theme: React.PropTypes.object,
  },

  render() {
    const {theme} = this.context;
    const {proc} = this.props;
    return (
      <div>
        <h6 style={{ padding: '0 16px', margin: '8px 0 0' }}>配置需求Spec</h6>
        <DescriptionList style={{ margin: 16, paddingLeft: 16 }} titleWidth={120}
          list={[
            {k: 'Image', v: proc.image },
            {k: 'Entrypoint', v: Array.isArray(proc.entrypoint) ? proc.entrypoint.join(' ') : '' },
            {k: '启动命令', v: Array.isArray(proc.cmd) ? proc.cmd.join(' ') : '' },
            {k: '实例数量', v: proc.numinstances }, 
            {k: '预留CPU／内存', v: `${proc.cpu} / ${proc.memory}` }, 
            {k: 'DNS搜索域', v: proc.dnssearchs.join(', ') }, 
            {k: '域名挂载点', v: proc.mountpoints.join(', ') }, 
            {k: '端口', v: proc.ports.map(p => `${p.porttype}/${p.portnumber}`).join(', ') }, 
            {k: '持久化目录', v: proc.persistentdirs.join(', ') }, 
            {k: '工作目录', v: proc.workingdir }, 
            {k: '用户', v: proc.user }, 
            {k: '环境变量', v: proc.envs.join(', ') }, 
          ]}
        />
      </div>
    );
  },

});

export default Radium(ProcSpecSection);
