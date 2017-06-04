/*
 * Created by 95 on 2015/9/17.
 */
var isSaving = false;
var effectImgBase64 = null; //tpl的 base64效果图
var PageStore = null;
var uuid = require('uuid');
var isReEdit = false; //是否是二次编辑
var magazineRender;
var isCreateEffectImg = false;

var Base = require('./Base');
//require("./base64.min.js");
var GroupInit = require("../components/Common/GroupInit");
var urlconfig = require("../config/serverurl.js");
var MakeWebAPIUtils = require("./MakeWebAPIUtils");
var WorkDataUtil = {

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

    cloneTplData: function (t) {
        var tplData;
        if (!!t) {
            tplData = t.clone();
            tplData.set("pages", WorkDataUtil.clonePages(tplData.get("pages")));
        }

        return tplData;
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

        var GlobalFunc = require("../components/Common/GlobalFunc");
        var cloneNode;

        if (GlobalFunc.isGroup(node)) {
            //copy group
            cloneNode = WorkDataUtil.cloneGroup(node, cloneID);
            //copy group children
            var children = node.get("items");
            var cloneChildren = [];
            if (children) {
                for (var i = 0; i < children.length; i++) {
                    var child = children[i];
                    // add by konghuachao-2017-4-24-"部分作品某一页发生错误,代码停止执行";
                    if(child){
                        cloneChildren.push(WorkDataUtil.cloneNode(child, cloneNode, cloneID));
                    }
                    //cloneChildren.push(WorkDataUtil.cloneNode(child, cloneNode, cloneID));
                }
            }

            cloneNode.set("items", cloneChildren);
        } else {
            //copy page
            cloneNode = WorkDataUtil.clonePages([node], cloneID)[0]
        }
        if (typeof parent != "undefined") {
            cloneNode.set("parent", parent)
        }
        if (cloneID) {
            cloneNode.id = node.id
        }
        return cloneNode

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
                result[i].set("item_object", WorkDataUtil.cloneElements(result[i].get("item_object"), cloneID));
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

    /*
     * 过滤 生成 时的 tpl-data 对象
     */
    filterTplData: function () {
        var MagazineStore = require('../stores/MagazineStore');
        var magazineData = MagazineStore.getTplData();
        magazineData.set("key_id", MagazineStore.getTpl().get("tpl_id"));
        /* 修改过滤保存时的 items 数据 */
        WorkDataUtil.filterItems(magazineData);
        return magazineData;
    },
    /**
     * 树转化成二维结构
     * @param treeTplData
     */
    tree2TableTplData: function (parentId, workData, tplID) {
        var items = workData.get("items");
        var ret = WorkDataUtil.tree2Table(parentId, items, tplID);
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
                var childRet = WorkDataUtil.tree2Table(id, children, tplID);
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
    table2TreeNetGroup: function (tableTplData, tid) {
        throw "error"
        var groups = tableTplData.get("group");
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
                    child = child || [];
                    child[order] = page;
                    group.set("items", child);
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
                group.set("items", oldChild);
            })
        });
        //var topLayer = groups[0].get("f_parent");
        var topLayer = tid;
        groups = groups.filter((group) => {
            return group.get("f_parent") == topLayer
        })
        tableTplData.set("group", groups);

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
    /*
     * 过滤 pages 生成效果图
     */
    filterPagesEffectImg: function (tplDataTable, callBack) {

        if (!!isCreateEffectImg) {
            if (callBack) callBack();
            return;
        }
        isCreateEffectImg = true;
        var MagazineStore = require('../stores/MagazineStore');

        var _tpl = WorkDataUtil.getJsonTpl(),
            _tplData = WorkDataUtil.getJsonTplData(tplDataTable.get("pages")),
            _pages = _tplData.pages,
            successNum = 0;
        _pages && _pages.forEach((page) => {
            page.page_height = 1008
        })
        _tpl.page_value = _pages;
        magazineRender = new ms.MagazinePageRenderer(_tpl);

        function successFunc() {
            isCreateEffectImg = false;
            if (callBack) callBack();
            //生成缩略图之后释放内存
            if (magazineRender) {
                magazineRender.destroy();
                magazineRender = undefined;
            }
        }

        for (var i = 0; i < _pages.length; i++) {
            var edited = _pages[i].edited;
            if (!!edited) {
                WorkDataUtil.createPagesEffectImg(tplDataTable, i, function (data, pageObj) {
                    var _base64 = data;
                    if (_base64) {
                        WorkDataUtil.uploadEffectImg(_base64, function (file, pageObj) {
                            var _url = file.url();
                            //console.log("effect_img",_url,pageObj.get("page_uid"));
                            pageObj.set("page_effect_img", _url);
                            pageObj.unset("edited");
                            successNum++;
                            if (successNum == _pages.length) successFunc();
                        }, function (err) {
                            console.log(err);
                            successNum++;
                            if (successNum == _pages.length) successFunc();
                        }, pageObj);
                    } else {
                        successNum++;
                        if (successNum == _pages.length) successFunc();
                    }
                });
            } else {
                successNum++;
                if (successNum == _pages.length) successFunc();
            }
        }
    },
    resetTimelineFrame: function (el) {
        //元素的位置等调整成最后一帧
        var attributes = el.attributes
        var isTimeLineOn = !!attributes["item_animation_script"];
        if (isTimeLineOn) {
            var timeObj = JSON.parse(attributes['item_animation_frame']);
            var timeArr = []
            for (var time in timeObj) {
                timeArr.push(time);
            }
            timeArr.sort(function (a, b) {
                return a.time - b.time;
            });
            var lastFrame = timeObj[timeArr[timeArr.length - 1]]
            var GlobalFunc = require("../components/Common/GlobalFunc")
            GlobalFunc.resetTimelineFrame(el, lastFrame);
        }

    },
    filterItems: function (tplData) {
        var _pages = tplData.get("pages");
        var ilen = _pages.length;
        for (var i = 0; i < ilen; i++) {
            var _itemObj = _pages[i].get("item_object"), jlen = _itemObj.length;
            for (let j = 0; j < jlen; j++) {
                this.resetTimelineFrame(_itemObj[j])
            }

            for (var j = 0; j < jlen; j++) {
                if (_itemObj[j].get("item_type") == 1 || _itemObj[j].get("item_type") == 3 || _itemObj[j].get("item_type") == 10 || _itemObj[j].get("item_type") == 17 || _itemObj[j].get("item_type") == 18) {
                    _itemObj[j].set("item_width", _itemObj[j].get("item_width") * _itemObj[j].get("x_scale"));
                    _itemObj[j].set("item_height", _itemObj[j].get("item_height") * _itemObj[j].get("y_scale"));
                    _itemObj[j].set("x_scale", 1);
                    _itemObj[j].set("y_scale", 1);
                }
                if (_itemObj[j].get("item_type") == 10) {
                    _itemObj[j].set("item_width", 640);
                    _itemObj[j].set("item_height", 1008);
                    _itemObj[j].set("item_left", 0);
                    _itemObj[j].set("item_top", 0);
                }
            }
            WorkDataUtil.filterItemsType_18(_itemObj);
            WorkDataUtil.filterItemsImgUrl(_itemObj);
            //WorkDataUtil.resetLayer(_itemObj);
            WorkDataUtil.resetPageLayer(_itemObj);
            //_itemObj.sort(WorkDataUtil.elementsLayerSort);
        }
    },

    filterItemsType_18: function (items) {
        var _itemObj = items, len = _itemObj.length;
        var GlobalFunc = require("../components/Common/GlobalFunc.js");
        for (var j = 0; j < len; j++) {
            if ((_itemObj[j].get("item_type") == 1 || _itemObj[j].get("item_type") == 18) && !!_itemObj[j].get("group_id") && GlobalFunc.ifPicFrame(_itemObj[j].get("group_id"), _itemObj)) {
                for (var l = 0; l < len; l++) {
                    if (_itemObj[l].get("item_type") == 17 && _itemObj[l].get("group_id") == _itemObj[j].get("group_id")) {
                        _itemObj[l].set("item_width", _itemObj[j].get("item_width"));
                        _itemObj[l].set("item_height", _itemObj[j].get("item_height"));
                        _itemObj[l].set("item_top", _itemObj[l].get("item_top") + _itemObj[j].get("item_top"));
                        _itemObj[l].set("item_left", _itemObj[l].get("item_left") + _itemObj[j].get("item_left"));
                    }
                }
                _itemObj[j].set("item_type", 1);
                _itemObj[j].set("item_top", 0);
                _itemObj[j].set("item_left", 0);
            }
        }
    },

    filterItemsImgUrl: function (items) {
        var _itemObj = items, len = _itemObj.length;
        for (var i = 0; i < len; i++) {
            var itemType = _itemObj[i].get("item_type"), itemValue = _itemObj[i].get("item_val"),
                itemWidth = parseInt(_itemObj[i].get("item_width")), itemHeight = parseInt(_itemObj[i].get("item_height"));
            if (!itemValue) {
                continue;
            }
            if (itemType == 1 || itemType == 3 || itemType == 18) {
                itemWidth = itemWidth > 640 ? 640 : itemWidth;
                itemHeight = itemHeight;
                var suffix = "?imageView2/2/w/" + itemWidth;
                if (itemValue.split('?').length > 1) {
                    if (itemValue.split('?')[0].indexOf("gif") > 0) {
                        //gif
                        if (itemValue.split('?')[1].indexOf("/crop/") > -1) {
                            //已经裁切过的gif
                            var thumbIndex = itemValue.split('?')[1].indexOf("/thumbnail/")
                            if (thumbIndex > -1) {
                                //已经裁切，已经压缩过的gif
                                var oriSuffix = itemValue.split('?')[1];
                                var cropSuffix = oriSuffix.substring(0, thumbIndex)
                                suffix = `?${cropSuffix}/thumbnail/${itemWidth}x`
                            } else {
                                //已经裁切，但是没有压缩的gif
                                suffix = `?${itemValue.split('?')[1]}/thumbnail/${itemWidth}x`
                            }
                        } else {
                            suffix = suffix + "/format/gif";
                        }

                    }
                    _itemObj[i].set("item_val", itemValue.split('?')[0] + suffix);
                    //console.log(itemValue.split('?')[0] + suffix);
                } else {
                    //图片没有压缩参数的后缀
                    if (itemValue.indexOf("gif") > 0) {
                        suffix = suffix + "/format/gif";
                    }
                    _itemObj[i].set("item_val", itemValue + suffix);
                    //console.log(itemValue + suffix);
                }
            }
        }
    },

    elementsLayerSort: function (a, b) {
        return a.attributes.item_layer - b.attributes.item_layer
    },
    initTplWithObj: function (templateObject, user) {
        templateObject.set("effect_img", templateObject.get("effect_img"));
        templateObject.set("tiny_img", templateObject.get("tiny_img"));
        templateObject.set("brief", templateObject.get("brief") == "/" ? "我刚刚制作了一份H5微场景，快来看看！" : templateObject.get("brief")); //作品简介 , 在发布时会更改
        templateObject.set("tpl_class", "0"); //模板类型（0:个人模板,1:企业模板） 在发布时会更改
        templateObject.set("tpl_type", "10"); //默认为10  在保存时会更改
        templateObject.set("tpl_privacy", templateObject.get("tpl_privacy") || "private"); //tpl_privacy 是否公开，public|private
        templateObject.set("data_site", "1"); // 1: PC 作品  0: APP 作品
        templateObject.set("read_int", 0); // 阅读数置为0
        templateObject.set("read_pv", 0); // 阅读数置为0
        templateObject.set("using_count", 0);// 被作为模版使用的次数置为0
        templateObject.set("share_int", 0);// 作品被分享次数置为0
        templateObject.set("store_count", 0);// 收藏数置为0
        templateObject.set("comment_int", 0);// 评论数置为0
        templateObject.set("like_int", 0);// 作品被赞数置为0

        templateObject.set("tpl_width", 640);
        templateObject.set("tpl_height", 1008);
        templateObject.set("approved", 0); //不上架
        templateObject.set("author", user.objectId);
        templateObject.set("author_img", user.user_pic);
        templateObject.set("author_name", user.user_nick);
        templateObject.set("author_vip_level", user.vip_level);
        PageStore = require('../stores/PageStore');
        templateObject.set("render_version", PageStore.getMaxRenderVersion()); //render_version 渲染器版本号
        return templateObject;
    },
    /*
     * 过滤 生成 时的tpl对象
     */
    filterTpl: function () {
        var MagazineStore = require('../stores/MagazineStore');
        var templateObject = MagazineStore.getTpl();
        var GlobalFunc = require('../components/Common/GlobalFunc');
        var user = GlobalFunc.getUserObj();
        templateObject.set("effect_img", templateObject.get("effect_img"));
        templateObject.set("tiny_img", templateObject.get("tiny_img"));
        templateObject.set("brief", templateObject.get("brief") == "/" ? "我刚刚使用ME发布了个人作品，快来看看吧！" : templateObject.get("brief")); //作品简介 , 在发布时会更改
        templateObject.set("tpl_type", "10"); //默认为10  在保存时会更改
        templateObject.set("tpl_sign", 2); //ME刊作品
        templateObject.set("name", templateObject.get("name") == "noname" || !templateObject.get("name") ? GlobalFunc.getUserObj().user_nick : templateObject.get("name")); //作品名 , 在发布时会更改
        templateObject.set("tpl_privacy", templateObject.get("tpl_privacy") || "private"); //tpl_privacy 是否公开，public|private
        templateObject.set("data_site", "1"); // 1: PC 作品  0: APP 作品

        templateObject.set("read_int", isReEdit ? templateObject.get("read_int") : 0); // 阅读数置为0
        templateObject.set("read_pv", isReEdit ? templateObject.get("read_pv") : 0); // 阅读数置为0
        templateObject.set("using_count", isReEdit ? templateObject.get("using_count") : 0);// 被作为模版使用的次数置为0
        templateObject.set("share_int", isReEdit ? templateObject.get("share_int") : 0);// 作品被分享次数置为0
        templateObject.set("store_count", isReEdit ? templateObject.get("store_count") : 0);// 收藏数置为0
        templateObject.set("comment_int", isReEdit ? templateObject.get("comment_int") : 0);// 评论数置为0
        templateObject.set("like_int", isReEdit ? templateObject.get("like_int") : 0);// 作品被赞数置为0
        typeof templateObject.get("page_style") == "undefined" && templateObject.set("page_style", 1); //页码样式
        typeof templateObject.get("list_style") == "undefined" && templateObject.set("list_style", 1); //目录样式
        templateObject.set("tpl_width", 640);
        templateObject.set("tpl_height", 1008);
        templateObject.set("approved", isReEdit ? templateObject.get("approved") : 0); //不上架
        templateObject.set("author", user.objectId);
        templateObject.set("author_img", user.user_pic);
        templateObject.set("author_name", user.user_nick);
        templateObject.set("author_vip_level", user.vip_level);
        templateObject.set("page_int", MagazineStore.getAllPagesRef().length);
        var PageStore = require('../stores/PageStore');
        templateObject.set("render_version", PageStore.getMaxRenderVersion()); //render_version 渲染器版本号
        templateObject.set("tpl_delete", 0); //ME刊作品
        return templateObject;
    },
    /** 上传tpl,tpldata等信息作为json文件上传
     tpl_id，作品id用于文件名称
     **/

    /*静态json文件
     *-konghuachao--2017-05-10-satrt-
     */
    uploadJsonFile: function (tpl, tplData, ok, err) {
        var data = {};
        data.tplObj = WorkDataUtil.avosTpl2Json(tpl);
        data.tplData = WorkDataUtil.avosTplData2Json(tplData);
        var tpl_id = data.tplObj.tpl_id || "H5微场景作品json数据";
        var jsonInfo = data || "";
        var textInfo = JSON.stringify(jsonInfo);
        var b64 = Base64.encode(textInfo);
        var file = new AV.File(tpl_id + '.json', { base64: b64 });
        file.save().then(ok, err);
    },
    /*静态json文件
     *-konghuachao--2017-05-10-end-
     */

    //注释原有代码-20170515-konghuachao
    //uploadJsonFile: function (tpl, tplData,ok, err) {
    //    debugger;
    //    var file_api=require("./file.js");
    //    var MakeWebAPIUtils=require("./MakeWebAPIUtils.js");
    //    var data = {};
    //    data.tplObj = this.getJsonTpl();
    //    fmacapi.tpl_get_data(data.tplObj.tpl_id, function (tplDataResult) {
    //        success(tplDataResult);
    //    }, function (errorMsg) {
    //        MakeWebAPIUtils.cld_get_tpl_data_local(data.tplObj.tpl_id, function (tplDataResult) {
    //            success(tplDataResult);
    //        }, function () {
    //            isSaving = false;
    //            cb_err();
    //        });
    //        console.log(errorMsg);
    //    });
    //    var success = function (tplDataResult) {
    //        debugger;
    //        data.tplData = MakeWebAPIUtils.convertTplDataToJson(tplDataResult);
    //        var tpl_id = data.tplObj.tpl_id || "H5微场景作品json数据";
    //        var jsonInfo = data || "";
    //        var textInfo = JSON.stringify(jsonInfo);
    //        var b64 = Base64.encode(textInfo);
    //        var file = new AV.File(tpl_id + '.json', {base64: b64})
    //        file.save().then(cb_ok, cb_err);
    //    };
    //},
    /**
     * 增加组缩略图
     * @param treeData
     * @returns {*}
     */
    setGroupThumb: function (treeData) {
        return traversalTree(treeData.get("items"));
        function traversalTree(items) {
            items.forEach((item) => {
                var type = item.get("f_type");
                if (type == 2) {
                    //增加组缩略图
                    var children = item.get("items");
                    for (var i = 0; i < children.length; i++) {
                        var child = children[i];
                        if (typeof child.get("f_type") == "undefined" || child.get("f_type") == 1) {
                            item.set("f_cover", child.get("page_effect_img"));
                            break;
                        }
                    }
                    //遍历子组
                    traversalTree(item.get("items"))
                }
            })
        }
    },
    saveRawWork: function (templateObject, tplData, success, error) {

            var MakeWebAPIUtils = require('../utils/MakeWebAPIUtils');
            fmacapi.tpl_save_all(templateObject, tplData, null, function (tplResult) {
                var tplid = tplResult.get("tpl_id");
                uploadJsonFile(tplResult, function (file) {
                    var temp = file.url().split("/");
                    var fileId = temp[temp.length - 1].split(".")[0];
                    var result = {};
                    result.url_type = "leancloud";
                    result.postfix = ".json";
                    result.key = fileId;
                    var jsonUrl = JSON.stringify(result);
                    fmacapi.update_tplobj(tplid, { json_url: jsonUrl }, function (tplobj) {
                        isSaving = false;
                        WorkDataUtil.debugLog(tplobj, tplData, "after save");
                        success(tplobj);

                    }, function (err) {
                        error(err);
                        isSaving = false;
                    });
                }, function (msg) {
                    error(msg);
                    isSaving = false;
                });
            }, function (err) {
                error(err);
                isSaving = false;
            });

            function uploadJsonFile(tpl, cb_ok, cb_err) {
                var MakeWebAPIUtils = require('../utils/MakeWebAPIUtils');
                var data = {};
                data.tplObj = tpl.toJSON();
                fmacapi.tpl_get_data(data.tplObj.tpl_id, function (tplDataResult) {
                    covertTplData(tplDataResult);
                }, function (errorMsg) {

                    MakeWebAPIUtils.cld_get_tpl_data_local(data.tplObj.tpl_id, function (tplDataResult) {
                        covertTplData(tplDataResult);
                    }, function () {
                        isSaving = false;
                        cb_err();
                    });
                    console.log(errorMsg);
                });
                var covertTplData = function (tplDataResult) {

                    data.tplData = MakeWebAPIUtils.convertTplDataToJson(tplDataResult);
                    var tpl_id = data.tplObj.tpl_id || "H5微场景作品json数据";
                    var jsonInfo = data || "";
                    var textInfo = JSON.stringify(jsonInfo);
                    var b64 = Base64.encode(textInfo);
                    var file = new AV.File(tpl_id + '.json', { base64: b64 });
                    file.save().then(cb_ok, cb_err);
                };
            }
        },

    /*
     * 添加 option
     * 此option为tpl对象的其它属性的  key->value 对
     */
    saveTpl: function (saveType, success, error, tpl_option) {
            if (!!isCreateEffectImg) {
                error("正在生成缩略图");
                return;
            }
            PageStore = require('../stores/PageStore');
            if (!!isSaving) {
                error("保存失败！");
                return;
            }
            isSaving = true;
            debugger;
            var templateObject = WorkDataUtil.filterTpl();
            var tplDataTable = WorkDataUtil.filterTplData();
            debugger;
            WorkDataUtil.debugLog(templateObject, tplDataTable, "before save");
            var tpl_options = tpl_option || {};

            //将传过来的tpl_domain赋值到模块属性
            // debugger;
            Base.setTplDomain(tpl_options.tpl_domain);

            /*
             * clone 用与生成 我的模板 tpl_type:10模板 11作品
             * 非clone 用与发布
             */
            var reviewStatus=templateObject.get("review_status")
            if ((templateObject.get("tpl_state")==2||tpl_option.tpl_state == 2)&&(!reviewStatus||reviewStatus==3||reviewStatus==7)) {
                tpl_option.review_status = 1
            }
            if (saveType == "clone")
                templateObject.set("tpl_type", 10);
            else
                templateObject.set("tpl_type", 11);

            for (var i in tpl_options)
                templateObject.set(i, tpl_options[i]);

            var _share_img = null;
            if (tpl_options.tpl_share_img != undefined) {
                _share_img =
                    tpl_options.tpl_share_img.indexOf("AV:") > -1
                        ? tpl_options.tpl_share_img.split("AV:")[1]
                        : tpl_options.tpl_share_img;
            } else {
                _share_img =
                    templateObject.get("effect_img").indexOf("AV:") > -1
                        ? templateObject.get("effect_img").split("AV:")[1]
                        : templateObject.get("effect_img");
            }

            templateObject.set("tpl_share_img", _share_img);
            templateObject.set("tpl_share_name", templateObject.get("name"));
            templateObject.set("tpl_share_exp", templateObject.get("brief"));
            WorkDataUtil.filterPagesEffectImg(tplDataTable, function () {

                var treeData = WorkDataUtil.table2Tree(tplDataTable, templateObject.get("tpl_id"));
                WorkDataUtil.setGroupThumb(treeData);
                tplDataTable = WorkDataUtil.tree2TableTplData(templateObject.get("tpl_id"), tplDataTable, templateObject.get("tpl_id"));
                //   clearDataBaseGroup(templateObject.get("tpl_id"), tplDataTable.get("group")).then(function () {
                //                     fmacloud.saveMEBook(templateObject, tplDataTable, null, function (data) {
                //                         uploadJsonFile(data)
                //                     })
                //                 }).catch(function (e) {
                //                     error(e)
                //                     isSaving = false;
                //                 });
                clearDataBaseGroup(templateObject.get("tpl_id"), tplDataTable.get("group")).then(function () {
                    fmacloud.saveMEBook(templateObject, tplDataTable, null, function (data) {
                        uploadJsonFile(data)
                    })
                }).catch(function (e) {
                    error(e)
                    isSaving = false;
                });

                // fmacloud.Cloud.rpc('tpl_save_all_expand', { "tplobj": templateObject.toJSON(), "tpldata": WorkDataUtil.netTplData2Json(tplDataTable) }, {
                //     success: function (data) {
                //         uploadJsonFile(data)
                //     },
                //     error: function (err) {
                //         clearDataBaseGroup(templateObject.get("tpl_id"), tplDataTable.get("group")).then(function () {
                //             fmacloud.saveMEBook(templateObject, tplDataTable, null, function (data) {
                //                 uploadJsonFile(data)
                //             })
                //         }).catch(function (e) {
                //             error(e)
                //             isSaving = false;
                //         });
                //     }
                // });
            }, function (err) {
                error(err);
                isSaving = false;
            })
            /**
             * 保存完后更新json文件
             */
            function uploadJsonFile(data) {
                var tplTableData = data.tpldata;
                if (data.group && data.group.length == 0) {
                    var group = GroupInit.createBlankGroup(tplTableData, "组");
                    var group_id = group.get("f_object_id");
                    tplTableData.get("pages").forEach((page, index) => {
                        page.set("f_tpl_group_id", group_id);
                        page.get("f_order_num", index);
                    });
                    tplTableData.set("group", [group])
                } else {
                    tplTableData.set("group", data.group)
                }
                var tpl = data.tplobj, tplid = tpl.get('tpl_id');
                var tplData = WorkDataUtil.table2Tree(tplTableData, tplid);

                WorkDataUtil.uploadJsonFile(tpl, WorkDataUtil.cloneNode(tplData, undefined, true), function (file) {
                    var temp = file.url().split("/");
                    var fileId = temp[temp.length - 1].split(".")[0];
                    var result = {};
                    result.url_type = "leancloud";
                    result.postfix = ".json";
                    result.key = fileId;
                    var jsonUrl = JSON.stringify(result);
                    fmacapi.update_tplobj(tplid, { json_url: jsonUrl }, function (tplobj) {
                        //保存完成
                        var GlobalFunc = require('../components/Common/GlobalFunc');
                        var user = GlobalFunc.getUserObj();
                        var obj = {
                            tpl_id: tplid,
                            user_name: user.user_nick,
                            user_id: user.objectId
                        }

                        if (tpl.get("tpl_state") == 2) {
                            obj.action = 2;
                            var reviewStatus = tpl.get("review_status")
                            if (reviewStatus != 2 &&reviewStatus != 4 && reviewStatus != 5 && reviewStatus != 6 ) {
                                var ori=GlobalFunc.getReviewText(reviewStatus);
                                obj.tpl_state = `发布,${ori}-1待审核`;
                                GlobalFunc.addRecord(obj, function () {
                                    $.get(urlconfig.api + "/v1/verify/sensitive?tid=" + tplid, function () { })
                                })
                            }else{
                                obj.tpl_state = "发布";
                                GlobalFunc.addRecord(obj)
                            }


                        } else {
                            obj.action = 1;
                            obj.tpl_state = "保存";
                            GlobalFunc.addRecord(obj)
                        }

                        var MakeActionCreators = require('../actions/MakeActionCreators');

                        if (isSaving == false) {
                            //已经通过其他方式取消
                            MakeActionCreators.cancelUpdate(tplData.id);
                            return
                        }
                        MakeActionCreators.saveUpdate(tplobj, tplData);
                        isSaving = false;
                        WorkDataUtil.debugLog(tplobj, tplData, "after save");
                        success(tplobj);

                        if (!isReEdit) {
                            WorkDataUtil.setReEdit(true);
                            var query = "/makemagazine/" + tplid + "&reEdit=true";
                            Base.replacePath(query)
                            // window.history.replaceState(null, null, query);
                        }
                    }, function (err) {
                        error(err);
                        isSaving = false;
                    });
                }, function error(err) {
                    error(err);
                    isSaving = false;
                })
            }

        },
    avosTpl2Json: function (tpl) {
        return tpl.toJSON();
    },
    netTplData2Json: function (tplDataNet) {
        var group = tplDataNet.get("group").map((item) => {
            return item.toJSON()
        });

        var tplData = fmacapi.convert_tpldata_2_json(tplDataNet);
        if (group && group.length > 0) {
            tplData.group = group
        }
        return tplData;
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

    }
    ,
    getJsonTpl: function () {
        var MagazineStore = require('../stores/MagazineStore');
        return MagazineStore.getTpl().toJSON();
    }
    ,

    getJsonTplData: function (pages) {
        var tpl_data = fmaobj.tpl_data.create();
        tpl_data.set("pages", pages);
        return fmacapi.convert_tpldata_2_json(tpl_data);
    }
    ,
    getTplData: function () {
        var MagazineStore = require('../stores/MagazineStore');
        var magazineData = MagazineStore.getTplData();
        var tpl_data = fmaobj.tpl_data.create();
        tpl_data.set("pages", magazineData.pages);
        tpl_data.set("group", magazineData.groups);
        return tpl_data;
    }
    ,
    createTplEffectImg: function (index, cb) {
        var MagazineStore = require('../stores/MagazineStore');
        var _tpl = MagazineStore.getTpl();
        var _pages = MagazineStore.getPagesJSON();
        if (!_pages) {
            return
        }
        var _pageObj = _pages[index],
            _items = _pages[index].item_object;
        WorkDataUtil.filterJsonItemsType_not_2(_items);
        WorkDataUtil.filterJsonItemsType_18(_items);
        _tpl.page_value = _pages;
        if (magazineRender) {
            magazineRender.destroy();
            magazineRender = undefined;
        }
        magazineRender = new ms.MagazinePageRenderer(_tpl);
        (function (pageRef) {
            magazineRender.getImageDataByPageIndex(index, function (data) {
                effectImgBase64 = data;
                cb(data, pageRef);
                if (magazineRender) {
                    magazineRender.destroy();
                    magazineRender = undefined;
                }
            });
        })(_pageObj)

    }
    ,

    createPagesEffectImg: function (tplData, index, cb) {
        var _pages = tplData.get("pages"),
            _pageObj = _pages[index];
        magazineRender.getImageDataByPageIndex(index, function (data) {
            cb(data, _pageObj);
        });
    }
    ,

    createEffectImgWithoutText: function (index, cb) {
        var MagazineStore = require('../stores/MagazineStore');
        var _tpl = WorkDataUtil.getJsonTpl(),
            _pages = MagazineStore.getPagesJSON(),
            _pageObj = _pages[index],
            _items = _pages[index].item_object,
            newItems = [];
        //_pageObj&&(_pageObj.page_height=1008);
        for (var i = 0; i < _items.length; i++) {
            var itemType = _items[i].item_type;
            if (itemType != 2) {
                newItems.push(_items[i]);
            }
        }
        _pages[index].item_object = newItems;
        _tpl.page_value = _pages;
        if (magazineRender) {
            magazineRender.destroy();
            magazineRender = undefined;
        }
        magazineRender = new ms.MagazinePageRenderer(_tpl);
        magazineRender.getImageDataByPageIndex(index, function (data) {
            effectImgBase64 = data;
            cb(data, _pageObj);
            if (magazineRender) {
                magazineRender.destroy();
                magazineRender = undefined;
            }
        });
    }
    ,

    /*
     * 在调用过 createTplEffectImg 之后,可以获得这个 base64 的图片
     */
    getCreatedTplEffectImg: function () {
        return effectImgBase64;
    }
    ,

    filterJsonItems: function (tplData) {
        var _pages = tplData.pages;
        for (var i = 0; i < _pages.length; i++) {
            var _itemObj = _pages[i].item_object;
            WorkDataUtil.filterJsonItemsType_not_2(_itemObj);
            WorkDataUtil.filterJsonItemsType_18(_itemObj);
        }
    }
    ,

    filterJsonItemsType_not_2: function (items) {
        var itemObjs = items, len = itemObjs.length;
        for (var j = 0; j < len; j++) {
            if (itemObjs[j].item_type == 1 || itemObjs[j].item_type == 3 || itemObjs[j].item_type == 10 || itemObjs[j].item_type == 17 || itemObjs[j].item_type == 18) {
                itemObjs[j].item_width = itemObjs[j].item_width * itemObjs[j].x_scale;
                itemObjs[j].item_height = itemObjs[j].item_height * itemObjs[j].y_scale;
                itemObjs[j].x_scale = 1;
                itemObjs[j].y_scale = 1;
            }
        }
    }
    ,

    filterJsonItemsType_18: function (items) {
        var itemObjs = items,
            len = itemObjs.length;
        var GlobalFunc = require("../components/Common/GlobalFunc.js");
        for (var j = 0; j < len; j++) {
            if ((itemObjs[j].item_type == 1 || itemObjs[j].item_type == 18) && !!itemObjs[j].group_id && GlobalFunc.ifPicFrame(itemObjs[j].group_id, itemObjs)) {
                for (var l = 0; l < len; l++) {
                    if (itemObjs[l].item_type == 17 && itemObjs[l].group_id == itemObjs[j].group_id) {
                        itemObjs[l].item_width = itemObjs[j].item_width;
                        itemObjs[l].item_height = itemObjs[j].item_height;
                        itemObjs[l].item_top = itemObjs[l].item_top + itemObjs[j].item_top;
                        itemObjs[l].item_left = itemObjs[l].item_left + itemObjs[j].item_left;
                    }
                }
                itemObjs[j].item_type = 1;
                itemObjs[j].item_top = 0;
                itemObjs[j].item_left = 0;
            }
        }
    }
    ,

    resetSave: function () {
        isCreateEffectImg = false;
        isSaving = false;
    }
    ,

    saveQuick: function (saveType, ok, err, tpl_option) {

        if (!!isCreateEffectImg) {
            err("正在生成缩略图");
            return;
        }
        if (!!isSaving) return;
        isSaving = true;
        var _this = WorkDataUtil;
        var _tpl_options = tpl_option || {};
        //try {

        _this.createTplEffectImg(0, function (data) {
            var _base64 = data;
            if (!_base64) {
                isSaving = false;
                err("缩略图生成出错");
                return;
            }
            _this.uploadEffectImg(_base64, function (o) {  //check
                //fmacloud.Cloud.run('get_clouddate', {}, {
                //    success: function (result) {
                //var reupdate_date = parseInt(new Date(result).getTime() / 1000).toString();
                var reupdate_date = parseInt(new Date().getTime() / 1000).toString();
                isSaving = false;
                var _url = ("AV:" + o.url());
                _tpl_options.effect_img = _url;
                _tpl_options.tiny_img = _url;
                _tpl_options.reupdate_date = reupdate_date;
                _this.saveTpl(saveType, ok, err, _tpl_options); //check
                //},
                //error  : function (error) {
                //    err("服务器连接失败...");
                //    isSaving = false;
                //    console.log("时间获取失败...", error);
                //}
                //});
            }, function () {
                err("上传缩略图失败...");
                isSaving = false;
            });
        });
    }
    ,

    /*
     * 上传 TPL 效果图
     * @param base64 : base64
     */
    uploadEffectImg: function (base64, ok, err, pageObj) {
        if (!base64) return;
        var base = base64.split(',')[1];
        fmacloud.save_image('.jpg', base, function (success) {
            ok(success, pageObj);
        }, function (error) {
            err(error);
        });
    }
    ,

    initTplData: function (data) {
        var _pages = data.get("pages");
        for (var i = 0; i < _pages.length; i++) {
            var uid = _pages[i].get("page_uid");
            if (!uid) {
                _pages[i].set("page_uid", uuid.v4());
            }
            var _itemObj = _pages[i].get("item_object"), jlen = _itemObj.length;

            _itemObj.sort(WorkDataUtil.elementsLayerSort);
            for (var j = 0; j < jlen; j++) {
                _itemObj[j].set("item_layer", j);
            }
        }
        return data;
    }
    ,

    setReEdit: function (o) {
        isReEdit = o || false; ///需要测试第二次打开作品时，isReEdit是否用的上次的值
        //isReEdit=true;
    },
    /**
     * 重排所有元素的层级，包括画框和浮层,使浮层的子元素跟在浮层之后
    * @itemObjs 一页的元素
    */
    resetAllItemsLayer: function (itemObjs) {
        var GlobalFunc = require("../components/Common/GlobalFunc.js");
        var baseItem = itemObjs.filter(item => {
            return !item.get('group_id')
        })
        var frames = itemObjs.filter(item => {
            return (item.get('item_type') == 17 || item.get('item_type') == 34)
        });
        frames.forEach((frame) => {
            //将每个浮层的子元素放在frame.floatLayer上
            var groupels = GlobalFunc.getDisplayGroupEls(frame.get("group_id"), itemObjs);
            if (groupels.length > 0) {
                groupels.sort(GlobalFunc.itemSort("item_layer"));
                frame.floatLayer = groupels;
            }

        });
        var layerFrame = baseItem.concat(frames);
        layerFrame.sort(GlobalFunc.itemSort("item_layer"));
        var layer = 0;
        layerFrame.forEach((item) => {
            item.set("item_layer", layer++);
            if (item.floatLayer) {
                item.floatLayer.forEach((groupItem) => {
                    groupItem.set("item_layer", layer++);
                })
            }
        });

    },


    /**
     * 重排浮层和元素的层级，使浮层的子元素跟在浮层之后
     * @itemObjs 一页的元素
     */
    resetPageLayer: function (itemObjs) {
        var GlobalFunc = require("../components/Common/GlobalFunc.js");
        var baseItem = GlobalFunc.getBaseFrame(itemObjs);
        var frames = GlobalFunc.getAllDisplayFrame(itemObjs);
        frames.forEach((frame) => {
            //将每个浮层的子元素放在frame.floatLayer上
            var groupels = GlobalFunc.getDisplayGroupEls(frame.get("group_id"), itemObjs);
            if (groupels.length > 0) {
                groupels.sort(GlobalFunc.itemSort("item_layer"));
                frame.floatLayer = groupels;
            }

        });
        var layerFrame = baseItem.concat(frames);
        layerFrame.sort(GlobalFunc.itemSort("item_layer"));
        var layer = 0;
        layerFrame.forEach((item) => {
            item.set("item_layer", layer++);
            if (item.floatLayer) {
                item.floatLayer.forEach((groupItem) => {
                    groupItem.set("item_layer", layer++);
                })
            }
        });

    },
    /**
     * 对一个浮层和浮层里的元素按0开始排序
     * @itemObjs 一个浮层和里面的元素
     */
    resetLayer: function (itemObjs) {
        var GlobalFunc = require("../components/Common/GlobalFunc.js");
        var layerObjs = [];
        var baseFrame;
        itemObjs.forEach((item) => {
            if (item.get("item_type") == 34) {
                baseFrame = item;
            } else {
                layerObjs.push(item);
            }
        });
        layerObjs.sort(GlobalFunc.itemSort("item_layer"));
        var baseLayer = 0;
        if (baseFrame) {
            baseLayer = baseFrame.get("item_layer")
        }
        layerObjs.forEach((item, index) => {
            item.set("item_layer", baseLayer + index)
        })
    }
    ,

    addDebugLog: function (options, cb_ok, cb_err) {
        //console.log("addDebugLog", options);
        var tpl_id = options.tpl_id || "作品id为空",
            module = options.module || "制作模块",
            content = options.content || "";
        if (!content) {
            cb_err("log内容为空！");
            return;
        }

        var me_debuglog = fmacloud.Object.extend("me_debuglog");
        var logobj = new me_debuglog();
        logobj.set("tpl_id", tpl_id);
        logobj.set("module", module);
        logobj.set("content", content);
        logobj.save(null, {
            success: cb_ok,
            error: cb_err
        });
    }
    ,

    debugLog: function (tpl, tplData, pos) {
        try {
            var pages = tplData.get("pages");
            for (var i = 0; i < pages.length; i++) {
                var itemObj = pages[i].get("item_object");
                for (var j = 1; j < itemObj.length; j++) {
                    var itemType = itemObj[j].get('item_type'),
                        itemWidth = itemObj[j].get('item_width'),
                        group_id = itemObj[j].get('group_id');
                    if (itemType == 1 && !group_id) {
                        this.addDebugLog({
                            tpl_id: tpl.get("tpl_id"),
                            module: "mepc制作模块",
                            content: pos + " item_type为 1 时,没有group_id,page:" + i + ",item:" + j
                        })
                    }
                }
            }
        } catch (e) {
            this.addDebugLog({
                tpl_id: tpl.get("tpl_id"),
                module: "mepc制作模块",
                content: pos + "日志异常 " + e.name + ": " + e.message
            });
        }
    }

}
    ;
function clearDataBaseGroup(tid, groups) {
    return new Promise(function (resolve, reject) {
        var MakeWebAPIUtils = require("./MakeWebAPIUtils");
        MakeWebAPIUtils.getAllGroupDataByTplid(tid, function (oldGroups) {
            WorkDataUtil.addDebugLog({
                tpl_id: tid,
                module: "mepc制作模块",
                content: "oldGroups:" + oldGroups.length + ",groupLength:" + groups.length
            })
            var deleteGroups = oldGroups.filter((group) => {
                for (var i = 0; i < groups.length; i++) {
                    if (groups[i].id == group.id) {
                        return false
                    }
                }
                return true
            })
            if (deleteGroups.length > 0) {
                WorkDataUtil.addDebugLog({
                    tpl_id: tid,
                    module: "mepc制作模块",
                    content: "deleteGroups:" + deleteGroups.length + ":" + deleteGroups.map(group => {
                        return group.id
                    }).join(",")
                })
            }

            var promiseGroups = deleteGroups.map((group) => {
                return group.destroy()
            });
            Promise.all(promiseGroups).then(resolve).catch(reject)
        })
    })
}
module.exports = WorkDataUtil;

