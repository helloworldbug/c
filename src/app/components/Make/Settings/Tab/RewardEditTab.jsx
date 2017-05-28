/**
 * @component ButtonEditTab
 * @description 按钮元素编辑设置
 * @time 2015-09-24 16:00
 * @author Nick
 **/

var React = require('react');
var MakeActionCreators = require('../../../../actions/MakeActionCreators');

var PositionAndSize = require("./SettingComponents/PositionAndSize");
var Color = require("./SettingComponents/Color");
var InputText = require("./SettingComponents/InputText");
var Range = require("./SettingComponents/Range");

var GlobalFunc=require('../../../Common/GlobalFunc')

var RewardEditTab = React.createClass({
    _changeName    : function (event) {
        MakeActionCreators.updateElement({f_name: GlobalFunc.htmlEncode(event.target.value)});
    },
    render: function () {
        var attributes = this.props.attributes;
        var borderRadiusMax = attributes["item_width"] < attributes["item_height"] ? attributes["item_width"] / 2 : attributes["item_height"] / 2;
        if (this.props.isTimelineFrame === true) {
            return <div className="setting-container">


                <header onClick={this._headerClick.bind(this, "base-style", "setting-base-style")}><span>基础样式</span><b id="base-style"/></header>
                <div id="setting-base-style">
                    <span className="clearTop"/>
                    <PositionAndSize attributes={attributes}/>
                </div>
            </div>
        }
        return (
            <div className="setting-container">
                <span className="clearTop"/>
                <div className="setting-input-text">
                    <h1>元素名称</h1>
                    <input type="text" value={GlobalFunc.htmlDecode(attributes.f_name)} onChange={this._changeName} maxLength="20"/>
                </div>
                <header onClick={this._headerClick.bind(this, "base-style", "setting-base-style")}><span>基础样式</span><b id="base-style"/></header>
                <div id="setting-base-style">
                    <span className="clearTop"/>

                    <PositionAndSize attributes={attributes}/>
                    <Range title="不透明度" parameter="item_opacity" value={attributes["item_opacity"]}
                           defaultValue={0} max={100} min={0} step={1} isNumber={true}/>

                    <Range title="旋转角度" parameter="rotate_angle" value={attributes["rotate_angle"]}
                           defaultValue={0} max={360} min={0} step={1} isNumber={true}/>

                    <Color title="按钮颜色" parameter="bg_color" value={attributes['bg_color']}/>

                    <InputText title="按钮名称" parameter="item_val" value={GlobalFunc.htmlDecode(attributes["item_val"])}/>

                    <Color title="文字颜色" parameter="item_color" value={attributes['item_color']}/>

                    <InputText title="提交提示" parameter="item_val_sub" value={GlobalFunc.htmlDecode(attributes["item_val_sub"])}/>
                </div>

                <header onClick={this._headerClick.bind(this, "border-style", "setting-border-style")}><span>边框样式</span><b id="border-style"/></header>
                <div id="setting-border-style">

                    <span className="clearTop"/>
                    <Range title="边框尺寸" parameter="item_border" value={attributes["item_border"]}
                           defaultValue={0} max={20} min={0} step={1} isNumber={true}/>

                    <Range title="边框弧度" parameter="bd_radius" value={attributes["bd_radius"]}
                           defaultValue={0} max={borderRadiusMax} min={0} step={1}/>

                    <div className="setting-select">
                        <h1>边框样式</h1>
                        <select value={attributes["bd_style"]||"solid"}
                                onChange={this._changeBorderStyle}>
                            <option value="solid">直线</option>
                            <option value="dashed">破折线</option>
                            <option value="dotted">点状线</option>
                            <option value="double">双划线</option>
                        </select>
                    </div>

                    <Color title="边框颜色" parameter="bd_color" value={attributes['bd_color']}/>

                </div>
            </div>
        );
    },

    _headerClick: function (buttonID, contentID) {
        $("#" + contentID).slideToggle();
        $("#" + buttonID).toggleClass("hide").toggleClass("show");
    },

    _changeBorderStyle: function (event) {
        MakeActionCreators.updateElement({bd_style: event.target.value});
    }


});

module.exports = RewardEditTab;