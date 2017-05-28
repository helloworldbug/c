/**
 * @component TextStyleTab
 * @description 文本元素样式设置
 * @time 2015-09-07 15:30
 * @author StarZou
 **/

var React = require('react');
var MakeActionCreators = require('../../../../actions/MakeActionCreators');
var fix_attr = {};

var Range = require("./SettingComponents/Range");
var Color = require("./SettingComponents/Color");

var TextStyleTab = React.createClass({

    componentWillReceiveProps: function (nextProps) {

        var attributes = nextProps.attributes;

        var borderRadiusMax;
        if (attributes['fix_attr']) {
            fix_attr = JSON.parse(attributes['fix_attr']);
            borderRadiusMax = fix_attr.itemWidth < fix_attr.itemHeight ? fix_attr.itemWidth / 2 + (attributes["item_border"] || 0) * 2 : fix_attr.itemHeight / 2 + (attributes["item_border"] || 0) * 2;
        } else {
            borderRadiusMax = attributes["item_width"] < attributes["item_height"] ? attributes["item_width"] / 2 : attributes["item_height"] / 2;
        }

        if (attributes['bd_radius'] > borderRadiusMax) {
            MakeActionCreators.updateElement({bd_radius: parseInt(borderRadiusMax) + ""});
        }

    },

    render: function () {
        var attributes = this.props.attributes;
        var height = document.body.clientHeight - 54 - 40;

        var borderRadiusMax;

        if (attributes['fix_attr']) {
            fix_attr = JSON.parse(attributes['fix_attr']);
            borderRadiusMax = fix_attr.itemWidth < fix_attr.itemHeight ? fix_attr.itemWidth / 2 + (attributes["item_border"] || 0) * 2 : fix_attr.itemHeight / 2 + (attributes["item_border"] || 0) * 2;
        } else {
            borderRadiusMax = attributes["item_width"] < attributes["item_height"] ? attributes["item_width"] / 2 : attributes["item_height"] / 2;
        }
        if (this.props.isTimelineFrame === true) {
            return <div className="setting-container" style={{height:height}}>
                <header onClick={this._headerClickBase}><span>字体</span><b id="baseStyle"/></header>

                <span className="clearTop"/>
                <Range title="不透明度" parameter="item_opacity" value={attributes["item_opacity"]}
                       defaultValue={0} max={100} min={0} step={1} isNumber={true}/>

                <Range title="旋转角度" parameter="rotate_angle" value={attributes["rotate_angle"]}
                       defaultValue={0} max={360} min={0} step={1} isNumber={true}/>
            </div>

        }
        return (
            <div className="setting-container" style={{height:height}}>

                <header onClick={this._headerClickBase}><span>字体</span><b id="baseStyle"/></header>
                <div id="setting-text-base">

                    <span className="clearTop"/>
                    <Color title="背景颜色" parameter="bg_color" value={attributes['bg_color']}/>

                    <Range title="不透明度" parameter="item_opacity" value={attributes["item_opacity"]}
                           defaultValue={0} max={100} min={0} step={1} isNumber={true}/>

                    <Range title="旋转角度" parameter="rotate_angle" value={attributes["rotate_angle"]}
                           defaultValue={0} max={360} min={0} step={1} isNumber={true}/>

                </div>

                <header onClick={this._headerClickBorder}><span>边框样式</span><b id="borderStyle"/></header>
                <div id="setting-text-border">

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

                <header onClick={this._headerClickShadow}><span>阴影样式</span><b id="shadowStyle"/></header>
                <div id="setting-text-shadow">
                    <span className="clearTop"/>

                    <Color title="阴影颜色" parameter="frame_color" value={attributes['frame_color']}/>

                    <Range title="阴影模糊" parameter="frame_pixes" value={attributes["frame_pixes"]}
                           defaultValue={0} max={100} min={0} step={1} isNumber={true}/>
                    <span className="clearTop"/>
                </div>

            </div>
        );
    },

    _headerClickBase: function () {
        $("#setting-text-base").slideToggle();
        $("#baseStyle").toggleClass("hide").toggleClass("show");
    },

    _headerClickBorder: function () {
        $("#setting-text-border").slideToggle();
        $("#borderStyle").toggleClass("hide").toggleClass("show");
    },

    _headerClickShadow: function () {
        $("#setting-text-shadow").slideToggle();
        $("#shadowStyle").toggleClass("hide").toggleClass("show");
    },

    _changeBorderStyle: function (event) {
        MakeActionCreators.updateElement({bd_style: event.target.value});
    }

});

module.exports = TextStyleTab;