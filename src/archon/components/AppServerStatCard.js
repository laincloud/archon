import React from 'react';
import Radium from 'radium';
import MDL from './MdlComponents';

let sortNode = function(a, b) {
  return a[0].localeCompare(b[0]);
};

let AppServerStatCard = React.createClass({

  contextTypes: {
    theme: React.PropTypes.object,
  },

  render() {
    const {theme} = this.context;
    const {apps} = this.props;
    const stats = this.getStats(apps);
    const rows = _(stats).keys().map((key) => {
      const item = stats[key];
      return [key, _.keys(item.apps).length, `${item.upPodCount}/${item.podCount}`, `${item.cpu}/-`];
    }).value();
    const trStyle = (section, index) => {
      if (section === 'head') return {};
      const item = rows[index];
      return theme.colorStyle(item.upPodCount === item.podCount ? 'success' : 'error');
    };
    return (
      <MDL.Card style={theme.card}>
        <MDL.CardTitle title='服务器节点概况' style={ _.assign({}, theme.cardTitle, theme.colorStyle('info', true)) } />
        <MDL.CardSupportText>
          下面列举了目前您管理的集群应用所在服务器节点概况。
        </MDL.CardSupportText>
        <div style={{ paddingBottom: 24 }}>
          <MDL.Table style={theme.dataTable}
            cols={[
              { title: '节点IP', number: false },
              { title: '应用数量' },
              { title: '实例数量', number: false },
              { title: 'CPU/内存', number: false },
            ]}
            trStyle={trStyle}
            rows={ rows.sort(sortNode) } />
        </div>
      </MDL.Card>
    );
  },

  getStats(apps) {
    let machines = {};
    _.forEach(apps, (app, index) => {
      if (app.procs) {
        _.forEach(app.procs, (proc, index) => {
          if (proc.pods) {
            _.forEach(proc.pods, (pod, index) => {
              if (!machines.hasOwnProperty(pod.nodeip)) {
                machines[pod.nodeip] = {
                  apps: {},
                  podCount: 0,
                  cpu: 0,
                  upPodCount: 0,
                };
              }
              machines[pod.nodeip].apps[app.appname] = true;
              machines[pod.nodeip].podCount += 1;
              machines[pod.nodeip].cpu += proc.cpu;
              machines[pod.nodeip].upPodCount += pod.status === 'True' ? 1 : 0;
            });
          }
        });
      } 
    });
    return machines;
  },

});

export default Radium(AppServerStatCard);
