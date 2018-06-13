import React from 'react';
import Radium from 'radium';
import MDL from './MdlComponents';

let ProcScheduleInstanceCard = React.createClass({
  
  getInitialState() {
    return {
      isValid: true,
    };
  },

  contextTypes: {
    theme: React.PropTypes.object,
  },

  render() {
    const {theme} = this.context;
    const {numInstance} = this.props;
    const titleStyle = _.assign({}, theme.cardTitle, theme.colorStyle('info', true));
    return (
      <MDL.Card style={theme.card}>
        <MDL.CardTitle style={titleStyle} title={`运行实例数量调度`} />
        <MDL.CardSupportText>
          对Proc进行实时的动态运行实例数量调整调度，输入需要的实例数量，点击确认调度即可。<br/>
          当前运行实例数量：<b>{numInstance}</b>
        </MDL.CardSupportText>
        <div style={{ padding: '0 16px' }}>
          <MDL.InputTextField inputType='number' name='num-instance' ref='numInstance'
            style={{ width: '100%' }}
            isValid={this.state.isValid}
            onEnterPressed={this.doSchedule}
            label='运行实例数量 [1-30]' />
        </div>
        <MDL.CardActions
          buttons={[
            { title: '确认调度', color: 'accent', onClick: this.doSchedule },
          ]}
          border={false} align='right' />
      </MDL.Card>
    );
  },

  doSchedule() {
    const value = this.refs.numInstance.getValue();
    let numInstance = this.props.numInstance;
    let isValid = true;
    if (!value) {
      isValid = false;
    } else {
      numInstance = Number(value);
      if (isNaN(numInstance) || numInstance <= 0 || numInstance > 30) {
        isValid = false;
      }
    }
    this.setState({isValid});
    if (isValid && numInstance) {
      this.props.doSchedule && this.props.doSchedule(numInstance); 
    }
  },

});

export default Radium(ProcScheduleInstanceCard);
