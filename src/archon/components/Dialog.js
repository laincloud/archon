import React from 'react';
import ReactDOM from 'react-dom';
import Radium from 'radium';
import MDL from './MdlComponents';

const kDialogWidth = 288;

let Dialog = React.createClass({

  render() {
    const cStyles = this.computeStyle();
    const {theme} = this.context;
    return (
      <div style={[this.styles.mask, this.computeMaskStyle()]}>
        <MDL.Card depth={16} style={_.assign({}, this.styles.dialog, cStyles, this.props.style)}>
          { !this.props.title ? null : <MDL.CardTitle title={this.props.title} style={{ padding: '24px 24px 20px' }} /> }
          <div style={this.styles.content}>
            { this.props.children }
          </div>
          <div style={this.styles.buttons}>
            {
              this.props.buttons.map((button, index) => {
                return (
                  <MDL.Button color='colored' key={index} title={button.title}
                    onClick={(evt) => { this.onBtnClick(evt, button) }} />
                ); 
              })
            } 
          </div>
        </MDL.Card>
      </div>
    ); 
  },

  computeMaskStyle() {
    const {innerWidth, innerHeight} = window;
    return {
      width: innerWidth,
      height: innerHeight,
    };
  },

  computeStyle() {
    const {innerWidth, innerHeight} = window;
    const dialogWidth = innerWidth / 2 - 16 * 2;
    return {
      top: innerHeight / 4,
      maxHeight: innerHeight * 2 / 3 - 32,
      left: (innerWidth - dialogWidth) / 2,
      width: dialogWidth,
    }; 
  },

  onBtnClick(evt, buttonDesc) {
    buttonDesc.onClick && buttonDesc.onClick(evt);
    const mountNode = document.getElementById('dialog');
    ReactDOM.unmountComponentAtNode(mountNode);
  },

  styles: {
    mask: {
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 100,
      backgroundColor: 'rgba(0, 0, 0, .24)',
    },
    dialog: {
      position: 'absolute',
      minWidth: kDialogWidth,
      minHeight: 100,
      zIndex: 101,
    },
    content: {
      padding: '0 24px 24px',
      overflowY: 'auto',
    },
    buttons: {
      padding: 8,
      textAlign: 'right', 
      borderTop: '1px solid rgba(0, 0, 0, .12)',
    },
  },

});

export default Radium(Dialog);
