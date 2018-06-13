import React from 'react';

import Dialog from './Dialog';
import MDL from './MdlComponents.js'
import Moment from 'moment';

let AppLogsCard = React.createClass({

  contextTypes:{
    theme: React.PropTypes.object,
  },

  render(){
    const {theme}=this.context;
    const logs = JSON.parse(this.props.logs);
    const appname = this.props.appname;
    const titleStyle = _.assign({}, theme.cardTitle, theme.colorStyle('info', true));
    //const versions=["hello","world"];
    return (
      <MDL.Card style={theme.card}>
        <MDL.CardTitle style={titleStyle} title={`应用 - ${appname} 的操作历史`} />
        <div style={{ marginBottom: 16  }}>
          <MDL.Table style={theme.dataTable}
            cols={[
              { title: "操作时间", number: false },
              { title: "操作名称", number: false },
              { title: "操作人员", number: false },
              { title: "版本号", number: false },
              { title: "备注", number: false },
            ]}
            rows={ _.map(logs,(l) => [Moment(new Date(l.fields.time)).format('YYYY-MM-DD HH:mm:ss'), l.fields.op, l.fields.user, l.fields.app_version, l.fields.message])}
          />
        </div>
      </MDL.Card>
    );
  },


})

export default AppLogsCard;
