/**
 * @component ImageEditTab
 * @description 图片元素编辑设置
 * @time 2015-09-17 10:29
 * @author Nick
 **/

var React = require('react');
var MakeActionCreators = require('../../../../actions/MakeActionCreators');
var DialogAction = require("../../../../actions/DialogActionCreator");
var PositionAndSize = require("./SettingComponents/PositionAndSize");
var GlobalFunc = require('../../../Common/GlobalFunc');
var Range = require("./SettingComponents/Range");
var Color = require("./SettingComponents/Color");

var RedEnvelopeEditTab = React.createClass({

    render: function () {
        var attributes = this.props.attributes, itemType = attributes['item_type'], picReplace;
        var height = document.body.clientHeight - 54 - 48;
        var borderRadiusMax = attributes["item_width"] < attributes["item_height"] ? attributes["item_width"] / 2 : attributes["item_height"] / 2;
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
                <header onClick={this._headerClick.bind(this, "base-style", "setting-base-style")}><span>基础样式</span><b id="base-style"/></header>
                <div id="setting-base-style">
                    <span className="clearTop"/>
                    <PositionAndSize attributes={attributes}/>
                    <Range title="不透明度" parameter="item_opacity" value={attributes["item_opacity"]}
                           defaultValue={0} max={100} min={0} step={1} isNumber={true}/>

                    <Range title="旋转角度" parameter="rotate_angle" value={attributes["rotate_angle"]}
                           defaultValue={0} max={360} min={0} step={1} isNumber={true}/>
                    <div className="replace-image">
                        <button onClick={this._replaceImg}>替换图片</button>
                    </div>
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
    },

    _replaceImg: function () {
        DialogAction.show("material", "", {materialType: 5, itemType: "redEnvelope", replace: true});
    }

});

module.exports = RedEnvelopeEditTab;