import React from 'react';
import Radium from 'radium';
import classnames from 'classnames';

import MDL from './MdlComponents';

let NoticeInforCard = React.createClass({

  getDefaultProps() {
    return {
      title: '',
      message: '',
      noticeType: 'success',
    };
  },

  contextTypes: {
    theme: React.PropTypes.object,
  },

  render() {
    const {theme} = this.context;
    const {title, message, noticeType} = this.props;
    const titleStyle = _.assign({}, theme.cardTitle, theme.colorStyle(noticeType, true));
    return (
      <MDL.Card style={theme.card}>
        <MDL.CardTitle style={titleStyle} icon={this.props.titleIcon} title={title} />
        <div style={{ padding: 16 }}>
          <div style={[this.styles.errorText, theme.colorStyle(noticeType)]}>
            {
              _.map(message.split('\n'), (msg, index) => {
                return <p style={{ marginBottom: 0 }} key={index}>{msg}</p>
              })
            }
          </div>
          <p style={{ marginBottom: 0 }}>如果有问题，请联系我们的集群管理员。</p>
        </div>
        { this.renderAction() }
        { this.renderMenuIcon() }
      </MDL.Card>
    );
  },

  renderMenuIcon() {
    const {menuIcon} = this.props;
    if (!menuIcon || !menuIcon.icon) {
      return null;
    }
    return (
      <MDL.CardMenuIcon icon={menuIcon.icon} 
        iconStyle={{ color: 'white' }}
        onClick={(evt) => menuIcon.onClick && menuIcon.onClick(evt)} />
    );
  },

  renderAction() {
    const {buttons} = this.props;
    return !buttons || buttons.length === 0 ? null : 
      <MDL.CardActions align='right' buttons={buttons} border={true} />;
  },

  styles: {
    errorText: {
      fontSize: '16px',
      marginBottom: '8px',
    }, 
  },

});

export default Radium(NoticeInforCard);
