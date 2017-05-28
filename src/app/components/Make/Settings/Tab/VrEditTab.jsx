/**
 * @component VrEditTab
 * @description VR元素编辑设置
 * @time 2016-06-07 19:00
 * @author Yangjian
 **/

var React = require('react');
var MakeActionCreators = require('../../../../actions/MakeActionCreators');

var PositionAndSize = require("./SettingComponents/PositionAndSize");
var Range = require("./SettingComponents/Range");
var Color = require("./SettingComponents/Color");
var InputText = require("./SettingComponents/InputText");
var DisplayStateEdit = require("./DisplayStateEdit");
var GlobalFunc=require('../../../Common/GlobalFunc')

var VrEditTab = React.createClass({

    render: function () {
        var attributes = this.props.attributes;
        var height = document.body.clientHeight - 54 - 48;
        if (this.props.isTimelineFrame === true) {
            return <div className="setting-container" style={{height:height}}>
                <header onClick={this._headerClick.bind(this, "base-style", "setting-base-style")}><span>基础样式</span><b id="base-style"/></header>
                <div id="setting-base-style">
                    <span className="clearTop"/>
                    <PositionAndSize attributes={attributes}/>

                </div>
            </div>
        }
        return (
            <div className="setting-container" style={{height:height}}>
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

                    <Color title="按钮颜色" parameter="bg_color" value={attributes['bg_color']}/>
                </div>
                <header onClick={this._headerClick.bind(this, "family-style", "setting-text-family")}><span>字体</span><b id="family-style"/></header>
                <div id="setting-text-family">

                    <span className="clearTop"/>

                    <InputText title="按钮名称" parameter="item_val" value={GlobalFunc.htmlDecode(attributes['item_val'])}/>

                    <Range title="字号" parameter="font_size" value={attributes["font_size"].slice(0, -2)}
                           defaultValue={12} max={200} min={12} step={1}/>

                    <Color title="文字颜色" parameter="item_color" value={attributes['item_color']}/>

                </div>
            </div>
        );
    },
    _changeName    : function (event) {
        MakeActionCreators.updateElement({f_name: GlobalFunc.htmlEncode(event.target.value)});
    },
    _headerClick: function (buttonID, contentID) {
        $("#" + contentID).slideToggle();
        $("#" + buttonID).toggleClass("hide").toggleClass("show");
    }

});

module.exports = VrEditTab;