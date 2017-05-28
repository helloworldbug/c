/**
 * @component CommonUtils
 * @description 公共工具类
 * @time 2015-09-10 15:39
 * @author StarZou
 **/

var React = require('react');
var QRCode = require('qrcode.react');
var _ = require('lodash');
var moment = require('moment');

var defaultUserAvatar = require('../../assets/images/main/mrPicture.png');

var MakeWebAPIUtils = require("../utils/MakeWebAPIUtils");
var GlobalFunc = require("../components/Common/GlobalFunc");
var MakeActionCreators = require('../actions/MakeActionCreators');

var DialogAction = require("../actions/DialogActionCreator");
var MakeAction = require('../actions/MakeActionCreators');

var MagazineStore = require('../stores/MagazineStore');
var PageStore = require('../stores/PageStore');
var ElementStore = require('../stores/ElementStore');
var MeConstants = require('../constants/MeConstants');
var ElementType = MeConstants.Elements;

var ItemInit = require("../components/Common/ItemInit");
var RedEnvelope = require("../components/Common/RedEnvelope");

/**
 * init
 */
moment.locale('zh-cn');

/**
 * 提供字符串format函数
 */
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

/**
 * 为工具类服务的常量对象
 */
var constants = {
    pageSize     : 15,// 每页作品数量
    selectSQL    : ' select {0} from ',// 基础查询语句
    selectColumns: ' count(*),* ',// 查询列
    whereSQL     : ' where ',// 条件语句
    limitSQL     : ' limit {0},{1} ',// 分页语句
    orderBySQL   : ' order by '// 分页语句
};

