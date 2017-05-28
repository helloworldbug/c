/**事件数据格式化
 * Created by 95 on 2016/1/20.
 */
var MeConstants = require('../../constants/MeConstants');
var ElementsType = MeConstants.Elements;
var $ = require("jquery");
var ElementsEvents = {

    getLinkType: function (url, openLinkWay) {
        //取事件类型
        var linkType = "none";
        if (typeof url == "object") {
            if (url.target == "_self") {
                linkType = "out"
            } else if (url.target == "_blank") {
                linkType = "embedded"
            }
            return linkType
        }

        if (!url) return linkType;
        if (url.indexOf("show_el") != -1) {
            linkType = "show_el";
        } else if (url.indexOf("hide_el") != -1) {
            linkType = "hide_el";
        } else if (url.indexOf("play_el") != -1) {
            linkType = "play_el";
        } else if (url.indexOf("pause_el") != -1) {
            linkType = "pause_el";
        } else if (url.indexOf("pageto:") != -1) {
            linkType = "in";
        } else if (url.indexOf("telto:") != -1) {
            linkType = "telto";
        } else if (url.indexOf("http") != -1) {
            linkType = "out";
        }
        if (url.indexOf("animate_el:") != -1) {
            linkType = "animate_el";
        }
        if (url.indexOf("move_el:") != -1) {
            linkType = "move_el";
        }
        return linkType
    },

    getHref: function (elementAttributes) {
        //取href的值，摇一摇存在animate_end_act里
        var item_type = elementAttributes["item_type"];
        var url = elementAttributes["item_href"];
        url = url || "";
        if (item_type == ElementsType.shake||item_type == ElementsType.scribble) {
            url = elementAttributes["animate_end_act"];
        }
        return url;

    },

    url2Events: function (url, openLinkWay) {
        ///链接分解成一个个事件
        ///return [{type:show_el,value:[1,2]}]
        var GlobalFunc = require("./GlobalFunc");
        var hrefMap = [];
        var _this = ElementsEvents;
        //统一处理成json格式
        if (url == "") {
            url = "[]"
        } else if (url.indexOf("{") == -1) {
            url = JSON.stringify([{meTap: url}])
            //url = "[{meTap:" + url + "}]"
        }
        var objURL = GlobalFunc.toJson(url);

        objURL.forEach((eventItem)=> {
            if (_this.isEmptyObject(eventItem)) {
                hrefMap.push({})
            } else {
                for (var prop in eventItem) {
                    var eventType = prop;
                    var eventItemHrefMap = [];
                    let eventArr = eventItem[prop];
                    if (typeof eventArr == "string") {
                        eventArr = eventArr.split("|")
                    } else {
                        eventArr = [eventArr]
                    }
                    eventArr.forEach((url)=> {
                        var action = _this.getLinkType(url);
                        var obj = {};
                        for (let i = 0; i < eventItemHrefMap.length; i++) {
                            if (eventItemHrefMap[i].action == action) {
                                obj = eventItemHrefMap[i];
                                break;
                            }
                        }
                        if (!obj.action) {
                            //{eventType:eventType,action:action,value:[]}
                            eventItemHrefMap.push(obj)
                        }
                        if (action == "show_el" || action == "hide_el" || action == "play_el" || action == "pause_el") {
                            var id = _this.getDisplayObjId(url);
                            if (obj.value) {
                                obj.value.push(id);
                            } else {
                                obj.action = action
                                obj.value = [id]
                            }
                        } else if (action == "animate_el") {
                            var objStr = url.substr(url.indexOf("animate_el:") + "animate_el:".length)
                            var actionValueObj = GlobalFunc.toJson(objStr);
                            var ids = []
                            actionValueObj.forEach((item)=> {
                                ids.push(item.id)
                            });
                            if (ids.length > 0) {
                                obj.value = {
                                    ids     : ids,
                                    name    : actionValueObj[0].name,
                                    delay   : actionValueObj[0].delay,
                                    duration: actionValueObj[0].duration,
                                    infinite: actionValueObj[0].infinite,
                                    type: actionValueObj[0].type||""
                                }
                            } else {
                                obj.value = {
                                    ids     : [],
                                    name    : "none",
                                    delay   : 0.3,
                                    duration: 1,
                                    infinite: 1,
                                    type:"in"
                                }
                            }
                            obj.action = action
                        } else if (action == "move_el") {
                            var objStr = url.substr(url.indexOf("move_el:") + "move_el:".length)
                            var actionValueObj = GlobalFunc.toJson(objStr);
                            var ids = []
                            actionValueObj.forEach((item)=> {
                                ids.push(item.id)
                            });
                            if (ids.length > 0) {
                                obj.value = {
                                    ids     : ids,
                                    easing  : actionValueObj[0].easing,
                                    position: actionValueObj[0].position,
                                    to      : actionValueObj[0].to,
                                    delay   : +actionValueObj[0].delay,
                                    speed   : +actionValueObj[0].speed
                                }
                            } else {
                                obj.value = {
                                    ids     : [],
                                    easing  : "linear",
                                    position: "relative",
                                    to      : {x: 0, y: 0},
                                    delay   : 0,
                                    speed   : 1

                                }
                            }
                            obj.action = action
                        } else {
                            obj.action = action
                            obj.value = url
                        }
                        obj.eventType = eventType;


                    });
                    hrefMap = hrefMap.concat(eventItemHrefMap);
                }
            }


        })

        return hrefMap;
    },

    events2Url     : function (eventsArr) {
        //事件还原成链接url
        if (eventsArr.length == 0) {
            return ""
        }
        var retArr = [];
        for (let i = 0; i < eventsArr.length; i++) {
            var item = eventsArr[i];
            var eventType = item.eventType;
            if (!eventType) {
                retArr.push({})
                continue;
            }
            if (item.action == "show_el" || item.action == "hide_el" || item.action == "play_el" || item.action == "pause_el") {
                let itemVal = item.value;
                var stdItem = itemVal.map((id)=> {
                    return (item.action + ":" + id);
                }).join("|");

                //stdItem = "{" + eventType + ":" + stdItem + "}"
                retArr.push({[eventType]: stdItem})
                //retArr.push(stdItem)
            } else if (item.action == "in" || (item.action == "telto")) {
                retArr.push({[eventType]: item.value})
            } else if (item.action == "move_el" || (item.action == "animate_el")) {
                var actionValueArr = []
                if (item.value.ids && item.value.ids.length > 0) {
                    item.value.ids.forEach((id)=> {
                        var actionValue = $.extend({}, item.value);
                        delete actionValue.ids;
                        actionValue.id = id;
                        actionValueArr.push(actionValue)
                    })
                }
                retArr.push({[eventType]: item.action + ":" + JSON.stringify(actionValueArr)})

            } else if (item.value) {
                var target
                if (item.action == "embedded") {
                    target = "_blank"
                } else if (item.action == "out") {
                    target = "_self";
                }
                if (typeof item.value == "string") {
                    retArr.push({[eventType]: {"target": target, "value": item.value}})
                } else {
                    retArr.push({[eventType]: {"target": item.value.target, "value": item.value.value}})
                }

                //retArr.push("{" + eventType + ":" + "{target:"+target+",value:"+item.value + "}}")
            } else {
                retArr.push({[eventType]: item.action || ""})
                //retArr.push("{" + eventType + ":" + item.action + "}")
            }
        }
        return JSON.stringify(retArr);
    },
    getDisplayObjId: function (url) {
        //从show_el:id中获取id
        var id;
        if (typeof url == "string") {
            var index = url.indexOf(":");
            if (index > -1) {
                id = url.substring(index + 1);
            }
        }
        return id;
    },

    composePicUrl: function (allEvent, nameStr) {
        //多图元素的事件转化成字符串
        //Picslide events to url
        var names = nameStr.split("|");
        var href = names.map(()=> {
            return [];
        });
        for (let i = 0; i < allEvent.length; i++) {
            var event = allEvent[i];
            var eventName = event.name;
            var index = _.indexOf(names, eventName);
            if (index > -1) {
                href[index].push(composeEventItem(event));
            }
        }
        var imgHref = href.map((eventArr)=> {
            return eventArr.join("|")
        });
        return imgHref.join("@");
    },
    isEmptyObject: function (o) {
        for (var n in o) {

            return false;
        }
        return true;
    },
    getPicEvents : function (attributes) {
        //多图元素字符串转化成事件
        //Picslide item_href to events
        //[]
        // return [{type:show_el,name:...,value;[1,2]},...]
        var ret = [];
        let names = attributes["item_val_sub"].split("|");
        let hrefArr = attributes["item_href"].split("@");
        for (var i = 0; i < hrefArr.length; i++) {
            if (hrefArr[i] != "") {
                let hrefMap = decomposePicUrl(names[i], hrefArr[i]);
                for (let j = 0; j < hrefMap.length; j++) {
                    ret.push(hrefMap[j]);
                }
            }
        }
        if (ret.length == 0) {
            ret.push({name: "", value: " ", type: "none"})
        }
        return ret;
    }
};
module.exports = ElementsEvents;

