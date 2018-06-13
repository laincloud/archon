import React from 'react';
import Radium from 'radium';
import MDL from './MdlComponents';
import DescriptionList from './DescriptionList';

let AppStatCard = React.createClass({

  contextTypes: {
    theme: React.PropTypes.object,
  },

  render() {
    const {theme} = this.context;
    const {apps} = this.props;
    const stats = this.getStats(apps);
    return (
      <MDL.Card style={theme.card}>
        <MDL.CardTitle title='应用部署概况' style={ _.assign({}, theme.cardTitle, theme.colorStyle('info', true)) } />
        <MDL.CardSupportText>
          下面列举了目前您管理的集群应用部署概况。
        </MDL.CardSupportText>
        <div style={{ padding: '0 16px 16px' }}>
          <DescriptionList titleWidth={150} list={[
            { k: '应用数量', v: String(stats.appCount) },
            { k: 'Proc数量', v: String(stats.procCount) },
            { k: 'Proc预约运行实例', v: String(stats.procInstanceCount) },
            { k: 'Proc实例数量', v: String(stats.procUpPodCount) },
            { k: '使用服务数量', v: String(stats.serviceCount) },
            { k: '服务器分布节点', v: String(stats.machineCount) },
            { k: '预留CPU', v: String(stats.cpu) },
            { k: '预留内存', v: 0 },
          ]}/>
        </div>
      </MDL.Card>
    );
  },

  getStats(apps) {
    let serviceCount = 0;
    let appCount = 0;
    let procCount = 0;
    let procInstanceCount = 0;
    let procUpPodCount = 0;
    let machines = {};
    let cpu = 0;
    _.forEach(apps, (app, index) => {
      switch(app.apptype) {
        case 'app':
          appCount += 1; break;
        case 'service':
          serviceCount += 1; break;
      }
      if (app.procs) {
        procCount += app.procs.length;
        _.forEach(app.procs, (proc, index) => {
          procUpPodCount += app.procUpCount(proc);
          procInstanceCount += proc.numinstances;
          if (proc.pods) {
            _.forEach(proc.pods, (pod, index) => {
              machines[pod.nodeip] = true;
              if (pod.status === 'True') {
                cpu += proc.cpu;
              }
            });
          }
        });
      } 
    });
    return {
      appCount,
      procCount, procInstanceCount, procUpPodCount,
      machineCount: _.keys(machines).length,
      cpu,
      serviceCount,
    };
  },

});

export default Radium(AppStatCard);
