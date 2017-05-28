/**
 * @component TemplateUtils
 * @description 操作模板的工具类
 * @time 2015-09-15 14:56
 * @author StarZou
 **/

var _ = require('lodash');
var keyMirror = require('keymirror');

// 卡片组件类型
var CardTypes = keyMirror({
    MagazineCard: null,// 杂志
    UserMagazineCard: null,// 用户杂志
    TemplateCard: null,// 模板
    DesignerCard: null// 设计师认证
});

// 模板类型
var TemplateTypes = keyMirror({
    hotMagazine: null,// 热门杂志
    newMagazine: null,// 最新杂志
    bestMagazine: null,// 精品杂志
    industryTemplate: null,// 行业模板
    personalTemplate: null,// 个人模板
    publishedMagazine: null,// 已发布杂志
    unpublishedMagazine: null,// 未发布, 草稿箱杂志
    recycle: null,//回收站
    illegalWork: null,//异常作品
    myFavoritesMagazine: null,// 我收藏的杂志
    myTemplate: null,// 我的模板
    chargedTemplate:null,// 收费模板
    pingYaoMagazine: null,//平遥摄影展杂志
    userOtherMagazine: null,// 该作者其他杂志
    PUBLISH_MESSAGE: null,      //已发消息
    UNPUBLISH_MESSAGE: null,   //草稿箱消息
    RECYCLE_MESSAGE: null      //回收站消息
});

// 模板类型与查询参数 映射
var TemplateTypeToQueryOptionMap = {
    [TemplateTypes.hotMagazine]: {
        orderCondition: 'read_int desc'
    },

    [TemplateTypes.newMagazine]: {
        orderCondition: 'reupdate_date desc'
    },

    [TemplateTypes.bestMagazine]: {
        orderCondition: 'editor_recno desc',
        whereCondition: {
            'tpl_class': '=2'
        }
    },

    [TemplateTypes.industryTemplate]: {
        orderCondition: 'editor_recno desc',
        whereCondition: {
            tpl_class: '=1',
            tpl_type: '=10'
        }
    },

    [TemplateTypes.personalTemplate]: {
        orderCondition: 'editor_recno desc',
        whereCondition: {
            tpl_class: '=0',
            tpl_type: '=10'
        }
    },

    [TemplateTypes.publishedMagazine]: {
        orderCondition: 'reupdate_date desc',
        whereCondition: {
            approved: null,
            tpl_state: '=2',
            review_status: ' not in(4,5,6)',//审核通过或还没审核
            tpl_delete: '=0'// 没有被删除
        }
    },

    [TemplateTypes.unpublishedMagazine]: {
        orderCondition: 'reupdate_date desc',
        whereCondition: {
            approved: null,
            tpl_state: '=1',
            data_site: '="1"', //来源于pc外的作品不显示
            tpl_delete: '=0'// 没有被删除
        }
    },

    [TemplateTypes.recycle]: {
        orderCondition: 'tpl_delete_date desc',
        whereCondition: {
            approved: null,
            tpl_delete: '=1'
        }
    },
    [TemplateTypes.illegalWork]: { //异常作品
        orderCondition: 'reupdate_date desc',
        whereCondition: {
            approved: null,
            tpl_state: '=2',
            review_status: ' in(4,5,6)',//审核拒绝
            tpl_delete: '=0'
        }
    },
    [TemplateTypes.myFavoritesMagazine]: {
        orderCondition: 'reupdate_date desc',
        whereCondition: {
            approved: null,
            tpl_delete: '=0'// 没有被删除
        }
    },

    [TemplateTypes.myTemplate]: {
        orderCondition: 'reupdate_date desc',
        whereCondition: {
            approved: null,
            tpl_type: '=10',
            tpl_delete: '=0'// 没有被删除
        }
    },

    [TemplateTypes.pingYaoMagazine]: {
        orderCondition: 'editor_recno desc',
        whereCondition: {
            label: ' all (\'平遥摄影展\') '
        }
    },

    [TemplateTypes.userOtherMagazine]: {
        orderCondition: 'reupdate_date desc',
        whereCondition: {
            approved: null,
            tpl_state: '=2'
        }
    },

    [TemplateTypes.PUBLISH_MESSAGE]: {
        currentPage: 1,
        whereCondition: {
            type: "3",
            pageSize: 15
        }
    },
    [TemplateTypes.UNPUBLISH_MESSAGE]: {
        currentPage: 1,
        whereCondition: {
            type: "1",
            pageSize: 15
        }
    },
    [TemplateTypes.RECYCLE_MESSAGE]: {
        currentPage: 1,
        whereCondition: {
            type: "4",
            pageSize: 15
        }
    }

};

// 默认查询参数
var DefaultQueryOption = {
    currentPage: 1,
    whereCondition: {
        approved: '=1',// 已上架
        tpl_type: '=11'// 杂志类型
    }
};

// 常量
var constants = {
    TemplateTypes: TemplateTypes,
    CardTypes: CardTypes
};

