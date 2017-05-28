// 文件名：DesignerDetail.jsx
// 创建人：YJ
// 创建日期：2015/12/21 17:44
// 描述： 设计师主页
'use strict';

var React  = require('react'),
    QRCode = require('qrcode.react'),
    Base   = require('../../utils/Base'),
    MePC   = require('../../lib/MePC_Public'),
    Images = require('../Common/Image'),
    Share  = require('./Share');

var Model = require('../../utils/Model');

var SuperLogicComponent    = require('../../lib/SuperLogicComponent'),
    SuperTemplateComponent = require('../../lib/SuperTemplateComponent');

var TemplateProduct = require('../Common/TemplateProduct');

var MeActionCreators = require('../../actions/NewMeActionCreator');

var WorkStore = require('../../stores/WorkStore');

var TplObjModel = require('../../utils/TplObjModel');

// require common mixins
var ImageModules = require('../Mixins/ImageModules'); 

var tplobjModel = new TplObjModel();

// 实例化Model类
var model = new Model();
model.set('tableName', '_User');

// 下拉组件
var LoadingComponent = require('../../lib/include/buss/loading');

var DesignerDetail = MePC.inherit(SuperLogicComponent, SuperTemplateComponent, React.createClass({


    mixins: [ImageModules],

    /*
     * 生成 '*'' 
    */
    generateMosaicChar: function (str, isEmail) {
        if(!str){
            return;
        }
        var keyWord = isEmail ? /(.{1,4})@/: void 0,
            charsFront = !keyWord ? str.slice(0, -4) : str.replace(keyWord, function (total, other) {
                return '****';
            }),
            overCharLength = isEmail ? 4 : str.length - charsFront.length,
            charsBack = '';

        if (!isEmail) {
            for (var i = 0; i < overCharLength; i++ ) {
                charsBack += '*';
            }

            return charsFront + charsBack;    
        } else {
            return charsFront;
        }    
        
    },

    /**
     * 生成二维码
    */
    generateQRCode: function (codeUrl) {
        if (!codeUrl) return;

        return (
            <QRCode value={ codeUrl } size={ 115 } /> 
        );
    },

    /**
     * 获取用户id
    */
    getUserId: function () {
        return Base.getParam(location.pathname, 'uid');
    },

    /**
     * 获取用户信息
    */
    getUserMsg: function () {
        var SQLCondition = {
            fieldColumn: '*',
            whereCondition: {
                'objectId = ': '\'' + this.getUserId() + '\''    
            }
        };

        var SQLConditionStr = model.getQuerySQLByCondition(SQLCondition);
        
        return new Promise(function (resolveFunc, rejectFunc) {
            fmacloud.Query.doCloudQuery(SQLConditionStr, {
                success: resolveFunc,
                error: rejectFunc
            });    
        });   
    },

    /**
     * 渲染用户信息
    */
    renderUserMsg: function () {
        var context = this;

        context
            .getUserMsg()
            .then(function (data) {

                if (!data.results.length) {
                    Base.linkToPath('/404');
                    return;
                }

                context.onChangeUserMsg(data.results[0].attributes);                
            })
            .catch(function () {});
    },

    /**
     * 获取用户作品总阅读数
    */
    renderUserTemplateNumber: function (keyword) {
        var SQLCondition = {
            fieldColumn: 'count(*),*',
            whereCondition: {
                'author =': '\''+ this.getUserId() +'\'',
                'tpl_type =': 11,
                'tpl_delete': '=0',
                'tpl_state = ': 2
            }
        };

        tplobjModel
            .getTplObjs(SQLCondition)
            .then((function (data) {
                var nums = 0;

                if (data.results.length) {
                    nums = data.results.map(function (av) {
                        return av.attributes[keyword] || 0;
                    }).reduce(function (prevNum, nextNum) {
                        return prevNum + nextNum;
                    });
                }

                this['onChangeUserTemplate' + (keyword === 'read_pv' ? 'Pvs' : 'Favorites')](nums);
            }).bind(this));
    },

    /**
     * 渲染用户作品
    */
    renderUserTemplate: function (currentPage) {
        currentPage = currentPage || 1;

        var SQLCondition = {
            fieldColumn: '*',
            whereCondition: {
                'author =': '\''+ this.getUserId() +'\'',
                'tpl_type =': 11,
                'approved = ': 1,
                'tpl_delete' : '=0',
                'tpl_privacy=':'public'
            },
            orderCondition: 'reupdate_date desc',
            currentPage: currentPage,
            pageSize: 12
        }

        tplobjModel
            .getTplObjs(SQLCondition)
            .then((function (data) {
                MeActionCreators.showWorkTemplate({
                    data: data.results,
                    category: false
                });
            }).bind(this))
            .catch(function () {});
    },

    /**
     * 渲染用户打赏二维码
    */
    renderUserGaveQRCode: function () {
        var weixinData = {
            total_fee: '5',
            trade_type:'1',
            uid: this.getUserId(),
            body: '打赏'
        };
        
        fmacloud.Cloud.run('wechat_codeurl', weixinData, {
            success: (function (res) {
                this.onChangeUserGaveQRCode(JSON.parse(res).codeurl);
            }).bind(this)
        });
    },

    /*
    * banner
    */
    generatorBanner: function() {
        return (
            <div className="designer-detail-banner">
                {/*<img className="designer-detail-banner-img" src="../../../assets/images/designerTribe/banner.jpg" />*/}
                {!!this.state.user_zone_bgimg ? (<img src={ this.state.user_zone_bgimg } className="designer-detail-banner-img" />) : (<Images className="designer-detail-banner-img" src={this.defineImageModules().defaultPageBgPic} />) }
                <dl>
                    <dt>
                        {!!this.state.user_pic ? (<img src={ this.state.user_pic } width="80" height="80" />) : (<Images src={this.defineImageModules().defaultUserLogo} width="80" height="80" />) }
                    </dt>
                    <dd>
                        <h3>{ this.state.user_nick }</h3> 
                        { this.state.recno > 10 ? <p>{ !!this.state.user_sign ?  this.state.user_sign : '设计师太害羞，什么都没写' }</p> : <p>{ !!this.state.user_sign ?  this.state.user_sign : '这个用户很懒，木有签名' }</p> } 
                        <p>{ this.state.user_labels && "聚焦邻域：" + this.state.user_labels.join(', ') }

                        </p>
                    </dd>
                </dl>
            </div>
        );
    },

    onChangeUserMsg: function (user) {
        this.setState(this.getUserMsgStore(user));
    },

    onChangeUserTemplate: function () {
        this.setState(this.getUserTemplateStore(WorkStore.getWorks()));
    },

    onChangeUserTemplatePvs: function (pvs) {
        this.setState(this.getUserTemplatePVsStore(pvs));
    },

    onChangeUserTemplateFavorites: function (favorites) {
        this.setState(this.getUserTemplateFavoritesStore(favorites));
    },

    onChangeUserGaveQRCode: function (codeUrl) {
        this.setState(this.getUserGaveQRCodeStore(codeUrl));
    },

    /**
     * 获取用户信息Store
    */
    getUserMsgStore: function (store) {
        return store || {};
    },

    /**
     * 获取用户总阅读数Store
    */
    getUserTemplatePVsStore: function (pvs) {
        return pvs ? { pvs: pvs } : {};
    },

    /**
     * 获取用户总收藏数Store
    */
    getUserTemplateFavoritesStore: function (favorites) {
        return favorites ? { favorites: favorites } : {};
    },

    /**
     * 获取用户作品Store
    */
    getUserTemplateStore: function (store) {
        return store ? { templateStores: store } : { templateStores: {} };
    },

    /**
     * 获取用户打赏二维码
    */
    getUserGaveQRCodeStore: function (codeUrl) {
        return codeUrl ? { codeUrl: codeUrl } : {};
    },

    /**
     * 切换
    */
    contactPoplayer: function (e) {
        $(e.currentTarget).toggleClass('active').siblings('a').removeClass('active');
        // $('.designer-detail-2 .fr a > span').bind('click', function (e) { 

        //     $(this).parent('a').toggleClass('active').siblings('a').removeClass('active');
        // });
    },

    /**
     * 初始化State
    */
    getInitialState: function () {
        return $.extend({}, this.getUserMsgStore(), this.getUserTemplateFavoritesStore(), this.getUserTemplatePVsStore(), this.getUserTemplateStore());
    },

    /*
     * 联系设计师/打赏 按钮
    */ 
    generatorUserContact: function () { 
        return (
            <div className="fr">
                <a href="javascript:;" onClick={ this.contactPoplayer }><span>联系设计师</span>
                    <div className="contact_designer_hover">
                        <div className="contact-designer-middle">
                            {!!this.state.qq ? (<p className='qq'> {this.generateMosaicChar( this.state.qq )} </p>) : void 0 }
                            {!!this.state.vipphone ? (<p className='phone'> {this.generateMosaicChar( this.state.vipphone )} </p>) : void 0 }
                            {!!this.state.email ? (<p className='email'> {this.generateMosaicChar( this.state.email, true )} </p>) : void 0 } 
                        </div>
                    </div>
                </a>
                <a href="javascript:;" onClick={ this.contactPoplayer }><span>打赏设计师</span>
                    <div className="reward_designer_hover">
                        <dl>
                            <dt>{ this.generateQRCode(this.state.codeUrl) }</dt>
                            <dd>微信扫描打赏设计师</dd>
                        </dl>
                    </div>
                </a>
            </div> 
        );
    },

    /*
     * 分享
    */ 
    generatorUserShare: function () {
        return (
            <div className="fr"> 
                <a href="javascript:;" onClick={ this.contactPoplayer }><span>分享</span>
                    <Share ref="Shares" userNick={ this.state.user_nick } /> 
                </a>
            </div>
        );
    },

    render: function () {
        var context = this;
        return (
            <div className="designer-detail">
                {/*banner*/}
                { this.generatorBanner() }
                <div className="designer-detail-2">
                    <div className="fl"> 
                        <span className="num">{ this.state.pvs || 0  }</span>
                        <span className="star">{ this.state.favorites || 0  }</span>
                    </div>
                    { this.state.recno > 10 ? this.generatorUserContact() : this.generatorUserShare() } 
                </div>

                {/* 作品 */}
                {/*<TemplateProduct templateStores={ this.state.templateStores } />*/}
                <LoadingComponent ref="loading"  pageSize={ 12 } orderCondition={{ orderCondition: "reupdate_date desc" }} whereCondition={ { whereCondition: {'author =': '\''+ this.getUserId() +'\'', 'tpl_type =': 11, 'tpl_state =' : 2, 'tpl_delete': '=0', 'tpl_privacy =':'\'public\''}} } />
            </div>
        );
    },

    componentDidMount: function () {
        //WorkStore.addChangeListener(this.onChangeUserTemplate);

        this.renderUserMsg();
        //this.renderUserTemplate();
        this.renderUserTemplateNumber('read_pv');
        this.renderUserTemplateNumber('store_count');
        this.renderUserGaveQRCode();

        // 联系方式和打赏弹出层
        // this.contactPoplayer();
    },

    componentWillUnmount: function () {
        //WorkStore.removeChangeListener(this.onChangeUserTemplate);
    }, 

}));

// export DesignerRule component
module.exports = DesignerDetail;