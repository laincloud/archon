import React from 'react';

import * as AppActions from '../models/actions/Apps';
import ApiMixin from '../mixins/ApiMixin';
import AuthorizeMixin from '../mixins/AuthorizeMixin';
import TerminalCard from '../components/TerminalCard'
import ContainerLatestLog from '../components/ContainerLatestLog'

let ContainerTerminalPage = React.createClass({
    mixins: [AuthorizeMixin, ApiMixin],

    componentDidMount(){
        this.authorize(() => {
            this.refreshProc();
        });
    },

    componentWillReceiveProps(nextProps) {
        const request = this.getRequestFromProps(nextProps, 'GET_APP_REQUEST');
        const { procName } = this.props.params;
        if (request.statusCode === 200) {
            const app = request.data;
            let index = _.findIndex(app.procs, (proc) => proc.procname === procName);
            if (index !== -1) {
                this.procType = app.procs[index].proctype;
            }
        }
    },

    render() {
      let lct = this.props.location.pathname;
      let suffix = "enter";
      if (lct.indexOf(suffix, lct.length - suffix.length) !== -1) {
        return <TerminalCard appName={this.props.params.appName} procName={this.props.params.procName} instanceNo={this.props.params.instanceNo}/>;
      } else {
        return <ContainerLatestLog 
          appName={this.props.params.appName} 
          procName={this.props.params.procName} 
          instanceNo={this.props.params.instanceNo}
          procType={this.procType}
          />;
      }
    },

    refreshProc(props = this.props) {
        const { dispatch } = props;
        const { appName } = this.props.params;
        dispatch(AppActions.get(appName));
    },

});

export default ContainerTerminalPage;
