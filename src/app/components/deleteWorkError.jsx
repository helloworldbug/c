/**
 * @author tony
 * @time 2016-7-20
 * @description 作品已删除页面
 **/

'use strict';

// require core module
var React = require('react');
import {Link} from 'react-router'

var AppealWrapper=require("./Appeal/AppealWrapper");

// define about component
var deleteWorkError = React.createClass({

    render() {
        var footer=<Link to="/discovery" className="other-work">去看看其他作品</Link>
        return (
            <AppealWrapper  showAppealHeader={false} title="作品已删除" tips="该作品已被删除" icon="expired" footer={footer}/>
        );
    }
});

// export NofondPage component
module.exports = deleteWorkError;