/**
 * @component TemplateProduct
 * @description 产品模板组件
 * @time 2015-10-19 20:34
 * @author 曾文彬
 **/

'use strict';

// require core module
var React = require('react');

var QRCode = require('qrcode.react');

var Base = require('../../utils/Base');

var MeAPI = require('../../utils/MeAPI');

var MeActionCreator = require('../../actions/MeActionCreators');

var Notification = require('./Notification');

var GlobalFunc = require('./GlobalFunc');

var ImageModules = require('../Mixins/ImageModules');
var Dialog = require('../Common/Dialog');
var CartDialog = require('../Cart/Cart');

var WorkStore = require('../../stores/WorkStore');
import {Link} from 'react-router'

var MakeWebAPIUtils = require("../../utils/MakeWebAPIUtils.js");

var TemplateProduct = React.createClass({

    getInitialState: function() {
        var _this = this;
        MakeWebAPIUtils.loadOwnGoods().then(function(data) {
            if(data.err) {
                return false;
            }
            var goods = data.result || [];
            var ownBuyTpl = goods.filter(function(item) {
                return item.type == "template";
            });

            _this.setState({ ownBuyTpl: ownBuyTpl || [] }); //已购买模版
        });


        return {
            dialogTitle: '',
            showDialog: false,
            showHeader: false,
            data: []
        }
    },

    clearAVFrontChar(url,width) {
        url=url ? url.slice(3) : '';
        var suffix = "?imageView2/2/w/"+width;
        if (url.indexOf("gif") > 0) {
            suffix = suffix + "/format/gif";
        }
        if(url!=""){
            url+=suffix
        }

        return url;
    },

    /**
     * 生成二维码
    */
    generateQRCode(value, size = 128) {
        return (<QRCode value={value} size={size}/>);
    },

    buildAuthorName(name) {
        var retName;

        if (name) {
            retName = (
                <span className="clearfix">
                    {/*{ !!this.props.category && <span className="bychar">by</span> } */}
                    <i>{name}</i>
                </span>
            );
        }

        return retName;
    },

    /**
     * 价格转换 分->元
    */
    priceConvert: function(price) {
        return parseFloat(price / 100).toFixed(2)
    },

    /**
     * 通过商品id判断商品是否已购买
     * @param goodId
    */
    isBuy: function(goodId) {
        var ownBuyTpl = this.state.ownBuyTpl;
        if((typeof ownBuyTpl == "undefined") || ownBuyTpl.length == 0 ) return false;

        var filterArr = ownBuyTpl.filter(function(item) {
            return item.item_description.item_id == goodId;
        });

        if( filterArr.length > 0 ) {
            return true;
        }else {
            return false;
        }
    },

    buildCategoryTemplate(work) {
        var btn;
        var onsaleTemplate = this.props.onsaleTemplate || [];
        var tplId = work.attributes.tpl_id;
        var onsale = onsaleTemplate.filter(function(item) {
            var TplId = "Tpl_" + tplId;
            return item.custom_code == TplId;
        });

        var _this = this;

        if(onsale.length > 0) {
            var sale = onsale[0];
            //console.log(sale);
            var attr = work.attributes;
            ///现在模板只有一个一个卖的，只取list[0]
            if(_this.isBuy(sale.custom_code)) {
                btn = (<Link to={ '/make/' + work.attributes.tpl_id } target="_blank" className="link btn-black btn-fill-vert-o">使用模板</Link>);
            }else {
                var data = [{
                    id: sale.id,
                    name: attr.name,
                    icon: GlobalFunc.subAvChar(attr.tpl_share_img) + "?imageView2/2/w/216",
                    price: this.priceConvert(sale.price),
                    qixian : Base.formattime(sale.end_at, 'yyyy-MM-dd'),
                    sum: "1",
                    custom_code: sale.custom_code,
                    type: "template"
                }];
                btn  = (<div className="link" onClick={this.onBuyHandle.bind(this, data)}>
                    <span className="rrp">￥{this.priceConvert(sale.original_price)}</span><span className="cost">￥{this.priceConvert(sale.price)}</span>
                    <span className="use">立即购买</span>
                </div>);
            }
        }else {
            btn = (<Link to={ '/make/' + work.attributes.tpl_id } target="_blank" className="link btn-black btn-fill-vert-o">使用模板</Link>);
        }

        var templateStr = '',
            category = WorkStore.isShowCreateTemplate();
        var mode=(
                <div className="create-title div1">
                    <p className="title" title={ work.attributes.name }>{ work.attributes.name }</p>
                    <p className="author"> { this.buildAuthorName(work.attributes.author_name) }</p>
                    {/*<Link to={ '/make/' + work.attributes.tpl_id } target="_blank" className="link btn-black btn-fill-vert-o">使用模板</Link>*/}
                    {/*<Link to={ '/make/' + work.attributes.tpl_id } target="_blank" className="link">
                        <span className="rrp">￥200</span><span className="cost">￥19.99</span>
                        <span className="use">立即购买</span>
                    </Link>*/}
                    {btn}
                </div>
            );
        var work=(
                <div className="div1">
                    <div className="cart-avator">
                        <div className="avatar fl">
                          <Link to={'/designerDetail/uid=' + work.attributes.author}><img src={ work.attributes.author_img || ImageModules.defineImageModules().defaultUserLogo} width="30" height="30" /></Link>
                        </div>
                        <div className="info fr">
                          <p className="title" title={ work.attributes.name }>{ work.attributes.name }</p>
                          <p><Link to={'/designerDetail/uid=' + work.attributes.author} className="info-color">{ this.buildAuthorName(work.attributes.author_name) }</Link></p>
                        </div>
                    </div>

                    <div className="cart-active" data-tplid={ work.attributes.tpl_id }>
                       { this.favorite(work.attributes.tpl_id) }
                       <span className="num fl">{ work.attributes.read_pv || 0 }</span>
                       <span className="star fr" onClick={ this.favorite.bind(this, work.attributes.tpl_id, 'do') }><a href="javascript:;">收藏</a></span>
                    </div>
                </div>
            );

        if (category) {
            templateStr = mode;
        } else {
            templateStr = work;
        }
        if((!!this.props.type)&&this.props.type=="mode"){
            templateStr = mode;
        }else if((!!this.props.type)&&this.props.type=="work"){
            templateStr = work;
        }

        return templateStr;
    },

    /*
     * 去掉url开头的 "AV:"
     
    subAvChar(url) {
        return url.substr(0, 3) == "AV:" ? url.substr(3) : url;

    },*/

    buildTargetLink(work) {

        var child = (
            <div className="link-layer">
                <div className="template-zask"></div>
                <div className="template-qrcode">
                    { this.generateQRCode(Base.generateQRCodeUrl(work.attributes.tpl_id), 115) }
                </div>
                {/*<img src={this.clearAVFrontChar(work.attributes.effect_img,216)} />*/}
                <img src={!!work.attributes.tpl_share_img ? GlobalFunc.subAvChar(work.attributes.tpl_share_img) + "?imageView2/2/w/216" : this.clearAVFrontChar(work.attributes.effect_img,216)}  />
            </div>
        );
    

        return (
            <Link title={this.props.category ? '点击或扫描浏览模版' : '点击或扫描浏览作品'} className="link-to-preview" to={'/preview/tid=' + work.attributes.tpl_id} target="_blank">
                { child }
            </Link>
        )
    },

    getTemplateWorks() {
        //var templates = this.state ? this.state.templateStores : this.props.templateStores;
        var templates = this.state.templateStores ? this.state.templateStores : this.props.templateStores;

        templates = templates instanceof Array && templates.length > 0 && templates.map(((_work, _index) => {

            return (
                <dl key={_index}>
                    <dt>
                        { this.buildTargetLink(_work) }
                    </dt>
                    <dd>
                        { this.buildCategoryTemplate(_work) }
                        <div className="div2"></div>
                        <div className="div3"></div>
                    </dd>
                </dl>
            );
        }).bind(this));

        return templates;
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

	render() {
        return (
			<div className="product clearfix">
                <div className="product-lists">
                    {this.getTemplateWorks()}
                </div>
                <Dialog title={this.state.dialogTitle} sureText={this.state.sureText} showHeader={this.state.showHeader} appearanceState={this.state.showDialog} sureFn={this.sureFn} cancelFn={this.hideDialog}/>
                <CartDialog ref="cart" data = {this.state.data} />
            </div>
		);
	},

    onBuyHandle: function(data) {
        var _data = Array.isArray(data) ? data : [data];
        if(!Base.getCurrentUser()){
            this.setState({
                dialogTitle: '您还未登录，请登录',
                showDialog : true,
                sureFn: function() {
                    Base.linkToPath('/login');
                }
            });
        }else {
            this.setState({
                data: _data
            },()=>this.refs["cart"].changeDialogStatus(true,0));
        }
    },

    /**
     * 关闭dialog
     */
    hideDialog: function () {
        this.setState({
            showDialog: false,
            showHeader : false
        });
    }
});

module.exports = TemplateProduct;
