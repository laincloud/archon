import React from 'react';
import ReactDOM from 'react-dom';
import Radium from 'radium';
import MDL from './MdlComponents';
import Dialog from './Dialog';
import {History} from 'react-router';

let ProcRuntimeSection = React.createClass({
  mixins: [History],

  contextTypes: {
    theme: React.PropTypes.object,
  },

  render() {
    const {theme} = this.context;
    const {proc, fullname} = this.props;
    return (
      <div style={{ marginBottom: 16 }}>
        <h6 style={{ padding: '0 16px', margin: '8px 0 0' }}>{`运行时状况 [Up/Total = ${proc.upCount()}/${proc.numinstances}]`}</h6>
        <MDL.Table style={theme.dataTable}
          cols={[
            { title: 'ID（点击进入）', number: false },
            { title: '容器名称', number: false },
            { title: '节点IP', number: false },
            { title: '容器IP', number: false },
            { title: '容器端口', number: true },
            { title: '实时日志', number: false },
            { title: '环境变量', number: false },
          ]}
          rows={ _.map(proc.pods, (pod) => [pod.containerid.substring(0, 12), pod.containername, pod.nodeip, pod.containerip, pod.containerport, 'LOG', '点击查看']) }
          trStyle={(section, index) => {
            if (section === 'head') return {};
            return theme.colorStyle(proc.pods[index].status === 'True' ? 'success' : 'error');
          }}
          tdClickable={ (rowIndex, colIndex) => {
            switch (colIndex) {
              case 0:
                return (evt) => this.openTerminal(proc.pods[rowIndex]);
              case 5:
                return (evt) => this.openTerminalAttach(proc.pods[rowIndex]);
              case 6:
                return (evt) => this.showPodEnvDialog(proc.pods[rowIndex]);
            }
            return null;

          }} />
      </div>
    );
  },

  showPodEnvDialog(showPod) {
    const mountNode = document.getElementById('dialog');
    const {fullname, proc} = this.props;
    const dialog = (
      <Dialog title={`运行时环境变量`}
          buttons={[
            { title: '好的' },
          ]}>
        <p>下面列出 <b>{`proc - ${fullname}`}</b> 运行时环境变量。</p>
        <ul style={{ fontSize: 13 }}>
          {
            showPod.envs.map((env, index) => {
              return <li key={`${index}`}>{env}</li>
            })
          }
        </ul>
      </Dialog>
    );
    ReactDOM.render(dialog, mountNode);
  },

  openTerminal(podInfo) {
    const appName = this.extractFromEnv(podInfo.envs, "LAIN_APPNAME");
    const procName = this.extractFromEnv(podInfo.envs, "LAIN_PROCNAME");
    const instanceNo = this.extractFromEnv(podInfo.envs, "DEPLOYD_POD_INSTANCE_NO");
    window.open(`/archon/apps/${appName}/proc/${procName}/instance/${instanceNo}/enter`, '_blank');
  },

  openTerminalAttach(podInfo) {
    const appName = this.extractFromEnv(podInfo.envs, "LAIN_APPNAME");
    const procName = this.extractFromEnv(podInfo.envs, "LAIN_PROCNAME");
    const instanceNo = this.extractFromEnv(podInfo.envs, "DEPLOYD_POD_INSTANCE_NO");
    window.open(`/archon/apps/${appName}/proc/${procName}/instance/${instanceNo}/attach`, '_blank');
  },

  extractFromEnv(env, key) {
    for (let i = 0; i < env.length; i++) {
      let index = env[i].indexOf('=');
      if (index >= 0 && env[i].substring(0, index) == key) {
        return env[i].substring(index+1);
      }
    }
    return "-";
  },

});

export default Radium(ProcRuntimeSection);
