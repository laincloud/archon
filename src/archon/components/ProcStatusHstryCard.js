import React from 'react';

import Dialog from './Dialog';
import MDL from './MdlComponents.js'
import Moment from 'moment';

let ProcStatusHstryCard = React.createClass({

  contextTypes:{
    theme: React.PropTypes.object,
  },

  render(){
    const { theme } = this.context;
    const { proc, procname, instance} = this.props;
    const titleStyle = _.assign({}, theme.cardTitle, theme.colorStyle('info', true));
    const procStatus = proc || {};
    return (
      <MDL.Card style={theme.card}>
        <MDL.CardTitle style={titleStyle} title={`容器 - ${procStatus.Name || procname}-${instance} 的操作历史`} />
        <div style={{ marginBottom: 16  }}>
          <MDL.Table style={theme.dataTable}
            cols={[
              { title: "状态时间", number: false },
              { title: "容器状态", number: false },
              { title: "镜像信息", number: false },
              { title: "节点信息", number: false },
            ]}
            rows={ _.map(procStatus.StatusHistory,(l) => [Moment(Moment.unix(l.time)).format('YYYY-MM-DD HH:mm:ss'), l.status, l.image, l.node])}
          />
        </div>
      </MDL.Card>
    );
  },


})

export default ProcStatusHstryCard;
