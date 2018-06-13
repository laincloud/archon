import React from 'react';
import {Link} from 'react-router';
import Radium from 'radium';

import MDL from './MdlComponents';
import ProcSummaryBlock from './ProcSummaryBlock';
import LifescoreBar from './LifescoreBar';
import AppView from '../models/views/App';
import ProcView from '../models/views/Proc';

let AppSummaryCard = React.createClass({

  getDefaultProps() {
    return {
      inDetail: false,
    };
  },

  contextTypes: {
    theme: React.PropTypes.object,
  },

  render() {
    const {theme} = this.context;
    const app = AppView(this.props.app);
    let lifescore = app.lifescore();
    const portals = _(app.useservices).map(s => s.service.portals || []).flatten().value();
    const deployerror = app.deployerror
    return (
      <MDL.Card style={theme.card}>
        <LifescoreBar score={lifescore} />
        { this.renderTitle(app, lifescore, theme) }
        <MDL.CardSupportText>
          { this.props.inDetail ? <p style={{ margin: 0 }}><b>MetaVersion</b>: {app.metaversion}</p> : null }
          当前版本代码最后提交时间为 <b>{app.commitTime().format('YYYY-MM-DD HH:mm')}</b>, 定义包括Procs <b>{app.procs.length}</b> 个，
          使用服务 <b>{app.useservices.length}</b> 个，资源 <b>{app.useresources.length}</b> 个。
          { this.props.inDetail && deployerror ? <p style={{ margin: 0, color: "red" }}><b>Error</b>: {deployerror}</p> : null }
        </MDL.CardSupportText>

        {
          this.props.inDetail ? null :
            <div className="clearfix" style={{ padding: '0 16px 8px' }}>
              { 
                app.procs.map((proc, index) => {
                  const type = app.apptype === 'resource' ? 'resource' : 'proc';
                  const runtime = type === 'proc';
                  return (
                    <ProcSummaryBlock title="Proc" proc={ProcView(proc)} key={index} type={type} runtime={runtime} />
                  );
                })
              }
              { app.portals.map((proc, index) => <ProcSummaryBlock title="Portal" proc={ProcView(proc)} key={index} type="service" />) }
              { portals.map((portal, index) => <ProcSummaryBlock title="Service Portal" proc={ProcView(portal)} key={index} type="service" runtime />) }
            </div>
        }

        { this.renderAction(app) }
        { this.renderMenuIcon(app, lifescore) }
      </MDL.Card>
    );
  },

  renderTitle(app, lifescore, theme) {
    let titleStyle = {};
    if (lifescore < 100) {
      titleStyle['color'] = theme.colors.error;
    } else {
      titleStyle['color'] = theme.colors.proc;
      if (app.apptype === 'service' || app.apptype === 'resource-instance') {
        titleStyle['color'] = theme.colors.service;
      }
      if (app.apptype === 'resource') {
        titleStyle['color'] = theme.colors.resource;
      }
    }
    let titleIcon = 'memory';
    if (app.apptype === 'service' || app.apptype === 'resource-instance') {
      titleIcon = 'cast';
    }
    if (app.apptype === 'resource') {
      titleIcon = 'extension';
    }
    return <MDL.CardTitle style={titleStyle} icon={titleIcon} title={app.appname} />;
  },

  renderAction(app) {
    const {theme} = this.context;
    if (this.props.inDetail) {
      const buttons=[
        { title: '刷新', color: 'colored', onClick: (evt) => this.props.onRefreshClick && this.props.onRefreshClick() },
      ];
      return <MDL.CardActions buttons={buttons} border={true} align='right' />
    } 
    const buttons = [{ title: '查看详情', to: `/apps/${app.appname}`, color: 'colored' }];
    return <MDL.CardActions border buttons={buttons} />
  },

  renderMenuIcon(app, lifescore) {
    if (this.props.inDetail) {
      if (lifescore === 100) {
        return null;
      }
      return <MDL.CardMenuIcon style={this.context.theme.colorStyle('error')} icon='warning' />;
    }
    return <MDL.CardMenuIcon to={`/apps/${app.appname}`} icon='open_in_new' />;
  },

});

export default Radium(AppSummaryCard);
