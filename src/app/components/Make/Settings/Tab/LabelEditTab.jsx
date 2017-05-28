/**
 * @component PhoneEditTab
 * @description 一键拨号元素编辑设置
 * @time 2015-12-16 17:00
 * @author Nick
 **/

var React = require('react');
var MakeActionCreators = require('../../../../actions/MakeActionCreators');
var LinkEdit = require('./LinkEdit');
var InputText = require("./SettingComponents/InputText");

var PositionAndSize = require("./SettingComponents/PositionAndSize");
var DisplayStateEdit = require("./DisplayStateEdit");
var Color = require("./SettingComponents/Color");
var Range = require("./SettingComponents/Range");
var GlobalFunc=require('../../../Common/GlobalFunc')
var LabelEditTab = React.createClass({
    _changeName    : function (event) {
        MakeActionCreators.updateElement({f_name: GlobalFunc.htmlEncode(event.target.value)});
    },
    render: function () {
        var attributes = this.props.attributes;
        var height = document.body.clientHeight - 54 - 48;
        if (this.props.isTimelineFrame === true) {
            return <div className="setting-container label-setting" style={{height:height}}>

                <header onClick={this._headerClick.bind(this, "base-style", "setting-base-style")}><span>基础样式</span><b id="base-style"/></header>
                <div id="setting-base-style">

                    <span className="clearTop"/>
                    <PositionAndSize attributes={attributes}/>
                </div>
            </div>

        }
        return (
            <div className="setting-container label-setting" style={{height:height}}>
                <span className="clearTop"/>
                <div className="setting-input-text">
                    <h1>元素名称</h1>
                    <input type="text" value={GlobalFunc.htmlDecode(attributes.f_name)} onChange={this._changeName} maxLength="20"/>
                </div>
                <header onClick={this._headerClick.bind(this, "base-style", "setting-base-style")}><span>基础样式</span><b id="base-style"/></header>
                <div id="setting-base-style">
                    <span className="clearTop"/>

                    <PositionAndSize attributes={attributes}/>
                    <DisplayStateEdit attributes={attributes}/>
                    <Range title="不透明度" parameter="item_opacity" value={attributes["item_opacity"]}
                           defaultValue={0} max={100} min={0} step={1} isNumber={true}/>

                    <Range title="旋转角度" parameter="rotate_angle" value={attributes["rotate_angle"]}
                           defaultValue={0} max={360} min={0} step={1} isNumber={true}/>
                </div>
                <header onClick={this._headerClick.bind(this, "label-style", "setting-label")}><span>标签</span><b id="label-style"/></header>
                <div id="setting-label">
                    <span className="clearTop"/>
                    <InputText title="标签内容" parameter="item_val" value={GlobalFunc.htmlDecode(attributes['item_val'])}/>

                    <div className="setting-select">
                        <h1>标签方向</h1>
                        <select onChange={this._changeDirection} value={attributes['ext_attr']}>
                            <option value="left">左</option>
                            <option value="right">右</option>
                        </select>
                    </div>
                </div>

            </div>
        );
    },

    _headerClick: function (buttonID, contentID) {
        $("#" + contentID).slideToggle();
        $("#" + buttonID).toggleClass("hide").toggleClass("show");
    },

    _changeDirection: function (event) {
        MakeActionCreators.updateElement({ext_attr: event.target.value});
    }

});

module.exports = LabelEditTab;