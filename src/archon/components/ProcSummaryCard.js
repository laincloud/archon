import React from 'react';
import {Link} from 'react-router';
import Radium from 'radium';

import ProcSpecSection from './ProcSpecSection';
import LifescoreBar from './LifescoreBar';
import MDL from './MdlComponents';

let ProcSummaryCard = React.createClass({

  contextTypes: {
    theme: React.PropTypes.object,
  },

  render() {
    const {theme} = this.context;
    const {appName, proc} = this.props;
    const lifescore = proc.lifescore();
    let titleStyle = {};
    if (lifescore < 100) {
      titleStyle['color'] = theme.colors.error;
    }
    return (
      <MDL.Card style={theme.card}>
        <LifescoreBar score={lifescore} />
        <MDL.CardTitle title={`应用 Proc - ${appName}.${proc.proctype}.${proc.procname}`} style={titleStyle} icon='usb' />
        <div style={{ padding: '0 16px 16px' }}>
          <ProcSpecSection proc={proc} />
        </div>
        <MDL.CardActions buttons={[
            { title: '返回应用', color: 'colored', to: `/apps/${appName}` },
            { title: '刷新', color: 'colored', onClick: (evt) => this.props.onRefreshClick && this.props.onRefreshClick() },
          ]} 
          border={true} align='right' />
      </MDL.Card>
    );
  },

});

export default Radium(ProcSummaryCard);
