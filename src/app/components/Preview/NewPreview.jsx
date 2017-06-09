/**
 * @component PreView
 * @description 作品详情页
 * @time 2015-10-23 16:00
 * @author Nick
 **/

// require core module
var React = require('react'),
    QRCode = require('qrcode.react'),
    Base = require('../../utils/Base'),
    TplObjModel = require('../../utils/TplObjModel'),
    Tpl = require('../../utils/tpl'),
    MeAPI = require('../../utils/MeAPI'),
    MeActionCreator = require('../../actions/MeActionCreators'),
    Notification = require('../Common/Notification'),
    GlobalFunc = require('../Common/GlobalFunc'),
    CompatibleTip = require("../Common/CompatibleTip"),
    PreviewMain = require('./PreviewMain'),
    PreviewShare = require('./PreviewShare');
import { Link } from 'react-router'
var LogUtils = require("../../utils/log.js");
var SHORTSERVER = require('../../config/serverurl.js').short;
var WorkStore = require('../../stores/WorkStore');
var MakeWebAPIUtils = require('../../utils/MakeWebAPIUtils');

var Dialog = require('../Common/Dialog');
var CartDialog = require('../Cart/Cart');
var urlconfig = require("../../config/serverurl.js")
var copy = require("../../../vendor/zeroclipboard/ZeroClipboard");

require('../../../assets/css/preview.css');

// user message
var hash = location.pathname, // 路由hash
    tid = Base.getParam(hash, 'tid'); // 作品id

// initialize tplobj model object
var tplObjModel = new TplObjModel({ tid: tid });

/* add by xs 2017/04/28 需要将作品多域名 手动跳回主域名
* */
const NEW_ORIGIN = 'http://www.agoodme.com';
// const NEW_ORIGIN = 'http://localhost:8000'; //测试

