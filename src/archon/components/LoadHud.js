import React from 'react';
import Radium from 'radium';
import MDL from './MdlComponents';

let LoadHud = React.createClass({

  render() {
    return <MDL.Progress indeterminate={true} style={this.styles.loading} />;
  },

  styles: {
    loading: {
      position: 'fixed',
      top: 64,
      left: 0,
      width: '100%',
    }, 
  },

});

export default Radium(LoadHud);
