var ElementTypes = {
    background: 1,// 背景
    text: 2,// 文本
    watermark: 3,// 水印
    music: 7,//音乐
    video: 8,// 视频
    borderFrame: 10,// 边框
    link: 11,// 链接
    phone: 12,// 电话
    inputText: 14,// 输入框
    map: 15,//地图
    pictureFrame: 17,// 画框
    image: 18,// 图片
    button: 19,// 按钮
    radio: 20,//单选
    checkbox: 21,//多选
    vote: 22, //投票
    scribble: 24,//涂抹
    fingerprint: 25,//指纹长按
    shake: 27, //摇一摇
    displayFrame: 34, //显示框 又叫 浮层
    embedded: 35, //嵌入网页
    reward: 36, //打赏
    picslide: 37, //图集
    label: 38, //标签
    svg: 39, //svg
    panorama: 40, //虚拟全景
    redEnvelope: 41, //红包
    ar: 45,  //AR增强现实
    vr: 46,  //VR增强现实
}
var uid = {
    //自定义uid生成器
    generateUid: function (len) {
        len = len || 12;
        return Math.random().toString(35).substr(2, len);

    },
    generateUidNum: function (len) {
        len = len || 8;
        return parseInt(Math.random().toString(10).substr(2, len))

    }
}

var CopyWork = {
    copyWork: function (tid, resolve, reject) {
        CopyWork.getMagazineTreeDataById(tid, function (templateObject, pagesObject) {
            var tpl = templateObject;
            var tplData = pagesObject;

            //用模板打开，复制数据
            tpl = CopyWork.cloneTpl(tpl);// 设置模板对象 tpl
            tpl.set("tpl_id", CopyWork.createTplId());
            tpl.set("tpl_type", 10);
            tpl.set("inherit_from", tid);
            tpl.set("approved", 0);
            ///clone tree
            var objCopy = CopyWork.cloneNode(tplData);
            CopyWork.traversalTree(objCopy, true, CopyWork.copyPageEvents);
            //重置ID
            var pageUids = {}; //新旧页UID
            CopyWork.traversalTree(objCopy, false, function (node) {
                if (CopyWork.isGroup(node)) {
                    node.set("f_object_id", fmacapi_create_uid(""))
                } else {
                    var newPageUid = uuid.v4();
                    pageUids[node.get("page_uid")] = newPageUid;
                    node.set("page_uid", newPageUid);
                }
            })
            CopyWork.traversalTree(objCopy, false, function (node) {
                if (!CopyWork.isGroup(node)) {
                    CopyWork.copyPageToEvents(node, pageUids);
                }
            })
            CopyWork.traversalTree(objCopy, true, function (page) {
                var items = page.get("item_object");
                items.forEach((item) => {
                    if (item.get("item_type") == 2 && typeof item.get("line_height_nodefault") != "undefined") {
                        //老版本App不识别新的行高，所以生成模板时去掉新的字段
                        item.set("line_height", item.get("line_height_nodefault"));
                        if (item.get("line_height") == 0) {
                            //新行高的0是真正的0，老的0是默认行高，所以使用1最接近模板效果
                            item.set("line_height", 1);
                        }
                        item.unset("line_height_nodefault");
                    }
                })
            })
            objCopy.set("key_id", tpl.get("tpl_id"));
            var tplDataTable = CopyWork.tree2TableTplData(tpl.get("tpl_id"), objCopy, tpl.get("tpl_id"));
            var groups = tplDataTable.get("group").slice(0);
            fmacloud.saveMEBook(tpl, tplDataTable, null, function (data) {
                //返回data{tpldata：...,tplobj:...,group:...},tpldata里包含pages
                var tplTableData = data.tpldata;
                tplTableData.set("group", data.group);
                var tpl = data.tplobj, tplid = tpl.get('tpl_id');
                var tplData = CopyWork.table2Tree(tplTableData, tplid);

                CopyWork.uploadJsonFile(tpl, CopyWork.cloneNode(tplData, undefined, true), function (file) {
                    var temp = file.url().split("/");
                    var fileId = temp[temp.length - 1].split(".")[0];
                    var result = {};
                    result.url_type = "leancloud";
                    result.postfix = ".json";
                    result.key = fileId;
                    var jsonUrl = JSON.stringify(result);
                    fmacapi.update_tplobj(tplid, { json_url: jsonUrl }, function (tplobj) {
                        resolve(tplobj);
                    }, function (error) {
                        reject(error);
                    })
                }, function (error) {
                    reject(error);
                })


            }, function (error) {
                reject(error);
            });
        }, function (error) {
            reject(error);
        })
    },


    /**
      * copy group or page
      * @param pages
      * @parent
      * @cloneID if cloneID
      *
      * @returns {Array}
      */
    cloneNode: function (node, parent, cloneID) {
        var cloneNode;

        if (CopyWork.isGroup(node)) {
            //copy group
            cloneNode = CopyWork.cloneGroup(node, cloneID);
            //copy group children
            var children = node.get("items");
            var cloneChildren = [];
            if (children) {
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    cloneChildren.push(CopyWork.cloneNode(child, cloneNode, cloneID));
                }
            }

            cloneNode.set("items", cloneChildren);
        } else {
            //copy page
            cloneNode = CopyWork.clonePages([node], cloneID)[0]
        }
        if (typeof parent != "undefined") {
            cloneNode.set("parent", parent)
        }
        if (cloneID) {
            cloneNode.id = node.id
        }
        return cloneNode

    },
    isGroup: function (obj) {
        ///有"items" 但没有f_type是对用户不可见的根组
        return obj.get("f_type") == 2 || !!obj.get("items");
    },
    /**
        * copy a group
        * @param group
        */
    cloneGroup: function (group, cloneID) {
        var copy = group.clone();
        if (cloneID) {
            copy.id = group.id
        }
        return copy
    },

    /**
         * copy page array
         * @param pages
         * @returns {Array}
         */
    clonePages: function (pages, cloneID) {
        var i = 0, plen = pages.length, result = new Array(plen);
        for (; i < plen; i++) {
            result[i] = pages[i].clone();
            if (cloneID) {
                result[i].id = pages[i].id
            }
            if (result[i].get("item_object") && result[i].get("item_object").length > 0) {
                result[i].set("item_object", CopyWork.cloneElements(result[i].get("item_object"), cloneID));
            }

        }
        return result;
    },
    cloneElements: function (Elements, cloneID) {
        if (!Elements) return []
        var i = 0, len = Elements.length, result = new Array(len);
        for (; i < len; i++) {
            result[i] = Elements[i].clone();
            if (cloneID) {
                result[i].id = Elements[i].id
            }
        }
        return result;
    },
    /**
        * traversal tree , execute func on every node
        * @param root
        * @param skipGroup 对组节点是否执行func
        * @param func
        */
    traversalTree: function (root, skipGroup, func) {
        if (CopyWork.isGroup(root)) {
            if (!skipGroup) {
                func(root);
            }
            var children = root.get("items");
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                CopyWork.traversalTree(child, skipGroup, func);
            }

        } else {
            func(root)
        }

    },

    createTplId: function () {
        return fmacapi_create_uid("");
    },

    cloneTpl: function (t) {

        if (!!t) {
            return t.clone();
        } else {
            return null;
        }
    },

    copyPageEvents: function (page) {
        var elments = (page.get("item_object"));
        if (elments && elments.length > 0) {
            CopyWork.copyElementsEvents(elments);
            page.set("item_object", elments);
        }

    },

    copyElementsEvents: function (elementArr) {

        ///复制元素关联事件
        ///事件在item_href中，显示和隐藏的事件格式为show_el:item_id|hide_el:item_id
        ///复制事件对每个element生成新的item_id,保存新旧id对应关系，再将item_href里的旧id更新成新id
        if (!elementArr) return
        var idMap = {}
        elementArr.forEach((el) => {
            //生成新的id
            var newID = uid.generateUidNum();
            idMap[el.get("item_id")] = newID;
            el.set("item_id", newID);
        });
        elementArr.forEach((el) => {
            //关联事件
            var type = el.get("item_type");
            if (!CopyWork.hasEventCfg(type)) {

                //不可配置事件的href直接使用，不需要关联ID
                return;
            }
            if (type == ElementTypes.picslide) {
                let picEvents = CopyWork.getPicEvents(el.attributes);
                picEvents.forEach(updateEvent.bind(CopyWork, idMap));
                let newUrl = CopyWork.composePicUrl(picEvents, el.attributes["item_val_sub"]);
                el.set("item_href", newUrl)
            } else {
                let url = CopyWork.getHref(el.attributes);
                let events = CopyWork.url2Events(url);
                events.forEach(updateEvent.bind(CopyWork, idMap));
                let newUrl = CopyWork.events2Url(events);
                if (type == ElementTypes.shake || type == ElementTypes.scribble) {
                    el.set("animate_end_act", newUrl)
                } else {
                    el.set("item_href", newUrl)
                }
            }

        });

        function updateEvent(idMap, event) {
            ///将事件里的旧id更新成新id
            if (event.action == "show_el" || event.action == "hide_el") {
                let opEls = event.value;
                for (let i = 0; i < opEls.length; i++) {
                    if (idMap[opEls[i]]) {
                        opEls[i] = idMap[opEls[i]]
                    }
                }
            } else if (event.action == "animate_el" || event.action == "move_el") {
                let opEls = event.value.ids;
                for (let i = 0; i < opEls.length; i++) {
                    if (idMap[opEls[i]]) {
                        opEls[i] = idMap[opEls[i]]
                    }
                }
            }
        }
    },
    /**
         * 元素是否可配置事件
         * @param type
         * @returns {boolean}
         */
    hasEventCfg: function (type) {
        var cfgEvent = true;
        switch (type) {
            case ElementTypes.scribble:
            case ElementTypes.video:
            case ElementTypes.music:
            case ElementTypes.reward:
            case ElementTypes.button:
            case ElementTypes.phone:
                cfgEvent = false;
                break;
            default:
                cfgEvent = true;
        }
        return cfgEvent
    },

    getPicEvents: function (attributes) {
        //Picslide item_href to events
        //[]
        // return [{type:show_el,name:...,value;[1,2]},...]
        var ret = [];
        let names = attributes["item_val_sub"].split("|");
        let hrefArr = attributes["item_href"].split("@");
        for (var i = 0; i < hrefArr.length; i++) {
            if (hrefArr[i] != "") {
                let hrefMap = CopyWork.decomposePicUrl(names[i], hrefArr[i]);
                for (let j = 0; j < hrefMap.length; j++) {
                    ret.push(hrefMap[j]);
                }
            }
        }
        if (ret.length == 0) {
            ret.push({ name: "", value: " ", type: "none" })
        }
        return ret;
    },
    composePicUrl: function (allEvent, nameStr) {
        //Picslide events to url
        var names = nameStr.split("|");
        var href = names.map(() => {
            return [];
        });
        for (let i = 0; i < allEvent.length; i++) {
            var event = allEvent[i];
            var eventName = event.name;
            var index = _.indexOf(names, eventName);
            if (index > -1) {
                href[index].push(CopyWork.composeEventItem(event));
            }
        }
        var imgHref = href.map((eventArr) => {
            return eventArr.join("|")
        });
        return imgHref.join("@");
    },
    getHref: function (elementAttributes) {
        var item_type = elementAttributes["item_type"];
        var url = elementAttributes["item_href"];
        url = url || "";
        if (item_type == ElementTypes.shake || item_type == ElementTypes.scribble) {
            url = elementAttributes["animate_end_act"];
        }
        return url;

    },
    toJson: function (str) {
        return (new Function("", "return " + str))();
    },
    isEmptyObject: function (o) {
        for (var n in o) {

            return false;
        }
        return true;
    },
    getDisplayObjId: function (url) {
        var id;
        if (typeof url == "string") {
            var index = url.indexOf(":");
            if (index > -1) {
                id = url.substring(index + 1);
            }
        }
        return id;
    },
    getLinkType: function (url, openLinkWay) {
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
    url2Events: function (url, openLinkWay) {
        ///链接分解成一个个事件
        ///return [{type:show_el,value:[1,2]}]
        var hrefMap = [];
        var _this = CopyWork;
        if (url == "") {
            url = "[]"
        } else if (url.indexOf("{") == -1) {
            url = JSON.stringify([{ meTap: url }])
            //url = "[{meTap:" + url + "}]"
        }
        var objURL = CopyWork.toJson(url);
        objURL.forEach((eventItem) => {
            if (CopyWork.isEmptyObject(eventItem)) {
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
                    eventArr.forEach((url) => {
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
                            var actionValueObj = CopyWork.toJson(objStr);
                            var ids = []
                            actionValueObj.forEach((item) => {
                                ids.push(item.id)
                            });
                            if (ids.length > 0) {
                                obj.value = {
                                    ids: ids,
                                    name: actionValueObj[0].name,
                                    delay: actionValueObj[0].delay,
                                    duration: actionValueObj[0].duration,
                                    infinite: actionValueObj[0].infinite,
                                    type: actionValueObj[0].type || ""
                                }
                            } else {
                                obj.value = {
                                    ids: [],
                                    name: "none",
                                    delay: 0.3,
                                    duration: 1,
                                    infinite: 1,
                                    type: "in"
                                }
                            }
                            obj.action = action
                        } else if (action == "move_el") {
                            var objStr = url.substr(url.indexOf("move_el:") + "move_el:".length)
                            var actionValueObj = CopyWork.toJson(objStr);
                            var ids = []
                            actionValueObj.forEach((item) => {
                                ids.push(item.id)
                            });
                            if (ids.length > 0) {
                                obj.value = {
                                    ids: ids,
                                    easing: actionValueObj[0].easing,
                                    position: actionValueObj[0].position,
                                    to: actionValueObj[0].to,
                                    delay: +actionValueObj[0].delay,
                                    speed: +actionValueObj[0].speed
                                }
                            } else {
                                obj.value = {
                                    ids: [],
                                    easing: "linear",
                                    position: "relative",
                                    to: { x: 0, y: 0 },
                                    delay: 0,
                                    speed: 1

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

    events2Url: function (eventsArr) {
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
                var stdItem = itemVal.map((id) => {
                    return (item.action + ":" + id);
                }).join("|");

                //stdItem = "{" + eventType + ":" + stdItem + "}"
                retArr.push({ [eventType]: stdItem })
                //retArr.push(stdItem)
            } else if (item.action == "in" || (item.action == "telto")) {
                retArr.push({ [eventType]: item.value })
            } else if (item.action == "move_el" || (item.action == "animate_el")) {
                var actionValueArr = []
                if (item.value.ids && item.value.ids.length > 0) {
                    item.value.ids.forEach((id) => {
                        var actionValue = $.extend({}, item.value);
                        delete actionValue.ids;
                        actionValue.id = id;
                        actionValueArr.push(actionValue)
                    })
                }
                retArr.push({ [eventType]: item.action + ":" + JSON.stringify(actionValueArr) })

            } else if (item.value) {
                var target
                if (item.action == "embedded") {
                    target = "_blank"
                } else if (item.action == "out") {
                    target = "_self";
                }
                if (typeof item.value == "string") {
                    retArr.push({ [eventType]: { "target": target, "value": item.value } })
                } else {
                    retArr.push({ [eventType]: { "target": item.value.target, "value": item.value.value } })
                }

                //retArr.push("{" + eventType + ":" + "{target:"+target+",value:"+item.value + "}}")
            } else {
                retArr.push({ [eventType]: item.action || "" })
                //retArr.push("{" + eventType + ":" + item.action + "}")
            }
        }
        return JSON.stringify(retArr);
    },
    /**
     * 取期刊作品的树型
     * @param tid
     * @param success
     * @param error
     */
    getMagazineTreeDataById: function (tid, success, error) {
        CopyWork.getMagazineTemplateDataById(tid, function (tpl, tplData) {
            success(tpl, CopyWork.table2Tree(tplData, tid))
        }, error)
    },
    /**
    * 取期刊作品，有组
    * @param tid
    * @param success
    * @param error
    */
    getMagazineTemplateDataById: function (tid, success, err) {
        CopyWork.getAllGroupDataByTplidPromise(tid).then(function (groups) {
            CopyWork.getTemplateDataById(tid, function (templateObject, pagesObject) {
                pagesObject.unset("parent");
                if (groups.length == 0) {
                    ///老作品添加组
                    var group = CopyWork.createBlankGroup(pagesObject, "组");
                    group.set("f_parent", tid);
                    var group_id = group.get("f_object_id");
                    pagesObject.get("pages").forEach((page, index) => {
                        page.set("f_tpl_group_id", group_id);
                        page.set("f_order_num", index);
                    });
                    pagesObject.set("group", [group])
                } else {
                    pagesObject.set("group", groups)
                }
                if (success) success(templateObject, pagesObject);
            }, function (error) {
                // error
                if (err) err(error);
                console.log(error);
            });
        }).catch(function (e) {
            err(e)
        })
    },
    /**
    * 取组数据
    * @param tplid
    * @returns {Promise}
    */
    getAllGroupDataByTplidPromise: function (tplid) {
        return new Promise(function (resolve, reject) {
            CopyWork.getAllGroupDataByTplid(tplid, resolve, reject)
        })
    },
    /**
  * 查询作品id查询ME刊数据的所有group数据
  * @param tplid 作品id
  * @param cb_ok
  * @param cb_err
  * @returns {*}
  */
    getAllGroupDataByTplid: function (tplid, cb_ok, cb_err) {
        var query = new AV.Query("t_tpl_group");
        query.equalTo("f_belong_tpl", tplid);
        query.find({
            success: function (results) {
                cb_ok(results);
            }, error: function (results, error) {
                cb_err(error);
            }
        });
    },
    // 根据tid, 查询template作品数据, pages数据
    getTemplateDataById: function (tid, success, error) {
        fmacapi.tpl_get_tpl(tid, function (templateObject) {
            //fmacapi.tpl_get_data
            fmacapi.tpl_get_data(tid, function (pagesObject) {
                success(templateObject, pagesObject);
            }, function () {
                CopyWork.cld_get_tpl_data_local(tid, function (pagesObject) {
                    success(templateObject, pagesObject);
                }, function (e) {
                    error(e);
                });
            });

        }, function (e) {
            error(e);
            console.log(e);
        });
    },
    createBlankGroup: function (parent, groupName) {
        fmaobj.tplgroup = {
            create: function (a) {
                var h = new (fmacloud.Object.extend("t_tpl_group"));
                return h
            }
        };
        var group = fmaobj.tplgroup.create();
        group.set("f_object_id", fmacapi_create_uid(""));
        group.set("f_name", groupName);
        group.set("f_collapse", false);
        group.set("show_page_num", true);
        group.set("parent", parent);
        group.set("f_type", 2);
        group.set("items", []);
        return group;
    },
    cld_get_tpl_data_local: function (tplId, callback_ok, callback_err) {
        var stdout = { "log": "" };
        if (!tplId) {
            callback_err("作品id为空!");
            return;
        }
        try {
            function _execute_array_task(objArray, index, cb_task, cb_ok, cb_err) {
                if (objArray) {
                    cb_task(objArray[index], function () {
                        if (index < objArray.length - 1) {
                            _execute_array_task(objArray, index + 1, cb_task, cb_ok, cb_err);
                        } else {
                            cb_ok(objArray);
                        }
                    }, cb_err);
                } else {
                    console.log(tplId + " its pages data is destroyed ");
                    cb_err(tplId + " its pages data is destroyed!");
                }
            }

            function cb_ok(tpl_data) {
                stdout.data = tpl_data;
                callback_ok(tpl_data);
            }

            function cb_err(err) {
                callback_err(err.message);
            }

            function _fetch_object(objArray, index, cb_ok, cb_err) {
                _execute_array_task(objArray, index, function (obj, cb_task_ok, cb_task_err) {
                    obj.fetch().then(cb_task_ok, cb_task_err);
                }, function (obj) {
                    cb_ok(obj);
                }, cb_err);
            }

            var data_obj = AV.Object.extend("pages_data");
            var query = new AV.Query(data_obj);

            query.equalTo("key_id", tplId);
            query.descending("createdAt");
            query.find().then(function (dsObj) {

                if (dsObj.length > 0) {

                    var dObj = dsObj[0];
                    var pages = dObj.get("pages");

                    //获取每个页对象数据
                    _fetch_object(pages, 0, function (pages) {
                        _execute_array_task(pages, 0, function (page, cb_ok, cb_err) {
                            var items = page.get("item_object");
                            _fetch_object(items, 0, cb_ok, cb_err);
                        }, function () {
                            var page = dObj.get("pages")[0];
                            if (!!page.get("item_object")[0].get("item_id")) {
                                cb_ok(dObj);
                            } else {
                                cb_err(new AV.Error(3201, "元素数据可能已受到损坏。"));
                            }
                        }, cb_err);
                    }, cb_err);
                } else {
                    cb_err(new AV.Error(3202, "指定ID的数据不存在。"));
                }
            }, function (error) {
                cb_err(error);
            });
        } catch (e) {
            console.log("ME作品数据出错！" + e.message);
            callback_err(tplId + "作品数据出错！" + e.message);
        }
    },
    /**
     * 树转化成二维结构
     * @param treeTplData
     */
    tree2TableTplData: function (parentId, workData, tplID) {
        var items = workData.get("items");
        var ret = CopyWork.tree2Table(parentId, items, tplID);
        workData.set("pages", ret.pages);

        workData.set("group", ret.groups);
        workData.unset("items");
        workData.unset("parent")
        workData.unset("f_object_id");
        workData.unset("f_parent");
        return workData;
    },
    tree2Table: function (parentId, items, tplID) {
        var groups = [];
        var pages = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];

            item.set("f_order_num", i);
            item.set("f_belong_tpl", tplID);
            item.unset("parent");
            var children = item.get("items");
            if (item.get("f_type") == 2) {
                //group
                item.set("f_parent", parentId);
                item.unset("items");
                groups.push(item);
            } else {
                //page
                item.set("f_tpl_group_id", parentId);
                item.set("f_type", 1);
                pages.push(item)
            }

            if (children && children.length > 0) {
                var id = item.get("f_object_id");
                var childRet = CopyWork.tree2Table(id, children, tplID);
                if (childRet.groups.length > 0) {
                    groups = groups.concat(childRet.groups);
                }
                if (childRet.pages.length > 0) {
                    pages = pages.concat(childRet.pages)
                }

            }
        }
        return { groups: groups, pages: pages }
    },
    /**
    * 二维结构转化成树
    * @param tableTplData
    */
    table2Tree: function (tableTplData, tid) {
        var groups = tableTplData.get("group");
        groups.forEach((group) => {
            group.set("items", [])
        })
        var groupLen = groups.length;
        var pages = tableTplData.get("pages");
        //对所有页放入组中
        pages.forEach((page) => {
            var parentID = page.get("f_tpl_group_id");
            var order = page.get("f_order_num");
            for (var i = 0; i < groupLen; i++) {
                var group = groups[i];
                var groupId = group.get("f_object_id");
                if (parentID == groupId) {
                    var child = group.get("items");
                    page.set("parent", group)
                    child = child || [];
                    child[order] = page;
                    group.set("items", child);
                    break
                }
            }
        })

        //所有组形成树
        groups.forEach((group) => {
            var id = group.get("f_object_id");
            var children = getChildren(id);
            children.forEach((child) => {
                var order = child.get("f_order_num");
                var oldChild = group.get("items");
                oldChild = oldChild || [];
                oldChild[order] = child;
                child.set("parent", group);
                group.set("items", oldChild);
            })
        });
        var topLayer = tid;
        //var topLayer = groups[0].get("f_parent");
        groups = groups.filter((group) => {
            return group.get("f_parent") == topLayer
        })
        groups.forEach((group) => {
            group.set("parent", tableTplData);
        })
        groups.sort((a, b) => {
            return a.get("f_order_num") - b.get("f_order_num");
        })
        tableTplData.set("items", groups);
        tableTplData.set("pages", []);
        tableTplData.set("group", []);
        return tableTplData;
        function getChildren(parentID) {
            var ret = [];
            groups.forEach((group) => {
                if (group.get("f_parent") == parentID) {
                    ret.push(group);
                }
            });
            return ret
        }
    },
    /**
    * 复制页内跳转事件
    * @param pageObj
    * @param pageUidMap 新旧pageUID对应关系
    */
    copyPageToEvents: function (pageObj, pageUidMap) {
        var elementArr = pageObj.get("item_object");
        if (!elementArr) return;
        elementArr.forEach((el) => {

            let url = CopyWork.getHref(el.attributes);
            if (typeof url == "undefined" || url.indexOf("pageto:") == -1) {
                //不包含pageto事件
                return;
            }
            let events = CopyWork.url2Events(url);
            events.forEach(event => {
                //遍历所有事件，对页内跳转事件更新pageuid
                if (event.action == "in") {
                    var id = event.value.substr("pageto:".length);
                    if (pageUidMap[id]) {
                        event.value = "pageto:" + pageUidMap[id]
                    }
                }
            });
            if (events.length <= 0) {
                return;
            }
            //反序列化
            let newUrl = CopyWork.events2Url(events);
            var type = el.get("item_type")
            if (type == ElementTypes.shake) {
                el.set("animate_end_act", newUrl)
            } else {
                el.set("item_href", newUrl)
            }
        })
    },
    /** 上传tpl,tpldata等信息作为json文件上传
    tpl_id，作品id用于文件名称
    **/
    uploadJsonFile: function (tpl, tplData, ok, err) {
        var data = {};
        data.tplObj = CopyWork.avosTpl2Json(tpl);
        data.tplData = CopyWork.avosTplData2Json(tplData);
        var tpl_id = data.tplObj.tpl_id || "ME微杂志作品json数据";
        var jsonInfo = data || "";
        var textInfo = JSON.stringify(jsonInfo);
        var b64 = Base64.encode(textInfo);
        var file = new AV.File(tpl_id + '.json', { base64: b64 });
        file.save().then(ok, err);
    },
    avosTpl2Json: function (tpl) {
        return tpl.toJSON();
    },
    avosTplData2Json: function (tplData) {
        var items = tplData.get("items");
        tplData.unset("items");
        tplData.unset("group");
        tplData.unset("pages");
        var objTplData = tplData.toJSON();
        objTplData.groups = items.map(convertNode2Json);
        return objTplData;
        function convertNode2Json(item) {
            var ret;
            var children = item.get("items");
            item.unset("parent");
            if (children) {
                ///group
                item.unset("items");
                var groupObj = item.toJSON();
                var childrenObj = children.map((child) => {
                    return convertNode2Json(child);
                })
                groupObj.pages = childrenObj;
                ret = groupObj
            } else {
                //page
                var pageObj = item.toJSON();
                var elements = item.get("item_object");
                var elementsObj = [];
                for (var j = 0; j < elements.length; j++) {
                    var element = elements[j];
                    elementsObj[j] = element.toJSON()
                }
                pageObj.item_object = elementsObj;
                ret = pageObj
            }
            return ret
        }

    },
    decomposePicUrl: function (name, url) {
        ///分解链接
        // return [{type:show_el,name:...,value;[1,2]},...]
        let eventArr = url.split("|");
        var hrefMap = [];
        eventArr.forEach((url) => {
            var type = CopyWork.getLinkType(url);
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
                var id = CopyWork.getDisplayObjId(url);
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
    },
    composeEventItem: function (obj) {
        var retarr = [];
        let item = obj;
        if (item.type == "show_el" || item.type == "hide_el") {
            let itemVal = item.value;
            var stdItem = itemVal.map((id) => {
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
};
//     uuid.js
//
//     Copyright (c) 2010-2012 Robert Kieffer
//     MIT License - http://opensource.org/licenses/mit-license.php

/*global window, require, define */
(function (_window) {
    'use strict';

    // Unique ID creation requires a high quality random # generator.  We feature
    // detect to determine the best RNG source, normalizing to a function that
    // returns 128-bits of randomness, since that's what's usually required
    var _rng, _mathRNG, _nodeRNG, _whatwgRNG, _previousRoot;

    function setupBrowser() {
        // Allow for MSIE11 msCrypto
        var _crypto = _window.crypto || _window.msCrypto;

        if (!_rng && _crypto && _crypto.getRandomValues) {
            // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
            //
            // Moderately fast, high quality
            try {
                var _rnds8 = new Uint8Array(16);
                _whatwgRNG = _rng = function whatwgRNG() {
                    _crypto.getRandomValues(_rnds8);
                    return _rnds8;
                };
                _rng();
            } catch (e) { }
        }

        if (!_rng) {
            // Math.random()-based (RNG)
            //
            // If all else fails, use Math.random().  It's fast, but is of unspecified
            // quality.
            var _rnds = new Array(16);
            _mathRNG = _rng = function () {
                for (var i = 0, r; i < 16; i++) {
                    if ((i & 0x03) === 0) { r = Math.random() * 0x100000000; }
                    _rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
                }

                return _rnds;
            };
            if ('undefined' !== typeof console && console.warn) {
                console.warn("[SECURITY] node-uuid: crypto not usable, falling back to insecure Math.random()");
            }
        }
    }

    function setupNode() {
        // Node.js crypto-based RNG - http://nodejs.org/docs/v0.6.2/api/crypto.html
        //
        // Moderately fast, high quality
        if ('function' === typeof require) {
            try {
                var _rb = require('crypto').randomBytes;
                _nodeRNG = _rng = _rb && function () { return _rb(16); };
                _rng();
            } catch (e) { }
        }
    }

    if (_window) {
        setupBrowser();
    } else {
        setupNode();
    }

    // Buffer class to use
    var BufferClass = ('function' === typeof Buffer) ? Buffer : Array;

    // Maps for number <-> hex string conversion
    var _byteToHex = [];
    var _hexToByte = {};
    for (var i = 0; i < 256; i++) {
        _byteToHex[i] = (i + 0x100).toString(16).substr(1);
        _hexToByte[_byteToHex[i]] = i;
    }

    // **`parse()` - Parse a UUID into it's component bytes**
    function parse(s, buf, offset) {
        var i = (buf && offset) || 0, ii = 0;

        buf = buf || [];
        s.toLowerCase().replace(/[0-9a-f]{2}/g, function (oct) {
            if (ii < 16) { // Don't overflow!
                buf[i + ii++] = _hexToByte[oct];
            }
        });

        // Zero out remaining bytes if string was short
        while (ii < 16) {
            buf[i + ii++] = 0;
        }

        return buf;
    }

    // **`unparse()` - Convert UUID byte array (ala parse()) into a string**
    function unparse(buf, offset) {
        var i = offset || 0, bth = _byteToHex;
        return bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]];
    }

    // **`v1()` - Generate time-based UUID**
    //
    // Inspired by https://github.com/LiosK/UUID.js
    // and http://docs.python.org/library/uuid.html

    // random #'s we need to init node and clockseq
    var _seedBytes = _rng();

    // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
    var _nodeId = [
        _seedBytes[0] | 0x01,
        _seedBytes[1], _seedBytes[2], _seedBytes[3], _seedBytes[4], _seedBytes[5]
    ];

    // Per 4.2.2, randomize (14 bit) clockseq
    var _clockseq = (_seedBytes[6] << 8 | _seedBytes[7]) & 0x3fff;

    // Previous uuid creation time
    var _lastMSecs = 0, _lastNSecs = 0;

    // See https://github.com/broofa/node-uuid for API details
    function v1(options, buf, offset) {
        var i = buf && offset || 0;
        var b = buf || [];

        options = options || {};

        var clockseq = (options.clockseq != null) ? options.clockseq : _clockseq;

        // UUID timestamps are 100 nano-second units since the Gregorian epoch,
        // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
        // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
        // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
        var msecs = (options.msecs != null) ? options.msecs : new Date().getTime();

        // Per 4.2.1.2, use count of uuid's generated during the current clock
        // cycle to simulate higher resolution clock
        var nsecs = (options.nsecs != null) ? options.nsecs : _lastNSecs + 1;

        // Time since last uuid creation (in msecs)
        var dt = (msecs - _lastMSecs) + (nsecs - _lastNSecs) / 10000;

        // Per 4.2.1.2, Bump clockseq on clock regression
        if (dt < 0 && options.clockseq == null) {
            clockseq = clockseq + 1 & 0x3fff;
        }

        // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
        // time interval
        if ((dt < 0 || msecs > _lastMSecs) && options.nsecs == null) {
            nsecs = 0;
        }

        // Per 4.2.1.2 Throw error if too many uuids are requested
        if (nsecs >= 10000) {
            throw new Error('uuid.v1(): Can\'t create more than 10M uuids/sec');
        }

        _lastMSecs = msecs;
        _lastNSecs = nsecs;
        _clockseq = clockseq;

        // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
        msecs += 12219292800000;

        // `time_low`
        var tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
        b[i++] = tl >>> 24 & 0xff;
        b[i++] = tl >>> 16 & 0xff;
        b[i++] = tl >>> 8 & 0xff;
        b[i++] = tl & 0xff;

        // `time_mid`
        var tmh = (msecs / 0x100000000 * 10000) & 0xfffffff;
        b[i++] = tmh >>> 8 & 0xff;
        b[i++] = tmh & 0xff;

        // `time_high_and_version`
        b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
        b[i++] = tmh >>> 16 & 0xff;

        // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
        b[i++] = clockseq >>> 8 | 0x80;

        // `clock_seq_low`
        b[i++] = clockseq & 0xff;

        // `node`
        var node = options.node || _nodeId;
        for (var n = 0; n < 6; n++) {
            b[i + n] = node[n];
        }

        return buf ? buf : unparse(b);
    }

    // **`v4()` - Generate random UUID**

    // See https://github.com/broofa/node-uuid for API details
    function v4(options, buf, offset) {
        // Deprecated - 'format' argument, as supported in v1.2
        var i = buf && offset || 0;

        if (typeof (options) === 'string') {
            buf = (options === 'binary') ? new BufferClass(16) : null;
            options = null;
        }
        options = options || {};

        var rnds = options.random || (options.rng || _rng)();

        // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
        rnds[6] = (rnds[6] & 0x0f) | 0x40;
        rnds[8] = (rnds[8] & 0x3f) | 0x80;

        // Copy bytes to buffer, if provided
        if (buf) {
            for (var ii = 0; ii < 16; ii++) {
                buf[i + ii] = rnds[ii];
            }
        }

        return buf || unparse(rnds);
    }

    // Export public API
    var uuid = v4;
    uuid.v1 = v1;
    uuid.v4 = v4;
    uuid.parse = parse;
    uuid.unparse = unparse;
    uuid.BufferClass = BufferClass;
    uuid._rng = _rng;
    uuid._mathRNG = _mathRNG;
    uuid._nodeRNG = _nodeRNG;
    uuid._whatwgRNG = _whatwgRNG;

    if (('undefined' !== typeof module) && module.exports) {
        // Publish as node.js module
        module.exports = uuid;
    } else if (typeof define === 'function' && define.amd) {
        // Publish as AMD module
        define(function () { return uuid; });


    } else {
        // Publish as global (in browsers)
        _previousRoot = _window.uuid;

        // **`noConflict()` - (browser only) to reset global 'uuid' var**
        uuid.noConflict = function () {
            _window.uuid = _previousRoot;
            return uuid;
        };

        _window.uuid = uuid;
    }
})('undefined' !== typeof window ? window : null);
CopyWork.copyWork("15755512631a6eaa")
// CopyWork.copyWork("15703829b6a0758f")