function decomposePicUrl(name, url) {
    ///分解链接
    // return [{type:show_el,name:...,value;[1,2]},...]
    let eventArr = url.split("|");
    var hrefMap = [];
    eventArr.forEach((url)=> {
        var type = ElementsEvents.getLinkType(url);
        var obj = {};
        for (let i = 0; i < hrefMap.length; i++) {
            if (hrefMap[i].type == type) {
                obj = hrefMap[i];
                break;
            }
        }

        if (!obj.type) {
            obj.type = type;
            obj.name = name;
            hrefMap.push(obj)
        }
        if (type == "show_el" || type == "hide_el") {
            var id = ElementsEvents.getDisplayObjId(url);
            if (obj.value) {
                obj.value.push(id)
            } else {
                obj.value = [id]
            }
        } else {
            obj.value = url
        }

    });
    return hrefMap;
}
function composeEventItem(obj) {
    //事件组合成字符串
    var retarr = [];
    let item = obj;
    if (item.type == "show_el" || item.type == "hide_el") {
        let itemVal = item.value;
        var stdItem = itemVal.map((id)=> {
            return item.type + ":" + id;
        }).join("|");
        retarr.push(stdItem)
    } else if (item.value) {
        retarr.push(item.value)
    } else {
        retarr.push(item.type)
    }

    return retarr.join("|");
}