// 上下文
var context = {
    templateTypeToQueryOptionMap: {}
};

// 页面配置, 包含有哪些tabs、其他配置
var PageConfig = {
    create: {
        tabs: [
            { label: '行业模板', value: TemplateTypes.industryTemplate, cardType: CardTypes.TemplateCard },
            { label: '个人模板', value: TemplateTypes.personalTemplate, cardType: CardTypes.TemplateCard }
        ],
        showSearchForm: true,
        showCreateButton: true,
        allowLoadMore: true
    },

    index: {
        tabs: [
            { label: '热门杂志', value: TemplateTypes.hotMagazine },
            { label: '最新杂志', value: TemplateTypes.newMagazine },
            { label: '精品杂志', value: TemplateTypes.bestMagazine }
        ],
        showSearchForm: true,
        showMoreButton: true,
        allowLoadMore: true
    },

    discovery: {
        tabs: [
            { label: '热门杂志', value: TemplateTypes.hotMagazine },
            { label: '最新杂志', value: TemplateTypes.newMagazine },
            { label: '平遥摄影展', value: TemplateTypes.pingYaoMagazine }
        ],
        showSearchForm: true,
        allowLoadMore: true
    },

    preview: {
        tabs: [
            { label: '该作者其他杂志', value: TemplateTypes.userOtherMagazine }
        ],
        showMoreButton: true
    },

    /* 设计师认证 */
    designer: {
        tabs: [
            { label: '作品秀', value: TemplateTypes.publishedMagazine, cardType: CardTypes.DesignerCard }
        ]
    },

    user: {
        tabs: [
            { label: '已发布', value: TemplateTypes.publishedMagazine, cardType: CardTypes.UserMagazineCard },
            { label: '草稿箱', value: TemplateTypes.unpublishedMagazine, cardType: CardTypes.UserMagazineCard },
            { label: '回收站', value: TemplateTypes.recycle, cardType: CardTypes.UserMagazineCard },
            { label: '我的收藏', value: TemplateTypes.myFavoritesMagazine, cardType: CardTypes.UserMagazineCard },
            { label: '我的模板', value: TemplateTypes.myTemplate, cardType: CardTypes.UserMagazineCard }

        ]
    }

};
const TabIndex = require('../constants/MeConstants').UserTab;
PageConfig.user.tabs[TabIndex.ILLEGALWORK] = { label: '异常作品', value: TemplateTypes.illegalWork, cardType: CardTypes.UserMagazineCard }
PageConfig.user.tabs[TabIndex.CHARGEDTEMPLATE] = { label: '我的模板', value: TemplateTypes.myTemplate, cardType: CardTypes.UserMagazineCard,dataKey:TemplateTypes.chargedTemplate }
var TemplateUtils = {
    constants: constants,

    context: context,

    /**
     * 得到queryOptionMap
     */
    getQueryOptionMap: function () {
        return context.templateTypeToQueryOptionMap;
    },

    /**
     * 初始化查询参数
     */
    initQueryOption: function () {
        var templateTypeToQueryOptionMap = context.templateTypeToQueryOptionMap = {};

        _.forEach(TemplateTypeToQueryOptionMap, function (value, key) {
            templateTypeToQueryOptionMap[key] = _.merge(_.cloneDeep(DefaultQueryOption), value);
        });
        return templateTypeToQueryOptionMap;
    },

    /**
     * 根据模板类型, 取得查询参数
     * @param templateType
     * @return queryOption
     */
    getQueryOptionByTemplateType: function (templateType) {
        return this.getQueryOptionMap()[templateType];
    },

    /**
     * 根据模板类型, 设置查询参数
     * @param templateType
     * @param queryOption
     * @return {*}
     */
    configureQueryOptionByTemplateType: function (templateType, queryOption, extraQueryOption) {
        var currentQueryOption = this.getQueryOptionByTemplateType(templateType);
        var result;
        result = _.merge(currentQueryOption, queryOption);
        if (_.isPlainObject(extraQueryOption)) {
            return _.merge({}, result, extraQueryOption);
        }
        return result;
    },

    /**
     * 根据pageType, 取PageConfig
     * @param pageType
     */
    getPageConfigByPageType: function (pageType) {
        return PageConfig[pageType];
    },

    /**
     * 改变currentPage
     * @param templateType
     * @param type 加减
     * @param step 步长
     * @param value 值
     */
    changeCurrentPageQueryOptionByTemplateType: function (templateType, type, step, value) {
        step = step || 1;
        var currentQueryOption = this.getQueryOptionByTemplateType(templateType);
        if (_.isFinite(value)) {
            currentQueryOption.currentPage = value;
        } else if (type === '-') {
            currentQueryOption.currentPage = currentQueryOption.currentPage - step;
        } else {
            currentQueryOption.currentPage = currentQueryOption.currentPage + step;
        }
    }

};

TemplateUtils.initQueryOption();

module.exports = TemplateUtils;