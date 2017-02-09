import React from 'react';
import AuthorizeMixin from '../mixins/AuthorizeMixin';
import TerminalCard from '../components/TerminalCard'
import TerminalCardAttach from '../components/TerminalCardAttach'

let ContainerTerminalPage = React.createClass({
    mixins: [AuthorizeMixin],

    render() {
      let lct = this.props.location.pathname;
      let suffix = "enter";
      if (lct.indexOf(suffix, lct.length - suffix.length) !== -1) {
        return <TerminalCard appName={this.props.params.appName} procName={this.props.params.procName} instanceNo={this.props.params.instanceNo}/>;
      } else {
        return <TerminalCardAttach appName={this.props.params.appName} procName={this.props.params.procName} instanceNo={this.props.params.instanceNo}/>;
      }
    },

});

export default ContainerTerminalPage;
