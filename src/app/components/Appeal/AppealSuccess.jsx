/**
 * @description 申请成功
 * 
 * @author lifeng
*/

'use strict';

// require core module
var React = require('react');
var AppealWrapper=require("./AppealWrapper");
import { Link } from 'react-router';

var AppealSuccess = React.createClass({

    render() {
         var footer=<Link to="/discovery" className="other-work">去看看其它作品</Link>
        return (
            <AppealWrapper showAppealHeader={true} title="申诉提交成功" tips="你的申诉已提交成功" icon="success" footer={footer}/>
        );
    }
});



module.exports = AppealSuccess;