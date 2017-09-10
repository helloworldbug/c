/**
 * @description 模板详情组件
 * @time 2015-9-14
 * @author 曾文彬
 */

'use strict';

// require core module
var React = require('react'),
    ReactDOM=require("react-dom"),
    Base = require('../../utils/Base'),
    CommonUtils = require('../../utils/CommonUtils'),
    TplObjModel = require('../../utils/TplObjModel'),
    MeAPI = require('../../utils/MeAPI'),
    MeActionCreator = require('../../actions/MeActionCreators');
import {Link } from 'react-router'
// require children component
var NavBar = require('../Common/NavBar'),
    Slider = require('../Common/Slider'),
    Footer = require('../Common/Footer'),
    Report = require('../Common/Report'),
    Dialog = require('../Common/Dialog'),
    OtherMagazineCards = require('./OtherMagazineCards'),
    ShowPreView = require('../Common/ShowPreView'),
    Notification = require('../Common/Notification'),
    ShareProduct = require('../Common/ShareProduct');

// user message
var hash = location.pathname, // 路由hash
    tid = Base.getParam(hash, 'tid'); // 作品id

// initialize tplobj model object
var tplObjModel = new TplObjModel({tid: tid});

// define Preview component
var Preview = React.createClass({

    handleCollect() {
        this.addFavorite();
    },

    handleReport() {
        this.refs.report.setState({status: true});
        this.changeIcon('reportState', true)();
    },

    handleShare() {
        this.setState({
            shareState    : !this.state.shareState,
            shareListState: !this.state.shareListState
        });

        $(ReactDOM.findDOMNode(this.refs.wemcn)).hide("slow");
    },

    changeIcon(key, value) {
        var context = this;

        return () => {
            var states = {};
            states[key] = value || !this.state[key];
            context.setState(states);
        };
    },

    showDialog(title) {
        this.refs.dialog.setState(
            {
                appearanceState: true,
                title          : title
            }
        );
    },

    hideDialog() {
        this.refs.dialog.setState({
            appearanceState: false
        });
    },

    displayFavoriateState(tid) {
        this.favorite(tid, 'visible');
    },

    favorite(tid, type = 'add') {
        var tid = tid || this.props.params.tid;

        var addFavoritePromise, findFavoritePromise;

        if (type === 'visible') {

            findFavoritePromise = MeAPI.getFavoriteById(tid);

            findFavoritePromise && findFavoritePromise.then((_fav => {
                _fav && this.changeIcon('collectState', true)();
            }).bind(this));
        } else {

            addFavoritePromise = MeActionCreator.addFavorite(tid);

            addFavoritePromise.then((_resp => {
                this.changeIcon('collectState', true)();
            }).bind(this)).catch(_error => {
                Notification.currentNotification.show(_error.message);
            })
        }
    },

    addFavorite() {
        return this.favorite();
    },

    getPreview(tid) {
        tplObjModel.getTplObj(tid || this.props.params.tid,
            ((_tpl) => {
                var tpl = $.extend({}, _tpl[0].attributes, {createdAt: Base.formattime(_tpl[0].createdAt, 'yyyy-MM-dd')});
                this.setPagePreview(tpl);
                this.setShareComponentState(_tpl[0].attributes.name, _tpl[0].attributes.tpl_share_img, _tpl[0].attributes.brief);
            }).bind(this)
        );
    },

    setPagePreview(tpl) {
        var now = {
            author_name: '',
            author_img : 'http://ac-hf3jpeco.clouddn.com/206ea7bf442919405a7f.jpg',//http://ac-hf3jpeco.clouddn.com/Qy6NxalPv9RwYq9soCsS84PGKMLirVnTLvptSqyh.jpg',
            name       : '我做的H5作品，欢迎来围观哦！',
            createdAt  : '',
            page_int   : '不祥',
            read_pv    : ''
        };

        $.each(tpl,
            (_key, _value) => {
                _value && (now[_key] = _value);
            }
        );

        this.setState(now);
    },

    buildShareComponentObject(title, pic, summary) {
        return {
            url        : encodeURIComponent(window.location.href),
            title      : title,
            content    : title,
            pic        : pic,
            pics       : pic,
            summary    : summary,
            comment    : summary,
            description: summary
        }
    },

    setShareComponentState(title, pic, summary) {
        var shareComponentObject = this.buildShareComponentObject(title, pic, summary),
            shareComponentObjects = {}, picValue;

        ['tsina', 'renren', 'tqq', 'tqzone', 'kaixin', 'tieba', 'cqq'].forEach(_name => {
            shareComponentObjects[_name] = shareComponentObject;
        });

        this.refs.shareProduct.setState(shareComponentObjects);
    },

    getInitialState() {
        return {
            shareState    : false,
            collectState  : false,
            reportState   : false,
            shareListState: false
        };
    },

    render() {
        var otherMagazineCards, uid = this.props.params.uid;

        if (uid) {
            // 显示作者其他杂志
            otherMagazineCards = (<OtherMagazineCards pageType="preview" uid={uid}/>);
        }

        return (
            <div className="inner">
                <Dialog ref="dialog" sureIsHide={true} sureFn={this.hideDialog} title="请输入举报理由"/>
                <NavBar sign="discovery"/>
                <Slider emuabled="true"/>

                <div className="preview-nav" style={{height:"88px"}}>
                    <div className="container clearfix">
                        <span className="preview-nav-title">
                            {this.getCrumbs()}
                        </span>&nbsp;
                        <label className="usernick">{this.state.name}</label>
                        <ul className="fr clearfix" style={{overflow:"hidden",height:"95px"}}>
                            <li className={this.state.shareListState ? 'show-animation-nav show-share-nav fl' : 'show-share-nav fl'}>
                                <ShareProduct ref="shareProduct" showWeixinCallback={this.openWeiXing}/>
                            </li>
                            <li className="share fl">
                                <a title="分享" className={this.state.shareState ? 'active' : ''} href="javascript:;" onClick={this.handleShare}></a>
                            </li>
                            <li className="collects fl">
                                <a title="收藏" className={this.state.collectState ? 'active' : ''} href="javascript:;" onClick={this.handleCollect}></a>
                            </li>
                            <li className="reports fl">
                                <a title="举报" className={this.state.reportState ? 'active' : ''} href="javascript:;" onClick={this.handleReport}></a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="preview-view container clearfix">
                    {/* 举报组件 */}
                    <div className="report-group">
                        <Report ref="report" showDialogFn={this.showDialog} cancelFn={this.changeIcon('reportState')}/>
                    </div>

                    <div className="fl addMargin">
                        <ShowPreView userNick={this.state.author_name} tid={this.props.params.tid}/>
                    </div>

                    <div className="phone-message fr">
                        {/* 微信二维码 */}
                        <div className="wemcn clearfix" ref="wemcn">
                            <div className="ewm-img fl">
                                {CommonUtils.generateQRCode(CommonUtils.generateViewTemplateUrl(this.props.params.tid), 120)}
                            </div>
                            <div className="ewm-text fr">
                                <p>扫一扫，用手机观看！</p>
                                <p>用微信扫描还可以</p>
                                <p>分享至好友和朋友圈</p>
                            </div>
                        </div>
                        <div className="lin">
                            <div className="lin-logo" style={{"background-image":"url("+ this.state.author_img +")"}}></div>
                            <p className="lin-title">{this.state.author_name}</p>
                        </div>
                        <div className="content">
                            <h3>{this.state.brief}</h3>

                            <p>
                                <label>创建时间：</label>
                                <span>{this.state.createdAt}</span>
                            </p>

                            <p>
                                <label>页&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;数：</label>
                                <span>{this.state.page_int}</span>
                            </p>

                            <p>
                                <label>阅读次数：</label>
                                <span>{this.state.read_pv}</span>
                            </p>
                        </div>
                        <div className="foot">
                            <p>手机扫描阅读</p>

                            <div className="qrcode">
                                {CommonUtils.generateQRCode(CommonUtils.generateViewTemplateUrl(this.props.params.tid), 158)}
                            </div>
                            <Link to="/create" className="fork">创建我的H5微场景</Link>
                        </div>

                    </div>
                </div>
                <div>
                    {otherMagazineCards}
                </div>
                <Footer />
            </div>
        );
    },

    componentDidMount() {

        // 如果收藏，显示收藏状态
        this.displayFavoriateState();

        // 获得作品信息
        this.getPreview();
    },

    getCrumbs(){
        // 面包屑
        var crumbs, from = this.props.query.form;
        switch (from) {
            case 'user':
                crumbs = (<Link to="/user">个人中心 &gt;</Link>);
                break;

            default :
                crumbs = (<Link to="/discovery">发现 &gt;</Link>);
        }

        return crumbs;
    },

    openWeiXing(){
        $(ReactDOM.findDOMNode(this.refs.wemcn)).toggle("slow");
    },

    componentWillReceiveProps (nextProps) {
        // 如果收藏，显示收藏状态
        this.displayFavoriateState(nextProps.params.tid);

        // 获得作品信息
        this.getPreview(nextProps.params.tid);
    }

});

// define Preview component
module.exports = Preview;

