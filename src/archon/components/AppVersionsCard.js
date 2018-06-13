import React from 'react';

import Dialog from './Dialog';
import MDL from './MdlComponents.js'
import { getCommitTimeFromTag  } from '../models/Utils';

let AppVersionsCard = React.createClass({

  contextTypes:{
    theme: React.PropTypes.object,
  },

  render(){
    const {theme}=this.context;
    const versions = this.props.versions;
    const appname = this.props.appname;
    const titleStyle = _.assign({}, theme.cardTitle, theme.colorStyle('info', true));
    //const versions=["hello","world"];
    return (
      <MDL.Card style={theme.card}>
        <MDL.CardTitle style={titleStyle} title={`应用 - ${appname} 的历史版本`} />
        <div style={{ marginBottom: 16  }}>
          <MDL.Table style={theme.dataTable}
            cols={[
              { title: "版本号 ( 时间戳- git 提交 HASH )", number: false },
              { title: "代码提交时间", number: false },
              { title: "", number: false },
            ]}
            rows={ _.map(versions,(version) => [version, getCommitTimeFromTag(version).format('YYYY-MM-DD HH:mm'), '部署此版本'])}
            tdClickable={ (rowIndex, colIndex) => {
              if (colIndex !== 2) return null;
              return (evt) => this.props.callback(versions[rowIndex]);
            }} 
          />
        </div>
      </MDL.Card>
    );
  },


})

export default AppVersionsCard;
