import React from 'react';
import Radium from 'radium';
import MDL from './MdlComponents';
import DescriptionList from './DescriptionList';

let AppPortsStatCard = React.createClass({

  contextTypes: {
    theme: React.PropTypes.object,
  },

  render() {
    const {theme} = this.context;
    const {ports} = this.props;
    const trStyle = (section, index) => {
      if (section === 'head') return {};
      return theme.colorStyle('success');
    };
    return (
      <MDL.Card style={theme.card}>
        <MDL.CardTitle title='端口使用概况' style={ _.assign({}, theme.cardTitle, theme.colorStyle('info', true)) } />
        <MDL.CardSupportText>
          需要对外提供传输层服务的应用，以及对内的相对安全性要求不高的服务可以用 streamrouter 提供统一的代理，可用端口为 [9500,10000] 共 5001 个端口，下表给出了已经被占用的端口。
        </MDL.CardSupportText>
        <div style={{ paddingBottom: 24 }}>
          <MDL.Table style={theme.dataTable}
            cols={[
              { title: '端口号' },
              { title: '应用' },
              { title: 'Proc', number: false },
            ]}
            trStyle={trStyle}
            rows={ _.map(ports, (port) => [port.srcport, port.NameSpace, port.ProcName]) } />
        </div>
      </MDL.Card>
    );
  },

});

export default Radium(AppPortsStatCard);
