import React from 'react';
import Radium from 'radium';

let DescriptionList = React.createClass({

  getDefaultProps() {
    return {
      titleWidth: 170,
      list: [],
    };
  },

  render() {
    const {list} = this.props;
    const dtStyle = {
      width: this.props.titleWidth,
    };
    const ddStyle = {
      marginLeft: this.props.titleWidth + 16,
    };
    return (
      <dl style={[this.styles.dl, this.props.style]}>
        {
          _(list).map((item) => [item, item]).flatten().map((item, index) => {
            if (index % 2 === 0) {
              return <dt key={`${index}`} style={[this.styles.dt, dtStyle]}>{item.k}</dt>;
            } else {
              return <dd key={`${index}`} style={[this.styles.dd, ddStyle]}>{item.v ? item.v : '-' }</dd>;
            }
          }).value()
        } 
      </dl>
    );
  },

  styles: {
    dl: {
      fontSize: 13,
    },
    dt: {
      float: 'left',
      overflow: 'hidden',
      clear: 'left',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontWeight: 700,
      textAlign: 'right',
    }, 
    dd: {
      
    },
  },
});

export default Radium(DescriptionList);