var CommonUtils = {
    constants: constants,

    /**
     * 计算分页语句
     * @param currentPage
     * @param pageSize
     */
    getLimitSQL: function (currentPage, pageSize) {
        if (!currentPage) {
            return ' ';
        }

        var offset,// 偏移量
            limit;// 限定数

        pageSize = pageSize || constants.pageSize;// 每页数
        offset = ((currentPage - 1) * pageSize);
        limit = pageSize;

        return constants.limitSQL.format(offset, limit);
    },

    /**
     * 计算条件语句
     * @param whereCondition
     * @param relation
     * @returns {string}
     */
    getWhereSQL: function (whereCondition, relation) {
        if (!whereCondition) {
            return ' ';
        }

        relation = relation || ' and ';

        var names = Object.getOwnPropertyNames(whereCondition),
            name,
            value,
            index,
            conditionSQL = '',
            canAppend,
            length = names.length,
            stopIndex = length - 1;

        for (index = 0; index < length; index++) {
            name = names[index];
            value = whereCondition[name];

            canAppend = (value != null);
            if (canAppend) {
                conditionSQL += (' ' + name + value);
            }

            if (canAppend && index != stopIndex) {
                conditionSQL += relation;
            }
        }

        return constants.whereSQL + conditionSQL;
    },

    /**
     * 计算排序语句
     * @param orderCondition
     * @returns {string}
     */
    getOrderBySQL: function (orderCondition) {
        if (!orderCondition) {
            return ' ';
        }

        return constants.orderBySQL + orderCondition;
    },

    /**
     * 取得SQL语句
     * @param option
     * @returns {string}
     */
    getSelectSQL: function (option) {
        // 查询列
        var selectColumns = option.selectColumns;
        if (_.isArray(selectColumns)) {
            selectColumns = selectColumns.join(',');
        } else if (_.isUndefined(selectColumns)) {
            selectColumns = constants.selectColumns;
        }

        var selectSQL = constants.selectSQL.format(selectColumns);// 查询语句
        selectSQL += option.className;// 类
        selectSQL += this.getWhereSQL(option.whereCondition, option.relation);// where条件, 关系
        selectSQL += this.getLimitSQL(option.currentPage, option.pageSize);// 当前页, 页数量
        selectSQL += this.getOrderBySQL(option.orderCondition);// 排序条件

        return selectSQL;
    },

    /**
     * 是否有下一页
     * @param count
     * @param currentPage
     * @param pageSize
     */
    hasNext: function (count, currentPage, pageSize) {
        pageSize = pageSize || constants.pageSize;
        return (currentPage * pageSize) < count;
    },

    /**
     * 计算一个时间对比现在时间
     * @param date
     * @return string
     */
    fromNow: function (date) {
        return moment(date).fromNow();
    },

    /**
     * 生成查看的url
     * @param tid
     * @return {string}
     */
    generateViewTemplateUrl: function (tid) {
        return `${location.origin}/${tid}/shareme.html?tid=${tid}&dataFrom=pc2-0`;
        // if (fmawr == 0) {  // 测试服
        //     return `http://test.agoodme.com/${tid}/shareme.html?tid=${tid}&dataFrom=pc2-0`;
        // } else {
        //     return `http://www.agoodme.com/${tid}/shareme.html?tid=${tid}&dataFrom=pc2-0`;
        // }
    },

    generateViewMessageUrl : function(id){
        var url = "/views/pushing/index.html?gid=" + id;
        var host=location.origin;
        // var host = "http://www.agoodme.com";
        // if(fmawr == 0){
        //     host = "http://test.agoodme.com";
        // }

        return host + url;
    },

    /**
     * 生成二维码
     * @param value
     * @param size
     */
    generateQRCode: function (value, size = 128) {
        return (<QRCode value={value} size={size}/>);
    },

    /**
     * 获取默认头像图片
     */
    getDefaultUserAvatar: function () {
        return defaultUserAvatar;
    },

    /**
     * 检测是否是移动设备
     * @return {boolean|*}
     */
    isMobile: function () {
        if (this.isMobileValue === undefined) {
            this.isMobileValue = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        }
        return this.isMobileValue;
    },

    /**
     * 替换版式
     * @param tid
     * @param cb_ok
     * @param cb_err
     */
    replaceTemplateById : function(tid, cb_ok, cb_err){
        fmacapi.tpl_get_tpl(tid, function (data) {
            var version = data.get("render_version");
            MakeWebAPIUtils.cld_get_tpl_data_local(tid, function (data) {
                var pages = data.get("pages");
                MakeActionCreators.replacePage({
                    tid              : tid,
                    pageObj          : pages,
                    pageRenderVersion: version
                });
                if(cb_ok) cb_ok();
            }, function () {
                if(cb_ok) cb_ok();
                GlobalFunc.addSmallTips("服务器连接失败，请稍后再试。", null, {delBackGround: true, clickCancel: true});
            });
        }, function () {
            if(cb_ok) cb_ok();
            GlobalFunc.addSmallTips("服务器连接失败，请稍后再试。", null, {delBackGround: true, clickCancel: true});
        });
    },


    /**
     * 添加涂抹
     */
    addTuMo : function(){
        console.log("addTuMo")
        if (!!ElementStore.getDisplayFrame()) {
            GlobalFunc.addSmallTips("当前页面不支持该功能", 2, {delBackGround: true});
            return;
        }
        DialogAction.show("scribble");
    },

    /**
     * 添加地图
     */
    addDiTu : function(){
        MakeAction.addElement({type: 'map', obj: ItemInit.mapInit()});
    },

    /**
     * 添加指纹
     */
    addZhiWen : function(){
        var exist = this.findElementFromCurrentPage(25);
        if (exist == false) {
            MakeAction.addElement({type: 'fingerprint', obj: ItemInit.fingerprintInit()});
        }else{
            GlobalFunc.addSmallTips("当前页已存在指纹,请不要重复添加", null, {clickCancel: true});
        }
    },

    /**
     * 添加摇一摇元素
     */
    addYaoYiYao : function(){
        var exist = this.findElementFromPages(27);
        if (exist == false) {
            MakeAction.addElement({type: 'shake', obj: ItemInit.shakeInit()});
        }else{
            GlobalFunc.addSmallTips("当前作品已存在摇一摇,请不要重复添加", null, {clickCancel: true});
        }
    },

    /**
     * 添加一键拨号元素
     */
    addYiJianBoHao : function(){
        MakeAction.addElement({type: 'phone', obj: ItemInit.phoneInit()});
    },

    /**
     * 添加标签元素
     */
    addBiaoQian : function(){
        MakeAction.addElement({type: 'label', obj: ItemInit.labelInit()});
    },

    /**
     * 添加浮层元素
     */
    addFuCeng : function(){
        var DisplayFrameObj = ItemInit.makeDisplayFrame();
        MakeAction.addElement({type: 'displayFrame', obj: DisplayFrameObj})
    },

    /**
     * 添加图集元素
     */
    addTuJi : function(){
        DialogAction.show("multimaterial", "", {materialType: 5, itemType: "picslide", maxselect: 9});
    },

    /**
     * 添加打赏元素
     */
    addDaShang : function(){
        GlobalFunc.addSmallTips("该组件只在微信中可见", 2, {delBackGround: true});
        MakeAction.addElement({type: 'reward', obj: ItemInit.rewardInit()});
    },

    /**
     * 添加投票元素
     */
    addTouPiao : function(){
        MakeAction.addElement({type: 'vote', obj: ItemInit.voteInit()});
    },

    /**
     * 添加红包元素
     */
    addHongBao : function(){
        RedEnvelope.getSwitch().then(function setupAdd(result) {
            var tpl = MagazineStore.getTpl().attributes;
            if (GlobalFunc.existInWork(MagazineStore.getAllPagesRef(), ElementType.redEnvelope)) {
                GlobalFunc.addSmallTips("一个作品只能添加一个红包", null, {clickCancel: true});
                return;
            }

            var tid = tpl["tpl_id"]
            DialogAction.show("redenvelope", "", {moneyMin: result.moneymin, moneyMax: result.moneymax, tid: tid});
        }).catch(function err(message) {
            GlobalFunc.addSmallTips(message, null, {clickCancel: true});
        })
    },

    /**
     * 添加svg元素
     */
    addSVG : function(){
        MakeAction.addElement({type: 'svg', obj: ItemInit.svgInit()});
    },

    /***
     * 添加全景元素
     */
    addPanorama : function(){
        DialogAction.show("multimaterial", "", {materialType: 5, itemType: "panorama", maxselect: 36});
    },

    addAR : function(){
        MakeAction.addElement({type: 'ar', obj: ItemInit.arInit()});
    },

    addVR : function(){
        MakeAction.addElement({type: 'vr', obj: ItemInit.vrInit()});
    },

    /**
     * 从当前页查找元素
     * @param type
     * @returns {boolean}
     */
    findElementFromCurrentPage : function(type){
        var result = false;
        var page = PageStore.getSelectedPage();
        var item = page.get("item_object");
        for (var i = 0; i < item.length; i++) {
            if (item[i].attributes.item_type == type) {
                result = true;
                break;
            }
        }
        return result;
    },

    /**
     * 从当所有页查找元素
     * @param type
     * @returns {boolean}
     */
    findElementFromPages : function(type){
        var result = false;
        var pages = MagazineStore.getAllPagesRef();
        for (var i = 0; i < pages.length && result == false; i++) {
            var page = pages[i];
            var item = page.get("item_object");
            for (var j = 0; j < item.length; j++) {
                if (item[j].attributes.item_type == type) {
                    result = true;
                    break;
                }
            }
        }
        return result
    },

    addElementByType : function(type){
        switch (type){
            case ElementType.scribble:
                this.addTuMo();
                break;
            case ElementType.fingerprint:
                this.addZhiWen();
                break;
            case ElementType.map:
                this.addDiTu();
                break;
            case ElementType.shake:
                this.addYaoYiYao();
                break;
            case ElementType.phone:
                this.addYiJianBoHao();
                break;
            case ElementType.label:
                this.addBiaoQian();
                break;
            case ElementType.displayFrame:
                this.addFuCeng();
                break;
            case ElementType.picslide:
                this.addTuJi();
                break;
            case ElementType.reward:
                this.addDaShang();
                break;
            case ElementType.vote:
                this.addTouPiao();
                break;
            case ElementType.redEnvelope:
                this.addHongBao();
                break;
            case ElementType.svg:
                this.addSVG();
                break;
            case ElementType.panorama:
                this.addPanorama();
                break;
            case ElementType.ar:
                this.addAR();
                break;
            case ElementType.vr:
                this.addVR();
                break;
        }
    }
};

module.exports = CommonUtils;