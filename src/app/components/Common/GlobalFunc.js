/*
 * 全局方法
 */
var React = require("react");
var EventEmitter = require('events').EventEmitter;
var isSaving = false;

var $ = require("jquery");
var PageStore = require("../../stores/PageStore");
var WorkDataUtil = require('../../utils/WorkDataUtil');
var MakeActionCreators = require("../../actions/MakeActionCreators");
var Base = require("../../utils/Base");
var MeConstants = require('../../constants/MeConstants');
var ElementsEvents = require("./ElementsEvents");
var uuid = require("../../utils/numuid");
var ElementsType = MeConstants.Elements;
var MINIWIDTH = MeConstants.Defaults.MINELEMENTWIDTH;
var _ = require("lodash");
var log = require("loglevel");

var failedTimer = null;
var clearTipTimer = null;
var smallTipsTimer = null;
var mask = $("<div class='save-mask'></div>");
var zoom = 0;


var GlobalFunc = Object.assign({}, EventEmitter.prototype, {

    getDeviceScale: function () {
        var scale = (document.body.clientHeight - 80 - 32 - 48) / 1012; //(文档高度 - 头部工具栏高度 - deviceMargin) / device实际高度
        scale = scale > 1 ? 1 + zoom : scale + zoom;
        return scale;
    },

    setDeviceZoom: function (type) {
        if (type == "in") {
            zoom = zoom + 0.2;
        } else if (type == "out") {
            zoom = zoom - 0.2;
        }
        console.log("zoom", zoom);
    },

    /*
     * 获得当前的登录用户
     */
    getUserObj: function () {
        var u = Base.getCurrentUser();
        return {
            user_nick: u ? u.attributes.user_nick : "未登录用户",
            user_pic: u ? u.attributes.user_pic : "",
            objectId: u ? u.id : "",
            vip_level: u ? u.attributes.vip_level : 0,
            speFunctionCode: u ? u.attributes.spe_function_code : ""
        };
    },

    /**
     * 获得用户本地信息
     **/
    getUserExtra: function (parameter) {
        var user = "Make" + this.getUserObj().user_nick;
        var userInfo = localStorage.getItem(user);

        if (!userInfo) return false;
        userInfo = JSON.parse(userInfo);
        return (!!userInfo[parameter]);
    },

    /**
     * 设置用户本地信息
     **/
    setUserExtra: function (parameter) {
        var user = "Make" + this.getUserObj().user_nick;
        var userInfo = localStorage.getItem(user);
        if (!userInfo) {
            userInfo = {};
        } else {
            userInfo = JSON.parse(userInfo)
        }
        userInfo[parameter] = true;
        localStorage.setItem(user, JSON.stringify(userInfo));
    },

    /**
     * 点击动画事件
     */
    clickAnimation: function (e) {
        var el = e && e.target;
        setTimeout(function () {
            //remove rippleEffect div after 1 second
            if (el) $(el).find(".ripple").remove()

        }, 1000);
        if ($(e.target).hasClass('slider')) {
            return;
        }
        var whatTab = $(e.target).index();
        var howFar = 100 * whatTab;
        $(e.target).parent().find(".slider").css({
            left: howFar + "px"
        });
        $(".ripple").remove();
        var posX = $(e.target).offset().left,
            posY = $(e.target).offset().top,
            buttonWidth = $(e.target).width(),
            buttonHeight = $(e.target).height();
        $(e.target).prepend("<span class='ripple'></span>");
        if (buttonWidth >= buttonHeight) {
            buttonHeight = buttonWidth;
        } else {
            buttonWidth = buttonHeight;
        }
        var x = e.pageX - posX - buttonWidth / 2;
        var y = e.pageY - posY - buttonHeight / 2;
        $(".ripple").css({
            width: buttonWidth,
            height: buttonHeight,
            top: y + 'px',
            left: x + 'px'
        }).addClass("rippleEffect");
    },

    canChangeLayer: function (item) {
        if (!item.get("group_id") && item.get("item_type") == 1) {
            return false;
        }
        return true;
    },

    canClearStyle: function () {
        var ElementStore = require("../../stores/ElementStore");
        var items = ElementStore.getSelectedElement();
        if (items.length != 1 || _.indexOf(items, -1) != -1) {
            return false;
        }
        var itemObj = items[0];
        var type = itemObj.get('item_type') ? itemObj.get('item_type') : -1;
        if (type == 2 || type == 3 || type == 14 || type == 19 || type == 18 || type == 10 || type == 1) {
            return true;
        } else {
            return false;
        }
        //return (itemType===2||itemType===18);
    },

    canLock: function () {
        var ElementStore = require("../../stores/ElementStore");
        return ElementStore.canLock();
    },

    canUnLock: function () {
        var ElementStore = require("../../stores/ElementStore");
        return ElementStore.canUnLock();
    },

    canAlign: function () {
        var ElementStore = require("../../stores/ElementStore");
        return ElementStore.canAlign();
    },

    canAjust: function () {
        var ElementStore = require("../../stores/ElementStore");
        return ElementStore.canAjust();
    },

    canCompose: function () {
        var ElementStore = require("../../stores/ElementStore");
        return ElementStore.canCompose();
    },

    canUnCompose: function () {
        var ElementStore = require("../../stores/ElementStore");
        return ElementStore.canUnCompose();
    },

    canZoomIn: function () {
        var scale = this.getDeviceScale();
        return (scale + 0.2 < 2);
    },

    canZoomOut: function () {
        var scale = this.getDeviceScale();
        return (scale - 0.2 > 0.4);
    },

    clearStyle: function () {


        if (!GlobalFunc.canClearStyle()) {
            return
        }
        var ElementStore = require("../../stores/ElementStore");
        var ItemInit = require("../../components/Common/ItemInit");
        var item = ElementStore.getSelectedElement()[0];
        var type = item.get('item_type') ? item.get('item_type') : -1;
        var initObj;
        switch (type) {
            case 18:
            case 1:
                initObj = ItemInit.getImageInitStyle();
                break;
            case 3:
                initObj = ItemInit.getWatermarkInitStyle();
                break;
            case 19:
                initObj = ItemInit.getButtonInitStyle();
                break;
            case 14:
                initObj = ItemInit.getInputTextInitStyle();
                break;
            case 10:
                initObj = ItemInit.getFrameInitStyle();
                break;
            case 2:
                var isLineFeedText = GlobalFunc.isLineFeedText(item.attributes);
                if (isLineFeedText) {
                    initObj = ItemInit.getLineFeedTextInitStyle();
                } else {
                    initObj = ItemInit.getTextInitStyle();
                }

                break;
        }

        if (initObj) {

            MakeActionCreators.updateElement(initObj);

        }

    },

    showLoading: function () {
        var loadingHtml = [];
        loadingHtml.push(
            <div className="loading-bj">
                <div className="loading-spinner">
                    <div className="loading-spinner-container container1">
                        <div className="circle1"></div>
                        <div className="circle2"></div>
                        <div className="circle3"></div>
                        <div className="circle4"></div>
                    </div>
                    <div className="loading-spinner-container container2">
                        <div className="circle1"></div>
                        <div className="circle2"></div>
                        <div className="circle3"></div>
                        <div className="circle4"></div>
                    </div>
                    <div className="loading-spinner-container container3">
                        <div className="circle1"></div>
                        <div className="circle2"></div>
                        <div className="circle3"></div>
                        <div className="circle4"></div>
                    </div>
                </div>
                <div className="radial-progress">
                    <div className="circle">
                        <div className="mask full">
                            <div className="fill"></div>
                        </div>
                        <div className="mask half">
                            <div className="fill"></div>
                            <div className="fill fix"></div>
                        </div>
                    </div>
                </div>
                <div className="loading-text">正在上传中...</div>
            </div>
        );
        return loadingHtml;
    },

    createModel: function (type, option) {
        var AutoSave = require("../Make/Tools/autoSave");
        var _this = this;
        var MagazineStore = require("../../stores/MagazineStore");
        var tplData = MagazineStore.getTplDataClone(true);
        var tplobj = MagazineStore.getTpl();
        AutoSave.stop();
        function failed(error) {
            AutoSave.start();
            ///todo 恢复数据
            MakeActionCreators.saveUpdate(tplobj, tplData);
            if (error) {
                console.error(error)
            }
            if (typeof error == "string") {
                error = "保存失败：" + error;
            } else {
                error = "保存失败"
            }


            SortCut.init();
            $(mask).remove();
            _this.addSmallTips(error, null, { clickCancel: true });
            //$("#save-tip").html(error);
            $(".action-button-save").children(".saveLoading").remove();
            //clearTipTimer = setTimeout(function () {
            //    $("#save-tip").hide();
            //}, 5000);
        }

        /*
         生成我的模板 : type: "clone" , option : {}
         生成未完成作品: type: "" , options :{ tpl_state:1 }
         */

        clearTimeout(clearTipTimer);
        var option = option || {};

        $(".action-button-save").append("<div class='saveLoading'></div>");
        var SortCut = require('../Make/shortcut/ShortCut');
        SortCut.unInit();
        this.addSmallTips("正在保存到草稿箱... ", null, {
            cancel: true,
            cb_cancel: function () {
                ///todo 恢复数据
                AutoSave.start();
                MakeActionCreators.saveUpdate(tplobj, tplData);
                $(mask).remove();
                $(".action-button-save").children(".saveLoading").remove();
                SortCut.init();
                WorkDataUtil.resetSave();
            }
        });
        WorkDataUtil.saveQuick(type, function () {
            AutoSave.start();
            SortCut.init();
            _this.addSmallTips("成功保存到草稿箱... ", 2, { delBackGround: true });
            $(".action-button-save").children(".saveLoading").remove();
            $(mask).remove();
            clearTipTimer = setTimeout(function () {
                $("#save-tip").hide();
            }, 2000);
        }, failed, option)
    },

    canLayerDown: function () {
        var ElementStore = require("../../stores/ElementStore");
        return ElementStore.canLayerDown();
    },

    canLayerUp: function () {
        var ElementStore = require("../../stores/ElementStore");
        return ElementStore.canLayerUp();
    },

    canCrop: function () {
        var ElementStore = require("../../stores/ElementStore");
        var items = ElementStore.getSelectedElement();
        if (_.indexOf(items, -1) != -1) {
            return false
        }
        if (items.length == 1) {
            var item = items[0];
            var type = item.get("item_type");
            if (type == 3 || type == 18 || (type == 1 && !!item.get("group_id"))) {
                return true;
            }
        }
        return false
    },
    itemCopyAble: function () {
        //元素是否可复制  背景和画框 不让复制
        var ElementStore = require("../../stores/ElementStore");
        var items = ElementStore.getSelectedElement();
        if (_.indexOf(items, -1) != -1) {
            return false
        }
        if (items.length < 1) {
            return false;
        }
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var type = item.get("item_type");
            if (1 == type || ElementsType.borderFrame == type) {
                if (!item.get("group_id")) return false;
            }
        }
        for (var si = 0; si < items.length; si++) {
            var selectedItem = items[si];
            var selectType = selectedItem.get("item_type");
            switch (selectType) {

                case ElementsType.redEnvelope:
                    return "一个作品只能添加一个红包";
                    break;
                case ElementsType.shake:
                    return "一个作品只能添加一个摇一摇";
                    break;

                case ElementsType.background:
                    if (!selectedItem.get("group_id")) {
                        return false;
                    } else {
                        return true;
                    }
                    break;
                case ElementsType.displayFrame:
                    return "浮层不能复制";
                    break;

            }

        }
        return true;
    },
    itemCopyParseAble: function () {
        //元素是否可复制  背景和画框 不让复制
        var ElementStore = require("../../stores/ElementStore");
        var items = ElementStore.getSelectedElement();
        if (_.indexOf(items, -1) != -1) {
            return false
        }
        if (items.length < 1) {
            return false;
        }
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var type = item.get("item_type");
            if (1 == type || ElementsType.borderFrame == type) {
                if (!item.get("group_id")) return false;
            }
        }
        for (var si = 0; si < items.length; si++) {
            var selectedItem = items[si];
            var selectType = selectedItem.get("item_type");
            switch (selectType) {
                case ElementsType.fingerprint:
                    return "当前元素已存在,请不要重复添加";
                    break;
                case ElementsType.radio:
                    return "当前元素已存在,请不要重复添加";
                    break;
                case ElementsType.checkbox:
                    return "当前元素已存在,请不要重复添加";
                    break;
                case ElementsType.redEnvelope:
                    return "一个作品只能添加一个红包";
                    break;
                case ElementsType.shake:
                    return "一个作品只能添加一个摇一摇";
                    break;
                case ElementsType.borderFrame:
                    return false;
                    break;
                case ElementsType.background:
                    if (!selectedItem.get("group_id")) {
                        return false;
                    } else {
                        return true;
                    }
                    break;
                case ElementsType.displayFrame:
                    return "浮层不能复制";
                    break;

            }

        }
        return true;
    },

    itemDeleteAble: function () {

        //元素是否可删除  背景 不让删除
        // var ElementStore = require("../../stores/ElementStore");
        // var items = ElementStore.getSelectedElement();
        // for (var i = 0; i < items.length; i++) {
        //     var item = items[i];
        //     var type = item.get("item_type");
        //     if (1 == type) {
        //         if (!item.get("group_id")) return false;
        //     }
        // }
        // if (items.length < 1) {
        //     return false;
        // }
        return true;
    },

    getItemWidthAndHeightByObjArr: function (attrArr) {
        var type = attrArr['item_type'];
        var width = attrArr['item_width'];
        var height = attrArr['item_height'];

        var scaleX = attrArr['x_scale'], scaleY = attrArr['y_scale'];
        if (type == 2 && !attrArr["is_wrap"]) {

            //text has no width
            var fa = attrArr['fix_attr'];
            if (fa) {
                var dimobj = JSON.parse(fa);
                width = dimobj.itemWidth;
                height = dimobj.itemHeight;
            } else {
                width = 0;
                height = 0;
            }

        }

        width = width * scaleX;
        height = height * scaleY;
        return { width: width, height: height };
    },

    getTopLeft: function (AllItems, selItem) {
        var top = selItem.get("item_top");
        var left = selItem.get("item_left");
        var groupId = selItem.get("group_id")
        if (!!groupId && selItem.get("item_type") != 34) {
            for (var i = 0; i < AllItems.length; i++) {
                var temp = AllItems[i]
                var igroupId = temp.get("group_id");
                if (igroupId && igroupId == groupId) {
                    if (temp.get("item_type") == 17 || temp.get("item_type") == 34) {
                        var frameTop = temp.get("item_top");
                        top = isNaN(frameTop) ? top : top + frameTop;
                        var frameLeft = temp.get("item_left");
                        left = isNaN(frameLeft) ? left : left + frameLeft;
                        break;
                    }
                }
            }
        }
        return { top: top, left: left }
    },

    getPicFramePosByObjArr: function (attrArr) {
        var groupId = attrArr["group_id"];
        var type = attrArr["item_type"];
        if (type == 1 && !!groupId) {
            var ElementStore = require("../../stores/ElementStore");
            var allEls = ElementStore.getElements();
            for (let i = 0; i < allEls.length; i++) {
                let el = allEls[i];
                let elgroupId = el.get("group_id");
                let eltype = el.get("item_type");
                if (eltype == 17 && elgroupId == groupId) {
                    return { top: el.get("item_top"), left: el.get("item_left") }
                }
            }
        }
    },

    getDimAndPos: function (AllItems, calItems) {
        var selectedEls = calItems;
        if (selectedEls.length < 1) {
            return undefined;
        }
        var first = selectedEls[0];
        var dim = GlobalFunc.getItemWidthAndHeight(first);
        if (dim.width <= 0 || dim.height <= 0) {
            return undefined
        }
        var pos = GlobalFunc.getTopLeft(AllItems, first)
        var top = pos.top;
        var left = pos.left;
        var bottom = top + dim.height;
        var right = left + dim.width;

        for (var i = 1; i < selectedEls.length; i++) {
            var cur = selectedEls[i];
            var dim = GlobalFunc.getItemWidthAndHeight(cur);
            var curpos = GlobalFunc.getTopLeft(AllItems, cur)
            var curtop = curpos.top;
            var curleft = curpos.left;
            var curbottom = curtop + dim.height;
            var curright = curleft + dim.width;
            if (curtop < top) {
                top = curtop;
            }
            if (curleft < left) {
                left = curleft;
            }
            if (curbottom > bottom) {
                bottom = curbottom;
            }
            if (curright > right) {
                right = curright;
            }
        }
        return { top: top, left: left, width: right - left, height: bottom - top }

    },

    getItemWidthAndHeight: function (item) {
        var type = item.get('item_type');
        var width = item.get('item_width');
        var height = item.get('item_height');
        var scaleX = item.get('x_scale'), scaleY = item.get('y_scale');
        if (type == 2 && !item.get('is_wrap')) {
            //text has no width
            var fa = item.get('fix_attr');
            //var fixed_size=item.get("fixed_size");
            if (fa) {
                var dimobj = JSON.parse(fa);
                width = dimobj.itemWidth;
                height = dimobj.itemHeight;
            } else {
                width = 0;
                height = 0;
            }

        }
        width = width * scaleX;
        height = height * scaleY;
        return { width: width, height: height };
    },

    getImgWidth: function (image) {
        var width = image.width;
        var height = image.height;
        if (width > 640 && width >= height) {
            width = 512;
            height = height * (512 / image.width);
            if (height > 1008) {
                width = width * (806.4 / height);
                height = 806.4;
            }
        }
        if (height > 1008 && height > width) {
            height = 806.4;
            width = width * (806.4 / image.height);
            if (width > 640) {
                height = height * (512 / width);
                width = 512;
            }
        }
        return { width: width, height: height };
    },

    /**
     * 以缩略图的方式保存图片
     * @param options 参数
     * options = {
     *     file: file, //File对象
     *     base64: base64, //base64对象
     *     fileName: fileName, //图片名称
     *     format: {   //压缩相关参数
     *        w: 100,
     *        h: 100,
     *        q: 70,
     *        scaleToFit: true,
     *        fmt: "png"
     *     },
     *     success: function(file){}, //成功时回调，其中file为AV.File对象
     *     error: function(err){}  //失败时回调
     * }
     * 其中format压缩参数说明:
     * --{Number} format.w(width) 宽度，单位：像素
     * --{Number} format.h(heigth) 高度，单位：像素
     * --{Number} format.q(quality) 质量，1-100的数字，默认100
     * --{Boolean} format.scaleToFit 是否将图片自适应大小。默认为true。
     * --{String} format.fmt 格式，默认为png，也可以为jpeg,gif等格式。
     */
    saveAsThumbnail: function (options) {

        options = options || {};

        var avFile, format = options.format || null,
            fileName = options.fileName ? options.fileName + "." + format.fmt : "thumbnail." + format.fmt;

        if (options.file) {
            console.log(options.file.size);
            if (options.file.size >= 10 * 1024 * 1024) {
                options.error("上传文件不能超过10MB！");
                return;
            }
            avFile = new AV.File(fileName, options.file);

        } else if (options.base64) {

            avFile = new AV.File(fileName, { base64: options.base64 });

        }

        var _hook = (options._hook == null) ? true : options._hook;  //缩略图生成失败，是否删除原图

        var successCallback = options.success || function (f) {
            console.log('保存成功: ' + f.url());
        };
        var errorCallback = options.error || function (err) {
            console.log('保存失败: ' + (err.message || err));
        };

        avFile.save().then(function (f) {
            var id = f.id;

            fmacloud.Cloud.run('thumbnail', { id: id, format: format, _hook: _hook }, {
                success: function (result) {
                    var file = new fmacloud.File(result.name);
                    file._url = result.get('url');
                    file.id = result.id;
                    file.name = result.get("name");
                    file._metaData = result.get("metaData");
                    successCallback(file);
                },
                error: function (err) {
                    errorCallback(err);
                }
            });
        }, function (err) {
            errorCallback(err);
        });
    },

    /**
     * 保存用户素材
     * @param options 参数
     * options = {
     *     fileUrl           //素材地址
     *     fileName      //素材名称
     *     materialOwner //pc端给用户默认值 0系统，1用户
     *     materialType  //素材类型 1.贴纸，2.边框，3.形状，4.背景，5.图片
     *     userId        //用户ID
     * }
     * @param success: function(file){}, //成功时回调，其中file为AV.File对象
     * @param error: function(err){}  //失败时回调
     */
    saveMaterialObj: function (options, success, error) {
        var MaterialObj = fmacloud.Object.extend("pc_material");
        var materialObj = new MaterialObj();
        materialObj.set("material_src", options.fileUrl);
        materialObj.set("material_name", options.fileName);
        materialObj.set("material_owner", options.materialOwner);
        materialObj.set("material_type", parseInt(options.materialType));
        materialObj.set("user_id", options.userId);
        materialObj.save(null, {
            success: function (obj) {
                success(obj);
            },
            error: function (obj, err) {
                error(obj, err);
            }
        });
    },

    /**
     * 添加制作页通用提示窗
     * @param option 参数
     * option = {
     *     confirm       //是否出现确认按钮
     *     cancel        //是否出现取消按钮
     *     clickCancel   //是否点击消失
     *     delBackGround //是否删除背景
     *     margin        //边界
     * }
     * @param message    //提示信息
     * @param delay      //延迟时间
     * @param callBack   //点击取消调用回调
     */
    addSmallTips: function (message, delay, option) {
        option = option || {};

        //如果提示框已存在，先移除
        if (smallTipsTimer || $("#makeSmallTips").length > 0) {
            $("#makeSmallTips").remove();
            window.clearTimeout(smallTipsTimer);
            smallTipsTimer = null;
        }

        var smallTips = $('<div id="makeSmallTips"></div>'),
            messageBox = $('<div class="message"></div>'),
            cancel = $('<span class="cancel">【取消】</span>'),
            confirm = $('<span class="cancel">【确认】</span>');
        messageBox.html(message);
        smallTips.append(messageBox);

        //option.cancel == true 在提示框内增加“取消”按钮，并在点击时调用回调
        if (option.cancel) {
            messageBox.append(cancel);
            cancel.click(function () {
                smallTips.remove();
                if (smallTipsTimer) {
                    window.clearTimeout(smallTipsTimer);
                    smallTipsTimer = null;
                }
                if (option.cb_cancel) option.cb_cancel();
            })
        }

        //option.confirm == true 在提示框内增加“确认”按钮，并在点击时调用回调
        if (option.confirm) {
            messageBox.append(confirm);
            confirm.click(function () {
                smallTips.remove();
                if (smallTipsTimer) {
                    window.clearTimeout(smallTipsTimer);
                    smallTipsTimer = null;
                }
                if (option.cb_confirm) option.cb_confirm();
            })
        }

        //option.confirm == true 移除提示框
        if (option.clickCancel) {
            smallTips.click(function () {
                smallTips.remove();
                if (smallTipsTimer) {
                    window.clearTimeout(smallTipsTimer);
                    smallTipsTimer = null;
                }
                if (option.cb_confirm) option.cb_confirm();
            })
        }

        //设置提示框margin
        if (option.margin) {
            messageBox.css({ margin: option.margin });
        }

        //删除提示框背景
        if (option.delBackGround) {
            smallTips.css({ background: "none" });
        }

        $("body").append(smallTips);
        if (!delay) return;
        smallTipsTimer = setTimeout(function () {
            smallTips.remove();
            smallTipsTimer = null;
        }, delay * 1000)

    },

    toJson: function (str) {
        return (new Function("", "return " + str))();
    },

    deleteGrpEls: function (els) {
        //delete groups elements
        var pageId = PageStore.getPageUid();
        var ClientState = require("../../utils/ClientState")
        var selectGrps = ClientState.getGrpRoots(els, pageId);
        if (selectGrps.length > 0) {
            //delete grouped elements
            selectGrps.forEach((grp) => {
                var agrpEls = ClientState.getGroupEls(grp);
                grp.locked = false;
                agrpEls.forEach((elInfo) => {
                    var item_uuid = elInfo.id;
                    if (ClientState.isLocked(item_uuid, pageId)) {
                        grp.locked = true;
                    }
                    for (var i = 0; i < els.length; i++) {
                        if (els[i].get("item_uuid") == item_uuid) {
                            elInfo.el = els.splice(i, 1)[0];
                            break;
                        }
                    }
                });
                grp.els = agrpEls.map((obj) => {
                    return obj.el;
                });
            });
        }
        return selectGrps;
    },

    ifChangeWH: function (item_type) {
        var type = item_type;
        if (type == ElementsType.borderFrame || type == ElementsType.vote || type == ElementsType.music) {
            return false;
        }
        return true;
    },
    canChangeHeight: function (item_type) {
        var type = item_type;
        if (this.ifChangeWH(item_type) == false) {
            return false
        } else {
            if (type == ElementsType.label) {
                return false;
            }
        }

        return true;
    },
    ifScale: function (item) {

        var type;
        if (item.get) {
            type = item.get("item_type");
        } else {
            type = item["item_type"]
        }

        if (type == ElementsType.button || type == ElementsType.inputText || type == ElementsType.radio
            || type == ElementsType.checkbox || type == ElementsType.fingerprint || type == ElementsType.shake) {
            return true;
        }
        if (type == ElementsType.text) {
            var lineFeed;
            if (item.get) {
                lineFeed = item.get("is_wrap");
            } else {
                lineFeed = item["is_wrap"]
            }
            if (lineFeed) {
                return false;
            } else {
                return true;
            }

        }
        return false;
    },

    canUpdate: function (changeInfo, shift) {
        var ElementStore = require("../../stores/ElementStore");
        var ClientState = require('../../utils/ClientState');
        var pageId = PageStore.getPageUid();
        var els = ElementStore.getSelectedElement();
        var allEls = ElementStore.getElements();
        var dimPos = GlobalFunc.getDimAndPos(allEls, els);
        var allLocked = _.every(els, (el) => {
            return ClientState.isLocked(el.get("item_uuid"), pageId)
        });
        if (allLocked) {
            return false;
        }
        var scalex, scaley;
        var moveTop = false, moveLeft = false;
        if (!!changeInfo.top || changeInfo.top == 0) {
            moveTop = true;
        }
        if (!!changeInfo.left || changeInfo.left == 0) {
            moveLeft = true;
        }
        if (!!changeInfo.dy) {
            if (moveTop) {
                if (dimPos.height < MINIWIDTH && changeInfo.dy > 0) {
                    return;
                }
                scaley = (dimPos.height - changeInfo.dy) / dimPos.height;
            } else {
                if (dimPos.height < MINIWIDTH && changeInfo.dy < 0) {
                    return;
                }
                scaley = (dimPos.height + changeInfo.dy) / dimPos.height;
            }
        }
        if (!!changeInfo.dx) {
            if (moveLeft) {
                if (dimPos.width < MINIWIDTH && changeInfo.dx > 0) {
                    return;
                }
                scalex = (dimPos.width - changeInfo.dx) / dimPos.width;
            } else {
                if (dimPos.width < MINIWIDTH && changeInfo.dx < 0) {
                    return;
                }
                scalex = (dimPos.width + changeInfo.dx) / dimPos.width;
            }
        }
        if (shift) {
            if (scalex) {
                scaley = scalex;
                if (moveTop) {
                    changeInfo.dy = dimPos.height * (1 - scalex)
                } else {
                    changeInfo.dy = dimPos.height * (scalex - 1)
                }

            } else {
                return false;
            }

        }


        if (!!scaley) {
            for (var i = 0; i < els.length; i++) {
                var el = els[i];
                var elDimPos = GlobalFunc.getDimAndPos(allEls, [el]);
                var newHeight = elDimPos.height * scaley;
                if (newHeight < MINIWIDTH) {
                    return false;
                }
            }
        }
        if (!!scalex) {
            for (var i = 0; i < els.length; i++) {
                var el = els[i];
                var elDimPos = GlobalFunc.getDimAndPos(allEls, [el]);
                var newWidth = elDimPos.width * scalex;
                if (newWidth < MINIWIDTH) {
                    return false;
                }

            }

        }
        return true;
    },

    mouseThrough: function (attr, index) {
        var ElementStore = require("../../stores/ElementStore");
        var PageStore = require("../../stores/PageStore");
        var ClientState = require("../../utils/ClientState")
        var selectIndexArr = ElementStore.getSelectedElementIndex();
        if (ClientState.isLocked(attr["item_uuid"], PageStore.getPageUid())) {
            return true;
        }
        if (attr["item_type"] == 1 && !attr["group_id"]) {
            //background
            if (_.indexOf(selectIndexArr, index) != -1) {
                //selected
                return false;
            }
            return true
        } else {
            return false
        }
    },

    rectIntersect: function (r1, r2) {
        var wr1 = r1.x2 - r1.x1;
        var wr2 = r2.x2 - r2.x1;
        var hr1 = r1.y2 - r1.y1;
        var hr2 = r2.y2 - r2.y1;

        return (Math.abs((r1.x1 + r1.x2 - r2.x1 - r2.x2) / 2) <= wr1 / 2.0 + wr2 / 2.0 && Math.abs((r1.y1 + r1.y2 - r2.y1 - r2.y2) / 2) <= hr1 / 2.0 + hr2 / 2.0);
        // 矩形A的宽 Wa = Xa2-Xa1 高 Ha = Ya2-Ya1
        //           矩形B的宽 Wb = Xb2-Xb1 高 Hb = Yb2-Yb1
        //           矩形A的中心坐标 (Xa3,Ya3) = （ (Xa2+Xa1)/2 ，(Ya2+Ya1)/2 ）
        //           矩形B的中心坐标 (Xb3,Yb3) = （ (Xb2+Xb1)/2 ，(Yb2+Yb1)/2 ）
        //           所以只要同时满足下面两个式子，就可以说明两个矩形相交。
        //
        //                 1） | Xb3-Xa3 | <= Wa/2 + Wb/2
        //                 2） | Yb3-Ya3 | <= Ha/2 + Hb/2
    },

    getGroupByItemid: function (itemId, allEls) {
        for (var i = 0; i < allEls.length; i++) {
            if (allEls[i].get("item_id") == itemId) {
                return allEls[i].get("group_id")
            }
        }
    },

    getDisplayGroup: function (item) {
        let attributes;
        let group_id;
        if (typeof item.get != "function") {
            attributes = item;
        } else {
            attributes = item.attributes;
        }
        var linkStr = attributes["item_href"];
        if (typeof linkStr == "string") {
            let index = linkStr.indexOf("show_el:");
            let indexEnd = linkStr.indexOf("|", index + 1);
            indexEnd = indexEnd == -1 ? linkStr.length : indexEnd
            group_id = linkStr.substring(index + "show_el:".length, indexEnd);
        }
        return group_id;
    },
    /**
     * 取浮层内元素
     * @group_id 浮层对应的组id
     * @objs 页内所有元素
     */
    getDisplayGroupEls: function (group_id, objs) {
        let ret = [];
        objs.forEach((item) => {
            if (item.get("group_id") == group_id && item.get("item_type") != 34 && item.get("item_type") != 17) {
                ret.push(item)
            }
        });

        return ret;
    },

    ifPicFrame: function (group_id, item_objs) {
        ///组是否是画框，如果是返回true;
        if (!group_id) {
            return false;
        }

        var groupEls = [];
        for (let i = 0; i < item_objs.length; i++) {
            let item = item_objs[i];
            if (typeof item.get == "function") {
                item = item.attributes;
            }
            if (item.group_id == group_id) {
                groupEls.push(item);
            }
        }
        if (groupEls.length == 2) {
            for (let i = 0; i < groupEls.length; i++) {
                if (groupEls[i].item_type == 17) {
                    return true;
                }
            }
        }
        return false;
    },

    /**
     * 取最底层的元素，不包括浮层和浮层本身
     */
    getBaseFrame: function (allEls) {
        let baseFrame = [];
        allEls.forEach((item) => {
            var group_id = item.get("group_id")
            if (!group_id) {
                baseFrame.push(item);
            } else if (group_id && this.ifPicFrame(group_id, allEls)) {
                baseFrame.push(item);
            }
        });
        return baseFrame;

    },

    getDisplayFrameRoot: function (group_id, allEls) {
        for (var i = 0; i < allEls.length; i++) {
            var item = allEls[i];
            if (item.get("group_id") == group_id && item.get("item_type") == 34) {
                return item;
            }
        }
    },

    getAllDisplayFrame: function (allEls) {
        var frame = [];
        for (var i = 0; i < allEls.length; i++) {
            var item = allEls[i];
            if (!!item.get("group_id") && item.get("item_type") == 34) {
                frame.push(item);
            }
        }
        return frame;
    },

    itemSort: function (attr) {
        return function (a, b) {
            return parseInt(a.get(attr)) - parseInt(b.get(attr))
        }
    },
    canChangeDisplayState: function (itemType) {
        if (itemType == ElementsType.picslide || itemType == ElementsType.reward || itemType == ElementsType.shake || itemType == ElementsType.redEnvelope) {
            return false;
        } else {
            return true;
        }
    },
    getObj: function (item) {
        var itemType = item.get("item_type");
        var coverageName;
        switch (itemType) {
            case ElementsType.redEnvelope:
                coverageName = "红包";
                break;
            case ElementsType.svg:
                coverageName = "SVG";
                break;
            case ElementsType.background:
                if (!!item.get("group_id")) {
                    coverageName = "图片";
                } else {
                    coverageName = "背景";
                }
                break;
            case ElementsType.text:
                coverageName = "文字";
                break;
            case ElementsType.watermark:
                if (item.get('frame_style') == 1) {
                    coverageName = "水印";
                } else if (item.get('frame_style') == 3) {
                    coverageName = "图形";
                }
                break;
            case ElementsType.music:
                coverageName = "音乐";
                break;
            case ElementsType.video:
                coverageName = "视频";
                break;
            case ElementsType.borderFrame:
                coverageName = "边框";
                break;
            case ElementsType.phone:
                coverageName = "一键拨号";
                break;
            case ElementsType.inputText:
                coverageName = "输入框";
                break;
            case ElementsType.map:
                coverageName = "地图";
                break;
            case ElementsType.pictureFrame:
                coverageName = "画框";
                break;
            case ElementsType.image:
                coverageName = "图片";
                break;
            case ElementsType.button:
                coverageName = "按钮";
                break;
            case ElementsType.radio:
                coverageName = "单选按钮";
                break;
            case ElementsType.checkbox:
                coverageName = "多选按钮";
                break;
            case ElementsType.vote:
                coverageName = "投票";
                break;
            case ElementsType.scribble:
                coverageName = "涂抹";
                break;
            case ElementsType.fingerprint:
                coverageName = "指纹长按";
                break;
            case ElementsType.shake:
                coverageName = "摇一摇";
                break;
            case ElementsType.displayFrame:
                coverageName = "浮层";
                break;
            case ElementsType.embedded:
                coverageName = "嵌入网页";
                break;
            case ElementsType.reward:
                coverageName = "打赏";
                break;
            case ElementsType.label:
                coverageName = "标签";
                break;
            case ElementsType.picslide:
                coverageName = "图集";
                break;
            case ElementsType.panorama:
                coverageName = "全景";
                break;
            case ElementsType.ar:
                coverageName = "AR增强现实";
                break;
            case ElementsType.vr:
                coverageName = "VR虚拟现实";
                break;
        }
        return coverageName;
    },

    copyPageEvents: function (page) {
        var elments = (page.get("item_object"));
        if (elments && elments.length > 0) {
            GlobalFunc.copyElementsEvents(elments);
            page.set("item_object", elments);
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

            let url = ElementsEvents.getHref(el.attributes);
            if (url == "undefined" || url.indexOf("pageto:") == -1) {
                //不包含pageto事件
                return;
            }
            let events = ElementsEvents.url2Events(url);
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
            let newUrl = ElementsEvents.events2Url(events);
            var type = el.get("item_type")
            if (type == ElementsType.shake) {
                el.set("animate_end_act", newUrl)
            } else {
                el.set("item_href", newUrl)
            }
        })
    },
    copyElementsEvents: function (elementArr) {
        ///复制元素关联事件
        ///事件在item_href中，显示和隐藏的事件格式为show_el:item_id|hide_el:item_id
        ///复制事件对每个element生成新的item_id,保存新旧id对应关系，再将item_href里的旧id更新成新id
        if (!elementArr) return
        var idMap = {}
        elementArr.forEach((el) => {
            //生成新的id
            var newID = uuid.generateUidNum();
            idMap[el.get("item_id")] = newID;
            el.set("item_id", newID);
        });
        elementArr.forEach((el) => {
            //关联事件
            var type = el.get("item_type");
            if (!GlobalFunc.hasEventCfg(type)) {
                log.info("不可配置事件")
                //不可配置事件的href直接使用，不需要关联ID
                return;
            }
            if (type == ElementsType.picslide) {
                let picEvents = ElementsEvents.getPicEvents(el.attributes);
                picEvents.forEach(updateEvent.bind(global, idMap));
                let newUrl = ElementsEvents.composePicUrl(picEvents, el.attributes["item_val_sub"]);
                el.set("item_href", newUrl)
            } else {
                let url = ElementsEvents.getHref(el.attributes);
                let events = ElementsEvents.url2Events(url);
                events.forEach(updateEvent.bind(global, idMap));
                let newUrl = ElementsEvents.events2Url(events);
                if (type == ElementsType.shake || type == ElementsType.scribble) {
                    el.set("animate_end_act", newUrl)
                } else {
                    el.set("item_href", newUrl)
                }
            }

        });

        function updateEvent(idMap, event) {
            ///将事件里的旧id更新成新id
            if (event.action == "show_el" || event.action == "hide_el"|| event.action == "play_el"|| event.action == "pause_el") {
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
    getDateString: function getDateString(date, fmt) {
        // 对Date的扩展，将 Date 转化为指定格式的String
        // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
        // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
        // 例子：
        // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
        // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18

        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "H+": date.getHours(), //24小时
            "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //12小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    },
    getTimeString: function getTimeString(number, fmt) {
        var min = number % 60
        var o = {
            "m+": parseInt(number / 60), //minute
            "s+": number % 60, //second
        };
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    },
    canPaste: function () {
        var Clipboard = require("../../utils/Clipboard.util");
        var obj = Clipboard.getPasteElements();
        if (obj) {
            for (var i = 0, j = 0; i < obj.length; i++) {
                var type = obj[i].get("item_type");
                var item = obj[i];
                switch (type) {
                    case ElementsType.radio:
                        var page = PageStore.getSelectedPage();
                        var exist = sameTypeExistOnPage(item, page);
                        if (exist) {
                            GlobalFunc.addSmallTips("当前页已存在单选框,请不要重复添加", null, { clickCancel: true });
                            return false;
                        }
                        break;
                    case ElementsType.checkbox:
                        var page = PageStore.getSelectedPage();
                        var exist = sameTypeExistOnPage(item, page);
                        if (exist) {
                            GlobalFunc.addSmallTips("当前页已存在多选框,请不要重复添加", null, { clickCancel: true });
                            return false;
                        }
                        break;
                    case ElementsType.fingerprint:
                        var page = PageStore.getSelectedPage();
                        var exist = sameTypeExistOnPage(item, page);
                        if (exist) {
                            GlobalFunc.addSmallTips("当前页已存在指纹,请不要重复添加", null, { clickCancel: true });
                            return false;
                        }
                        break;
                    case ElementsType.redEnvelope:
                        if (GlobalFunc.existInWork(PageStore.getPages(), type)) {
                            GlobalFunc.addSmallTips("当前作品已存在红包,请不要重复添加", null, { clickCancel: true });
                            return false;
                        }
                        break;
                    case ElementsType.shake:
                        if (GlobalFunc.existInWork(PageStore.getPages(), type)) {
                            GlobalFunc.addSmallTips("当前作品已存在摇一摇,请不要重复添加", null, { clickCancel: true });
                            return false;
                        }
                        break;
                }
            }
            return true;
        }
        function sameTypeExistOnPage(item, page) {
            var type = item.get("item_type");
            var items = page.get("item_object");
            for (var j = 0; j < items.length; j++) {
                if (items[j].attributes.item_type == type) {
                    return true;
                }
            }
            return false;
        }
    },
    /**
     * 页数组中是否有itemType的元素
     * @param pages页数组
     * @param itemType
     * @returns {boolean}
     */
    existInWork: function (pages, itemType) {
        for (var i = 0; i < pages.length; i++) {
            var page = pages[i];
            var items = page.get("item_object")
            for (var j = 0; j < items.length; j++) {
                var curItem = items[j].get("item_type");
                if (itemType == curItem) {
                    return true;
                }
            }
        }
        return false;
    },
    trimStr: function (str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    existType: function (items, targetType) {
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var type = item.get("item_type");
            if (targetType == type) {
                return true
            }
        }
        return false;
    },
    decodeAnimateTime: function (timeString) {
        //将动画时间解析成对象格式，空对象用默认对象代替，
        // 动画时间是一个{'delay': 0.3, 'duration': 1, 'infinite': 1}的字符串，
        var obj;
        if (timeString) {
            obj = JSON.parse(timeString);
        }
        //animationVal = eval('(' + animationObj + ')');
        obj = obj || { 'delay': 0.3, 'duration': 1, 'infinite': 1 };
        return obj
    },
    decodeAnimateTimeline: function (timelineString) {
        //将动画时间线解析成时间对象格式
        //timelineString 格式'{  tween: [ "style", "", "top", "108px", { fromValue: "47px"}], position: 0, duration: 1000 }, {  tween: [ "style", "", "top", "244px", { fromValue:"108px"}], position: 1000, duration: 1175 }'
        //返回格式{0:{top:"47px"},1000:{top:"108px"},2175:{top:"244px"}}
        if (!timelineString) {
            return undefined;
        }
        var JSONStr = "[" + timelineString + "]";
        var rowTimeline = eval("(" + JSONStr + ")");
        var timeline = {};
        for (var i = 0; i < rowTimeline.length; i++) {
            var item = rowTimeline[i];
            var time = item.position;
            var nextTime = time + item.duration;
            var tween = item.tween;
            var type = tween[2];
            switch (type) {
                case "scaleX":
                    type = "x_scale";
                    break;
                case "scaleY":
                    type = "y_scale";
                    break;
                case "rotateZ":
                    type = "rotate_angle";
                    break;
                case "background-color":
                    type = "bg_color";
                    break;
                case "opacity":
                    type = "item_opacity";
                    break;
            }
            var value = tween[4].fromValue;
            var nextValue = tween[3];
            if (typeof timeline[time] == "undefined") {
                timeline[time] = { [type]: value };
            } else {
                timeline[time][type] = value;
            }
            if (typeof timeline[nextTime] == "undefined") {
                timeline[nextTime] = { [type]: nextValue };
            } else {
                timeline[nextTime][type] = nextValue;
            }
        }
        return timeline;
    },
    encodeAnimateTimeline: function (timelinePoints) {
        //将动画时间对象解析成动画时间线格式,timelinePoints里的值是绝对位置，时间轴需要相对最后一帧的位置
        // timelineObj 格式{0:{top:"47px"},1000:{top:"108px"},2175:{top:"244px"}}
        //返回的动画时间线格式'{  tween: [ "style", "", "top", "108px", { fromValue: "47px"}], position: 0, duration: 1000 }, {  tween: [ "style", "", "top", "244px", { fromValue:"108px"}], position: 1000, duration: 1175 }'
        if (!timelinePoints) {
            return "";
        }
        var timePoints = []
        for (var time in timelinePoints) {
            timePoints.push(parseInt(time));
        }
        if (timePoints.length == 0) {
            ///一个关键帧都没有
            return " "
        }
        timePoints.sort(function (a, b) {
            return a - b;
        });
        var lastFramePoint = timelinePoints[timePoints[timePoints.length - 1]];
        for (var i = 0; i < timePoints.length; i++) {
            var frame = timelinePoints[timePoints[i]];
            convertAbsoluteToRelative(frame, lastFramePoint)
        }

        var animateTimeline = [];
        var animateProps = timelinePoints[timePoints[0]];
        for (var prop in animateProps) {
            if (timePoints.length > 1) {
                for (var i = 0; i < timePoints.length - 1; i++) {
                    var timePoint = timePoints[i];
                    var nextTimePoint = timePoints[i + 1];
                    var point = { time: timePoint, value: timelinePoints[timePoint][prop], type: prop };
                    var nextPoint = { time: nextTimePoint, value: timelinePoints[nextTimePoint][prop], type: prop }
                    animateTimeline.push(encodeTimelineItem(point, nextPoint))
                }
            } else {
                var timePoint = timePoints[0];
                var point = { time: timePoint, value: timelinePoints[timePoint][prop], type: prop };
                animateTimeline.push(encodeTimelineItem(point, point))
            }

        }
        var JSONStr = JSON.stringify(animateTimeline);
        return JSONStr.substring(1, JSONStr.length - 1);
        function convertAbsoluteToRelative(convert, target) {
            //将一帧（convert）的绝对位置转成相对帧（target）的相对位置
            for (var prop in target) {
                switch (prop) {
                    case "top":
                    case "left":
                        convert[prop] = (convert[prop] - target[prop]).toFixed(3) + "px";
                        break;
                    case "rotate_angle":
                        convert[prop] = (convert[prop] - target[prop]).toFixed(3) + "deg";
                        break;
                    case "x_scale":
                    case "x_scale":
                        //case "item_opacity":
                        //    convert[prop] = (convert[prop] - target[prop]).toString();
                        break;
                }
            }


        }

        function encodeTimelineItem(timePoint, nextPoint) {
            //将两个时间点的数据生成动画时间线要求的格式
            //输入timePoint={time:0,value:100,type:"top"} nextPoint={time:1000,value:0,type:"top"}
            switch (timePoint.type) {
                case "top":
                case "left":
                case "width":
                case "height":
                    var tween = ["style", "", timePoint.type, nextPoint.value, { fromValue: timePoint.value }]
                    break;

                case "rotate_angle":
                    var tween = ["transform", "", "rotateZ", nextPoint.value, { fromValue: timePoint.value }]
                    break;
                case "item_opacity":
                    var tween = ["style", "", "opacity", nextPoint.value, { fromValue: timePoint.value }]
                    break;
                case "bg_color":
                    var tween = ["color", "", "background-color", nextPoint.value, {
                        animationColorSpace: 'RGB',
                        fromValue: timePoint.value
                    }]
                    break;
                case "x_scale":
                    var tween = ["transform", "", "scaleX", nextPoint.value, { fromValue: timePoint.value }]
                    break;
                case "y_scale":
                    var tween = ["transform", "", "scaleY", nextPoint.value, { fromValue: timePoint.value }]
                    break;
            }
            return { tween: tween, position: timePoint.time, duration: nextPoint.time - timePoint.time }
        }
    },
    getTimeObjFromTimeArr: function (timeArr) {
        //将视图需要的time array转换成时间线动画存储需要的对象格式
        //输入[{time:100,value:{top:"10px",left:"10px"}}]
        //返回{100:{top:"10px",left:"10px"}}
        timeArr.sort(function (a, b) {
            return a.time - b.time;
        });
        var timeObj = {}
        for (var i = 0; i < timeArr.length; i++) {
            var prop = timeArr[i].time;
            var value = timeArr[i].value
            timeObj[prop] = value
        }
        return timeObj;

    },
    propCanAnimate: function (propType) {
        ///属性是否可以做时间线动画
        var animateArray = ["item_top", "item_left", "item_width", "item_height", "x_scale", "y_scale", "rotate_angle", "item_opacity"]
        if (animateArray.indexOf(propType) != -1) {
            return true
        }
    },
    getAnimationName: function (itemAnimation) {
        if (!itemAnimation) return ["none"];
        if (itemAnimation.indexOf("[") != -1 && itemAnimation.indexOf("]") == itemAnimation.length - 1) {
            return GlobalFunc.toJson(itemAnimation);
        } else {
            var arrayObj = [];
            arrayObj.push(itemAnimation);
            return arrayObj;
        }

    },
    getAnimationTimeArr: function (itemAnimationVal) {
        if (!itemAnimationVal) {
            return [{ 'delay': 0, 'duration': 1, 'infinite': 1, type: 'in' }];
        }
        if (itemAnimationVal.indexOf("[") != -1 && itemAnimationVal.indexOf("]") == itemAnimationVal.length - 1) {
            return GlobalFunc.toJson(itemAnimationVal);
        } else {
            var arrayObj = [];
            arrayObj.push(GlobalFunc.toJson(itemAnimationVal));
            return arrayObj;
        }
    },
    resetTimelineFrame: function (element, frameProps) {
        element.set("item_top", parseFloat(frameProps.top));
        element.set("item_left", parseFloat(frameProps.left));
        element.set("item_width", parseFloat(frameProps.width));
        element.set("item_height", parseFloat(frameProps.height));
        element.set("x_scale", !isNaN(parseFloat(frameProps["x_scale"])) ? parseFloat(frameProps["x_scale"]) : 1);
        element.set("y_scale", !isNaN(parseFloat(frameProps["y_scale"])) ? parseFloat(frameProps["y_scale"]) : 1);
        element.set("rotate_angle", !isNaN(parseFloat(frameProps["rotate_angle"])) ? parseFloat(frameProps["rotate_angle"]) : 0);
        element.set("item_opacity", !isNaN(parseFloat(frameProps["item_opacity"])) ? parseFloat(frameProps["item_opacity"]) * 100 : 100);
    },
    isGroup: function (obj) {
        ///有"items" 但没有f_type是对用户不可见的根组
        return obj.get("f_type") == 2 || !!obj.get("items");
    },
    getParent: function (ID) {
        if (typeof ID != "string") {
            ID = ID.toString();
        }
        var IDArr = ID.split("|");
        IDArr.pop();
        return IDArr.join("|");
    },
    isBrother: function (ID1, ID2) {
        ////两个ID是否是同一层，拥有相同父节点是同一层的节点
        return this.getParent(ID1) === this.getParent(ID2)

    },
    getObjRef: function (workData, ID) {
        ///取ID对应的对象的引用
        if (typeof ID == "undefined") {
            throw "ID invalid";
        }
        ID = ID.toString();
        if (ID == "" || ID == "root") {
            ///root;
            return workData
        }
        var arr = ID.split("|");
        var Ref = workData.attributes["items"];
        if (!Ref) {
            throw "workData has no items"
        }
        var len = arr.length;
        for (var i = 0; i < arr.length; i++) {
            var layer = parseInt(arr[i]);
            if (isNaN(layer)) {
                throw " ID invalid"
            } else {
                if (i == len - 1) {
                    ///最后一层直接返回节点的引用
                    Ref = Ref[layer];
                } else {
                    ///不是最后一层，子组的引用
                    Ref = Ref[layer].attributes["items"];
                }
                if (!Ref) {
                    throw "workData has no items"
                }
            }
        }
        return Ref
    },
    getParentLayerID: function (ID) {
        ///取上层的ID
        var IDArr = ID.toString().split("|");
        if (IDArr.length == 1) {
            throw "getParentLayerID error";
        } else {
            IDArr.pop();
            return IDArr.join("|");
        }
    },
    getLastLayerIndex: function (ID) {
        ///取最后一层的序号
        var IDArr = ID.toString().split("|");
        var index = IDArr.pop();
        return index;

    },
    isRootLayer: function (selectInfo, workData) {
        return (!!tplData.attributes["items"] && selectInfo.index.indexOf("|") == -1)
    },
    getNodeDom: function (srcDom, type) {
        ///返回最近的一个有目录结构的父节点
        var dom = srcDom;
        while (!!dom) {
            if (typeof dom.dataset != "undefined" && dom.dataset.type != type) {
                //type一样
                dom = dom.parentNode;
                continue;
            }
            if (typeof dom.dataset == "undefined" || (typeof dom.dataset != "undefined" && typeof dom.dataset.id == "undefined")) {
                dom = dom.parentNode;
            } else {
                ///有ID
                break;
            }

        }
        if (!dom) {
            return null
        } else {
            return dom
        }
    },
    getDstID: function (mouseTop, targetDim, targetID, workData, srcID, tageName) {
        //生成放置时的ID
        var targetObj = GlobalFunc.getObjRef(workData, targetID);
        var ret = {};
        var newTargetID;
        console.log(tageName);
        //if(tageName=="DL"){
        //    debugger;
        //}
        var isBrother = GlobalFunc.isBrother(targetID, srcID);
        var canDrop = true;
        if (isBrother) {
            ///同层
            var targetLastIndex = GlobalFunc.getLastLayerIndex(targetID);
            var srcLastIndex = GlobalFunc.getLastLayerIndex(srcID);
            if (Math.abs(srcLastIndex - targetLastIndex) == 1) {
                var srcBeforeDst;
                ///相邻,
                if (srcLastIndex > targetLastIndex) {
                    ///src在dst之后
                    srcBeforeDst = false
                } else if (srcLastIndex < targetLastIndex) {
                    ///src在dst之前
                    srcBeforeDst = true
                }
                canDrop = adjacentCanDrop(targetID, mouseTop, targetDim, workData, srcBeforeDst)
            }

        }

        if (canDrop) {
            if (GlobalFunc.isGroup(targetObj)) {
                //if(mouseTop>targetDim.top + targetDim.height - 4){
                //    debugger;
                //}
                if (mouseTop < targetDim.top + 4) {
                    ret.type = "pre";
                    newTargetID = getPreIndex(targetID);

                } else if ((targetObj.get("f_collapse") == true || tageName == "DL") && (mouseTop > targetDim.top + targetDim.height - 4)) {

                    ///鼠标位于收起的组或展开组的下边缘时，放到组下
                    ret.type = "next";
                    newTargetID = getNextIndex(targetID);
                } else {
                    if (this.getParent(srcID) == targetID) {
                        //直接父节点
                        ret.type = "disable";
                    } else {
                        ret.type = "inner";
                        newTargetID = getInnerIndex(workData, targetID);
                    }
                }
                console.log("group");
            } else {
                ///页
                if (mouseTop < targetDim.top + targetDim.height / 2) {
                    ret.type = "pre";
                    newTargetID = getPreIndex(targetID);
                } else {
                    ret.type = "next";
                    newTargetID = getNextIndex(targetID);
                }
                console.log("page");
            }
            ret.targetID = newTargetID;
            var srcObj = GlobalFunc.getObjRef(workData, srcID);
            if (!GlobalFunc.isGroup(srcObj) && (typeof newTargetID == "undefined" || newTargetID.indexOf("|") == -1)) {
                ///页不能放在最上层
                ret.type = "disable"
            }
            if (newTargetID === srcID) {
                ret.type = "disable"
            }
            return ret
        } else {
            return { type: "disable" }
        }

        function adjacentCanDrop(targetID, mouseTop, targetDim, workData, srcBeforeDst) {
            ////相邻的两个元素是否可放置
            var canDrop;
            var targetObj = GlobalFunc.getObjRef(workData, targetID);
            if (srcBeforeDst) {
                if (GlobalFunc.isGroup(targetObj)) {
                    ///组上4px不可放置
                    if (mouseTop <= targetDim.top + 4) {
                        canDrop = false;
                    } else {
                        canDrop = true;
                    }
                } else {
                    ///页上半部分不可放置
                    if (mouseTop <= targetDim.top + targetDim.height / 2) {
                        canDrop = false;
                    } else {
                        canDrop = true;
                    }
                }
            } else {
                if (GlobalFunc.isGroup(targetObj)) {
                    ///组下4px不可放置
                    if (mouseTop >= targetDim.top + targetDim.height - 4) {
                        canDrop = false;
                    } else {
                        canDrop = true;
                    }
                } else {
                    ///页gh 半部分不可放置
                    if (mouseTop >= targetDim.top + targetDim.height / 2) {
                        canDrop = false;
                    } else {
                        canDrop = true;
                    }
                }
            }
            return canDrop;

        }

        function getNextIndex(targetID) {
            var IDArr = targetID.split("|");
            var lastIndex = parseInt(IDArr.pop());
            IDArr.push(+lastIndex + 1);
            return IDArr.join("|");
        }

        function getPreIndex(targetID) {
            return targetID;
        }

        function getInnerIndex(workData, targetID) {
            var targetObj = GlobalFunc.getObjRef(workData, targetID);
            var children = targetObj.attributes.items;
            var index = children.length;
            return targetID + "|" + index;

        }
    },
    /**
     * 更新属性
     * @param targetObj 要更新的对象
     * @param attrObj  更新的属性和值
     */
    updateObj: function (targetObj, attrObj) {
        for (var prop in attrObj) {
            targetObj.set(prop, attrObj[prop])
        }
    },
    /**
     * 计算出对象在树上的层次索引号（index）
     * @param obj 要计算的对象
     */
    getIndexByObj: function (obj) {
        var IDArr = [];
        var curNode = obj;
        while (curNode) {
            var curID = this.getLastIndexByObj(curNode);
            if (curID != -1) {
                IDArr.unshift(curID)
            } else {
                break;
            }
            curNode = curNode.get("parent")
        }
        if (IDArr.length > 0) {
            return IDArr.join("|")
        } else {
            throw "error"
        }
    },
    /**
     * 计算出对象在直接父节点上的索引
     * @param obj
     */
    getLastIndexByObj: function (obj) {
        var parent = obj.get("parent");
        if (parent && parent.get) {
            var arr = parent.get("items");
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == obj) {
                    return i;
                }
            }
        } else {
            ///没有父节点
            return -1;
        }

        //throw "getLastIndexByObj error"
    },
    /**
     * 是否能点上一层
     * @param workData
     * @param selectInfo
     * @returns {boolean}
     */
    nodeCanUp: function (workData, selectInfo) {
        var selectObj = GlobalFunc.getObjRef(workData, selectInfo.index);
        var parent = selectObj.get("parent");
        if (parent.get("items")[0] == selectObj) {
            return false;
        } else {
            return true;
        }
    },
    /**
     * 是否能点下一层
     * @param workData
     * @param selectInfo
     * @returns {boolean}
     */
    nodeCanDown: function (workData, selectInfo) {
        var selectObj = GlobalFunc.getObjRef(workData, selectInfo.index);
        var parent = selectObj.get("parent");
        var children = parent.get("items");
        if (children[children.length - 1] == selectObj) {
            return false;
        } else {
            return true;
        }
    },
    /**
     * 是否能删除
     * @param workData
     * @param selectInfo
     * @returns {boolean}
     */
    nodeCanRemove: function (workData, selectInfo) {
        var parentID = GlobalFunc.getParent(selectInfo.index);
        var selectObj = GlobalFunc.getObjRef(workData, selectInfo.index);
        var parent = selectObj.get("parent");
        var children = parent.get("items");
        if (parentID == "") {
            return children.length > 1;
        }
        return true;

    },
    /**
     * 是否能添加页
     * @param selectInfo
     */
    canAddPage: function (ID) {
        if (typeof ID == "number") {
            ID = "" + ID;
        }
        if (ID.indexOf("|") > -1) {
            ///只有选中顶层时不能加页
            return true;
        } else {
            return false
        }
    },
    /**
     * traversal tree , execute func on every node
     * @param root
     * @param skipGroup 对组节点是否执行func
     * @param func
     */
    traversalTree: function (root, skipGroup, func) {
        if (GlobalFunc.isGroup(root)) {
            if (!skipGroup) {
                func(root);
            }
            var children = root.get("items");
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                GlobalFunc.traversalTree(child, skipGroup, func);
            }

        } else {
            func(root)
        }

    },
    genElementName: function (elements, obj) {
        var type = obj.get("item_type");
        var maxNumber = 0;
        elements.forEach((el) => {
            var elName = el.get("f_name");
            if (el.get("item_type") == type && !!elName) {
                var numberMatch = elName.match(/\d+$/);
                if (numberMatch != null) {
                    var number = parseInt(numberMatch[0]);
                    if (maxNumber < number) {
                        maxNumber = number
                    }
                }
            }
        });
        var namePre = GlobalFunc.getObj(obj);
        return namePre + (+maxNumber + 1)
    },
    /**
     * 取页名字
     * @param pageUid
     */
    getPageName: function (pageUid, workData) {
        if (typeof pageUid == "undefined") {
            return ""
        }

        if (workData.get("items")) {
            var children = workData.get("items");
            for (var i = 0; i < children.length; i++) {
                var name = GlobalFunc.getPageName(pageUid, children[i]);
                if (typeof name != "undefined") {
                    return name;
                }
            }
        } else {
            if (workData.get("page_uid") == pageUid) {
                return workData.get("f_name") || ""
            }
        }

    },

    /**
     * 修改封面缩略图URL,去掉开头的“AV”，去掉之后的压缩
     * @param url 返回的url
     */

    subAvChar: function (url) {
        try {
            var newurl = url.substr(0, 3) == "AV:" ? url.substr(3) : url;
            var ipos = newurl.indexOf("?");
            var returnurl = newurl;
            if (ipos > 0) {
                returnurl = newurl.substr(0, ipos);
            }
        } catch (e) {
            console.error(e)
        }


        return returnurl;
    },

    /**
     * 字符串是否能转化成obj
     * @param str
     * @returns {boolean}
     */
    isJsonObject: function (str) {
        return str && 0 == str.indexOf("{") && str.lastIndexOf("}") == str.length - 1 ? true : false
    },
    /**
     * 元素是否可配置事件
     * @param type
     * @returns {boolean}
     */
    hasEventCfg: function (type) {
        var cfgEvent = true;
        switch (type) {
            case ElementsType.video:
            case ElementsType.music:
            case ElementsType.reward:
            case ElementsType.button:
            case ElementsType.phone:
                cfgEvent = false;
                break;
            default:
                cfgEvent = true;
        }
        return cfgEvent
    },
    /**
     * 验证网站url合法性
     * @param url
     * @returns {boolean}
     */
    validUrl: function (url) {
        return (/^(http:\/\/|https:\/\/)?((?:[A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\.())+([A-Za-z]+)[/\?\:]?.*$/).test(url)
    },
    /**
     * 检查文件大小的合法性
     * @param files
     * @param maxSize
     * return
     * {
     * code:校验结果代码：0为合法，1为不合法，2为文件太大
     * msg:错误消息
     * }
     */
    validFileSize: function (files, maxSize) {
        var ret = { code: 1, msg: "输入文件不合法" }
        if (!files || !files.length || typeof files.item != "function") {
            return ret;
        }
        for (var i = 0; i < files.length; i++) {
            var file = files.item(i);
            if (file.size > maxSize) {
                ret.msg = file.name
                ret.code = 2
                return ret
            }
        }
        return {
            code: 0
        }

    },
    /**
     * 检查文件类型的合法性
     * @param files
     * @param types 合法文件类型
     * return
     * 0:合法，1： 不合法
     */
    validFileType: function (files, types) {
        if (!files || !files.length || typeof files.item != "function") {
            return ret;
        }
        for (var i = 0; i < files.length; i++) {
            var file = files.item(i);
            if (types.indexOf(file.type) == -1) {
                return 1
            }
        }
        return 0
    },
    //格式化时间显示 add gy guYY 2016/7/8
    formatTimeToStr: function (time, format) {
        var t = new Date(time);
        var tf = function (i) {
            return (i < 10 ? '0' : '') + i
        };
        return format.replace(/yyyy|MM|dd|HH|mm|ss|M|d|H|m|s/g, function (a) {
            switch (a) {
                case 'yyyy':
                    return tf(t.getFullYear());
                    break;
                case 'MM':
                    return tf(t.getMonth() + 1);
                    break;
                case 'mm':
                    return tf(t.getMinutes());
                    break;
                case 'dd':
                    return tf(t.getDate());
                    break;
                case 'HH':
                    return tf(t.getHours());
                    break;
                case 'ss':
                    return tf(t.getSeconds());
                    break;
                case 'M':
                    return t.getMonth() + 1;
                    break;
                case 'd':
                    return t.getDate();
                    break;
                case 'H':
                    return t.getHours();
                    break;
                case 'm':
                    return t.getMinutes();
                    break;
                case 's':
                    return t.getSeconds();
                    break;
            }
        })
    },
    /**
     * 元素X坐标转化成窗口坐标
     * @param posX
     * @returns {number}
     */
    deviceX2Client: function (posX) {
        var deviceScale = GlobalFunc.getDeviceScale();
        var deviceX = posX * deviceScale;
        var $device = $("#device-content");
        var deviceLeft = $device.offset().left * deviceScale;
        return deviceLeft + deviceX
    },
    /**
     * 元素Y坐标转化成窗口坐标
     * @param posX
     * @returns {number}
     */
    deviceY2Client: function (posY) {
        var deviceScale = GlobalFunc.getDeviceScale();
        var deviceY = posY * deviceScale;
        var $device = $("#device-content");
        //var deviceContainer = $device[0].parentNode.parentNode;
        //var deviceTop = ($device.offset().top + deviceContainer.scrollTop) * deviceScale;
        var deviceTop = $device.offset().top * deviceScale
        return deviceTop + deviceY;

    },

    getPointMod: function (point) {
        if (typeof point.x == "number" && typeof point.y == "number") {
            return Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2))
        } else {
            throw "invalid point"
        }
    },

    /**
     * 判断是否为gif图片
     * @param url string
     * @return boolean
     */
    isGif: function (url) {
        var _url;
        //参数url不为空并且类型为字符串
        if (url && typeof url === "string") {
            _url = url;
        } else {
            _url = '';
        }

        return _url.substr(_url.length - 4, 4).toUpperCase() === ".GIF";
    },
    /*localStorage 取出对象*/
    getLocalStorageObject: function (prototype) {
        var str = window.localStorage.getItem(prototype);
        var result = {};
        if (str && str != "") {
            result = JSON.parse(str);
        }
        return result;
    },
    setLocalStorageObject: function (prototype, obj) {
        var str = JSON.stringify(obj);
        window.localStorage.setItem(prototype, str);
    },
    getLocalStorageValue: function (prototype, key) {
        var obj = this.getLocalStorageObject(prototype);
        if (obj[key]) {
            return obj[key];
        }
        return null;
    },
    addLocalStorageObject: function (prototype, key, value) {
        var obj = this.getLocalStorageObject(prototype);
        obj[key] = value;
        this.setLocalStorageObject(prototype, obj);
    },
    delLocalStorageObject: function (prototype, key) {
        var obj = this.getLocalStorageObject(prototype);
        if (obj[key]) {
            delete obj[key];
        }
        this.setLocalStorageObject(prototype, obj);
    },
    /**
     * 比较当前查询时间段key 、缓存时间段key : 作品ID相同，日期相同且缓存天数30大于等于查询天数7 返回true 否则返回false
     * @param dateNow 格式：1562b27aee62cce8_2016_08_02_366
     * @param dateLocal 格式：562b27aee62cce8_2016_08_02_7
     * @returns {boolean}
     */
    sameKeyForStatistics: function (dateNow, dateLocal) {
        var nowLastIndex = dateNow.lastIndexOf("_");
        var localLastIndex = dateLocal.lastIndexOf("_");
        if (dateNow.substr(0, nowLastIndex) != dateLocal.substr(0, localLastIndex)) {
            return false;
        }
        var dateNowDay = dateNow.substring(nowLastIndex + 1);
        var dateLocalDay = dateLocal.substring(localLastIndex + 1);
        return parseInt(dateLocalDay) >= parseInt(dateNowDay);
    },
    isLineFeedText: function (attrs) {
        //换行文本满足下列条件之一
        //1 设置了自动换行属性is_wrap 为true
        //2 新数据 有fixedSize，且fixedSize.width为true
        //3 老数据，没有fixedSize，但是item_width>0
        if (attrs["item_type"] == ElementsType.text) {
            if (attrs["is_wrap"]) {
                //设置了自动换行属性的是换行文本
                return true
            } else {
                //没有自动换行属性时，换行文本满足下列条件之一
                //1 新数据 有fixedSize，且fixedSize.width为true
                //2 老数据，没有fixedSize，但是item_width>0
                var fixedSize = attrs["fixed_size"];
                if (fixedSize) {
                    if (fixedSize.width) {
                        return true
                    } else {
                        return false
                    }

                } else if (attrs['item_width'] > 0) {
                    return true
                }
                return false
            }

        } else {
            return false
        }
    },
    /**
     * 是否是背景元素
     */
    isBackground: function (attrs) {
        if (attrs['item_type'] == ElementsType.background && !attrs['group_id']) {
            return true
        }
        return false;
    },
    /**
     * 对象是否为空
     * @param obj //要判断的对象
     */
    isEmptyObject: function (obj) {
        for (var n in obj) { return false }
        return true;
    },
    /**
     * 获取用户购买的code
     * @param userID 用户的ID
     * @param code  特权code
     *return  对应的一条特权信息，如果条件不符合或没有，返回undefined
     */
    getPrivilegeByCode: function (userID, code) {
        var cache = localStorage.getItem("owngoods");
        if (!cache) {
            //没有缓存
            return undefined
        }
        var cacheObj = JSON.parse(cache);
        if (cacheObj.user != userID) {
            return undefined
        }
        var result = cacheObj.data;
        for (let i of result) {
            let item = result[i]
            if (code == item.item_description.item_id) {
                return item
            }
        }
        return undefined
    },
    /**
     * 作品对应的特权是否付过费
     * 
     */
    ifCharged: function (tid, priviegeArr) {

    },

    htmlEncode: function (unsafe) {
        if (!unsafe) return unsafe
        // var Encoder = require('node-html-encoder').Encoder;
        // var encoder = new Encoder('entity');
        // return encoder.htmlEncode(unsafe)
        return partialEncode(unsafe)
        function partialEncode(unsafe) {
            return unsafe
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
        }
    },

    htmlDecode: function (safe) {
        if (!safe) return safe
        // var Encoder = require('node-html-encoder').Encoder;
        // var encoder = new Encoder('entity');
        // return encoder.htmlDecode(safe)
        return partialEncode(safe)
        function partialEncode(safe) {
            return safe
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
        }
    },
    escapeHtml: function (unsafe) {
        if (!unsafe) return unsafe
        return unsafe
            //  .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
        //  .replace(/"/g, "&quot;")
        //  .replace(/'/g, "&#039;");
    },
    /**
     * TODO 需要保存作品状态变迁履历表
     * obj
     *    tpl_id  //作品ID
     *    user_name  //操作用户
     *    user_id  //操作用户
     *    delete_status //是否删除
     *    action  //操作
     *    tpl_state // 作品状态
     * 
     */
    addRecord(obj, cb) {
        var RecordObj = AV.Object.extend("tpl_record");  //履历表名
        var recordObj = new RecordObj();
        for (var i in obj) {
            recordObj.set(i, obj[i]);
        }

        recordObj.save(null, {
            success: function (data) {
                cb && cb(data)
            },
            error: function (error) {
                console.log(error);
                cb && cb(data)
            }
        });
    },
    /*
    * 解析 new Date() 对象
    */
    parseNewDate: function (d) {
        if (!d) {
            return ""
        }
        var hours = d.getHours() < 10 ? "0" + d.getHours() : d.getHours(),
            minutes = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
        return d.getFullYear() + "/" + (d.getMonth() + 1) + "/" + d.getDate() + " " + hours + ":" + minutes;
    },
    getReviewText: function (code) {
        var ret = "无";
        switch (code) {
            case 1:
                ret = "待审核";
                break;
            case 2:
                ret = "告警";
                break;
            case 3:
                ret = "人工巡检正常";
                break;
            case 4:
                ret = "初审拒绝";
                break;
            case 5:
                ret = "已申诉";
                break;
            case 6:
                ret = "复审拒绝";
                break;
            case 7:
                ret = "人工审核通过";
                break;
        }
        return code+ret;
    }
});

module.exports = GlobalFunc;
