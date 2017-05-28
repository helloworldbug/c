/**
 * @component ImageEditTab
 * @description 图片元素编辑设置
 * @time 2015-09-17 10:29
 * @author Nick
 **/

var React = require('react');
var MakeActionCreators = require('../../../../actions/MakeActionCreators');
var DialogAction = require("../../../../actions/DialogActionCreator");
var GlobalFunc = require('../../../Common/GlobalFunc');
var ElementsEvents = require('../../../Common/ElementsEvents');
var PageStore = require('../../../../stores/PageStore');
var MultiSelect = require("../../Tools/MultiSelect");
var PositionAndSize = require("./SettingComponents/PositionAndSize");
var Range = require("./SettingComponents/Range");
var Color = require("./SettingComponents/Color");

var _ = require("lodash");
var userObj;
var OriDragIndex;
var dragLayerEl;
var optionDefaultValue = {
    none   : "",
    out    : "http://",
    in     : "pageto:0",
    hide_el: [-2],
    show_el: [-2]
};

var PicSlideEditTab = React.createClass({

    getInitialState: function () {
        //events:[{name:"",value:""/[1,2,3],type:""}]
        var attributes = this.props.attributes;
        return {events: ElementsEvents.getPicEvents(attributes)}
    },

    componentWillReceiveProps: function (newProps) {
        var attrs = newProps.attributes;
        this.setState({events: ElementsEvents.getPicEvents(attrs)});
    },

    componentWillMount: function () {
        userObj = GlobalFunc.getUserObj();
    },

    removeEvent: function (index) {
        var hrefMap = this.state.events;
        if (hrefMap.length > index) {
            hrefMap.splice(index, 1)
        }
        var href = ElementsEvents.composePicUrl(hrefMap, this.props.attributes["item_val_sub"]);
        MakeActionCreators.updateElement({item_href: href});
    },

    _changeType: function (index, event) {
        var select_type = event.target.value;
        var href = optionDefaultValue[select_type];
        var hrefMap = this.state.events;
        if (hrefMap.length > index) {
            hrefMap[index].type = select_type;
            hrefMap[index].value = href;
        }
        href = ElementsEvents.composePicUrl(hrefMap, this.props.attributes["item_val_sub"]);
        MakeActionCreators.updateElement({item_href: href});
    },

    getContent: function (type, obj, index) {  //obj= [{type:value}]
        var linkContent;
        var pageLength = PageStore.getPages().length;
        var linkArray = [];
        var number = "";
        var indexArray = [];
        var b;
        switch (type) {
            case "hide_el":
            case "show_el":
                var ElementStore = require("../../../../stores/ElementStore");
                var items = ElementStore.getElements();
                var baseItem = GlobalFunc.getBaseFrame(items);
                var frames = GlobalFunc.getAllDisplayFrame(items);
                var layerFrame = baseItem.concat(frames);
                layerFrame.sort(GlobalFunc.itemSort("item_layer"));
                for (let i = 0; i < layerFrame.length; i++) {
                    if (layerFrame[i].get("item_type") == 17 || !GlobalFunc.canChangeDisplayState(layerFrame[i].get("item_type"))) {
                        layerFrame.splice(i, 1);
                        i--
                    }
                }
                var ops = layerFrame.map((item)=> {
                    var text;
                    return <div value={item.get("item_id")} text={item.get("f_name")}>{item.get("f_name")}</div>
                    //let name = GlobalFunc.getObj(item);
                    //if (typeof  name != "undefined") {
                    //    text = name +item.get("f_name");
                    //}
                    //else {
                    //    text = "未知元素"
                    //}
                    //return <div value={item.get("item_id")} text={text}>{text}</div>
                });
                linkContent =
                    <div className="setting-select">
                        <h1>目标对象</h1>
                        <MultiSelect selectValues={obj.value} onChange={this.onChange.bind(this,index)}>
                            {ops}
                        </MultiSelect>
                    </div>;
                break;
            case "none":
                linkContent = <div className="linkNo"></div>;
                break;
            case "out":
                linkContent =
                    <div className="setting-select">
                        <h1>链接地址</h1>
                        <input className="linkOut" type="text" value={obj.value} onChange={this._changeLink.bind(this,index)}/>
                    </div>;
                break;
            case "in":
                linkArray = obj.value.split(":");
                number = parseInt(linkArray[1]) + 1;
                for (var i = 1; i <= pageLength; i++) {
                    indexArray.push(i);
                }
                linkContent =
                    <div className="setting-select">
                        <h1>跳转页数</h1>
                        <select className="linkIn" onChange={this._changeLinkIndex.bind(this,index)} defaultValue={number}>
                            {indexArray.map(function (item) {
                                b = "第" + item + "页";
                                return <option value={parseInt(item)}>{b}</option>
                                })}
                        </select></div>;

                break;
        }
        return linkContent;
    },

    onChange: function (index, e) {
        var hrefMap = this.state.events;
        if (hrefMap.length > index) {
            hrefMap[index].value = e.target.value
        }
        var newUrl = ElementsEvents.composePicUrl(hrefMap, this.props.attributes["item_val_sub"]);
        MakeActionCreators.updateElement({item_href: newUrl});
    },

    _changeImg: function (oriIndex, e) {
        var value = e.target.value;
        var events = this.state.events;
        events[oriIndex].name = value;
        var href = ElementsEvents.composePicUrl(events, this.props.attributes["item_val_sub"]);
        MakeActionCreators.updateElement({item_href: href});
        //console.log(href);
    },

    getNames: function () {
        var names = this.props.attributes["item_val_sub"].split("|");
        var pureName = names.map((name)=> {
            return name.split("@")[0];
        });
        return pureName;
    },

    addEvent: function (e) {
        e.preventDefault();
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        var events = this.state.events;
        var haveEmptyEvent = false;
        for (var i = 0; i < events.length; i++) {
            var ev = events[i];
            if (ev.value == " " && ev.name == "" && ev.type == "none") {
                haveEmptyEvent = true;
                break;
            }
        }

        if (!haveEmptyEvent) {
            events.push({name: "", value: " ", type: "none"});
            this.setState({events: events});
        }
    },

    _changeLink: function (index, event) {
        var text = event.target.value;

        if(text.substring(0, 4) != 'http'){  //如果地址不是以http开头，这加 http://
            text = 'http://' + text;
        }

        if(text.indexOf("http://http") == 0) { //如果以http://http 开头，则去掉前面的http://
            text = text.substr(7);
        }

        var hrefMap = this.state.events;
        if (hrefMap.length > index) {
            hrefMap[index].value = text;
        }
        var href = ElementsEvents.composePicUrl(hrefMap, this.props.attributes["item_val_sub"]);
        MakeActionCreators.updateElement({item_href: href});

    },

    _changeLinkIndex: function (index, event) {
        var pageIndex = "pageto:" + (parseInt(event.target.value) - 1);
        var hrefMap = this.state.events;
        if (hrefMap.length > index) {
            hrefMap[index].value = pageIndex
        }
        var href = ElementsEvents.composePicUrl(hrefMap, this.props.attributes["item_val_sub"]);
        MakeActionCreators.updateElement({item_href: href});
    },

    genEventItem: function (names, href, index) {
        var type = href.type;
        var namesops = names.map((name,_index)=> {
            return <option key={_index} value={name}>{name.split("@")[0]}</option>
        });
        var optionarr = [{value: "none", text: "无"}, {value: "out", text: "网站链接"}, {value: "in", text: "页内导航"}];
        var userObj = GlobalFunc.getUserObj();
        if (userObj.speFunctionCode) {
            if (userObj.speFunctionCode.indexOf("PICFRAME_ABLE") > -1) {
                optionarr = [{value: "none", text: "无"}, {value: "out", text: "网站链接"}, {
                    value: "in",
                    text : "页内导航"
                }, {value: "show_el", text: "显示对象"}, {value: "hide_el", text: "隐藏对象"}];
            }
        }
        var typeOps = optionarr.map((item,_index)=> {
            return <option  key={_index} value={item.value}>{item.text}</option>
        });

        var options = <select className="type" value={type} onChange={this._changeType.bind(this,index)}>
            {typeOps}
        </select>;
        return <div key={index} className="event-item">
            <div className="title">
                <h1 className="name">设置{index + 1}</h1>
                <span className="delete-event" onClick={this.removeEvent.bind(this,index)}/>
            </div>
            {/*<div className="setting-select">
             <h1>触发条件</h1>
             <select value="1">
             <option value="1">单击</option>
             </select>
             </div>*/}
            <div className="setting-select picsliceForm">
                <h1>设置对象</h1>
                <select className="type" value={this.state.events[index].name}
                        onChange={this._changeImg.bind(this,index)}>
                    <option value="">无</option>
                    {namesops}
                </select>
            </div>
            <div className="setting-select picsliceForm">
                <h1>效果</h1>
                {options}
            </div>
            <div className="linkContent picsliceLink">
                {this.getContent(type, href, index)}
            </div>
        </div>

    },

    render: function () {
        var attributes = this.props.attributes, itemType = attributes['item_type'], picReplace;
        var borderRadiusMax = attributes["item_width"] < attributes["item_height"] ? attributes["item_width"] / 2 : attributes["item_height"] / 2;
        var height = document.body.clientHeight - 54 - 40;
        var _this = this;


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
            return <li key={index} draggable="true" onDragOver={this.dragOver} onDragStart={this.dragStart.bind(this,index)}
                       onDrop={this.drop.bind(this,index)}>
                <div className="slide-img">
                    <div className="imgwrapper"><img src={src}/></div>
                    <span className={showDel?"del-flag":"del-flag hide"}
                          onClick={this.removeImg.bind(this,index)}/>
                </div>
                <div className="img-name">{names[index].split("@")[0]}</div>
            </li>;
        });

        var events = this.state.events.map(this.genEventItem.bind(_this, names));
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
                        <Range title="不透明度" parameter="item_opacity" value={attributes["item_opacity"]}
                               defaultValue={0} max={100} min={0} step={1} isNumber={true}/>

                        <Range title="旋转角度" parameter="rotate_angle" value={attributes["rotate_angle"]}
                               defaultValue={0} max={360} min={0} step={1} isNumber={true}/>
                    </div>
                    <header onClick={this._headerClick.bind(this, "eventStyle", "event-edit")}>
                        <span>图集设置</span>
                        <b id="eventStyle"/>
                        <b className="add-event" onClick={this.addEvent}/>
                    </header>
                    <div id="event-edit" className="picslide">
                        {events}
                    </div>
                    <header onClick={this._headerClick.bind(this, "edit-style", "imgs-edit")}><span>编辑图集</span><b id="edit-style"/></header>
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
        MakeActionCreators.updateElement({f_name: GlobalFunc.htmlDecode(event.target.value)});
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

    removeImg: function (index, event) {
        var attributes = this.props.attributes;
        var names = attributes["item_val_sub"].split("|");
        var srcs = attributes["item_val"].split("|");
        var hrefs = attributes["item_href"].split("@");
        names.splice(index, 1);
        srcs.splice(index, 1);
        hrefs.splice(index, 1);
        //if(srcs.length<2){
        //    GlobalFunc.addSmallTips("至少两张图片",1000,{clickCancel: true})
        //}else{
        MakeActionCreators.updateElement({
            item_val_sub: names.join("|"),
            item_val    : srcs.join("|"),
            item_href   : hrefs.join("@")
        });
        //}

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
        //var hrefs = attributes["item_href"].split("@");
        var imgarr = names.map((name, index)=> {
            return {
                name: name.split("@")[0],
                id  : name.split("@")[1],
                src : srcs[index]
            }
        });
        DialogAction.show("multimaterial", "", {
            materialType: 5,
            itemType    : "picslide",
            maxselect   : 9,
            replace     : true,
            selectImg   : imgarr
        });

    }

});

module.exports = PicSlideEditTab;