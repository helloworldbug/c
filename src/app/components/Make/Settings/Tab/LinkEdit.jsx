/**
 * @component LinkEdit
 * @description 元素链接设置
 * @time 2015-09-07 15:29
 * @author StarZou
 **/

var React = require('react');
var MakeActionCreators = require('../../../../actions/MakeActionCreators');
var PageStore = require('../../../../stores/PageStore');
var GlobalFunc = require("../../../Common/GlobalFunc");
var ElementsEvents = require("../../../Common/ElementsEvents");
var ElementContainer = require("../../Elements/ElementContainer");
var MultiSelect = require("../../Tools/MultiSelect");
var AnimateSelect = require("./SettingComponents/AnimateSelect");
var ElementMove = require("./SettingComponents/ElementMove")
var Schema = require("../../Tools/Schema");
var animateUtil = require("../../../Common/animateUtil");
var MeConstants = require('../../../../constants/MeConstants');
var ElementsType = MeConstants.Elements;
var optionDefaultValue = {
    none      : "",
    embedded  : "http://",
    out       : "http://",
    in        : "pageto:0",
    hide_el   : [-2],
    show_el   : [-2],
    play_el   : [-2],
    pause_el  : [-2],
    telto     : "telto:",
    animate_el: {animate_el: []},
    move_el   : {move_el: []}
};

