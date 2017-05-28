/**
 * @description 作品无效提示 
 * 
 * @author lifeng
*/


'use strict';

// require core module
var React = require('react');
var AppealWrapper=require("./AppealWrapper");
import { Link } from 'react-router';

var InvalidWork = React.createClass({

    render() {
        var tips='网页包含诱导分享，诱导关注内容，<br/> 被多人投诉，为维护绿色上网环境，<br/> 已停止访问。'
        var footer=<span className="other-work"><Link to="/appeal" >如何恢复访问</Link> | <Link to="/helper?type=ME审核规范" >查看规则</Link></span>
        return (
            <AppealWrapper showAppealHeader={false} title="作品已违规" tips={tips} icon="expired" footer={footer}/>
        );
    }
});



module.exports = InvalidWork;