var NewPreview = React.createClass({

    getInitialState() {
        this.queryTemplateOnsale();

        var _this = this;
        MakeWebAPIUtils.loadOwnGoods().then(function (data) {
            if (data.err) {
                return false;
            }
            var goods = data.result || [];
            var ownBuyTpl = goods.filter(function (item) {
                return item.type == "template";
            });

            _this.setState({ ownBuyTpl: ownBuyTpl || [] }); //已购买模版
        }).catch((err) => {
            console.log(err)
        });

        return {
            shareState: false,
            collectState: false,//收藏状态
            reportState: false,
            shareListState: false,
            showQRCode: false,//是否在作品区显示二维码
            delayTime: 5,//翻页时间
            autoPlay: true,//是否自动播放
            fullScreen: false,//是否全屏
            disableNextPage: true,
            disablePrevPage: true,
            showAppCode: false, //APP下载二维码
            shortUrl: '',
            showShortUrl: false, //显示短链接
            showReport: false, //显示举报框
            appearanceState: false, //对话框
            cartData: [],
            isShow : true //根据地址栏hostname,判断打赏收藏举报是否显示 add by xs 2017/4/28
        };
    },
    swipeChanged() {

    },
    newPageChanged(pageIndex, groupIndex) {
        if (typeof pageIndex == "number") {
            var pageID = this.refs.phone.getPageDataObjects(pageIndex).objectId
            this.log.resetLogTargetAndEvent(pageID, "browse");
            this.log.postLogData(PostUrl);
        }
    },
    pageChanged() {
        var hasNexPage = this.refs.phone.hasNextPage();
        var hasPrevPage = this.refs.phone.hasPrevPage();
        var isLock = this.refs.phone.isLockPage();
        if (isLock) {
            this.setState({ disableNextPage: true, disablePrevPage: true })
        } else {
            this.setState({ disableNextPage: !hasNexPage, disablePrevPage: !hasPrevPage })
        }
    },

    componentDidMount() {

        window.PostUrl = "http://api.test.agoodme.com/v1/logger";       //目前只是测试
        //实例化
        var log = new LogUtils();
        var platformInfo = log.getPlatformInfo();         //获取平台信息
        var currentUser = Base.getCurrentUser();
        //初始化log 收集对象
        if (currentUser) {
            platformInfo.userId = currentUser.id;
        } else {
            platformInfo.userId = "";
        }
        /**
         *初始化
         *platformInfo  {"userId":"", "platformName":"", "platformVersion":""}
         *
         */
        log.initLogData(platformInfo);
        this.log = log;
        // 获得作品信息
        var hasNexPage = this.refs.phone.hasNextPage();
        var hasPrevPage = this.refs.phone.hasPrevPage();
        var isLock = this.refs.phone.isLockPage();
        if (!hasNexPage) {
            this.setState({ autoPlay: false })
        }
        if (isLock) {
            this.setState({ disableNextPage: true, disablePrevPage: true })
        } else {
            this.setState({ disableNextPage: !hasNexPage, disablePrevPage: !hasPrevPage })
        }
        var _this = this;
        var new_random = Math.round(Math.random()*(30000)+1000);
        $.ajax({
            type: "GET",
            url: urlconfig.api + "/v1/verify/expire?tid=" + tid+"&entry_domain="+location.host+'&rnd='+new_random,
            success: function (result) {
                if(NEW_ORIGIN!==location.origin){
                    _this.setState({
                        isShow : false
                    });
                }
                if(result.backup_domain_name){
                    var domain=result.backup_domain_name;
                    if(domain!==location.host){
                        // location.port = 80;
                        //location.host=domain;
                        //return ;
                        //location.host=domain;
                        //return ;
                    }
                }
                if (result.code === "10000") {
                    var tpl = JSON.parse(result.tpl_obj);

                    if (tpl.results[0].tpl_delete != 0) {
                        Base.linkToPath("/deleteWorkError");
                        return;
                    }
                    if (result.expire) {
                        Base.linkToPath("/workexpired")
                    } else {
                        _this.getPreview();
                        _this.displayFavoriateState();
                    }

                } else {
                    _this.getPreview();
                    _this.displayFavoriateState();

                }
            },
            error: function (msg) {
                _this.getPreview();
                // 如果收藏，显示收藏状态
                _this.displayFavoriateState();
            },
            dataType: "json"
        });




    },

    componentDidUpdate() {
        copy.config({ swfPath: "http://www.agoodme.com/vendor/zeroclipboard/ZeroClipboard.swf" });
        new copy(document.getElementById("copyUrl"));
    },

    copyTip: function () {
        GlobalFunc.addSmallTips("复制完成", 0.8);
    },

    componentWillReceiveProps(nextProps) {
        if (nextProps.params.tid != this.props.params.tid) {
            this.refs.phone.clearGlobalComponent();
            // 获得作品信息
            this.getPreview(nextProps.params.tid);
            // 如果收藏，显示收藏状态
            this.displayFavoriateState(nextProps.params.tid);
        }
    },

    showShortUrl: function () {
        var _this = this;
        var longURL = window.location.href;
        var shortURL;
        $.ajax({
            url: `${SHORTSERVER}/short`,
            type: "POST",
            data: JSON.stringify({ longURL: longURL }),
            crossDomain: true,
            dataType: "json",
            success: function (data) {
                _this.setState(
                    {
                        shortUrl: data.shortURL
                    }, function () {
                        _this.setState({
                            showShortUrl: true
                        });
                    });
            },
            error: function (err) {
                console.log(err);
            }
        });
    },

    reportBoxDom: function () {
        return (
            <div className="report-bg">
                <div className="report-box">
                    <div className="title">
                        <span className="fl">举报</span>
                        <span className="fr close" onClick={this.changeReportState}></span>
                    </div>
                    <div className="lists">
                        <label><input type="radio" name="report" value="广告等垃圾信息" /> 广告等垃圾信息</label>
                        <label><input type="radio" name="report" value="不宜讨论政治内容" /> 不宜讨论政治内容</label>
                        <label><input type="radio" name="report" value="违反法律法规内容" /> 违反法律法规内容</label>
                        <label><input type="radio" name="report" value="不友善内容" /> 不友善内容</label>
                        <label><input type="radio" name="report" value="其他" /> 其他</label>
                    </div>
                    <div className="btns">
                        <a href="javascript:;" onClick={this.pushReport}>确 定</a>
                        <a href="javascript:;" onClick={this.changeReportState}>取 消</a>
                    </div>
                </div>
                <Dialog title={this.state.dialogTitle} appearanceState={this.state.showDialog}
                    sureFn={this.state.sureFn} sureIsHide={this.state.sureIsHide} />
            </div>
        )
    },

    /**
     * 价格转换 分->元
     */
    priceConvert: function (price) {
        return parseFloat(price / 100).toFixed(2)
    },

    /**
     * 通过商品id判断商品是否已购买
     * @param goodId
     */
    isBuy: function (goodId) {
        var ownBuyTpl = this.state.ownBuyTpl;
        if ((typeof ownBuyTpl == "undefined") || ownBuyTpl.length == 0) return false;

        var filterArr = ownBuyTpl.filter(function (item) {
            return item.item_description.item_id == goodId;
        });

        if (filterArr.length > 0) {
            return true;
        } else {
            return false;
        }
    },

    render: function () {
        //if(location.href.indexOf("preview1")==-1){
        //    var url=location.href;
        //   url=url.replace("preview","preview1");
        //    location.href=url;
        //}
        if(location.href.indexOf("preview2")==-1){
            var url=location.href;
            url=url.replace(/(preview[0-9]*)/,"preview2");
            location.href=url;
        }
        var labelArr = [], otherTplArr = [];
        if (!!this.state.label) {
            //作品标签
            var label = this.state.label;
            for (var i = 0; i < label.length; i++) {
                var repeat = false;
                for (var j = 0; j < labelArr.length; j++) {
                    if (label[i] == labelArr[j]) {
                        repeat = true;
                    }
                }
                if (!repeat) {
                    labelArr[i] = label[i];
                }
            }
        }

        if (!!this.state.otherTpl) {
            //作者其他作品
            var otherTpl = this.state.otherTpl.data;
            for (var i = 0; i < otherTpl.length; i++) {
                otherTplArr[i] = otherTpl[i];
            }
        }

        var scDiv, otherWork;
        var autoPlayDiv = (<div className="auto-play">
            <div className="line"></div>
            <div className="minus" onClick={this.changeDelayTime.bind(this, this.state.delayTime - 2)}>
                <span>{this.state.delayTime - 2 >= 0 ? (this.state.delayTime - 2) + "s" : null}</span>
            </div>
            <div className={this.state.autoPlay ? "pause" : "play"}
                onClick={this.changeAutoPlay.bind(this, !this.state.autoPlay)}>
                <span>{(this.state.delayTime) + "s"}</span>
            </div>
            <div className="plus" onClick={this.changeDelayTime.bind(this, this.state.delayTime + 2)}>
                <span>{this.state.delayTime + 2 <= 15 ? (this.state.delayTime + 2) + "s" : null}</span>
            </div>
        </div>)
        if (!!this.state.fullScreen) {
            //全屏时的样式
            scDiv = <div>
                <div className="sc-div">
                    <a href="javascript:;" className={this.state.autoPlay ? "sc-pause" : "sc-play"}
                        onClick={this.changeAutoPlay.bind(this, !this.state.autoPlay)}>
                        {this.state.autoPlay ? "暂停" : "播放"}
                    </a>
                </div>
                <div className="sc-div" style={{ left: "auto", right: 40, width: 140 }}>
                    <a href="javascript:;" className="sc-exitFullScreen" style={{ width: 86 }}
                        onClick={this.changeFullScreen.bind(this, false)}>退出全屏</a>
                </div>
            </div>;
        } else {
            //非全屏
            if (!!this.state.tpl_type) {
                if (this.state.tpl_type == 10) {

                    var tid = this.props.params.tid,
                        onsaleTemplate = this.state.templateOnsale || [],
                        btn;

                    var onsale = onsaleTemplate.filter(function (item) {
                        var tplId = "Tpl_" + tid;
                        return item.goods_id == tplId && item.type == "template";
                    });

                    if (onsale.length > 0) {
                        var sale = onsale[0];

                        if (this.isBuy(sale.goods_id)) {
                            btn = (<Link to={"/make/" + tid} className="sc-toMake">使用模板</Link>);
                        } else {
                            var priceDom;
                            var data = [{
                                id: sale.id,
                                name: sale.name,
                                icon: GlobalFunc.subAvChar(sale.cover_pic) + "?imageView2/2/w/216",
                                price: this.priceConvert(sale.price),
                                type: "template"
                            }];
                            if (sale.original_price != '' && sale.original_price == sale.price) {
                                priceDom = (
                                    <div className="sc-toMake" onClick={this.onBuyHandle.bind(this, data)}>
                                        <p className="price">￥{this.priceConvert(sale.price)}</p>
                                        <p className="buy">立即购买</p>
                                    </div>
                                )
                            } else {
                                priceDom = (<div className="sc-toMake" onClick={this.onBuyHandle.bind(this, data)}>
                                    <p className="price"><span className="cost">￥{this.priceConvert(sale.price)}</span>
                                        <span className="rrp">￥{this.priceConvert(sale.original_price)}</span></p>
                                    <p className="buy">立即购买</p>
                                </div>)
                            }
                            btn = priceDom;
                        }
                    } else {
                        btn = (<Link to={"/make/" + tid} className="sc-toMake">使用模板</Link>);
                    }

                    //是模板时显示使用模板
                    scDiv = <div className="sc-div" >
                        {/*
                         <Link to={"/make/" + tid} className="sc-toMake">使用模板</Link>
                         <Link to={"/make/" + tid} className="sc-toMake" onClick={this.onToMakeHandle}>
                         <span className="cost">￥9.90</span>
                         <span className="rrp">￥200</span>
                         </Link>*/}
                        {btn}
                    </div>;
                } else {
                    //是作品时显示收藏
                    scDiv = <div className="sc-div" onClick={this.favorite.bind(this, null)} style={{ display: this.state.isShow ? "inline-block" : "none" }}>
                        <a href="javascript:;"
                            className={this.state.collectState ? "sc-btn-cur" : "sc-btn"}>{this.state.collectState ? "已收藏" : "收藏"}</a>
                    </div>;
                    if (otherTplArr.length > 0) {
                        //作者其他杂志
                        otherWork = <div className="other-work">
                            <h3 className="work-title">作者其他杂志</h3>

                            <div className="other-work-lists">
                                <ul>
                                    {otherTplArr.map(function (item, index) {
                                        var href = NEW_ORIGIN+"/preview/tid=" + item.attributes.tpl_id;
                                        return <li key={index}>
                                            <a href={href}><img
                                                src={GlobalFunc.subAvChar(item.attributes.tpl_share_img) + "?imageView2/2/w/216"}
                                                width="96" height="151" alt="" /></a>

                                            <div className="cover"></div>
                                        </li>
                                    })}
                                </ul>
                            </div>
                        </div>;
                    }
                }
            }
        }

        var rewardCode;

        if (this.state.rewardUrl) {
            //打赏的二维码
            rewardCode = <div className="reward-cover" onClick={this.hideReward}>
                <div className="reward-code">
                    <QRCode size={230} value={this.state.rewardUrl} />
                    <div className="description">微信扫描二维码打赏</div>
                </div>
            </div>;
        }

        var meLogo = !this.state.fullScreen ?
            <a className="preview-me-logo" target="_blank" href={NEW_ORIGIN}>主页</a> : null;

        var urlState = this.state.showShortUrl ? <div className="short-url">
            <span id="shorturlContent">{this.state.shortUrl}</span>
            <a id="copyUrl" href="javascript:;" data-clipboard-target="shorturlContent" onClick={this.copyTip}>复制短链接</a>
        </div> : <div className="short-url">
                <a href="javascript:;" className="copy-url" onClick={this.showShortUrl} style={{ display: !this.state.isDraft ? "inline-block" : "none" }}>生成短链接</a>
            </div>;

        return (
            <div className="work-detail">
                <CompatibleTip />
                <div className="draft-tips" style={{ display: this.state.isDraft ? "block" : "none" }}>此作品为未发布状态，仅用于作品预览，10分钟有效</div>
                <div className={this.state.fullScreen ? "hide" : "left-top"}>
                    <div className="user-info">
                        <dl>
                            <dt>
                                <a href={NEW_ORIGIN+'/designerDetail/uid=' + this.state.author}><img src={this.state.author_img}
                                    className="face" width="50"
                                    height="50" /></a>
                                <div className={"v" + this.state.author_vip_level}></div>
                            </dt>
                            <dd>
                                <p className="title" dangerouslySetInnerHTML={{ __html: this.state.name }}></p>

                                <p className="other"><a
                                    href={NEW_ORIGIN+'/designerDetail/uid=' + this.state.author}>{this.state.author_name}</a>
                                    | {this.state.createdAt}|
                                    页数：{this.state.page_int}</p>
                            </dd>
                        </dl>
                    </div>
                    <div className={labelArr.length > 0 ? "work-label" : "hide"}>
                        <ul>
                            {labelArr.map(function (val, index) {
                                return <li key={index}><span>{val}</span></li>
                            })}
                        </ul>
                    </div>
                    <div className="work-info" dangerouslySetInnerHTML={{ __html: this.state.brief }}></div>

                    {urlState}

                </div>

                {scDiv}

                {otherWork}

                <PreviewMain ref="phone" tid={this.props.params.tid} author={this.state.author}
                    showQRCode={this.state.showQRCode} showAppCode={this.state.showAppCode}
                    delayTime={this.state.delayTime} changeDelayTime={this.changeDelayTime}
                    autoPlay={this.state.autoPlay} changeAutoPlay={this.changeAutoPlay}
                    fullScreen={this.state.fullScreen} changeFullScreen={this.changeFullScreen}
                    pageChanged={this.pageChanged} newPageChanged={this.newPageChanged} />

                <PreviewShare ref="shareProduct" fullScreen={this.state.fullScreen} />

                {/*me logo*/}
                {meLogo}

                <div className={this.state.fullScreen ? "hide" : "fr-code"}
                    onMouseEnter={this.isShowQRCode.bind(this, true)}
                    onMouseLeave={this.isShowQRCode.bind(this, false)}>
                    <dl>
                        <dt>
                            <QRCode size={112} value={Base.generateQRCodeUrl(this.props.params.tid)} />
                        </dt>
                        {/*<dd>微信扫描查看</dd>*/}
                    </dl>
                </div>

                {/*app 下载*/}
                <div className={this.state.fullScreen ? "hide" : "fr-app-down"}
                    onMouseEnter={this.isShowAppCode.bind(this, true)}
                    onMouseLeave={this.isShowAppCode.bind(this, false)}>APP下载
                </div>

                <div className={this.state.fullScreen ? "hide" : "tool-bar"}>
                    {/*add by xs 2017/4/27 在非www.agoodme.com上取消举报/打赏功能*/}
                    <span className="report" onClick={this.changeReportState} style={{ display: this.state.isShow? "inline-block" : "none" }}>举报</span>
                    <span className="reward" onClick={this.reward} style={{ display: this.state.isShow ? "inline-block" : "none" }}>打赏</span>
                    <span className="page-ctrl"><span
                        className={this.state.disablePrevPage ? "page-prev disable" : "page-prev "}
                        onClick={this.prePage}></span><span
                            className={this.state.disableNextPage ? "page-next disable" : "page-next "}
                            onClick={this.nextPage}></span></span>
                </div>
                {this.state.showReport ? this.reportBoxDom() : null}

                <span className={this.state.fullScreen ? "hide" : "full-screen"} onClick={this.changeFullScreen.bind(this, true)}>全屏</span>

                {autoPlayDiv}

                {rewardCode}

                <Dialog title={this.state.tipsTitle} appearanceState={this.state.showTips}
                    sureFn={this.tipsSureFn} sureText={this.state.sureText} cancelFn={this.tipsCancelFn} showHeader={this.state.showHeader} sureIsHide={this.state.tipsSureIsHide} />
                <CartDialog ref="cart" data={this.state.cartData} />
            </div>)
    },

    /**
     * 余额不足提示框
    */
    onToMakeHandle: function (e) {
        e.preventDefault();

        this.setState({
            tipsTitle: '<span style="font-size: 16px; color:#333">余额不足，请及时充值</span>',
            showTips: true,
            sureText: "去充值",
            tipsSureIsHide: false,
            showHeader: true
        });

    },

    /**
     * 提示框点击确定
    */
    tipsSureFn: function () {
        Base.linkToPath('/user');
    },

    /**
     * 提示框点击取消
     */
    tipsCancelFn: function () {
        this.setState({
            showTips: false
        });

    },

    prePage(event) {
        if (!this.state.disablePrevPage) {
            this.refs.phone.prePage();
        }

    },
    nextPage(event) {
        if (!this.state.disableNextPage) {
            this.refs.phone.nextPage();
        }

    },
    getPreview(tid) {
        var _this = this;
        tplObjModel.getTplObj(tid || this.props.params.tid,
            ((_tpl) => {
                if (_tpl.length == 0) {
                    Base.linkToPath("/404");
                    return;
                }

                if (_tpl[0].attributes.tpl_delete != 0) {
                    Base.linkToPath("/deleteWorkError");
                    return;
                }
                if (_tpl[0].attributes.tpl_state == 1) {
                    this.setState({ isDraft: true })
                }
                //debugger;
                this.log.resetLogTargetAndEvent(tid || this.props.params.tid, "works");
                this.log.postLogData(PostUrl);
                var tpl = $.extend({}, _tpl[0].attributes, { createdAt: Base.formattime(_tpl[0].createdAt, 'yyyy-MM-dd') });
                var animationMode = !!tpl.animation_mode ? JSON.parse(tpl.animation_mode) : {};
                var autoPlay = animationMode.autoplay;
                if (typeof autoPlay == "boolean") {
                    setTimeout(() => {
                        _this.setState({ autoPlay: autoPlay, delayTime: (animationMode.interval / 1000) || 0 })
                    }, 500)

                }
                this.setPagePreview(tpl);
                this.queryOtherTpl(tpl.author, this.props.params.tid);
                this.setShareComponentState(_tpl[0].attributes.name, _tpl[0].attributes.tpl_share_img, _tpl[0].attributes.brief);
            }).bind(this)
        );
    },

    /**
     * 将作品详细信息全都转化为每一条state属性
     * @param tpl
     */
    setPagePreview(tpl) {
        var now = {
            author_name: '匿名',
            author_img: 'http://ac-hf3jpeco.clouddn.com/206ea7bf442919405a7f.jpg',//http://ac-hf3jpeco.clouddn.com/Qy6NxalPv9RwYq9soCsS84PGKMLirVnTLvptSqyh.jpg',
            name: '我刚刚使用ME发布了个人作品，快来看看吧！',
            createdAt: '-',
            page_int: '不祥',
            read_pv: '0',
            label: {},
            author_vip_level: 0
        };

        $.each(tpl,
            (_key, _value) => {
                _value && (now[_key] = _value);
            }
        );

        this.setState(now);
    },

    /**
     * 查询作者其他作品
     * @param uid 用户ID
     * @param tid 作品ID
     */
    queryOtherTpl(uid, tid) {
        //取用户的其他4个作品
        var _this = this;
        if (uid) {
            Tpl.getUserTpl(function (tpls) {
                _this.setState({
                    otherTpl: tpls
                })
            }, uid, 0, 4, "reupdate_date", "desc", "", 11, {
                    tplState: 2,
                    exceptTid: tid
                });
        }
    },

    /**
     * 创建分享信息
     * @param title
     * @param pic
     * @param summary
     * @returns {{url: string, title: *, content: *, pic: *, pics: *, summary: *, comment: *, description: *}}
     */
    buildShareComponentObject(title, pic, summary) {
        return {
            url: encodeURIComponent(window.location.href),
            title: title,
            content: title,
            pic: pic,
            pics: pic,
            summary: summary,
            comment: summary,
            description: summary
        }
    },

    /**
     * 设置分享组件状态
     * @param title
     * @param pic
     * @param summary
     */
    setShareComponentState(title, pic, summary) {
        //生成分享条并显示
        var shareComponentObject = this.buildShareComponentObject(title, pic, summary),
            shareComponentObjects = {};

        ['tsina', 'renren', 'tqq', 'tqzone', 'kaixin', 'tieba', 'cqq'].forEach(_name => {
            shareComponentObjects[_name] = shareComponentObject;
        });

        this.refs.shareProduct.setState(shareComponentObjects);
    },

    displayFavoriateState(tid) {
        this.favorite(tid, 'visible');
    },

    /**
     * 设置收藏状态
     * @param tid
     * @param type
     */
    favorite(tid, type = 'add') {
        //显示作品收藏状态和添加收藏
        var tid = tid || this.props.params.tid;

        var addFavoritePromise, findFavoritePromise;

        if (type === 'visible') {
            //取作品收藏状态
            findFavoritePromise = MeAPI.getFavoriteById(tid);

            findFavoritePromise && findFavoritePromise.then((_fav => {
                _fav && this.changeCollect();
            }).bind(this));
        } else {

            addFavoritePromise = MeActionCreator.addFavorite(tid);

            addFavoritePromise.then((_resp => {
                this.changeCollect('collectState');
            }).bind(this)).catch(_error => {
                Notification.currentNotification.show(_error.message);
            })
        }
    },

    changeCollect() {
        //设置作品收藏状态
        this.setState({
            collectState: true
        })
    },

    isShowQRCode(type) {
        //鼠标放上或移出时修改中间二维码状态
        this.setState({
            showQRCode: type
        })
    },

    isShowAppCode(type) {
        //鼠标放上或移出时修改中间二维码状态
        this.setState({
            showAppCode: type
        })
    },

    changeDelayTime(time) {
        //修改翻页时间
        if (time < 0 || time > 15) return;
        this.setState({
            delayTime: parseInt(time)
        })
    },

    changeAutoPlay(type, time) {
        if (typeof time != "undefined" && typeof time != "object") {
            this.setState({
                autoPlay: type,
                delayTime: time
            })
        } else {
            this.setState({
                autoPlay: type
            })
        }

    },

    changeFullScreen(type) {
        this.setState({
            fullScreen: type
        })
    },

    /**
     * 调用打赏接口
     */
    reward() {
        //点击打赏时通过接口取加打赏URL
        var _this = this;
        var data = {
            total_fee: '5',// 金额
            trade_type: '1',//交易类型 1为打赏
            tid: this.state.tpl_id,//作品id
            uid: this.state.author,//打赏给用户的id
            body: '打赏'  // 描述
        };
        fmacloud.Cloud.run('wechat_codeurl', data, {
            success: function (res) {
                var url = JSON.parse(res).codeurl;
                _this.setState({
                    rewardUrl: url
                })
            },
            error: function (error) {
                GlobalFunc.addSmallTips("网络有问题，请稍后再试！", 2);
                console.log("失败" + error.message);
            }
        });
    },

    /**
     * 改变举报状态
    **/
    changeReportState: function () {
        var _this = this;
        this.setState({
            showReport: !_this.state.showReport
        });
    },

    /**
     * 提交举报
    **/
    pushReport: function () {
        var _this = this;

        var reportValue = $('.report-box .lists input[name="report"]:checked ').val();
        //判断是否登录
        if (!Base.isLogin()) {
            this.setState({
                dialogTitle: '您还未登录，请登录',
                showDialog: true,
                sureFn: function () {
                    var hashs = location.pathname.slice(1);
                    localStorage.setItem("referer", hashs); //设置登录成功后跳转hash
                    Base.linkToPath(NEW_ORIGIN+'/login');
                },
                cancelFn: _this.hideDialog
            });
        } else if (!reportValue) {
            this.setState({
                dialogTitle: '请选择举报内容信息',
                showDialog: true,
                sureIsHide: true,
                sureFn: _this.hideDialog,
            });
        } else {
            var options = {};
            var currentUser = Base.getCurrentUser();
            var userNick = currentUser.attributes.user_nick;

            options.fb_type = 3;
            options.fb_objid = tid;
            options.context = "昵称为:" + userNick + "的用户,举报了ID为：" + tid + " 的作品; 举报内容为:" + reportValue;
            options.f_name = currentUser.attributes.user_nick;

            //(options, cb_ok, cb_err)
            MeAPI.addFeedback(options, function () {
                _this.setState({
                    dialogTitle: "举报成功!",
                    showDialog: true,
                    sureIsHide: true,
                    sureFn: _this.hideAllDialog,
                });
            }, function (error) {
                _this.setState({
                    dialogTitle: error,
                    showDialog: true,
                    sureIsHide: true,
                    sureFn: _this.hideDialog,
                });
            });
        }

    },

    hideReward() {
        this.setState({
            rewardUrl: null
        })
    },

    /**
     * 关闭dialog
     */
    hideDialog: function () {
        this.setState({
            showDialog: false
        });
    },

    hideAllDialog: function () {
        this.setState({
            showReport: false,
            showDialog: false
        });
    },

    /**
     * 查询所有在售模板数据请求
     */
    queryTemplateOnsale: function () {
        var _this = this;
        MakeWebAPIUtils.loadPrices().then(function (data) {
            _this.setState({
                templateOnsale: data.result
            });
        }).catch(function (error) {
            console.log(error, "error");
        });
    },

    onBuyHandle: function (data) {
        var _this = this,
            _data = Array.isArray(data) ? data : [data];
        if (!Base.getCurrentUser()) {
            _this.setState({
                dialogTitle: '您还未登录，请登录',
                showDialog: true,
                sureFn: function () {
                    Base.linkToPath('/login');
                }
            });
        } else {
            _this.setState({
                cartData: _data
            }, function () {
                _this.refs.cart.changeDialogStatus(true,0);
            });
        }
    }


});

// define Preview component
module.exports = NewPreview;