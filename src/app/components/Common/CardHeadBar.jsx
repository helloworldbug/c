/**
 * @component CardHeadBar
 * @description 卡片头部栏
 * @time 2015-09-22 19:56
 * @author StarZou
 **/

'use strict';

var React = require('react');

var CardHeadBar = React.createClass({

    render: function () {
        return (
            <div className="card-head-bar">
                <span className="edit" title="编辑"></span>
                <span className="create">生成模版</span>
                <span className="delete" title="删除"></span>
            </div>
        );
    }

});

module.exports = CardHeadBar;