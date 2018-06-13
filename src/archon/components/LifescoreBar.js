import React from 'react';
import Radium from 'radium';

let LifescoreBar = React.createClass({

  getDefaultProps() {
    return {
      score: 100,
    };
  },

  contextTypes: {
    theme: React.PropTypes.object,
  },

  render() {
    const {theme} = this.context;
    let {score} = this.props;
    if (score < 0) {
      score = 0;
    } else if (score > 100) {
      score = 100;
    }
    const redbarStyle = {
      width: `${100-score}%`,
    };
    return (
      <div style={[this.styles.bar, this.styles.greenBar, theme.colorStyle('success', true)]}>
        <div style={[this.styles.bar, this.styles.redBar, redbarStyle, theme.colorStyle('error', true)]}></div>
      </div>
    );
  },
  
  styles: {
    bar: {
      position: 'absolute',
      top: 0,
      height: 4,
      width: '100%',
    },
    greenBar: {
      left: 0,
    }, 
    redBar: {
      right: 0,
    },
  },
});

export default Radium(LifescoreBar);
