import React from "react";
import MDL from './MdlComponents';
import Terminal from "xterm";
import * as fit from "xterm/lib/addons/fit/fit";
import $ from "jquery";
import Base64Tool from "js-base64";

import Cookie from '../models/Cookie';
import {ACCESS_TOKEN_COOKIE} from '../models/apis/Types';
import Fetch from '../models/apis/Fetch';


// The following constants must be equals with
// https://github.com/laincloud/entry/blob/master/message.proto
const REQUEST_PLAIN = 0;
const REQUEST_WINCH = 1;
const RESPONSE_CLOSE = 2;
const RESPONSE_PING = 3;

const apiLxcLatestLogs = (appName, procName, instance) => `${window.assets.logServer}/api/v1/latestlogs?appname=${appName}&procname=${procName}&instance=${instance}`;

var printWarn = function(data) {
    return `\x1B[33m${data}\x1B[0m`;
};
var printErr = function(data) {
    return `\x1B[31m${data}\x1B[0m`;
};

let TerminalCard = React.createClass({
    
    contextTypes: {
        theme: React.PropTypes.object,
    },

    componentDidMount(){
        Terminal.applyAddon(fit);
        const term =  new Terminal({
            cursorBlink: false,
        });
        term.open($('#container_terminal')[0]);
        term.fit();
        var termSize = term.proposeGeometry();
        this.term = term;
    },

    componentWillReceiveProps(nextProps) {
        this.refreshTerminal(nextProps);
    },

    render() {
        const {theme} = this.context;
        const customStyle = {height: "100%"};
        return (
            <MDL.Card depth={2} style={_.assign({}, theme.card, customStyle)}>
                <MDL.CardTitle title="容器终端（STDOUT/STDERR）" style={_.assign({}, this.styles.cardTitle, theme.colorStyle('proc', true))} />
                <div style={{ padding: 16, height: "100%" }} id="container_terminal">
                </div>
            </MDL.Card>
        );
    },

    styles: {
        cardTitle: {
            height: 56,
            color: 'white',
        },
    },

    refreshTerminal(props = this.props) {
        const { appName, procName, instanceNo, procType } = props;
        const { term } = this;
        if( !procType || !term) return;
        term.writeln(printWarn(">>> This terminal is based on xterm.js (https://github.com/sourcelair/xterm.js)"));
        term.writeln(printWarn(`>>> Trying to fetch container [${appName}.${procType}.${procName}-${instanceNo}] latest log of ${this.props.appName}...`));
        Fetch.text(apiLxcLatestLogs(appName, `${appName}.${procType}.${procName}`, instanceNo), 'GET', null)
            .then(({statusCode, data}) => {
            if (statusCode === 200) {
                data.trim().split('\n').forEach(line => {
                    term.writeln(line);
                });
            } else {
                term.writeln(printErr(`>>> Server fetch latest log failed with error: ${data}`));
            }
        }).catch(err => {
            console.log('err:',err)
            term.writeln(printErr(`>>> Server fetch latest log failed with error: ${err}`));
        });
        term.fit();
    },
});

export default TerminalCard;
