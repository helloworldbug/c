/**
 * @component Discovery
 * @description 发现页组件
 * @time 2015-10-22 14:56
 * @author 曾文彬
 **/

'use strict';

var React = require('react'),
    jSwipe = require('../../lib/jquery.Swipe');

var TemplateProduct = require('../Common/TemplateProduct'),
    Label = require('../Common/Labels'),
    Slider = require('../Common/Slider'),
    Scene = require('../Common/Scene'),
    MakeActionCreators = require('../../actions/MakeActionCreators'),
    MeActionCreators = require('../../actions/NewMeActionCreator');

var DropLoad = require('../../utils/DropLoad');

var WorkStore = require('../../stores/WorkStore');

var pageConditionPart = require('../../global/GlobalPageConditionPart');

var TplObjModel = require('../../utils/TplObjModel');

var tplobjModel = new TplObjModel();

var PluginMap = {
    STATE_SELECTOR: 'on',
    POINTER_SELECTOR: '.hd li',
    BANNER_SELECTOR: '.explore-banner > .bd'
}

var Discovery = React.createClass({

    generationDropLoadInstance() {
        var condition = pageConditionPart.tableCondition.Works;

        this.dropLoad = new DropLoad({
            parentContext: this,
            pageSize: pageConditionPart.tableCondition.Works.limitOffsetPage,
            currentPage: 2,
            whereCondition: {
                [condition.whereConditionField + ' ' + condition.whereConditionOperator]: condition.whereConditionValue
            },
            loadingState: 'isVisibleLoading',
            noMore: "noMore"
        });

        this.dropLoad.setOtherCondition({ orderCondition: 'reupdate_date desc' });
    },

    generationLoadingJSX() {
        return (
            <div className="loading">
                <div className="loading-box">
                    <div className="loading-boll"></div>
                    <span>正在加载中...</span>
                </div>
            </div>
        );
    },

    generationNoMore() {
        return (
            <div className="no-more"><div>没有更多作品了</div></div>
        );
    },

    // switch selected style
    switchSelectedStyle(index) {
        var selectedStyle = PluginMap.STATE_SELECTOR;

        $(PluginMap.POINTER_SELECTOR)
            .removeClass(selectedStyle)
            .eq(index)
            .addClass(selectedStyle);
    },

     // build Swipe jquery plugin config
    setJqueryPluginConfig() {
        return {
            mainCell: '.bd ul',
            effect: 'left',
            autoPlay : 5000
        };
    },

    // build Swipe jquery plugin
    buildJqueryPlugin(selector) {
        var context = this;

        return function () {

            return context.Swipe = new jSwipe($(selector).get(0), context.setJqueryPluginConfig());
        }
    },

    queryTemplateMethod(condition, category) {
        var defaultCondition = this.getDefaultCondition(),
            whereCondition = $.extend({'tpl_type =': 11, 'tpl_delete': '=0'}, defaultCondition.whereCondition, condition);
        defaultCondition.whereCondition = whereCondition;

        if (category === '热门杂志') {
            delete defaultCondition.whereCondition['label ='];
            defaultCondition = $.extend({}, defaultCondition, { orderCondition: 'read_pv desc' });
        }

        tplobjModel
            .getTplObjs(defaultCondition)
            .then(_tplObjs => {
                MeActionCreators.showWorkTemplate({
                    data: _tplObjs.results,
                    category: false
                });
            });
    },

    /**
      * 查询数据
    */
    query(condition, category) {
        this.queryTemplateMethod(condition, category);
    },

    queryLoading(condition, otherCondition) {

        var defaultCondition = this.getDefaultCondition(),
            whereCondition = $.extend({'tpl_type =': 11}, defaultCondition.whereCondition, condition), ret;

        defaultCondition.whereCondition = whereCondition;
        ret = $.extend({}, defaultCondition, otherCondition);

        this.dropLoad.setCurrentPage();
        //this.dropLoad.setWhereCondition(category ? $.extend({}, defaultWhereCondition, labelQueryObj) : defaultWhereCondition);
        this.dropLoad.setLimitPage();
        this.dropLoad.setOtherCondition(this.category === '热门杂志' ? { orderCondition: 'read_pv desc' } : void 0);
        tplobjModel
            .getTplObjs(ret)
            .then((_tplObjs => {

                MeActionCreators.showWorkTemplate({
                    data: _tplObjs.results,
                    category: false
                });
            }).bind(this));
    },

    /**
     * 获取作品数据
    */
    getTemplateStores() {
        return {
            templateStores: WorkStore.getWorks(),
        }
    },

    category: 'new',

    /**
     * 接收数据
    */
    onChange() {
        this.setState(this.getTemplateStores());
    },

    getTemplatesByLabelCategory(category) {
        var labelQueryObj = {['label ' + pageConditionPart.tableCondition.Works.whereConditionOperator]: '\''+ category +'\''},
            defaultWhereCondition = this.getDefaultCondition().whereCondition;


        this.query(
            category && category !== '热门杂志' ? {['label ' + pageConditionPart.tableCondition.Works.whereConditionOperator]: '\''+ category +'\''} : void 0,
            category
        );

        //read_int
        this.dropLoad.setCurrentPage(this.category != category ? 2 : void 0);
        this.dropLoad.setWhereCondition(category && category !== '热门杂志' ? $.extend({}, defaultWhereCondition, labelQueryObj) : defaultWhereCondition);
        this.dropLoad.setLimitPage();
        this.dropLoad.setOtherCondition( category === '热门杂志' ? { orderCondition: 'read_pv desc' } : { orderCondition: 'reupdate_date desc' });

        if (this.category != category) { this.category = category; }
    },

    getInOperatorValue(value) {
        return JSON.stringify(value).replace(/[\[\]]/g, '');
    },

    getTemplatesBySceneCategory(category) {
        this.query(
            category && {['label in']: '('+ this.getInOperatorValue(category) +')'}
        );
    },

    getInitialState() {
        return $.extend( this.getTemplateStores(), {isLoading: true});
    },

    getDefaultCondition() {
        var condition = pageConditionPart.tableCondition.Works,
            splitter = ' ',
            templateCondition = {
                fieldColumn: '*',
                whereCondition: {
                    [condition.whereConditionField + splitter + condition.whereConditionOperator]: condition.whereConditionValue
                },
                orderCondition: condition.orderField + splitter + condition.orderCategory,
                currentPage: condition.limitCurrentPage,
                pageSize: condition.limitOffsetPage
            };

        return templateCondition;
    },

    render() {
        return (
            <div className="inner">
                <Slider ref="slider" />
                {/* 场景 */}
                <Scene single="hot" condition={{ 'bannertype =': '\'专题\'' }} jQPluginMethod={ this.buildJqueryPlugin('.explore-banner') } getTemplatesBySceneCategory={ this.getTemplatesBySceneCategory } />

                {/* 标签 */}
                <div className="ex-mark clearfix">
                    <Label getTemplatesByLabelCategory={ this.getTemplatesByLabelCategory } single="hot" condition={{ 'type in': '(\'pc-works\')' }} />
                </div>

                {/* 作品 */}
                <TemplateProduct templateStores={ this.state.templateStores } />

                { this.state.isVisibleLoading ? this.generationLoadingJSX() : null }

                {!!this.state.noMore ? this.generationNoMore() : null }

            </div>
        );
    },

    isScrollBottom() {
        if(navigator.userAgent.indexOf("Trident") > 0 || navigator.userAgent.indexOf("Firefox") > 0){
            return document.documentElement.scrollTop + $(window).height() >= document.body.scrollHeight;
        }
        return document.body.scrollTop + $(window).height() >= document.body.scrollHeight;
    },

    bindWindowScrollEvent(options) {
        var isUnset = !!options && options.isUnset,
            scrollCallback = this.windowScrollCallback;

        $(window)[isUnset ? 'unbind' : 'bind']('scroll', scrollCallback);
    },

    windowScrollCallback() {

        if (this.isScrollBottom()) {
            this.dropLoad.isNext();
        }

        this.refs.slider.handleScroll();
    },

    componentDidMount() {
        this.query();
        WorkStore.addChangeListener(this.onChange);
        this.generationDropLoadInstance();
        this.bindWindowScrollEvent();
    },

    componentWillUnmount() {
        WorkStore.removeChangeListener(this.onChange);
        this.bindWindowScrollEvent({ isUnset: true });
    }
});

module.exports = Discovery;
