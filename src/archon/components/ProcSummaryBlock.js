import React from 'react';
import Radium from 'radium';

let ProcSummaryBlock = React.createClass({
  
  contextTypes: {
    theme: React.PropTypes.object,
  },

  render() {
    const {theme} = this.context;
    const {title, proc, type, runtime} = this.props;
    const upCount = proc.upCount();
    let blockStyle = _.assign({}, this.styles.block, theme.colorStyle(type, true));
    if (upCount < proc.numinstances && runtime) {
      blockStyle['boxShadow'] = `-3px -3px 5px ${theme.colors['error']}`;
    }
    return (
      <div style={blockStyle}>
        <b>{title}</b><br/>
        <b>{proc.procname}</b><br/>
        <b>类型</b> {proc.proctype}<br/>
        <b>资源</b> {`${proc.cpu}/${proc.memory}`}<br/>
        <b>实例</b> {`${upCount}/${proc.numinstances}`}
      </div>
    );
  },

  styles: {
    block: {
      'float': 'left',
      minWidth: 80,
      height: 100,
      margin: '0 8px 8px 0',
      padding: '8px 16px 8px 8px',
      fontSize: 12,
      color: 'white',
    },
  },

});

export default Radium(ProcSummaryBlock);
