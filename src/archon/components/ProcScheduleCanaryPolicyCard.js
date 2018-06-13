import React from 'react';
import Radium from 'radium';
import MDL from './MdlComponents';

let ProcScheduleCanaryPolicyCard = React.createClass({
  
  getInitialState() {
    return {
      isNewMountpointsValid: true,
      isNewDivTypeValid: true,
      isNewDivDataValid: true,
    };
  },

  contextTypes: {
    theme: React.PropTypes.object,
  },

  render() {
    const {theme} = this.context;
    const {mountpoints, divType, divData} = this.props;
    const titleStyle = _.assign({}, theme.cardTitle, theme.colorStyle('info', true));
    return (
      <MDL.Card style={theme.card}>
        <MDL.CardTitle style={titleStyle} title={`灰度策略调度`} />
        <MDL.CardSupportText style={{ whiteSpace: 'pre-wrap' }}>
          调度灰度策略。<br />
          <br />
          当前灰度策略挂载点列表：{mountpoints ? JSON.stringify(mountpoints, null, 4) : `无`}<br />
          <a href="https://github.com/CNSRE/ABTestingGateway/blob/master/doc/ab%E5%88%86%E6%B5%81%E7%AD%96%E7%95%A5.md" target="_blank">当前灰度策略类型</a>：{divType ? JSON.stringify(divType, null, 4) : `无`}<br />
          <a href="https://github.com/CNSRE/ABTestingGateway/blob/master/doc/ab%E5%88%86%E6%B5%81%E7%AD%96%E7%95%A5.md" target="_blank">当前灰度策略规则</a>：{divData ? JSON.stringify(divData, null, 4) : `无`}
        </MDL.CardSupportText>
        <div style={{ padding: '0 16px' }}>
          <MDL.InputTextField inputType='text' name='mountpoints' ref='mountpoints'
            style={{ width: '100%' }}
            isValid={this.state.isNewMountpointsValid}
            label='灰度策略挂载点列表 [例如 [a.b.c/d, e.f.g/h]]' />
          <MDL.InputTextField inputType='text' name='div-type' ref='divType'
            style={{ width: '100%' }}
            isValid={this.state.isNewDivTypeValid}
            label='灰度策略类型' />
          <MDL.InputTextField inputType='text' name='div-data' ref='divData'
            style={{ width: '100%' }}
            isValid={this.state.isNewDivDataValid}
            label='灰度策略规则' />
        </div>
        <MDL.CardActions
          buttons={[
            { title: '部署', color: 'accent', onClick: () => this.doSchedule('deploy') },
            { title: '删除', color: 'accent', onClick: () => this.doSchedule('undeploy') },
          ]}
          border={false} align='right' />
      </MDL.Card>
    );
  },

  doSchedule(action) {
    const {mountpoints, divType, divData} = this.props;
    let newMountpoints = this.refs.mountpoints.getValue();
    let newDivType = this.refs.divType.getValue();
    let newDivData = this.refs.divData.getValue();
    let isNewMountpointsValid = true;
    let isNewDivTypeValid = true;
    let isNewDivDataValid = true;

    if (!newMountpoints && !newDivType && !newDivData) {
      isNewMountpointsValid = false;
      isNewDivTypeValid = false;
      isNewDivDataValid = false;
      alert('请输入挂载点列表、灰度策略类型或灰度策略规则');
    }

    if (newMountpoints === mountpoints && newDivType === divType && newDivData === divData) {
      isNewMountpointsValid = false;
      isNewDivTypeValid = false;
      isNewDivDataValid = false;
      alert('挂载点列表、灰度策略类型和灰度策略规则均没有更改');
    }

    if (!newMountpoints) {
      newMountpoints = mountpoints;
    } else {
      newMountpoints = JSON.parse(newMountpoints)
      if(!Array.isArray(newMountpoints)) {
        isNewMountpointsValid = false;
        alert('挂载点列表为数组，例如 [a.b.c/d, e.f.g/h]')
      }
    }

    if (!newDivType) {
      newDivType = divType;
    } else {
      // TODO: 进一步校验
    }

    if (!newDivData) {
      isNewDivDataValid = false;
      alert('请输入灰度策略规则')
    } else {
      newDivData = JSON.parse(newDivData);
      // TODO: 进一步校验
    }

    this.setState({isNewMountpointsValid, isNewDivTypeValid, isNewDivDataValid});
    if (isNewMountpointsValid && isNewDivTypeValid && isNewDivDataValid) {
      this.props.doSchedule && this.props.doSchedule(action, newMountpoints, newDivType, newDivData);
    }
  },

});

export default Radium(ProcScheduleCanaryPolicyCard);
