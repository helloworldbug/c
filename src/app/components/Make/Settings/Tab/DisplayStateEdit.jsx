/**
 * @component LinkEdit
 * @description 元素链接设置
 * @time 2015-09-07 15:29
 * @author StarZou
 **/

var React = require('react');
var MakeActionCreators = require('../../../../actions/MakeActionCreators');
var GlobalFunc = require("../../../Common/GlobalFunc.js");

var DisplayStateEdit = React.createClass({
    changeDisplayState: function ( event) {
        var value = event.target.value;
        if (value == "1") {
            MakeActionCreators.updateElement({item_display_status: 1});

        } else {
            MakeActionCreators.updateElement({item_display_status: 0});
        }
    },
    render   : function () {
        var attributes = this.props.attributes;

        return  <div className="setting-select">
            <h1>初始状态</h1>
            <select onChange={this.changeDisplayState} value={attributes['item_display_status'] == 1?1:0}>
                <option value="1">隐藏</option>
                <option value="0">显示</option>
            </select>
        </div>
    }

});

module.exports = DisplayStateEdit;