var LinkEdit = React.createClass({

    getInitialState: function () {
        return {selectBlock: 0}
    },
    updateHref     : function (hrefMap, type, value, index) {
        var obj = hrefMap[index];
        //for (var i = 0; i < hrefMap.length; i++) {
        //    if (hrefMap[i].type == type) {
        //        obj = hrefMap[i];
        //    }
        //}
        if (obj.action) {
            obj.value = value;
        } else {
            obj.action = type
            obj.value.push(value);
            hrefMap.push(obj);
        }
        return hrefMap
    },

    onChange: function (type, index, e) {
        var attributes = this.props.attributes;
        var item_type = attributes["item_type"];
        var url = attributes["item_href"];
        url = url || "";

        if (item_type == 27) {
            url = attributes["animate_end_act"];
        }
        var hrefMap = ElementsEvents.url2Events(url);
        hrefMap = this.updateHref(hrefMap, type, e.target.value, index);

        var newUrl = ElementsEvents.events2Url(hrefMap);
        if (item_type == 27) {
            MakeActionCreators.updateElement({animate_end_act: newUrl});
        } else {
            MakeActionCreators.updateElement({item_href: newUrl});
        }

    },

    getContent         : function (type, obj, index) {  //obj= [{type:value}]
        var linkContent;
        var _this = this;
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
                var ops = layerFrame.map((item,index)=> {
                    var text;
                    let name = GlobalFunc.htmlDecode(item.get("f_name"));

                    console.log(item.get("item_id"));
                    return <div value={item.get("item_id")} text={name} key={index}>{name}</div>
                });
                linkContent =
                    <div className="setting-select"><h1>目标对象</h1><MultiSelect selectValues={obj.value}
                                                                              onChange={this.onChange.bind(this,type,index)}>
                        {ops}
                    </MultiSelect>
                    </div>;
                break;
            case "play_el":
            case "pause_el":
                var ElementStore = require("../../../../stores/ElementStore");
                var items = ElementStore.getElements();
                var baseItem = GlobalFunc.getBaseFrame(items);
                var frames = GlobalFunc.getAllDisplayFrame(items);
                var layerFrame = baseItem.concat(frames);
                layerFrame.sort(GlobalFunc.itemSort("item_layer"));
                for (let i = 0; i < layerFrame.length; i++) {
                    if (layerFrame[i].get("item_type") != 7 && layerFrame[i].get("item_type") != 8) {
                        layerFrame.splice(i, 1);
                        i--
                    }
                }

                var ops = layerFrame.map((item, index)=> {
                    let name = GlobalFunc.htmlDecode(item.get("f_name"));
                    return <div key={index} value={item.get("item_id")} text={name}>{name}</div>
                });
                if (ops.length == 0) {
                    ops = [<div value="0" text="无">无视音频元素</div>]
                }
                linkContent =
                    <div className="setting-select"><h1>目标对象</h1><MultiSelect selectValues={obj.value}
                                                                              onChange={this.onChange.bind(this,type,index)}>
                        {ops}
                    </MultiSelect>
                    </div>;
                break;
            case "none":
                linkContent = <div className="linkNo"></div>;
                break;
            case "embedded":
                linkContent =
                    <div className="setting-select">
                        <h1>链接地址</h1>
                        <input className="linkOut" type="text" value={obj.value.value}
                               onChange={this._changeLink.bind(this,index)}/>
                    </div>;
                break;
            case "telto":
                var allPhone = obj.value
                var phoneNumber = allPhone.substr(allPhone.indexOf(":") + 1);
                linkContent =
                    <div className="setting-select">
                        <h1>电话号码</h1>
                        <input className="linkOut" type="text" value={phoneNumber}
                               onChange={this._changePhone.bind(this,index)}/>
                    </div>;
                break;
            case "out":
                linkContent =
                    <div className="setting-select">
                        <h1>链接地址</h1>
                        <input className="linkOut" type="text" value={obj.value.value}
                               onChange={this._changeLink.bind(this,index)}/>
                    </div>;
                break;
            case "in":
                var MagazineStore = require("../../../../stores/MagazineStore")
                var data = MagazineStore.getWorkData();
                var pageString = obj.value;
                var selectValue = pageString && pageString.substr(pageString.indexOf(":") + 1)
                linkContent =
                    <div className="setting-select"><h1>跳转页面</h1>
                        <Schema data={data} selectValue={selectValue} onSelect={this.selectPage.bind(this,index)}/>
                    </div>

                break;
            case "animate_el":
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
                var ops = layerFrame.map((item,index)=> {
                    let name = GlobalFunc.htmlDecode(item.get("f_name"));

                    console.log(item.get("item_id"));
                    return <div key={index} value={item.get("item_id")} text={name}>{name}</div>
                });
                var animateSelect = obj.value.ids.length == 0 ? null :
                    <AnimateSelect data={obj.value} rangeChange={_this.changeAnimateRange.bind(_this,index)}
                                   nameChange={_this.nameChange.bind(_this,index)}/>
                linkContent =
                    <div>
                        <div className="setting-select"><h1>目标对象</h1><MultiSelect selectValues={obj.value.ids}
                                                                                  onChange={_this.selectAnimateTarget.bind(_this,type,index)}>
                            {ops}
                        </MultiSelect>

                        </div>

                        {animateSelect}
                    </div>
                break;
            case "move_el":
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
                var ops = layerFrame.map((item,index )=> {
                    let name = GlobalFunc.htmlDecode(item.get("f_name"));
                    return <div key={index} value={item.get("item_id")} text={name}>{name}</div>
                });
                var moveInfo = obj.value.ids.length == 0 ? null :
                    <ElementMove data={obj.value} change={_this.valueChange.bind(_this,index)}/>
                linkContent =
                    <div>
                        <div className="setting-select"><h1>目标对象</h1><MultiSelect selectValues={obj.value.ids}
                                                                                  onChange={_this.selectAnimateTarget.bind(_this,type,index)}>
                            {ops}
                        </MultiSelect>
                        </div>
                        {moveInfo}
                    </div>

                break;
        }
        return linkContent;
    },
    valueChange        : function (index, type, value, isRange) {

        var attributes = this.props.attributes;
        var item_type = attributes["item_type"];
        var url = ElementsEvents.getHref(attributes);
        var hrefMap = ElementsEvents.url2Events(url);
        if (hrefMap.length > index) {
            hrefMap[index].value = value;
        }
        var href = ElementsEvents.events2Url(hrefMap);
        if (isRange) {
            if (item_type == 27) {
                MakeActionCreators.updateElement({"animate_end_act": href}, undefined, {type: "range"});
            } else {
                MakeActionCreators.updateElement({item_href: href}, undefined, {type: "range"});
            }
        } else {
            if (item_type == 27) {
                MakeActionCreators.updateElement({"animate_end_act": href});
            } else {
                MakeActionCreators.updateElement({item_href: href});
            }

        }
    },
    selectAnimateTarget: function (type, index, event) {
        var attributes = this.props.attributes;
        var item_type = attributes["item_type"];
        var url = ElementsEvents.getHref(attributes);
        var hrefMap = ElementsEvents.url2Events(url);
        if (hrefMap.length > index) {
            hrefMap[index].value.ids = event.target.value
        }
        var href = ElementsEvents.events2Url(hrefMap);
        if (item_type == 27) {
            MakeActionCreators.updateElement({"animate_end_act": href});
        } else {
            MakeActionCreators.updateElement({item_href: href});
        }
    },
    changeAnimateRange : function (index, type, value, isRange) {
        if (typeof value.type == "undefined") {
            value.type = animateUtil.getType(value.name);
        }
        var attributes = this.props.attributes;
        var item_type = attributes["item_type"];
        var url = ElementsEvents.getHref(attributes);
        var hrefMap = ElementsEvents.url2Events(url);
        if (hrefMap.length > index) {
            hrefMap[index].value = value;
        }
        var href = ElementsEvents.events2Url(hrefMap);
        if (isRange) {
            if (item_type == 27) {
                MakeActionCreators.updateElement({"animate_end_act": href}, undefined, {type: "range"});
            } else {
                MakeActionCreators.updateElement({item_href: href}, undefined, {type: "range"});
            }
        } else {
            if (item_type == 27) {
                MakeActionCreators.updateElement({"animate_end_act": href});
            } else {
                MakeActionCreators.updateElement({item_href: href});
            }

        }
    },
    nameChange         : function (index, name, type) {
        var attributes = this.props.attributes;
        var item_type = attributes["item_type"];
        var url = ElementsEvents.getHref(attributes);
        var hrefMap = ElementsEvents.url2Events(url);
        if (hrefMap.length > index) {
            hrefMap[index].value.name = name
            if (typeof type != "undefined") {
                hrefMap[index].value.type = type;
            }
        }
        var href = ElementsEvents.events2Url(hrefMap);
        if (item_type == 27) {
            MakeActionCreators.updateElement({"animate_end_act": href});
        } else {
            MakeActionCreators.updateElement({item_href: href});
        }
        //MakeActionCreators.updateElement({item_animation:JSON.stringify(animationName)});
    },
    selectPage         : function (index, pageUid) {
        var pageIndex = "pageto:" + pageUid;
        var attributes = this.props.attributes;
        var item_type = attributes["item_type"];
        var url = ElementsEvents.getHref(this.props.attributes);
        var hrefMap = ElementsEvents.url2Events(url);
        if (hrefMap.length > index) {
            hrefMap[index].value = pageIndex
        }
        var href = ElementsEvents.events2Url(hrefMap);
        if (item_type == 27) {
            MakeActionCreators.updateElement({"animate_end_act": href});
        } else {
            MakeActionCreators.updateElement({item_href: href});
        }
        console.log("sdf", pageUid);
    },
    changeEventType    : function (index, event) {
        var selectType = event.target.value;
        var url = ElementsEvents.getHref(this.props.attributes);
        var hrefMap = ElementsEvents.url2Events(url);

        if (hrefMap.length > index) {
            console.log(hrefMap[index]);
            hrefMap[index].eventType = selectType || "meTap"
        }
        var href = ElementsEvents.events2Url(hrefMap);
        var attributes = this.props.attributes;
        var item_type = attributes["item_type"];

        if (item_type == 27) {
            MakeActionCreators.updateElement({"animate_end_act": href});
        } else {
            MakeActionCreators.updateElement({item_href: href});
        }
    },
    genEventItem       : function (hrefMap, obj, index) { // obj= [{type:value}]
        var type = obj.action || "";
        var optionarr = [{value: "", text: "无"}, {value: "embedded", text: "嵌入式网页"}, {
            value: "out",
            text : "网站链接"
        }, {
            value: "in",
            text : "页内导航"
        }, {value: "show_el", text: "显示对象"}, {value: "hide_el", text: "隐藏对象"}, {
            value: "play_el",
            text : "播放音视频"
        }, {value: "pause_el", text: "暂停音视频"}, {value: "telto", text: "拨打电话"}, {
            value: "animate_el",
            text : "播放动画"
        }, {value: "move_el", text: "移动元素"}];
        //var optionarr = [{value: "none", text: "无"}, {value: "embedded", text: "嵌入式网页"}, {
        //    value: "out",
        //    text : "网站链接"
        //}, {value: "in", text: "页内导航"}];
        //var userObj = GlobalFunc.getUserObj();
        //if (userObj.speFunctionCode) {
        //    if (userObj.speFunctionCode.indexOf("PICFRAME_ABLE") > -1) {
        //        optionarr = [{value: "none", text: "无"}, {value: "embedded", text: "嵌入式网页"}, {
        //            value: "out",
        //            text : "网站链接"
        //        }, {
        //            value: "in",
        //            text : "页内导航"
        //        }, {value: "show_el", text: "显示对象"}, {value: "hide_el", text: "隐藏对象"}, {
        //            value: "play_el",
        //            text : "播放音视频"
        //        }, {value: "pause_el", text: "暂停音视频"}, {value: "telto", text: "拨打电话"}, {
        //            value: "animate_el",
        //            text : "播放动画"
        //        }, {value: "move_el", text: "移动元素"}];
        //    }
        //}

        //for (var i = 0; i < hrefMap.length; i++) {
        //    var hrefType = hrefMap[i].action;
        //    if (type != hrefType) {
        //        for (let j = 0; j < optionarr.length; j++) {
        //            if (hrefType == optionarr[j].value) {
        //                optionarr.splice(j, 1);
        //                break;
        //            }
        //        }
        //    }
        //
        //}
        var typeOps = optionarr.map((item, index)=> {
            return <option key={index} value={item.value}>{item.text}</option>
        });
        var options = <select className="type" value={type} onChange={this._changeType.bind(this,index)}>
            {typeOps}
        </select>;
        var attributes = this.props.attributes;
        var item_type = attributes["item_type"];
        var optionEvents;
        if (item_type == ElementsType.fingerprint) {
            optionEvents = <div className="setting-select">
                <h1>触发条件</h1>
                <select value={obj.eventType} onChange={this.changeEventType.bind(this,index)}>
                    <option value="meLongTap">长按</option>
                </select>
            </div>
        } else if (item_type != 27) {
            optionEvents = <div className="setting-select">
                <h1>触发条件</h1>
                <select value={obj.eventType} onChange={this.changeEventType.bind(this,index)}>
                    <option value="meTap">单击</option>
                    <option value="meLongTap">长按</option>
                    <option value="meSwipeUp">向上滑动</option>
                    <option value="meSwipeDown">向下滑动</option>
                    <option value="meSwipeLeft">向左滑动</option>
                    <option value="meSwipeRight">向右滑动</option>
                </select>
            </div>
        }


        var height = document.body.clientHeight - 54 - 40;
        return (
        <div key={index} className="event-item">
            <header onClick={this.headerClick.bind(this, index)}>
                <span className="name">事件{index + 1}</span>
                <b className={this.state.selectBlock == index ? "show" : "hide"}/>
                <span className="delete-event" onClick={this.removeEvent.bind(this,index)}/>
            </header>
            <div className={this.state.selectBlock == index ? "setting-event-block show" : "setting-event-block hide"}>
                {/*style={{height:this.state.selectBlock == index ? height - hrefMap.length * 40 - 96 : 0}}*/}
                {optionEvents}
                <div className="setting-select">
                    <h1>发生事件</h1>
                    {options}
                </div>
                <div className="linkContent">
                    {this.getContent(type, obj, index)}
                </div>
            </div>
        </div>
        )
    },
    headerClick        : function (index) {
        if (this.state.selectBlock == index) {
            this.setState({
                selectBlock: -1
            });
        } else {
            this.setState({
                selectBlock: index
            });
        }

        //$("div[id^='setting-animation-']").slideUp();
        //$("#setting-animation-" + index).slideDown();
    },
    render             : function () {
        var url = ElementsEvents.getHref(this.props.attributes);
        var hrefMap = ElementsEvents.url2Events(url);
        var _this = this;

        var eventList = hrefMap.map(this.genEventItem.bind(_this, hrefMap));

        return (
            <div>
                <div className="linkEdit show">

                    <div className="setting-animation-add" onClick={this.addEvent}>
                        <span>添加事件</span>
                    </div>

                    {eventList}

                </div>
            </div>
        )
    },

    removeEvent: function (index, event) {
        event.stopPropagation();
        var url = ElementsEvents.getHref(this.props.attributes);
        var hrefMap = ElementsEvents.url2Events(url);
        if (hrefMap.length > index) {
            hrefMap.splice(index, 1)
        }
        var href = ElementsEvents.events2Url(hrefMap);
        var attributes = this.props.attributes;
        var item_type = attributes["item_type"];
        if (item_type == 27) {
            MakeActionCreators.updateElement({"animate_end_act": href});
        } else {
            MakeActionCreators.updateElement({item_href: href});
        }
    },

    addEvent: function (e) {
        e.stopPropagation();

        var url = ElementsEvents.getHref(this.props.attributes);
        var hrefMap = ElementsEvents.url2Events(url);
        hrefMap.push({});

        var href = ElementsEvents.events2Url(hrefMap);
        var attributes = this.props.attributes;
        var item_type = attributes["item_type"];
        if (item_type == 27) {
            MakeActionCreators.updateElement({"animate_end_act": href});
        } else {
            MakeActionCreators.updateElement({item_href: href});
        }
        this.setState({selectBlock: hrefMap.length - 1})
    },


    _changeType : function (index, event) {
        var selectType = event.target.value,
            href = optionDefaultValue[selectType],
            url = ElementsEvents.getHref(this.props.attributes);


        var hrefMap = ElementsEvents.url2Events(url);

        if (hrefMap.length > index) {
            hrefMap[index].eventType = hrefMap[index].eventType || "meTap"
            hrefMap[index].action = selectType;
            hrefMap[index].value = href;
        }
        href = ElementsEvents.events2Url(hrefMap);
        var attributes = this.props.attributes;
        var item_type = attributes["item_type"];

        if (item_type == 27) {
            MakeActionCreators.updateElement({"animate_end_act": href});
        } else {
            MakeActionCreators.updateElement({item_href: href});
        }
    },
    _changePhone: function (index, event) {
        var attributes = this.props.attributes;
        var item_type = attributes["item_type"]
        var text = "telto:" + event.target.value;

        var url = ElementsEvents.getHref(this.props.attributes);
        var hrefMap = ElementsEvents.url2Events(url);
        if (hrefMap.length > index) {
            hrefMap[index].value = text;
        }
        var href = ElementsEvents.events2Url(hrefMap);

        if (item_type == 27) {
            MakeActionCreators.updateElement({"animate_end_act": href});
        } else {
            MakeActionCreators.updateElement({item_href: href});
        }
    },
    _changeLink : function (index, event) {
        var attributes = this.props.attributes;
        var item_type = attributes["item_type"]
        var text = event.target.value;

        if (text.substring(0, 4) != 'http') {  //如果地址不是以http开头，这加 http://
            text = 'http://' + text;
        }

        if (text.indexOf("http://http") == 0) { //如果以http://http 开头，则去掉前面的http://
            text = text.substr(7);
        }

        var url = ElementsEvents.getHref(this.props.attributes);
        var hrefMap = ElementsEvents.url2Events(url);
        if (hrefMap.length > index) {
            hrefMap[index].value = text;
        }
        var href = ElementsEvents.events2Url(hrefMap);

        if (item_type == 27) {
            MakeActionCreators.updateElement({"animate_end_act": href});
        } else {
            MakeActionCreators.updateElement({item_href: href});
        }
    }

});

module.exports = LinkEdit;