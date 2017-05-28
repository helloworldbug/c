/**
 * @component ImageEditTab
 * @description 图片元素编辑设置
 * @time 2015-09-17 10:29
 * @author Nick
 **/

var React = require('react');
var MakeActionCreators = require('../../../../actions/MakeActionCreators');
var GlobalFunc = require('../../../Common/GlobalFunc');
var DialogAction = require("../../../../actions/DialogActionCreator");
var userObj;

var PositionAndSize = require("./SettingComponents/PositionAndSize");
var Color = require("./SettingComponents/Color");
var Range = require("./SettingComponents/Range");
var DisplayStateEdit = require("./DisplayStateEdit");

var ImageEditTab = React.createClass({

    componentWillMount: function () {
        userObj = GlobalFunc.getUserObj();
    },

    render: function () {
        var attributes = this.props.attributes, itemType = attributes['item_type'], picReplace;
        var height = document.body.clientHeight - 54 - 40;
        var borderRadiusMax = attributes["item_width"] < attributes["item_height"] ? attributes["item_width"] / 2 : attributes["item_height"] / 2;

        if (userObj.speFunctionCode) {
            var speFunctionCode = userObj.speFunctionCode;
            if (speFunctionCode.indexOf("PICREPLACE_ABLE") > -1) {
                if (itemType == 18 || itemType == 1) {
                    picReplace = <div className="setting-resource-niche">
                        <div>
                            <span>资源位是否允许被替换</span>
                            <input id="picReplace" type="checkbox" checked={attributes['pic_replace'] == 0 || !attributes['pic_replace']}
                                   onChange={this._changePicReplace}/>
                            {/*<label htmlFor="picReplace"><span id="picReplaceSpan"></span></label>*/}
                        </div>
                        <div>
                            <span>图片优先级</span>
                            <input type="text" value={attributes['pic_replaceindex'] || 0} onChange={this._changePicReplaceIndex}/>
                        </div>
                    </div>
                }
            }
        }
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
                    <input type="text" value={GlobalFunc.htmlDecode(attributes.f_name)} onChange={this.changeName} maxLength="20"/>
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
                    <div className="replace-image">
                        <button onClick={this._replaceImg}>替换图片</button>
                    </div>
                    {picReplace}
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

    _changePicReplace: function (event) {
        var value = event.target.checked;
        if (value) {
            MakeActionCreators.updateElement({pic_replace: 0});
            $("#picReplaceSpan").removeClass("hide");
        } else {
            MakeActionCreators.updateElement({pic_replace: 1});
            $("#picReplaceSpan").addClass("hide");
        }
    },
    changeName:function(event){
        var value = event.target.value;
        MakeActionCreators.updateElement({f_name: GlobalFunc.htmlEncode(value)});
    },
    _changePicReplaceIndex: function (event) {
        var value = parseInt(event.target.value);
        MakeActionCreators.updateElement({pic_replaceindex: value});
    },

    _replaceImg: function () {
        switch (this.props.attributes["item_type"]) {
            case 1:
                if (!!this.props.attributes["group_id"]) {
                    //picFrame
                    DialogAction.show("material", "", {materialType: 5, itemType: "img", replace: true});
                } else {
                    DialogAction.show("material", "", {materialType: 4, itemType: "backImg", replace: true});
                }
                break;
            case 3:
                if (this.props.attributes["frame_style"] == 1) {
                    DialogAction.show("material", "", {materialType: 1, itemType: "watermark", replace: true});
                } else if (this.props.attributes["frame_style"] == 3) {
                    DialogAction.show("material", "", {materialType: 3, itemType: "shape", replace: true});
                }
                break;
            case 10:
                DialogAction.show("material", "", {materialType: 2, itemType: "frame", replace: true});
                break;
            case 18:
                DialogAction.show("material", "", {materialType: 5, itemType: "img", replace: true});
                break;
            default:
                console.log(this.props.attributes["item_type"]);
                break;
        }
    },

    _headerClick: function (buttonID, contentID) {
        $("#" + contentID).slideToggle();
        $("#" + buttonID).toggleClass("hide").toggleClass("show");
    },

    _changeBorderStyle: function (event) {
        MakeActionCreators.updateElement({bd_style: event.target.value});
    }


});

module.exports = ImageEditTab;