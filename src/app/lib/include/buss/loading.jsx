// 文件名：loading.js
//
// 创建人：曾文彬
// 创建日期：2015/11/14 12:01
// 描述：下拉加载数据组件

'use strict';

var React = require('react'),
    QRCode = require('qrcode.react');
import {Link} from 'react-router'
var Base = require('../../../utils/Base'),
    MePCAPI = require('../../MePC_Public'),
    MePCEvent = require('../../MePC_Event'),
    ImageModules = require('../../../components/Mixins/ImageModules');


var MeAPI = require('../../../utils/MeAPI');

var MeActionCreator = require('../../../actions/MeActionCreators');

var GlobalFunc = require('../../../components/Common/GlobalFunc');

var TplObjModel = require('../../../utils/TplObjModel');

var tplobjModel = new TplObjModel;

var LoadingComponent = MePCAPI.inherit(MePCAPI, MePCEvent, React.createClass(
    {

        /**
         * 设置下拉事件
        */
        bindDownlistEvt: function (isUnset) {
            var unset = isUnset && isUnset['isUnset'] ? true : false;

            $(window)[unset ? 'unbind' : 'bind']('scroll', this.downlist);
        },

        /**
         * 滚动
        */
        downlist: function () {
            this.checkScrollBottom() && this.receiveDrowdownCallback();
        },

        /**
         * 检测是否滚动条滚动到底部
        */
        checkScrollBottom: function () {
            return document.body.scrollTop + $(window).height() >= document.body.scrollHeight;
        },

        /**
         * 处理下拉滚动条
        */
        receiveDrowdownCallback: function () {

            if (this.isStop === true || this.isStop === 'disabled'){
                return;
            };

            var currentPage = this.currentPage;

            this.setupCurrentPage(currentPage + 1);
            this.setState(this.getLoadingIconStore(true));
            this.renderTemplate();
        },

        /**
         * 更新当前页
        */
        setupCurrentPage: function (currentPage) {
            if (!currentPage) return this.currentPage;

            this.currentPage = currentPage;
        },

        /**
         * 获取总页数
        */
        getTotalPageSizes: function (counts) {
            return Math.ceil(counts / this.props.pageSize);
        },

        /**
         * 获取查询SQL对象
        */
        getSQLCondition: function (whereCondition, orderCondition, limitCondition, fieldColumnCondition) {
            // var SQLCondition = { fieldColumn: 'count(*),*' },
            //     args = this.makeArray(arguments);
            var args = this.makeArray(arguments), SQLCondition;

            fieldColumnCondition || (fieldColumnCondition = { fieldColumn: 'count(*),*' });

            SQLCondition = this.copy.apply(this, [fieldColumnCondition].concat(args));

            return SQLCondition;
        },

        /**
         * 接收数据
        */
        onChange: function (templates) {
            this.setState($.extend({}, this.getTemplateStore(templates), this.getLoadingIconStore()));
        },

        /**
         * 获取作品Store   
        */
        getTemplateStore: function (templates) {
            var tpls = templates ? this.state.templates.concat(templates) : [];

            return { templates: tpls };
        },

        /**
         * 获取加载图标   
        */
        getLoadingIconStore: function (isVisible) {
            var jsx = isVisible ? this.generatorLoadingIconJSX() : void 0;

            return { visibleLoadingIcon: jsx };
        },

        generationNoMore() {
            return (
                <div className="no-more"><div>没有更多作品了</div></div>
            );
        },

        /**
         * 开始渲染
        */
        renderTemplate: function (fieldColumnCondition) {
            var props = this.props,
                SQLCondition = this.getSQLCondition(props.whereCondition, props.orderCondition, { pageSize: props.pageSize, currentPage: this.currentPage });

            this.isStop = 'disabled';    
                
            tplobjModel
                .getTplObjs(SQLCondition)
                .then((function (data) {
                    this.setState(this.getLoadingIconStore());

                    if (this.currentPage === 1) {
                        this.bindDownlistEvt();
                    }

                    this.isStop = 'undisabled';

                    if (this.currentPage > this.getTotalPageSizes(data.count)) {
                        this.isStop = true;
                        return;
                    } else if(this.currentPage == this.getTotalPageSizes(data.count)) {
                        this.setState({ stop: true });
                    }
                    
                    this.onChange(data.results);
                }).bind(this)); 
        },

        /**
         * 清除av返回图片路径开头av字符
        */
        stripAVChar: function (url) {
            return url ? url.slice(3) : '';
        },

        /**
         * 生成二维码jsx
        */
        generatorQRCodeJSX: function (value, size) {
            size || (size = 128);

            return (<QRCode value={ value } size={ size } />);
        },

        /**
         * 生成加载图标
        */
        generatorLoadingIconJSX: function () {
            return (
                <div className="loading">
                    <div className="loading-box">
                        <div className="loading-boll"></div>
                        <span>正在加载中...</span>
                    </div>
                </div>
            );
        },

        /**
         * 生成默认jsx   
        */
        generatorDefaultViewJSX: function (template,index) {
            return (
                <dl key={index}>
                    <dt>
                        <a title="点击或扫描浏览作品" target="_blank" className="link-to-preview" href={ '/preview/tid=' + template.tpl_id}>
                            <div className="link-layer">
                                <div className="template-zask"></div>
                                <div className="template-qrcode">
                                    { this.generatorQRCodeJSX(Base.generateQRCodeUrl(template.tpl_id), 115) }
                                </div>
                                {/*<img src={ this.stripAVChar(template.effect_img) } />*/}
                                <img src={ GlobalFunc.subAvChar(template.tpl_share_img) + "?imageView2/2/w/216" } />
                            </div>
                        </a>
                    </dt>
                    <dd>
                        <div className="div1">
                            <div className="cart-avator">
                                <div className="avatar fl">
                                    <Link to={'/designerDetail/uid=' + template.author}><img src={ template.author_img || ImageModules.defineImageModules().defaultUserLogo } width="30" height="30" /> </Link>
                                </div>
                                <div className="info fr">
                                    <p className="title" title={ template.name }>{ template.name }</p>
                                    { template.author_name ? (<p><Link to={'/designerDetail/uid=' + template.author} className="info-color">{ template.author_name }</Link></p>) : void 0 }
                                </div>
                            </div>

                            <div className="cart-active" data-tplid={ template.tpl_id }>
                                { this.favorite(template.tpl_id) }
                                <span className="num fl">{ template.read_pv || 0 }</span> 
                                <span className="star fr" onClick={ this.favorite.bind(this, template.tpl_id, 'do') }><a href="javascript:;">收藏</a></span>
                            </div>
                        </div>
                        <div className="div2"></div>
                        <div className="div3"></div>
                    </dd>
                </dl>
            );
        },

        getInitialState: function () {
           return $.extend({stop:false}, this.getTemplateStore(), this.getLoadingIconStore());
        },

        favorite(tid, type = 'show') {
            this[type === 'show' ? 'showFavoriteState' : 'doFavorite'](tid);
        },

        doFavorite(tid) {
            if (!Base.isLogin()) return;

            var addFavoritePromise = MeActionCreator.addFavorite(tid);

            addFavoritePromise.then((_resp => {
                GlobalFunc.addSmallTips('收藏成功!', 1);
                this.changeFavoriteState('[data-tplid="'+ tid +'"]');
            }).bind(this)).catch(_error => {
                GlobalFunc.addSmallTips(_error.message, 1);
            })
        },

        showFavoriteState(tid) {
            if (!Base.isLogin()) return;

            var favoritePromise = MeAPI.getFavoriteById(tid); 

            favoritePromise && favoritePromise.then((_fav => {
                _fav && this.changeFavoriteState('[data-tplid="'+ tid +'"]');
            }).bind(this));
        },

        changeFavoriteState(selector) {
            $(selector).find('.star').addClass('on');
        },

        render: function () {
            var templates = this.state.templates.map((function (template,index) {
                return this.generatorDefaultViewJSX(template.attributes,index);
            }).bind(this));
            return (
                <div className="product" style={{ paddingBottom: "0" }}>
                    <div className="product-lists clearfix">
                        { templates }
                    </div>
                    
                    { this.state.visibleLoadingIcon }
                    { this.state.stop ? this.generationNoMore() : null }
                </div>
            );
        },

        componentDidMount: function () {
            // 初始化当前页
            this.setupCurrentPage(1);
            
            // 渲染
            this.renderTemplate();
        },

        componentWillUnmount: function () {
            this.bindDownlistEvt({ isUnset: true });
        }

    }
));

module.exports = LoadingComponent;