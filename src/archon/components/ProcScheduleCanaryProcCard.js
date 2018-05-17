import React from 'react';
import Radium from 'radium';
import MDL from './MdlComponents';

let ProcScheduleCanaryProcCard = React.createClass({
  
  getInitialState() {
    return {
      isNewImageVersionValid: true,
      isNewSecretFilesValid: true
    };
  },

  contextTypes: {
    theme: React.PropTypes.object,
  },

  render() {
    const {theme} = this.context;
    const {imageVersion, secretFiles, procVersions, currentProcVersion} = this.props;
    const titleStyle = _.assign({}, theme.cardTitle, theme.colorStyle('info', true));
    return (
      <MDL.Card style={theme.card}>
        <MDL.CardTitle style={titleStyle} title={`灰度 Proc 调度`} />
        <MDL.CardSupportText style={{ whiteSpace: 'pre-wrap' }}>
          调度灰度 Proc（部署后生成以 `_canary` 结尾的新 proc）。<br />
          <br />
          当前灰度 Proc 版本：{imageVersion ? JSON.stringify(imageVersion, null, 4) : `无`}<br />
          当前灰度 Proc 秘密文件列表：{secretFiles ? JSON.stringify(secretFiles, null, 4) : `无`}<br />
          灰度 proc 版本列表: {JSON.stringify(procVersions.filter(v => v !== currentProcVersion).slice(0, 4), null, 1)}
        </MDL.CardSupportText>
        <div style={{ padding: '0 16px' }}>
          <MDL.InputTextField inputType='text' name='image-version' ref='imageVersion'
            style={{ width: '100%' }}
            isValid={this.state.isNewImageVersionValid}
            label='Proc 版本' />
          <MDL.InputTextField inputType='text' name='secret-files' ref='secretFiles'
            style={{ width: '100%' }}
            isValid={this.state.isNewSecretFilesValid}
            label='秘密文件列表 [例如 [/a/b.json, /c/d.xml]]' />
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
    const {imageVersion, secretFiles} = this.props;
    let newImageVersion = this.refs.imageVersion.getValue();
    let newSecretFiles = this.refs.secretFiles.getValue();
    let isNewImageVersionValid = true;
    let isNewSecretFilesValid = true;

    if (action === 'deploy' && !newImageVersion && !newSecretFiles) {
      isNewImageVersionValid = false;
      isNewSecretFilesValid = false;
      alert('请输入 Proc 版本或秘密文件列表');
    }

    if (action === 'deploy' && newImageVersion === imageVersion && newSecretFiles === secretFiles) {
      isNewImageVersionValid = false;
      isNewSecretFilesValid = false;
      alert('Proc 版本和秘密文件列表均没有更改');
    }

    if (!newImageVersion) {
      newImageVersion = imageVersion;
    } else {
      // TODO: 进一步校验
    }

    if (!newSecretFiles) {
      newSecretFiles = secretFiles ? secretFiles : [];
    } else {
      newSecretFiles = JSON.parse(newSecretFiles);
      if (!Array.isArray(newSecretFiles)) {
        isNewSecretFilesValid = false;
        alert('秘密文件列表为数组，例如 [/a/b.json, /c/d.xml]')
      }
    }

    this.setState({isNewImageVersionValid, isNewSecretFilesValid});
    if (isNewImageVersionValid && isNewSecretFilesValid) {
      this.props.doSchedule && this.props.doSchedule(action, newImageVersion, newSecretFiles);
    }
  },

});

export default Radium(ProcScheduleCanaryProcCard);
