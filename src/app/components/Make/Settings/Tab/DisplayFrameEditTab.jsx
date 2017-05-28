/**
 * @component ImageEditTab
 * @description 图片元素编辑设置
 * @time 2015-09-17 10:29
 * @author Nick
 **/

var React = require('react');
var MakeActionCreators = require('../../../../actions/MakeActionCreators');
var LinkEdit = require('./LinkEdit');
var GlobalFunc = require('../../../Common/GlobalFunc');
var userObj;

var PositionAndSize = require("./SettingComponents/PositionAndSize");

var DisplayFrameEditTab = React.createClass({

    componentWillMount: function () {
        userObj = GlobalFunc.getUserObj();
    },
    changeName:function(event){
        var value = event.target.value;
        MakeActionCreators.updateElement({f_name: GlobalFunc.htmlEncode(value)});
    },
    render: function () {
        var attributes = this.props.attributes, height = document.body.clientHeight - 54 - 40;

        return (
            <div className="setting-container" style={{height:height}}>

                <span className="clearTop"/>
                <div className="setting-input-text">
                    <h1>元素名称</h1>
                    <input type="text" value={GlobalFunc.htmlDecode(attributes.f_name)} onChange={this.changeName} maxLength="20"/>
                </div>
                <PositionAndSize attributes={attributes}/>

                <div className="setting-select">
                    <h1>初始状态</h1>
                    <select onChange={this._changeInitStatus.bind(this,"item_display_status")} value={attributes['item_display_status'] == 1 ? 1 : 0}>
                        <option value="1">隐藏</option>
                        <option value="0">显示</option>
                    </select>
                </div>
                <div className="setting-select">
                    <h1>浮层模式</h1>
                    <select onChange={this._changeInitStatus.bind(this,"abstract_setting")} value={attributes['abstract_setting'] == 1 ? 1 : 0}>
                        <option value="0">普通模式</option>
                        <option value="1">摘要模式</option>
                    </select>
                </div>
            </div>
        );
    },

    _changeSizeWidth: function (event) {
        if (event.target.value == 0) return;
        MakeActionCreators.updateElement({item_width: event.target.value / this.props.attributes["x_scale"]});
    },

    _changeSizeHeight: function (event) {
        if (event.target.value == 0) return;
        MakeActionCreators.updateElement({item_height: event.target.value / this.props.attributes["y_scale"]});
    },

    _changeParameter: function (key, event) {
        MakeActionCreators.updateElement({[key]: Math.round(event.target.value)});
    },

    _changeInitStatus: function (name,event) {
        var value = event.target.value;
        if (value == "1") {
            MakeActionCreators.updateElement({[name]: 1});

        } else {
            MakeActionCreators.updateElement({[name]: 0});
        }
    }

});

module.exports = DisplayFrameEditTab;