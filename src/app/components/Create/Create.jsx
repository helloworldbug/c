/**
 * @component Create
 * @description 创建页组件
 * @time 2015-10-19 20:38
 * @author 曾文彬
 **/

var React = require('react');
var ReactDOM=require("react-dom");
var TemplateProduct = require('../Common/TemplateProduct'),
    Label = require('../Common/Labels'),
    ChildLabels = require('../Common/ChildLabels'),
    Slider = require('../Common/Slider'),
    Scene = require('../Common/Scene'),
    Base = require('../../utils/Base'),
    MakeActionCreators = require('../../actions/MakeActionCreators'),
    MeActionCreators = require('../../actions/NewMeActionCreator');
import {Link} from 'react-router'
var WorkStore = require('../../stores/WorkStore');

var pageConditionPart = require('../../global/GlobalPageConditionPart');

var TplObjModel = require('../../utils/TplObjModel');

var DropLoad = require('../../utils/DropLoad');

var tplobjmodel = new TplObjModel();

var jqScroller = $('html,body');

var MakeWebAPIUtils = require('../../utils/MakeWebAPIUtils');

var Create = React.createClass({

    generationDropLoadInstance() {
        var condition = pageConditionPart.tableCondition.Templates;

        this.dropLoad = new DropLoad({
            parentContext : this,
            pageSize      : pageConditionPart.tableCondition.Templates.limitOffsetPage,
            currentPage   : 2,
            whereCondition: {
                ["approved in "]: "(2,3)"
            },
            loadingState  : 'isVisibleLoading',
            noMore        : "noMore"
        });

        this.dropLoad.setOtherCondition({orderCondition: 'editor_recno desc'});
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
        if (this.state.templateStores.length > 0) {
            return (
                <div className="no-more">
                    <div>没有更多作品了</div>
                </div>
            );
        } else {
            return (
                <div className="no-more">
                    <div>没有相关作品</div>
                </div>
            );
        }

    },

    getDefaultCondition() {
        var condition = pageConditionPart.tableCondition.Templates,
            splitter = ' ',
            templateCondition = {
                fieldColumn   : '*',
                whereCondition: {
                    ["approved in "]: "(2,3)"
                },
                orderCondition: condition.orderField + splitter + condition.orderCategory,
                currentPage   : condition.limitCurrentPage,
                pageSize      : condition.limitOffsetPage
            };

        return templateCondition;
    },

    queryTemplateMethod(condition, isScroll) {
        var defaultCondition = this.getDefaultCondition(),
            whereCondition = $.extend({
                'tpl_type ='   : 10,
                'tpl_delete = ': 0,
                'tpl_class !=' : '2'
            }, defaultCondition.whereCondition, condition);

        defaultCondition.whereCondition = whereCondition;

        tplobjmodel
            .getTplObjs($.extend({}, defaultCondition, {orderCondition: 'editor_recno desc'}))
            .then(_tplObjs => {

                if (this.mounted) {
                    MeActionCreators.showWorkTemplate({
                        data    : _tplObjs.results,
                        category: true
                    });

                    this.setState({isVisibleLoading: false});
                    isScroll && this.handleScroll();
                }

            });
    },

    /**
     * 查询数据
     */
    query(condition, isScroll) {
        this.queryTemplateMethod(condition, isScroll);
    },

    queryLoading(condition, otherCondition) {
        var defaultCondition = this.getDefaultCondition(),
            whereCondition = $.extend({
                'tpl_type ='  : 10,
                'tpl_class !=': '2'
            }, defaultCondition.whereCondition, condition), ret;

        defaultCondition.whereCondition = whereCondition;
        ret = $.extend({}, defaultCondition, otherCondition);

        this.dropLoad.setCurrentPage();
        //this.dropLoad.setWhereCondition(category ? $.extend({}, defaultWhereCondition, labelQueryObj) : defaultWhereCondition);
        this.dropLoad.setLimitPage();
        this.dropLoad.setOtherCondition({orderCondition: 'editor_recno desc'});

        tplobjmodel
            .getTplObjs(ret)
            .then((_tplObjs => {

                MeActionCreators.showWorkTemplate({
                    data    : _tplObjs.results,
                    category: true
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

    onChange() {
        this.setState(this.getTemplateStores());
    },

    generationChildLabels: function (labelName) {
        this.refs.childLabels.request(labelName);
    },

    category: 'all',

    getTemplatesByLabelCategory(category, categorys) {
        // 生成二级标签
        this.generationChildLabels(category);
    },

    getTemplatesByChildLabelCategory: function (category) {
        var labelQueryObj = {['label ' + pageConditionPart.tableCondition.Templates.whereConditionOperator]: '\'' + category + '\''},
            defaultWhereCondition = this.getDefaultCondition().whereCondition;

        this.query(
            category && labelQueryObj
        );

        this.dropLoad.setCurrentPage(this.category != category ? 2 : void 0);
        this.dropLoad.setWhereCondition(category ? $.extend({}, defaultWhereCondition, labelQueryObj) : defaultWhereCondition);
        this.dropLoad.setLimitPage();
        this.dropLoad.setOtherCondition({orderCondition: 'editor_recno desc'});

        if (this.category != category) {
            this.category = category;
        }
    },
    getInOperatorValue(value) {
        return JSON.stringify(value).replace(/[\[\]]/g, '');
    },
    getTemplatesBySceneCategory(category, categoryName) {

        var sceneQueryObj = {['label in']: '(' + this.getInOperatorValue(category) + ')'},
            defaultWhereCondition = this.getDefaultCondition().whereCondition;

        this.setLabelAttr(this.getInOperatorValue(category), categoryName);
        this.query(
            category && {['label in']: '(' + this.getInOperatorValue(category) + ')'},
            true
        );

        this.dropLoad.setCurrentPage(this.category != category ? 2 : void 0);
        this.dropLoad.setWhereCondition(category ? $.extend({}, defaultWhereCondition, sceneQueryObj) : defaultWhereCondition);
        this.dropLoad.setLimitPage();
        this.dropLoad.setOtherCondition({orderCondition: 'editor_recno desc'});

        if (this.category != category) {
            this.category = category;
        }
    },

    handleScroll() {
        var offsetTop = $(ReactDOM.findDOMNode(this.refs.segent)).offset().top;

        jqScroller.animate({scrollTop: offsetTop}, 650);
    },

    setLabelAttr(categorys, text) {
        var jqLabel = $(ReactDOM.findDOMNode(this.refs.labels.refs.sceneLabel));

        this.refs.labels.changeActiveClass(jqLabel);
        jqLabel.attr('data-categorys', categorys).html(text);
    },

    getAllChildLabels: function (childLabels) {
        var childLabelArr = [], category;

        childLabels.forEach(function (child) {
            childLabelArr.push('\'' + child.attributes.name + '\'' || '');
        });

        category = childLabelArr.length ? '(' + childLabelArr.join(',') + ')' : '';

        var labelQueryObj = category ? {'label in': category} : {},
            defaultWhereCondition = this.getDefaultCondition().whereCondition;

        // 清除子级标签样式
        $(ReactDOM.findDOMNode(this.refs.childLabels)).children().removeClass('active');

        this.query(labelQueryObj);

        this.dropLoad.setCurrentPage(this.category != category ? 2 : void 0);
        this.dropLoad.setWhereCondition(category ? $.extend({}, defaultWhereCondition, labelQueryObj) : defaultWhereCondition);
        this.dropLoad.setLimitPage();
        this.dropLoad.setOtherCondition({orderCondition: 'editor_recno desc'});

        if (this.category != category) {
            this.category = category;
        }
    },

    getInitialState() {
        this.mounted = true;
        return $.extend({isVisibleLoading: false}, this.getTemplateStores());
    },

    render() {
        return (
            <div className="inner">
                <Slider ref="slider"/>
                <div id="create-bg">
                    <div className="con">
                        <h3>选择创作场景</h3>
                        <div className="lists">
                            <div className="lists-contain">
                                {/*a href="javascript:void(0);" className="prev"></a>*/}

                                {/* 场景 */}
                                <Scene getTemplatesBySceneCategory={ this.getTemplatesBySceneCategory }/>

                                {/*<a href="javascript:void(0);" className="nexts"></a>*/}
                            </div>
                        </div>
                        <p className="pic-link">
                            {/*<input id="createByPic" type="file" accept="image/jpeg,image/jpg,image/png" multiple
                             onChange={this.createByPic}/>
                             <a href="javascript:;" className="a1 btn-navy btn-fill-vert-o"
                             onClick={this.createByPicClick}>一键生成</a>*/}
                            <Link to="/make" target="_blank" className="a1 btn-navy btn-fill-vert-o">自由制作</Link>
                            <Link to="/dataProcessing" target="_blank" className="a1 btn-navy btn-fill-vert-o up-icon-new">一键出版</Link>
                            <Link to="/makemagazine" target="_blank" className="a1 btn-navy btn-fill-vert-o">期刊制作</Link>
                        </p>
                        <div className='readmore' onClick={ this.handleClickScroll }></div>
                    </div>
                </div>

                <div className="mark clearfix">
                    <div className="mark-inner">
                        <div className="lists clearfix">
                            {/* 标签 */}
                            <Label ref="labels" getTemplatesByLabelCategory={ this.getTemplatesByLabelCategory }
                                   generationChildLabels={this.generationChildLabels} query={this.query}/>
                        </div>
                    </div>

                    <div className="mark-inner-classB">
                        <div className="lists clearfix">
                            {/* 子标签 */}
                            <ChildLabels getAllChildLabels={ this.getAllChildLabels } ref="childLabels"
                                         getTemplatesByChildLabelCategory={ this.getTemplatesByChildLabelCategory }/>
                        </div>
                    </div>

                    <div ref="segent" className="product-segent">

                        {/* 作品 */ }
                        <TemplateProduct ref="template" category="create" onsaleTemplate={this.state.templateOnsale} templateStores={ this.state.templateStores }/>
                        { this.state.isVisibleLoading ? this.generationLoadingJSX() : null }

                        {!!this.state.noMore ? this.generationNoMore() : null }
                    </div>
                </div>
            </div>
        );
    },



    /*
     * 点击滚动
     */
    handleClickScroll: function () {
        $('html,body').animate({
            scrollTop: $('.mark').offset().top - 54
        }, 800);
    },

    componentWillMount: function () {
        this.queryTemplateOnsale();
    },

    componentDidMount() {
        this.query();
        this.generationDropLoadInstance();
        this.bindWindowScrollEvent();
        WorkStore.addChangeListener(this.onChange);
    },

    componentWillUnmount() {
        WorkStore.removeChangeListener(this.onChange);
        this.bindWindowScrollEvent({isUnset: true})
        this.mounted = false
    },

    isScrollBottom() {
        //if (navigator.userAgent.indexOf("Trident") > 0 || navigator.userAgent.indexOf("Firefox") > 0) {
        //    return document.documentElement.scrollTop + $(window).height() >= document.body.scrollHeight - 250;
        //}
        //return document.body.scrollTop + $(window).height() >= document.body.scrollHeight - 250;
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

    createByPicClick: function () {
        if (!Base.getCurrentUser()) {
            Base.linkToPath('/login');
            return;
        }
        $("#createByPic").trigger("click");
    },

    createByPic: function (event) {
        var user_id = Base.getCurrentUser().id;
        if (!user_id) {
            this.setState({notLogin: true});
        } else {
            var files = event.target.files;
            MakeActionCreators.createByPic(files);
            Base.linkToPath("/make");
        }
    },

    /**
     * 查询所有在售模板数据请求
    */
    queryTemplateOnsale: function() {
        var _this = this;
        MakeWebAPIUtils.loadPrices().then(function(data) {
            _this.setState({
                templateOnsale: data["template"].result
            });
        });
    }


});

module.exports = Create;