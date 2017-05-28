/**
 * @component ImageEditTab
 * @description 图片元素编辑设置
 * @time 2015-09-17 10:29
 * @author Nick
 **/

var React = require('react');
var MakeActionCreators = require('../../../../actions/MakeActionCreators');
var DialogAction = require("../../../../actions/DialogActionCreator");
var LinkEdit = require('./LinkEdit');
var GlobalFunc = require('../../../Common/GlobalFunc');
var userObj;
var OriDragIndex;
var dragLayerEl;
var PositionAndSize = require("./SettingComponents/PositionAndSize");
var DisplayStateEdit = require("./DisplayStateEdit");
var Range = require("./SettingComponents/Range");
var Color = require("./SettingComponents/Color");

var PanoramaEditTab = React.createClass({

    componentWillMount: function () {
        userObj = GlobalFunc.getUserObj();
    },

    render: function () {
        var attributes = this.props.attributes;
        var height = document.body.clientHeight - 54 - 40;
        var borderRadiusMax = attributes["item_width"] < attributes["item_height"] ? attributes["item_width"] / 2 : attributes["item_height"] / 2;

        var names = attributes["item_val_sub"].split("|");
        var srcs = attributes["item_val"].split("|");
        var showDel = true;
        if (srcs.length < 3) {
            showDel = false
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
        var img = srcs.map((src, index)=> {
            return <li draggable="true" onDragOver={this.dragOver} onDragStart={this.dragStart.bind(this,index)}
                       onDrop={this.drop.bind(this,index)}>
                <div className="slide-img">
                    <div className="imgwrapper"><img src={src}/></div>
                    <span className={showDel?"del-flag":"del-flag hide"} onClick={this.removeImg.bind(this,index)}/>
                </div>
                <div className="img-name">{names[index].split("@")[0]}</div>
            </li>;
        });
        return (
            <div className="setting-container" style={{height:height}}>
                <span className="clearTop"/>
                <div className="setting-input-text">
                    <h1>元素名称</h1>
                    <input type="text" value={GlobalFunc.htmlDecode(attributes.f_name)} onChange={this._changeName} maxLength="20"/>
                </div>
                <div id="setting-image-edit">
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
                    <header onClick={this._headerClick.bind(this, "edit-style", "imgs-edit")}><span>编辑图片</span><b id="edit-style"/></header>
                    <div id="imgs-edit">
                        <span className="clearTop"/>
                        <div className="replace-image">
                            <button onClick={this._replaceImg}>添加图片</button>
                        </div>
                        <ul className="imgpanel">
                            {img}
                        </ul>
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
            </div>
        );
    },
    _changeName    : function (event) {
        MakeActionCreators.updateElement({f_name: GlobalFunc.htmlEncode(event.target.value)});
    },
    dragOver: function (e) {
        e.preventDefault();
    },

    dragStart: function (index, e) {
        OriDragIndex = index;
        dragLayerEl = e.target;

        //e.preventDefault();
    },

    drop: function (index, e) {
        e.preventDefault();
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        if (OriDragIndex == index) {
            return
        }

        var attributes = this.props.attributes;
        var names = attributes["item_val_sub"].split("|");
        var srcs = attributes["item_val"].split("|");
        var hrefs = attributes["item_href"].split("@");
        if (OriDragIndex < index) {
            index--
        }
        var newName = names.splice(OriDragIndex, 1)[0];
        var newSrc = srcs.splice(OriDragIndex, 1)[0];
        var newHref = hrefs.splice(OriDragIndex, 1)[0];
        names.splice(index, 0, newName);
        srcs.splice(index, 0, newSrc);
        hrefs.splice(index, 0, newHref);
        MakeActionCreators.updateElement({
            item_val_sub: names.join("|"),
            item_val    : srcs.join("|"),
            item_href   : hrefs.join("@")
        });

    },

    removeImg: function (index) {
        var attributes = this.props.attributes;
        var names = attributes["item_val_sub"].split("|");
        var srcs = attributes["item_val"].split("|");
        var hrefs = attributes["item_href"].split("@");
        names.splice(index, 1);
        srcs.splice(index, 1);
        hrefs.splice(index, 1);
        MakeActionCreators.updateElement({
            item_val_sub: names.join("|"),
            item_val    : srcs.join("|"),
            item_href   : hrefs.join("@")
        });
    },

    _headerClick: function (buttonID, contentID) {
        $("#" + contentID).slideToggle();
        $("#" + buttonID).toggleClass("hide").toggleClass("show");
    },

    _changeBorderStyle: function (event) {
        MakeActionCreators.updateElement({bd_style: event.target.value});
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

    _changePicReplaceIndex: function (event) {
        var value = parseInt(event.target.value);
        MakeActionCreators.updateElement({pic_replaceindex: value});
    },

    _replaceImg: function () {
        var attributes = this.props.attributes;
        var names = attributes["item_val_sub"].split("|");
        var srcs = attributes["item_val"].split("|");
        var imgarr = names.map((name, index)=> {
            return {
                name: name.split("@")[0],
                id  : name.split("@")[1],
                src : srcs[index]
            }
        });
        DialogAction.show("multimaterial", "", {
            materialType: 5,
            itemType    : "panorama",
            maxselect   : 36,
            replace     : true,
            selectImg   : imgarr
        });

    }

});

module.exports = PanoramaEditTab;