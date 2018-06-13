import React from 'react';
import Radium from 'radium';

let ClusterSummaryCard = React.createClass({
  render() {
    return ( 
      <div className="mdl-card mdl-shadow--2dp" style={this.styles.card}>
        <div className="mdl-card__title">
          <h2 className="mdl-card__title-text">
            <i className="material-icons" style={{ marginRight: 8 }}>desktop_mac</i>集群概况
          </h2>
        </div>
        <table className="mdl-data-table mdl-js-data-table" style={{ width: '100%', border: 'none' }}>
          <thead>
            <tr>
              <th></th>
              <th>服务器</th>
              <th>CPU核数</th>
              <th>内存(GB)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>使用中</td>
              <td>13</td>
              <td>80</td>
              <td>20G</td>
            </tr>
            <tr>
              <td>总计</td>
              <td>15</td>
              <td>480</td>
              <td>960G</td>
            </tr>
          </tbody>
        </table>
        <div className="mdl-card__actions">
          <a className="mdl-button mdl-js-button mdl-js-ripple-effect" href="javascript:;">查看详情</a>
        </div>
      </div>
    );
  }, 

  styles: {
    card: {
      width: '100%',
      marginBottom: 16,
    },
  },
});

export default Radium(ClusterSummaryCard);
