/**
 * @description 作品过期提示页
 * 
 * @author lifeng
*/


'use strict';

// require core module
var React = require('react');
var AppealWrapper=require("./AppealWrapper")
import { Link } from 'react-router';

var WorkExpired = React.createClass({

    render() {
        var footer=<Link to="/discovery" className="other-work">去看看其它作品</Link>
        return (
            <AppealWrapper showAppealHeader={false} title="作品链接已失效" tips="作品未发布，临时链接已失效 " icon="expired" footer={footer}/>
        );
    }
});



module.exports = WorkExpired;