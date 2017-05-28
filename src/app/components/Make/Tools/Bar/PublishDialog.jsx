/**
 * @component 发布作品
 * @description 发布作品
 * @time 2015-09-19 19:20
 * @author Nick
 **/
var log = require("loglevel");
var React = require("react");
var Router = require('react-router'),
    Link = Router.Link;
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import Switch from '../../../Common/Switch';
import Collapse, {Panel} from '../../../Common/Collapse';
import Upload from '../../../Common/Upload';
require("../../../../actions/DialogActionCreator");
var InputColorPicker = require('../../../Common/InputColorPicker');
var DialogAction = require("../../../../actions/DialogActionCreator");
var MakeActionCreator = require("../../../../actions/MakeActionCreators");
var LoadingWave = require("../../../../lib/wave_1");

var tplAnimationConfig = require("../../../../config/tpl_animation_config");
var PageStore = require("../../../../stores/PageStore");
var ElementStore = require("../../../../stores/ElementStore");
var MagazineStore = require("../../../../stores/MagazineStore");
var GlobalFunc = require("../../../Common/GlobalFunc");
var WorkDataUtil = require("../../../../utils/WorkDataUtil");
var MakeWebAPIUtils = require("../../../../utils/MakeWebAPIUtils.js");
var ShowPreView = require("../../../Common/ShowPreView");
var Base = require("../../../../utils/Base");
var MeConstants = require("../../../../constants/MeConstants");
var ElementType = MeConstants.Elements;
var Color = require("../../../Common/Color");
var Cart = require("../../../Cart/Cart");
var classnames = require("classnames");
var defaultLogo = require("../../../../../assets/images/make/default-logo.png")
// require label model
var LabelsModel = require('../../../../utils/LabelsModel');
var _ = require("lodash");
// initialize label model
var labelsModel = new LabelsModel();
var AutoSave = require("../autoSave");
var $ = require("jquery");
var uploadedFile, uploadCoverSrc, jCropUpload, jCropEffect;
var cropImg = {};
var cropImgSize = {"x": 0, "y": 184, "x2": 640, "y2": 824};
var cropBoxWidth = 333.5;
var cropImgType = "effect";
function noop() {

}
function getJsonTplData() {
    var treeData = MagazineStore.getTplDataClone(false);
    WorkDataUtil.setGroupThumb(treeData);
    var allPages = MagazineStore.getAllPagesRef(treeData.get("items"));
    treeData.set("pages", allPages)
    //var _tplData = WorkDataUtil.getJsonTplData();
    WorkDataUtil.filterItems(treeData);
    var _tplData = WorkDataUtil.avosTplData2Json(treeData);
    return _tplData;
}
function getTpl() {
    return MagazineStore.getTpl();
}

function getMusic() {
    return ElementStore.getTplMusic();
}

var lookClick = true;

module.exports = React.createClass({

    getInitialState: function () {
        MakeWebAPIUtils.getGoodPrice(["Svc_CustomLogo"], true, "service").then(goodsInfo => {
            var goodInfo = goodsInfo[0];
            this.setState({
                logoCurPrice: (goodInfo.price / 100).toFixed(2),
                logoOriPrice: (goodInfo.original_price / 100).toFixed(2)
            })
        });
        MakeWebAPIUtils.getGoodPrice(["Svc_LastPageAndBottomMark"], true, "service").then(goodsInfo => {
            var goodInfo = goodsInfo[0];
            this.setState({
                lastPageCurPrice: (goodInfo.price / 100).toFixed(2),
                lastPageOriPrice: (goodInfo.original_price / 100).toFixed(2)
            })
        });
        /*MakeWebAPIUtils.getGoodPrice(['Svc_Mouth'], true, 'service').then(goodsInfo => {
            let goodInfo = goodsInfo[0];
            this.setState({
                userCurMonthPrice: (goodInfo.price / 100).toFixed(2),
                userOriMonthPrice: (goodInfo.original_price / 100).toFixed(2)
            })
        });
        MakeWebAPIUtils.getGoodPrice(['Svc_Year'], true, 'service').then(goodsInfo => {
            let goodInfo = goodsInfo[0];
            this.setState({
                userCurYearPrice: (goodInfo.price / 100).toFixed(2),
                userOriYearPrice: (goodInfo.original_price / 100).toFixed(2)
            })
        });*/

        //加载次数去服务器拿
        MakeWebAPIUtils.loadOwnGoods(Base.getCurrentUser().id,true).then(data => {

            if (data.err) {
                return false
            }
            var ownGoods = data.result;

            for (var i = 0, len = ownGoods.length; i < len; i++) {
                var item = ownGoods[i];
                if (item.item_description.item_id == "Svc_LastPageAndBottomMark") {
                    this.setState({ownRemoveLastPageCount: item.item_count || 0})
                }
                if (item.item_description.item_id == "Svc_CustomLogo") {
                    this.setState({ownCustomLogoCount: item.item_count || 0})
                }
                //add by Mr xu 2017/5/2 增加包月,包年的到期时间
                if (item.item_description.item_id == "Svc_Mouth") {
                    this.setState({ownCustomMonth: Base.formattime(item.available_end_at, 'yyyy-MM-dd') || Base.formattime(new Date(), 'yyyy-MM-dd')})
                }
                if (item.item_description.item_id == "Svc_Year") {
                    this.setState({ownCustomYear: Base.formattime(item.available_end_at, 'yyyy-MM-dd') || Base.formattime(new Date(), 'yyyy-MM-dd')})
                }
            }
        });
        var hasRenEnvelope = GlobalFunc.existInWork(MagazineStore.getAllPagesRef(), ElementType.redEnvelope);
        var tpl = getTpl().attributes;
        var ifPublish;
        if (hasRenEnvelope) {
            ifPublish = false;
        } else {
            ifPublish = typeof (tpl.tpl_privacy) == "undefined" ? true : (tpl.tpl_privacy == "public" ? true : false);
        }

        var commentOff = !!tpl.comment_off;
        MakeWebAPIUtils.getRESTfulData({
            url: `/v1/sm/works/tpl/${tpl.tpl_id}`, success: (data) => {
                if (!data.err) {
                    var logoInfo = data.result;
                    this.setState({logo: logoInfo.logo || "", customLogo: logoInfo.logo_used, logoID: logoInfo.id})
                }
            }, error: function (err) {

            }
        })
        var pageNumStyleObj = this._getPageNumStyle();
        var animationMode = !!tpl.animation_mode ? JSON.parse(tpl.animation_mode) : {};

        //init作品信息,在渲染模板之前
        return {
            tplID: tpl.tpl_id,
            cartData: [],
            tplName: tpl.name == "noname" ? GlobalFunc.getUserObj().user_nick : tpl.name,
            tplClass: tpl.tpl_class || 0,
            tplDescription: tpl.brief == "/" ? "我刚刚使用ME发布了个人作品，快来看看吧！" : tpl.brief,
            tplMusic: {},
            tplPages: getJsonTplData(),
            tplPagesIndex: 0,
            tagsLib: [],
            selectedTags: [],
            catalogType: WorkDataUtil.getJsonTpl().list_style,
            showCatalog: true,
            pageNumStyle: pageNumStyleObj.style,
            pageNumColor: pageNumStyleObj.color,
            showPageNumberPanel: false,
            ifPublish: ifPublish,//是否公开作品
            commentOff: commentOff,//关闭评论
            hasPrevPage: false,
            hasNextPage: false,
            hasPrevGroup: false,
            hasNextGroup: false,
            tplLoop: !!tpl.tpl_loop,//循环播放
            autoPlay: animationMode.autoplay,//自动播放
            autoPlayInterval: animationMode.interval || 0,//自动播放间隔
            customLogo: false,//自定义logo标志
            logo: "",//logo地址
            removeLastPage: tpl.last_status || 0,//去尾页打开标志,
            userName: ""
        }
    },

    componentWillUnmount: function () {
        AutoSave.start();
    },

    componentDidMount: function () {
        var userID = Base.getCurrentUser().id;
        this.setState({avatar: Base.getCurrentUser().get("user_pic"), userName: Base.getCurrentUser().get("user_nick")})
        MakeWebAPIUtils.getWorkUsedPrivilege(this.state.tplID, userID).then(data => {
            //data是已经收过费的功能
            data.result && data.result.forEach(item => {
                var chargedID = item.item_description.item_id;
                if (chargedID == "Svc_LastPageAndBottomMark") {
                    this.setState({
                        lastPageAndBottomMarkUsed: true
                    })
                }
                if (chargedID == "Svc_CustomLogo") {
                    this.setState({
                        customLogoUsed: true
                    })
                }

            })
        })
        this.pageChanged();
        this.refs.rightSlide.style.marginRight = "0px";
        cropImgSize = {"x": 0, "y": 184, "x2": 640, "y2": 824};
        uploadedFile = null;
        jCropUpload = null;
        jCropEffect = null;
        cropImgType = "effect";
        AutoSave.stop();
        var _this = this;
        //取作品标签库
        labelsModel.getLabelsBySQL({
            fieldColumn: '*',
            whereCondition: {
                ['type in ']: '(\'pc-trade\',\'pc-function\')'
            },
            orderCondition: "order desc",
            currentPage: 1,
            pageSize: 12
        }).then(function (_data) {
            var tagsLib = _data.results.map((item) => {
                return item.get("name")
            });
            var tpl = getTpl().attributes;
            var saveLabel = tpl.label;
            var selectedTags = [];
            //确定选中的标签
            tpl.label.forEach((text) => {
                var index = _.indexOf(tagsLib, text);
                if (index != -1) {
                    selectedTags.push(index);
                } else {
                    tagsLib.push(text);
                    selectedTags.push(tagsLib.length - 1);
                }
            });
            _this.setState({
                tagsLib: tagsLib,
                selectedTags: selectedTags
            });

        });

        var tpl = getTpl().attributes;
        if (tpl.upload_url) {
            //用户上传过封面，显示右边的封面图
            this._showUploadEffectImg();
        } else {
            //用户没有上传封面，生成首页缩略图并裁切默认位置
            this._showEffectImg();
        }


    },

    componentDidUpdate: function () {

    },

    toggleLabel: function (index) {
        var selectedArr = this.state.selectedTags;

        var i = _.indexOf(selectedArr, index);
        if (selectedArr.length >= 3 && i == -1) {
            GlobalFunc.addSmallTips("作品标签最多只能选择3个", null, {clickCancel: true})
            //no more than 3 tag selected
            return;
        }
        if (i == -1) {
            selectedArr.push(index)

        } else {
            selectedArr.splice(i, 1);
        }
        this.setState({selectedTags: selectedArr});
    },
    togglePageNumber: function (event) {
        //if(this.state.pageNumPanelBlur){
        //    return ;
        //}
        event.stopPropagation();
        this.setState({
            showPageNumberPanel: !this.state.showPageNumberPanel,
            pageNumPanelBlur: this.state.showPageNumberPanel
        });


    },
    /**
     * 选择组时取消或选中组的显示页码
     * @param i
     * @private
     */
    _setPageGroup: function (i, value) {
        MakeActionCreator.updateGroupPageNum(i, value);
        var _this = this;
        this.refs.preview.clearGlobalComponent();

        this.setState({tplPages: getJsonTplData()}, function () {
            _this._showMagazine();
        });
    },
    _selectAllGroup: function () {
        var _this = this;
        var allSelected = true;
        this.state.tplPages.groups.forEach((group, index) => {
            if (group["show_page_num"] == false) {
                allSelected = false;
            }
        });
        this.refs.preview.clearGlobalComponent();
        this.state.tplPages.groups.forEach((group, index) => {
            MakeActionCreator.updateGroupPageNum(index, !allSelected);
        });
        this.setState({tplPages: getJsonTplData()}, function () {
            _this._showMagazine();
        });

    },
    nextGroup() {
        this.refs.preview.nextGroup()
    },
    nextPage: function () {
        this.refs.preview.nextPage();
    },
    prevGroup() {
        this.refs.preview.prevGroup();
    },
    prevPage: function () {
        this.refs.preview.prevPage();

    },
    pageChanged: function () {
        this.setState({
            hasPrevPage: this.refs.preview ? this.refs.preview.hasPrevPage() : false,
            hasNextPage: this.refs.preview ? this.refs.preview.hasNextPage() : false,
            hasPrevGroup: this.refs.preview ? this.refs.preview.hasPrevGroup() : false,
            hasNextGroup: this.refs.preview ? this.refs.preview.hasNextGroup() : false
        })
    },
    stopPropagation(event) {
        event.stopPropagation();
    },
    hidePageNumPanel: function () {
        this.setState({showPageNumberPanel: false})
    },
    changeComment: function () {
        this.setState({commentOff: !this.state.commentOff})
    },
    changePrivacy: function () {
        this.setState({ifPublish: !this.state.ifPublish})
    },
    closeLogoLoading: function () {
        LoadingWave.end();
        this.setState({showCloseLogoLoading: false})
    },
    render: function () {
        var panelHeight = {height: document.body.clientHeight - 40 - 54 - 50}
        var user = GlobalFunc.getUserObj();
        var selectOption = [];
        var tplData = WorkDataUtil.getJsonTpl();
        tplData.tpl_sign = 2;
        tplData.groups = this.state.tplPages.groups;
        var allGroupSelected = true;
        tplData.groups.forEach(group => {
            if (!group.show_page_num) {
                allGroupSelected = false;
            }
        });
        var pageNumGroup = tplData.groups.map((group, index) => {
            return <li key={index} onClick={this._setPageGroup.bind(this, index, !group.show_page_num)}><span
                className={group.show_page_num ? "select-icon selected" : "select-icon"}></span><span
                className="group-text">{group.f_name}</span></li>
        });
        if (pageNumGroup.length > 0) {
            pageNumGroup.unshift(<div key="selectAll"><span
                className={allGroupSelected ? "select-icon selected" : "select-icon"}
                onClick={this._selectAllGroup}></span>全选
            </div>)
        }
        var show = <ShowPreView ref="preview" type="publish" pageChanged={this.pageChanged} userNick={user.user_nick}
                                tplData={tplData} musicData={getMusic()}
                                pageUid={PageStore.getPageUid()}/>;

        var labels = this.state.tagsLib.map((label, index) => {
            var selected = _.indexOf(this.state.selectedTags, index) != -1;
            return <li key={index} className={selected ? "label selected" : "label"}
                       onClick={this.toggleLabel.bind(this, index)}>{label}</li>
        });

        var pageNumberPanel = (<div className="page-number-panel">
            <div className="page-num-style line horizontal">
                <label>样式</label>
                <div>
                    <ul>
                        <li className={this.state.pageNumStyle == 1 ? "selected" : ""}
                            onClick={this._selectPageNumStyle.bind(this, 1)}></li>
                        <li className={this.state.pageNumStyle == 2 ? "selected" : ""}
                            onClick={this._selectPageNumStyle.bind(this, 2)}></li>
                        <li className={this.state.pageNumStyle == 0 ? "selected" : ""}
                            onClick={this._selectPageNumStyle.bind(this, 0)}>无
                        </li>
                    </ul>
                </div>

            </div>
            <div className="page-num-color line horizontal">
                <label>颜色</label>
                <div><InputColorPicker type="text" className="make-fontColor-select"
                                       value={this.state.pageNumColor}
                                       onChange={this._selectPageNumColor}/></div>
            </div>
            <div className="page-num-group line horizontal">
                <label>页码位置</label>
                <div>
                    <ul className="select-group">
                        {pageNumGroup}
                    </ul>
                </div>
            </div>

        </div>)
        let baseInfo = <div className="base-info small-white-scroll">
            <div className="line horizontal">
                <label>作品封面</label>
                <div className="publish-info-screen">
                    <div id="publish-info-screenshot">
                        <span className="tips">正在生成缩略图...</span>
                        <div className="img-frame">
                            <img id='screenImage'/>
                        </div>

                        <span className='replace'></span>
                        <span className='edit'></span>
                        <span className='ok'></span>
                        <span className='cancel'></span>
                    </div>
                </div>
            </div>
            <div className="line horizontal">
                <label>作品名称</label>
                <div >
                    <input id="tpl-name" value={GlobalFunc.htmlDecode(this.state.tplName)} maxLength="40"
                           placeholder="用户的作品"
                           onChange={this._changeValue.bind(this, "tplName")}/>
                </div>
            </div>
            <div className="line horizontal summary">
                <label>作品描述</label>
                <div>
                    <textarea id="tpl-description" placeholder="作品简介" maxLength="100"
                              value={GlobalFunc.htmlDecode(this.state.tplDescription)}
                              onChange={this._changeValue.bind(this, "tplDescription")}></textarea>
                </div>
            </div>
            <div className="line horizontal">
                <label>公开作品</label>
                <div >
                    <Switch checked={this.state.ifPublish} onChange={this.changePrivacy}></Switch>
                    <span className="tips">查看<a href="/helper?type=ME审核规范" target="_blank">作品审核规则</a></span>
                </div>
            </div>
            <div className="line horizontal">
                <label>弹幕评论</label>
                <div >
                    <Switch checked={!this.state.commentOff} onChange={this.changeComment}></Switch>
                </div>
            </div>
            <Collapse accordion={true} prefixCls="me-collapse" defaultActiveKey="label">
                <Panel header="页码设置" key="pageNum">{pageNumberPanel}</Panel>
                <Panel header="目录设置" key="catalog">
                    <div className="line horizontal publish-info-select">
                        <label>样式</label>
                        <div >
                            <select id="catalog-type" value={this.state.catalogType} onChange={this._changeCatalogType}>
                                <option value="1">目录样式一单列白</option>
                                <option value="2">目录样式二单列黑</option>
                                <option value="3">目录样式三双列白</option>
                                <option value="4">目录样式四双列黑</option>
                            </select>
                        </div>
                    </div>
                </Panel>
                <Panel header="标签设置" key="label">
                    <div className="tpl_label fl">
                        <ul>
                            {labels}</ul>
                    </div>
                </Panel>
            </Collapse>

            <div id="publish-info-uploadFile">
                <input id="fileUrl" type="file" accept="image/jpeg,image/jpg,image/png,image/gif"
                       onChange={this._uploadFile}/>
            </div>
        </div>
        var menuStyle = {}
        if (this.state.menuPosition) {
            menuStyle.top = this.state.menuPosition.top;
            menuStyle.right = this.state.menuPosition.right;
            menuStyle.left = "auto"
        }
        var showLoop = false;
        if (this.state.tplPages && this.state.tplPages.groups && this.state.tplPages.groups.length == 1) {
            showLoop = true
        }
        //add by Mr xu 2017/5/2 增加去尾页的包月包年服务
        var lastPage;
        if (this.state.lastPageAndBottomMarkUsed) {
            lastPage = <span className="fr"><span className="fee">已使用</span></span>
        }else if (this.state.ownRemoveLastPageCount && !(this.state.ownCustomMonth || this.state.ownCustomYear)) {
            lastPage = <span className="fee fr">剩余次数{this.state.ownRemoveLastPageCount}次</span>
        }else if(this.state.ownCustomMonth || this.state.ownCustomYear){
            lastPage = <span className="fee fr">到期时间{this.state.ownCustomMonth || this.state.ownCustomYear}</span>
        } else {
            lastPage = <span className="fr compare-price"> <span className="fee"><span
                className="cur-price">{this.state.lastPageCurPrice || ""}</span>元/次</span><div
                className="old-price">{this.state.lastPageOriPrice || ""}元</div></span>
        }
        var customLogoTip;
        var uploadLogoStyle = {};
        //add by Mr xu 2017/5/2 增加包月包年服务
        if (this.state.customLogoUsed) {
            customLogoTip = <span className="fr"><span className="fee">已使用</span></span>
        } else if (this.state.ownCustomLogoCount && !(this.state.ownCustomMonth || this.state.ownCustomYear)) {
            customLogoTip = <span className="fee fr">剩余次数{this.state.ownCustomLogoCount}次</span>
        } else if (this.state.ownCustomMonth || this.state.ownCustomYear) {
            customLogoTip = <span className="fee fr">到期时间:{this.state.ownCustomMonth || this.state.ownCustomYear}</span>
        } else {
            uploadLogoStyle.marginTop = "-16px";
            customLogoTip = <span className="fr compare-price">
                <span className="fee"><span className="cur-price">{this.state.logoCurPrice || ""}</span>元/次</span>
                <div className="old-price">{this.state.logoOriPrice || ""}元</div>
            </span>
        }
        
        var customLogoClass = classnames({
            "black-loading-animation": !!this.state.updatingCustomLogo,
            img: true,
            "image-center": true
        })
        let advancedSetting = (<div className="advanced-setting"><Collapse defaultActiveKey={["0", "1", "2"]}>
            <Panel header="播放设置" key="0">
                {showLoop ? <div className="line horizontal">
                    <label>循环播放</label>
                    <div>
                        <Switch checked={this.state.tplLoop}
                                onChange={this.changeBoolean.bind(this, "tplLoop")}></Switch>
                    </div>
                    <span className="fr"><span className="fee">免费</span></span>
                </div> : null}
                <div className="line horizontal auto-play-setting">
                    <label>自动播放</label>
                    <div >
                        <Switch checked={this.state.autoPlay}
                                onChange={this.changeBoolean.bind(this, "autoPlay")}></Switch>
                    </div>
                    <span className="fr">{this.state.autoPlay ?
                        <span> <input type="number" value={this.state.autoPlayInterval / 1000} min="0" max="60"
                                      onChange={this._changeAutoPlayTime.bind(this, "autoPlayInterval")}/> <span
                            className="unit">s</span></span> : null} <span className="fee">免费</span></span>
                </div>
            </Panel>
            <Panel header="加载设置" key="1">
                <div className="line horizontal">
                    <label>加载logo</label>
                    <div>
                        <div onClick={this.customLogoClick}>
                            <Switch checked={this.state.customLogo}
                                    onChange={this.changeBoolean.bind(this, "customLogo")}></Switch>
                        </div>
                    </div>
                    {customLogoTip}
                </div>
                {this.state.customLogo ? <div className="line horizontal upload-logo" style={uploadLogoStyle}>
                    <span className={customLogoClass}
                          style={{ backgroundImage: `url(${this.state.logo == "" ? defaultLogo : this.state.logo})` }}/>
                    <div className="fl upload-button"><Upload component="div"
                                                              accept="image/jpeg,image/jpg,image/png,image/gif"
                                                              onChange={this.logoChange}>
                        <button >设置加载logo</button>
                    </Upload>
                        <span className="tips fl">建议大小：128*128px</span></div>
                </div> : null}

            </Panel>
            <Panel header="尾页设置" key="2">
                <div className="line horizontal last-page-setting">
                    <span onClick={this.changeLastPageSetting.bind(this, "0")} className="label"><input type="radio"
                                                                                                        readOnly
                                                                                                        checked={this.state.removeLastPage == "0"}
                                                                                                        value="0"/><span>默认尾页样式</span></span>
                    <span className="fee fr">免费</span>
                </div>
                <div className="line horizontal last-page-setting">
                    <span onClick={this.changeLastPageSetting.bind(this, "1")} className="label"><input type="radio"
                                                                                                        readOnly
                                                                                                        checked={this.state.removeLastPage == "1"}
                                                                                                        value="1"/><span>去除尾页和底标</span></span> {lastPage}
                </div>
            </Panel>
        </Collapse></div>)
        return (
            <div className="select-dialog">
                <div className="publish-dialog" onClick={this.hidePageNumPanel}>
                    <Cart ref="cart" data={this.state.cartData} onOk={this.onPayOk.bind(this, this.state.cartData)}/>
                    <div className="preview-area">
                        <div className="logoloading"><span className="close-logoloading"
                                                           style={{ display: this.state.showCloseLogoLoading ? "block" : "none" }}
                                                           onClick={this.closeLogoLoading}></span></div>

                        <div className="last-page" ref="lastPage"><img className="avatar" src={this.state.avatar}
                                                                       style={{ display: !!this.state.avatar ? "block" : "null" }}></img>
                            <div className="user-name">{this.state.userName}</div>
                            <span className="close-logoloading" onClick={this.hideLastPage}></span></div>
                        <div className="clip-parent">
                            {show}
                            <div id="publish-info-cropEffect">
                                <img id="cropEffectImg" title="分享作品封面"/>
                                <ul className="crop-menu pop-menu" style={menuStyle}>
                                    <li className="menu-close item" onClick={this._cropEffectCancel}/>
                                    <li className="menu-confirm item" onClick={this._cropEffectOk}>裁切</li>
                                </ul>
                            </div>
                        </div>
                        <ul className="tools">
                            <li className={classnames({
                                "pre-group": true,
                                enabled: this.state.hasPrevGroup
                            })} title={this.state.hasPrevGroup ? "" : "没有上一组了"}><span className="img"
                                                                                      onClick={this.state.hasPrevGroup ? this.prevGroup : noop}></span><span
                                className="tips">上一组</span></li>
                            <li className={classnames({
                                "next-group": true,
                                enabled: this.state.hasNextGroup
                            })} title={this.state.hasNextGroup ? "" : "没有下一组了"}><span className="img"
                                                                                      onClick={this.state.hasNextGroup ? this.nextGroup : noop}></span><span
                                className="tips">下一组</span></li>
                            <li className={classnames({
                                "pre-page": true,
                                enabled: this.state.hasPrevPage
                            })} title={this.state.hasPrevPage ? "" : "没有上一页了"}><span className="img"
                                                                                     onClick={this.state.hasPrevPage ? this.prevPage : noop}></span><span
                                className="tips">上一页</span></li>
                            <li className={classnames({
                                "next-page": true,
                                enabled: this.state.hasNextPage
                            })} title={this.state.hasNextPage ? "" : "没有下一页了"}><span className="img"
                                                                                     onClick={this.state.hasNextPage ? this.nextPage : noop}></span><span
                                className="tips">下一页</span></li>
                        </ul>
                    </div>
                    <span className="close-dialog" onClick={this.closeDialog}></span>
                    <div className="publish-info" ref="rightSlide">
                        <Tabs className="tabs-h40" forceRenderTabPanel={true}>
                            <TabList>
                                <Tab>基础信息</Tab>
                                <Tab>高级设置</Tab>
                            </TabList>
                            <TabPanel style={panelHeight}>{baseInfo}</TabPanel>
                            <TabPanel style={panelHeight}>{advancedSetting}</TabPanel>
                        </Tabs>

                        <div className="footer">
                            <button className="publish-info-okBtn" onClick={this._checkPrivilege}>
                                发布
                            </button>
                            <button className="publish-info-cancel" onClick={this.closeDialog}>
                                取消
                            </button>

                        </div>
                    </div>

                </div>
                <div id="publish-info-cropFile">
                    <div>
                        <img id="uploadedImg" crossOrigin="anonymous"/>
                        <ul className="cropCtrlBar">
                            <button onClick={this._cropCancel}>取消</button>
                            <button className="active" onClick={this._cropConfirm}>确定</button>
                        </ul>
                    </div>
                </div>
            </div>
        )

    },
    customLogoClick: function () {

        if (!this.state.customLogo) {
            this.hideLastPage();
            this.refs.preview.clearGlobalComponent();
            LoadingWave.start(this.state.logo || "", "phone-container");
            this.setState({showCloseLogoLoading: true});
        } else {
            LoadingWave.end();
            this.setState({showCloseLogoLoading: false})
        }


    },
    hasID: function (arr, id) {
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i] == id) {
                return true;
            }
        }
        return false;
    },
    updateLogo: function () {
        var userID = Base.getCurrentUser().id;
        //更新owngoods,进入发布
        var data = {
            works_id: this.state.tplID,
            user_id: userID,
            logo: this.state.logo,
            logo_used: this.state.customLogo
        }
        if (this.state.logoID) {
            //更新
            MakeWebAPIUtils.postRESTfulData({
                type: "PUT",
                url: `/v1/sm/user/${userID}/works/${this.state.logoID}`,
                data: data,
                success: function (ret) {

                }
            })
        } else if (this.state.customLogo) {
            //第一次打开时新增
            MakeWebAPIUtils.postRESTfulData({
                url: `/v1/sm/user/${userID}/works`, data: data, success: function (ret) {

                }
            })
        }
    },
    /**
     * 使用特权
     *
     */
    onPayOk: function (useArr, type) {
        if (type != 2) {
            return;
        }
        debugger;
        if (this.unchargePrivilege) {
            MakeWebAPIUtils.usePrivilege(this.unchargePrivilege, this.state.tplID, "works", Base.getCurrentUser().id).then(ret => {

                if (ret.err) {
                    console.log(ret.err);
                    GlobalFunc.addSmallTips("收费功能使用失败，请重新发布", {clickCancel: true});
                    return;
                }
                MakeWebAPIUtils.updateOwnGoods(ret);

                if (this.hasID(this.unchargePrivilege, "Svc_CustomLogo")) {
                    //对logo收了费
                    this.updateLogo();
                }

                this._determine();
            }, err => {
                MakeWebAPIUtils.loadOwnGoods(Base.getCurrentUser().id, true);
                GlobalFunc.addSmallTips("收费功能使用失败，请重新发布", {clickCancel: true});
                return;
                //更新owngoods，提醒用户失败
            })
        } else {
            this.updateLogo();
            this._determine();
        }

    },
    
    /*
    * 增加特权页面默认的数据格式 add by
    * */
    addDefalutData : function (target) {
        var obj = {};
        obj.defaultPage = 'make';//增加制作页标识
        obj.sum = '0';//增加默认用户选择参数
        obj.custom_code = target['custom_code'];
        obj.id = target['id'];
        obj.name = target['name'];
        obj.description = target['description'];
        obj.icon = target['icon'];
        obj.price = (target['price']/ 100).toFixed(2);
        // obj.qixian = Base.formattime(target['end_at'], 'yyyy-MM-dd');
        obj.qixian = target['end_at'];
        return obj;
    },
    /*
    * 验证账号是否冻结*/
    _checkPrivilege:function(){
        var userID = Base.getCurrentUser().id;
        var _that=this;
        fmacloud.Cloud.run('userCheck',{'val':userID,'type':"make"},{
            success:function(data){
                //status=data.result.status;
                //return "kong"
            },
            error:function(err){
                //console.log("error")
                return false;
            }
        }).then(function(data){
            var str;
            if(data.status){
                if(data.end){
                    var time=Base.formattime(data.end,"yyyy-MM-dd HH:mm:ss");
                    str="该账户已被冻结，冻结截止时间:"+time+"。"
                        +"\n如有问题请联系客服。"
                }else{
                    str="该账号已被永久冻结。";
                }
                alert(str);
                window.location.href = 'http://www.agoodme.com/' + 'login';
                //$(".publish-info-okBtn").html("账户已被冻结")
                return false;
            }
            _that._checkPrivilege1();
        }).catch(function(){
            _that._checkPrivilege1();
        })
    },

    /*
     * 1.检查收费点是否收过费
     */
    _checkPrivilege1: function () {
        var userID = Base.getCurrentUser().id;
        var checkObj = [];//收费点
        var self = this;
        if (this.state.customLogo) {
            checkObj.push("Svc_CustomLogo");
        }
        if (this.state.removeLastPage == "1") {
            checkObj.push("Svc_LastPageAndBottomMark");
        }
        if (checkObj.length > 0) {
            //增加默认参数,
            let defaultEndPages = [];
            MakeWebAPIUtils.getGoodPrice(["Svc_CustomLogo"], true, "service").then(goodsInfo => {
                defaultEndPages.push(self.addDefalutData(goodsInfo[0]));
            });
            MakeWebAPIUtils.getGoodPrice(["Svc_LastPageAndBottomMark"], true, "service").then(goodsInfo => {
                defaultEndPages.push(self.addDefalutData(goodsInfo[0]));
            });
            MakeWebAPIUtils.getGoodPrice(['Svc_Mouth'], true, 'service').then(goodsInfo => {
                defaultEndPages.push(self.addDefalutData(goodsInfo[0]));
            });
            MakeWebAPIUtils.getGoodPrice(['Svc_Year'], true, 'service').then(goodsInfo => {
                defaultEndPages.push(self.addDefalutData(goodsInfo[0]));
            });
            for(let defaultValue of defaultEndPages){
                if(defaultValue.custom_code == 'Svc_LastPageAndBottomMark'){
                    defaultValue.sum = self.state.ownRemoveLastPageCount;
                }else if(defaultValue.custom_code == 'Svc_CustomLogo'){
                    defaultValue.sum = self.state.ownCustomLogoCount;
                }
            }

            MakeWebAPIUtils.getWorkUsedPrivilege(this.state.tplID, userID).then(data => {
                //data是已经收过费的功能
                data.result && data.result.forEach(item => {
                    var chargedID = item.item_description.item_id;
                    for (let i = 0, len = checkObj.length; i < len; i++) {
                        let privilegeItem = checkObj[i];
                        if (chargedID == privilegeItem) {
                            checkObj.splice(i, 1)
                            break;
                        }
                    }
                })
                return Promise.resolve(checkObj)
            }).catch(err => {
                log.info(err.message);
                return Promise.resolve(checkObj)
            }).then((unchargePrivilege) => {
                if (unchargePrivilege && unchargePrivilege.length > 0) {
                    this.unchargePrivilege = unchargePrivilege;
                    MakeWebAPIUtils.getGoodPrice(unchargePrivilege, true, "service").then((goodsInfos) => {
                        //查看本地记录，看什么可以直接使用
                        var goodsPromise = goodsInfos.map((goodInfo) => {
                            return MakeWebAPIUtils.loadOwnGoods().then(data => {
                                debugger;
                                if (data.err) {
                                    return false
                                }
                                var ownGoods = data.result;

                                // if(typeof this.state.ownCustomMonth !=='undefined' || typeof this.state.ownCustomYear !=='undefined'){
                                //     return true;
                                // }
                                //判断特权是否过期
                                for(let value of ownGoods){
                                    let endTimes = new Date(value.available_end_at).getTime();
                                    let newTimes = new Date().getTime();
                                    if(endTimes>newTimes){
                                        return true;
                                    }
                                }
                                for (var i = 0, len = ownGoods.length; i < len; i++) {
                                    var item = ownGoods[i];
                                    if (item.item_description.item_id == goodInfo.custom_code && item.item_count > 0) {
                                        return true;
                                    }
                                }
                                return false
                            })
                        });

                        Promise.all(goodsPromise).then(availableArr => {
                            var directUseArr = [], chargeArr = [];
                            availableArr.forEach((item, index) => {
                                if (item) {
                                    directUseArr.push(goodsInfos[index])
                                } else {
                                    chargeArr.push(goodsInfos[index]);
                                }
                            })

                            if (chargeArr.length > 0) {
                                //收费
                                var netgoodsInfos = chargeArr.map(item => {
                                    var expire = !!item.end_at ? item.end_at : "永久";
                                    return {
                                        name: item.name,
                                        icon: item.icon,
                                        price: (item.price / 100).toFixed(2),
                                        sum: "1",
                                        qixian: expire,
                                        id: item.id,
                                        custom_code: item.custom_code
                                    }
                                })

                                for(let defaultValue of defaultEndPages){
                                    // debugger;
                                    for(let userValue of netgoodsInfos){
                                        if(defaultValue.custom_code === userValue.custom_code && defaultValue.sum =='0'){
                                            defaultValue.sum = userValue.sum;
                                        }
                                    }
                                }
                                this.setState({
                                    cartData: defaultEndPages
                                }, () => {
                                    this.refs["cart"].changeDialogStatus(true,0);
                                })
                            } else {
                                this.onPayOk(undefined, 2);
                            }


                            // var availableGoods = [];
                        })
                        // var netgoodsInfos = goodsInfos.map(item => {
                        //     var expire = !!item.end_at ? item.end_at : "永久";
                        //     return { name: item.name, icon: item.icon, price: item.price, sum: "1", qixian: expire, id: item.id }
                        // })

                    }).catch(console.log.bind(console))

                } else {
                    //都已经收过费
                    this.onPayOk(undefined, 2);


                    //  MakeWebAPIUtils.postRESTfulData({type:"PUT",url:`/v1/user/${userID}/works/${this.state.tplID}`,data:{}})


                }

            });
        } else {
            //没有选择收费功能
            if (this.state.logoID) {
                //先使用过去logo，后来关闭时要更新logo开关和地址信息
                var data = {
                    WorksID: this.state.tplID,
                    UserID: userID,
                    Logo: this.state.logo,
                    LogoUsed: this.state.customLogo
                }
                MakeWebAPIUtils.postRESTfulData({
                    type: "PUT",
                    url: `/v1/sm/user/${userID}/works/${this.state.logoID}`,
                    data: data,
                    success: function () {

                    }
                })
            }
            this._determine();
        }


    },
    hideLastPage: function () {
        $(this.refs.lastPage).hide()
    },
    /**
     * 去除尾页样式选择
     */
    changeLastPageSetting: function (type) {
        this.setState({showCloseLogoLoading: false});
        LoadingWave.end();
        var $lastPage = $(this.refs.lastPage);
        if (type == 0) {
            $lastPage.show();
        } else {
            $lastPage.show()
            setTimeout(() => {
                $lastPage.hide("normal")
            }, 1000)

        }
        this.refs.preview.clearGlobalComponent();
        this.setState({removeLastPage: type})
    },
    /**
     * 上传logo图片
     */
    logoChange: function (e) {
        var _this = this;
        this.setState({updatingCustomLogo: true})
        var file = e.target.files[0]
        var newFile = new fmacloud.File(file.name, file);
        newFile.save().then((object) => {
            var _url = object.get("url");
            var logo = _url + "?imageMogr2/thumbnail/!128x128r";
            this.setState({updatingCustomLogo: false, logo: logo});
            LoadingWave.end();
            this.setState({showCloseLogoLoading: false})
            setTimeout(() => {
                _this.hideLastPage();
                _this.refs.preview.clearGlobalComponent();
                LoadingWave.start(logo, "phone-container");
                _this.setState({showCloseLogoLoading: true})
            }, 1000)
        }, function (error) {
            console.log(error);
        })
    },
    /**
     * 获取页码样式
     * @returns {{style: number, color: string}}
     * @private
     */
    _getPageNumStyle: function () {
        //老数据样式存在page_style里，新数据样式存在page_num_style里
        //优先取page_num_style里的数据，如果没有才取page_style里的数据
        var pageNumStyle = 0, pageNumColor = "rgb(0,0,0)";
        if (WorkDataUtil.getJsonTpl().page_num_style != undefined) {
            var styleObj = JSON.parse(WorkDataUtil.getJsonTpl().page_num_style);
            pageNumStyle = styleObj.style;
            pageNumColor = styleObj.color;
        } else if (WorkDataUtil.getJsonTpl().page_style != undefined) {
            pageNumStyle = WorkDataUtil.getJsonTpl().page_style;
        }
        return {style: pageNumStyle, color: pageNumColor}
    },

    /**
     * 更新元素的页码格式,
     * @param value
     * @param event
     * @private
     */
    _selectPageNumStyle: function (value, event) {
        var _this = this;
        this.refs.preview.clearGlobalComponent();
        var value = parseInt(value);
        //因为需要在左边显示修改效果，所以需要写回TPL，保存时不需要重新取界面的值
        var styleObj = this._getPageNumStyle();
        styleObj.style = value;
        MagazineStore.updateTpl("page_num_style", JSON.stringify(styleObj));
        this.setState({pageNumStyle: value}, function () {
            _this._showMagazine();
        });
    },
    /**
     * 更新元素的页码颜色,
     * @param value
     * @param event
     * @private
     */
    _selectPageNumColor: function (value, event) {
        var _this = this;
        this.refs.preview.clearGlobalComponent();
        //因为需要在左边显示修改效果，所以需要写回TPL，保存时不需要重新取界面的值
        var styleObj = this._getPageNumStyle();
        styleObj.color = value;
        MagazineStore.updateTpl("page_num_style", JSON.stringify(styleObj));
        this.setState({pageNumColor: value}, function () {
            _this._showMagazine();
        });
    },
    _showMagazine: function () {
        var tplData = WorkDataUtil.getJsonTpl();
        tplData.tpl_sign = 2;
        tplData.groups = this.state.tplPages.groups;
        this.refs.preview.showMagazine(tplData);
    },
    _changeCatalogType: function (event) {
        var _this = this;
        MagazineStore.updateTpl("list_style", parseInt(event.target.value));
        _this.refs.preview.clearGlobalComponent();
        //this.refs.preview.hideViewPorts()
        this.setState({catalogType: event.target.value}, function () {
            _this._showMagazine();
            this.refs.preview.showViewPorts();

        })
        //console.log(event);
    },
    closeDialog: function () {
        DialogAction.hide();
    },
    /**
     * 显示上传的图片和添加事件
     * @private
     */
    _showUploadEffectImg: function () {
        var _this = this;
        var $screenShot = $("#publish-info-screenshot"), $screenImage = $('#screenImage');
        var $replace = $screenShot.find(".replace"),//上传封面图，替换目前封面图
            $edit = $screenShot.find(".edit"); //裁切


        _this._cropUploadFile(getTpl().get("upload_url"));
        console.log(getTpl().get("tpl_share_img"), "getTpl().get()")
        $screenImage.attr("src", getTpl().get("tpl_share_img")).css({"margin": 0, "width": 102, "height": 102});
        //点击各个按钮时更新DOM
        $edit.click(function () {
            $("#publish-info-cropFile").show();
        });
        $replace.click(function () {
            $("#publish-info-uploadFile").find("input").trigger("click");
        });
        lookClick = false;
    },
    _cropEffectCancel: function () {
        $("#publish-info-cropEffect").hide();
    },
    _cropEffectOk: function () {
        $("#publish-info-cropEffect").hide();
        cropImgSize = jCropEffect.tellSelect();
    },

    //生成效果图
    _showEffectImg: function () {
        var cropRatio = cropBoxWidth / 640;
        var _this = this;
        var $screenShot = $("#publish-info-screenshot"), $screenImage = $('#screenImage');
        lookClick = true;
        //生成第一页的缩略图
        WorkDataUtil.createEffectImgWithoutText(0, function (data) {
            //按显示预览效果图框裁切
            var boundX,
                boundY,
                xSize = $screenShot.width(),
                ySize = $screenShot.height();

            var updatePreview = function (c) {//更改选区时，更新数据
                if (parseInt(c.w) > 0) {
                    var rx = xSize / c.w;
                    var ry = ySize / c.h;

                    $screenImage.css({
                        width: Math.round(rx * boundX) + 'px',
                        height: Math.round(ry * boundY) + 'px',
                        marginLeft: '-' + Math.round(rx * c.x) + 'px',
                        marginTop: '-' + Math.round(ry * c.y) + 'px'
                    });

                    cropImg.width = Math.round(rx * boundX);
                    cropImg.height = Math.round(ry * boundY);
                    cropImg.left = Math.round(rx * c.x);
                    cropImg.top = Math.round(ry * c.y);
                }
                var top = (c.h + c.y) * cropRatio;
                if (top > (1008 * cropRatio - 40)) {
                    top = c.y * cropRatio;
                }
                _this.setState({
                    menuPosition: {
                        top: top,
                        right: (640 - c.x2) * cropRatio
                    }
                })
            };
            $screenImage.attr("src", data);
            //WorkDataUtil.uploadEffectImg(data, function (file) {
            //    $screenImage.attr("src", file.url());
            //    console.log(file.url());
            //});
            var $replace = $screenShot.find(".replace"),//上传封面图，替换目前封面图
                $edit = $screenShot.find(".edit"), //裁切
                $cropEffect = $("#publish-info-cropEffect"),
                $cropEffectImg = $("#cropEffectImg");

            $replace.click(function () {
                $("#publish-info-uploadFile").find("input").trigger("click");
            });
            //点击各个按钮时更新DOM
            $edit.click(function () {
                $cropEffect.show();
            });


            //调用Jcrop插件
            $cropEffectImg.attr("src", data);
            $cropEffectImg.Jcrop({
                onChange: updatePreview,
                onSelect: updatePreview,
                aspectRatio: xSize / ySize,
                boxWidth: cropBoxWidth,
                setSelect: [cropImgSize.x, cropImgSize.y, cropImgSize.x2, cropImgSize.y2]
            }, function () {
                var bounds = this.getBounds();
                boundX = bounds[0];
                boundY = bounds[1];
                jCropEffect = this;
            });

            lookClick = false;
        });
    },
    /**
     * 生成上传图片的裁切图
     * @param fileUrl
     * @private
     */
    _cropUploadFile: function (fileUrl, isShow) {
        cropImgType = "upload";
        var $cropFile = $("#publish-info-cropFile");
        if (isShow) {
            $cropFile.show();
        }

        var $cropCtrlBar = $cropFile.find(".cropCtrlBar");

        var fixWidth, fixHeight;

        var cropChange = function (c) {
            $cropCtrlBar.hide();
            cropImgSize.width = c.w;
            cropImgSize.height = c.h;
            cropImgSize.left = c.x;
            cropImgSize.top = c.y;
            console.log(cropImgSize);
        };
        var cropSelect = function (c) {
            if (!!jCropUpload) {
                c = jCropUpload.tellScaled();
                $cropCtrlBar.show();
                $cropCtrlBar.css({
                    left: c.x2 + fixWidth - 140,
                    top: c.y2 + fixHeight + 2
                });
            }

        };

        if (!!jCropUpload) jCropUpload.destroy();

        var image = document.getElementById("uploadedImg");
        image.onload = function () {
            var imageWidth = image.naturalWidth,
                imageHeight = image.naturalHeight,
                clientWidth = document.body.clientWidth,
                clientHeight = document.body.clientHeight;

            if (imageWidth >= imageHeight && imageWidth >= clientWidth) {
                imageWidth = clientWidth - 100;
                imageHeight = imageHeight / (image.naturalWidth / imageWidth);
            } else if (imageHeight > imageWidth && imageHeight >= clientHeight) {
                imageHeight = clientHeight - 100;
                imageWidth = imageWidth / (image.naturalHeight / imageHeight);
            }
            if (imageHeight >= clientHeight) {
                imageWidth = image.naturalWidth / (image.naturalHeight / (clientHeight - 100));
                imageHeight = clientHeight - 100;
            }
            if (imageWidth >= clientWidth) {
                imageHeight = image.naturalHeight / (image.naturalWidth / (clientWidth - 100));
                imageWidth = clientWidth - 100;
            }

            $("#uploadedImg").css({width: "auto", height: "auto"});

            $(image).Jcrop({
                    onChange: cropChange,
                    onSelect: cropSelect,
                    boxWidth: imageWidth,
                    boxHeight: imageHeight,
                    aspectRatio: 1 / 1
                },
                function () {
                    jCropUpload = this;
                    fixWidth = (clientWidth - imageWidth) / 2;
                    fixHeight = (clientHeight - imageHeight) / 2;
                    $cropFile.find(".jcrop-holder").css({
                        "margin-left": fixWidth,
                        "margin-top": fixHeight
                    });
                    if (image.naturalWidth > image.naturalHeight) {
                        jCropUpload.setSelect([(image.naturalWidth - image.naturalHeight) / 2, 0, image.naturalHeight, image.naturalHeight]);
                    } else {
                        jCropUpload.setSelect([0, (image.naturalHeight - image.naturalWidth) / 2, image.naturalWidth, image.naturalWidth]);
                    }
                }
            )

        };
        image.src = fileUrl;
    },
    //上传封面图
    _uploadFile: function () {
        var _this = this;

        function getFileUrl(sourceId) {
            var url;
            if (navigator.userAgent.indexOf("Chrome") > 0) { // Chrome
                url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
            } else {
                alert(' 您使用的浏览器不支持此功能，请使用推荐浏览器：“Chrome、360极速” ');
                return {};
            }
            return {
                url: url,
                name: document.getElementById(sourceId).files.item(0).name,
                obj: document.getElementById(sourceId).files.item(0)
            };
        }

        var fileUrl = getFileUrl("fileUrl");

        if (fileUrl == null) return;
        var newFile = new fmacloud.File(fileUrl.name, fileUrl.obj);
        if (GlobalFunc.isGif(newFile.get("name"))) {
            _this._cropUploadFile(fileUrl.url, false);
        } else {
            _this._cropUploadFile(fileUrl.url, true);
        }
        newFile.save().then(function (object) {
            var _url = object.get("url");
            uploadCoverSrc = _url;

            if (GlobalFunc.isGif(_url)) {
                uploadedFile = uploadCoverSrc;
                $("#screenImage").attr("src", uploadCoverSrc);
            }
            //GlobalFunc.addSmallTips("视频封面上传成功", 0, {clickCancel: true, delBackGround: true});
        }, function (error) {
            console.log(error);
        })


    },
    /**
     * 裁切出图片上传
     * @private
     */
    _cropConfirm: function () {
        $(".jcrop-holder > div:first-child").append("<div class='saveLoading'><span>裁切中...</span></div>");
        var $cropFile = $("#publish-info-cropFile"),
            $cropCtrlBar = $cropFile.find(".cropCtrlBar"),
            $screenShot = $("#publish-info-screenshot"),
            $screenImage = $('#screenImage'),
            $edit = $screenShot.find(".edit");
        $cropCtrlBar.hide();
        jCropUpload.disable();
        var canvas = $('<canvas width="332" height="332"></canvas>')[0],
            ctx = canvas.getContext('2d'),
            image = document.getElementById("uploadedImg"),
            base64,
            left = cropImgSize.left,
            top = cropImgSize.top,
            scale = 102 / cropImgSize.width;
        ctx.drawImage(image,
            left, top,//开始剪切的坐标位置
            cropImgSize.width, cropImgSize.height,//原始图像的宽高
            0, 0,//在画布上图像开始的坐标位置。
            332, 332);//要使用的图像的宽高
        base64 = canvas.toDataURL();
        WorkDataUtil.uploadEffectImg(base64, function (file) {
            uploadedFile = file;
            var newImg = new Image();
            newImg.onload = function () {
                $screenImage.attr("src", file.url()).css({"margin": 0, "width": 102, "height": 102});
                $cropFile.hide();
                $edit.unbind("click");
                $edit.click(function () {
                    $cropFile.show();
                });
                $cropCtrlBar.show();
                $(".jcrop-holder > div:first-child .saveLoading").remove();
                jCropUpload.enable();
                var obj = document.getElementById('fileUrl');
                obj.value = "";
            };
            newImg.src = file.url();
            console.log("图片上传成功！");
        }, function (err) {
            $(".jcrop-holder > div:first-child .saveLoading span").html("裁切失败，请重新裁切...");
            setTimeout(function () {
                $(".jcrop-holder > div:first-child .saveLoading").remove();
                $cropCtrlBar.show();
                jCropUpload.enable();
            }, 2000);
            console.log(err, "封面图裁切上传失败");
        });
    },

    _cropCancel: function () {
        var obj = document.getElementById('fileUrl');
        obj.value = "";
        $("#publish-info-cropFile").hide();
    },
    /**
     * 修改state里name对应的值
     * @param event
     * @private
     */
    _changeValue: function (name, event) {
        var value = GlobalFunc.htmlEncode(event.target.value);
        this.setState({
            [name]: value
        })
    },
    _changeAutoPlayTime: function (name, event) {
        var value = event.target.value;
        value = parseFloat(value);
        if (isNaN(value)) {
            GlobalFunc.addSmallTips("自动播放时间不是数字", null, {clickCancel: true})
            return;
        }
        if (value < 0) {
            value = 0
        }
        if (value > 60) {
            value = 60
        }
        this.setState({
            [name]: value * 1000
        })
    },
    /**
     * boolean置反
     */
    changeBoolean: function (name) {
        var value = this.state[name];
        if (name === "autoPlay" && !value) {
            this.setState({
                [name]: !value,
                autoPlayInterval: 1000
            })
        } else {
            this.setState({
                [name]: !this.state[name]
            })
        }

    },
    /**
     * 修改作品描述
     * @param event
     * @private
     */
    _changeDescription: function (event) {
        var value = event.target.value.substr(0, 100);
        this.setState({
            tplDescription: value
        })
    },

    /**
     * 修改作品翻页
     * @private
     */
    //_changeAnimationType: function () {
    //    var tplAnimationType = $("#tpl-animation-type"),
    //        tplAnimationTypeV = tplAnimationType.val();
    //    var animation_mode = JSON.stringify(tplAnimationConfig[tplAnimationTypeV].animationValue);
    //    this.setState({
    //        animation_mode: animation_mode
    //    });
    //
    //    var tpl = getTpl();
    //    tpl.set("animation_mode", animation_mode);
    //
    //    //this._showView("#shareDialog-phone-container", this.state.tplPages);
    //},
    /**
     * 2.发布
     * @private
     */
    _determine: function () {
        if (!!lookClick) {
            alert(" 正在生成缩略图,请稍候 ");
            return;
        }
        //获取页面元素
        var check = this._checkInput();

        //TODO 调用后台API(leancloud)获取新域名 2.把获取到新域名放这里
        // check.tpl_domain="testa.agoodme.com"
        this._getHostFormBack((host)=> {
            check.tpl_domain = host;

            if (!check) return;
            //取出用户选择的标签
            var labelArr = this.state.selectedTags.map((selectedIndex) => {
                return this.state.tagsLib[selectedIndex];
            });
            $(".publish-info-okBtn").html("发布中...").attr("disabled", "disabled").addClass("disabled");
            if (cropImgType == "effect") {
                //源图片是根据第一页生成的图片
                //上传效果图 -- 包括原图和缩略图
                this._uploadEffectImg(function (file) {
                    this._uploadCoverImg(function (coverFile) {
                        this._uploadTplObj(file, check, coverFile, labelArr);
                    }.bind(this), function () {
                        console.log("上传微信封面图失败");
                        $(".publish-info-okBtn").html("发布失败(重新发布)").removeAttr("disabled").removeClass("disabled");
                    });
                }.bind(this), function () {
                    console.log("上传效果图失败");
                    $(".publish-info-okBtn").html("发布失败(重新发布)").removeAttr("disabled").removeClass("disabled");
                });
            } else if (cropImgType == "upload") {
                //源图片是用户按钮上传的图片
                if (uploadedFile) {
                    //用户裁切过
                    this._uploadTplObj(uploadedFile, check, uploadedFile, labelArr, uploadCoverSrc);
                } else {
                    //用户直接发布
                    var tpl = getTpl().attributes;
                    var share_url = tpl.tpl_share_img.indexOf("AV:") > -1 ? tpl.tpl_share_img.split("AV:")[1] : tpl.tpl_share_img;
                    share_url = share_url.split('?')[0]
                    this._uploadTplObj(share_url, check, share_url, labelArr, tpl.upload_url);
                }

            }
        });
    },

    //获取后台传送的域名  -- 被弃用
    /*_getHostFormBack: function (callback) {
        let userID = Base.getCurrentUser().id;

        let tpl_id = this.state.tplID.tpl_id;
        tpl_id = (typeof tpl_id == 'undefined') ? '' : tpl_id;

        fmacloud.Cloud.run('getDomain', {user_id: userID, tpl_id: tpl_id}, {
            success: function (host) {
                // debugger;
                if (!!host) {
                    // return host.trim();
                    callback(host.trim());
                }
            },
            error: function (err) {
                // debugger;
                console.log(err.message);
            }
        });
    },*/
    //获取后台传送的域名  -- 新方案
    _getHostFormBack: function (callback) {
        let userID = Base.getCurrentUser().id;
        fmacloud.Cloud.run('getRandomDomain', {author:userID}, {
            success: function (data) {
                debugger;
                callback(data.domain);

            },
            error: function (error) {
                console.error("查询失败");
            }
        });

    },

    //上传效果图
    _uploadEffectImg: function (ok, err) {
        var _base64 = WorkDataUtil.getCreatedTplEffectImg();
        WorkDataUtil.uploadEffectImg(_base64, ok, err);
    },

    //上传微信封面图
    _uploadCoverImg: function (ok, err) {
        isNaN(cropImg.width) ? cropImg.width = 102 : "";
        var canvas = $('<canvas width="332" height="332"></canvas>')[0],
            ctx = canvas.getContext('2d'),
            image = document.getElementById("screenImage"),
            scale = cropImg.width ? cropImg.width / 640 : 102 / 640,
            left = cropImg.left ? cropImg.left / scale : 0,
            top = cropImg.top ? cropImg.top / scale : 57 / scale;
        var viewWidth = 102;
        var ratio = cropImg.width / 640;
        var select = {
            top: parseInt(cropImg.top / ratio),
            left: parseInt(cropImg.left / ratio),
            width: parseInt((viewWidth / cropImg.width) * 640)
        }
        ctx.drawImage(image, select.left, select.top, select.width, select.width, 0, 0, 332, 332);
        var data = canvas.toDataURL();
        WorkDataUtil.uploadEffectImg(data, ok, err);
    },
    //保存 数据
    _uploadTplObj: function (effect, o, coverFile, label, uploadUrl) {
        var _this = this;
        var _obj = o;
        var _effect_img_url, _tiny_img_url, tpl_share_img;
        if (!!_obj && !!effect.url && !!coverFile.url) {
            //effect是文件对象
            var _effectImg = effect.url(), _coverImg = coverFile.url();
            _effect_img_url = "AV:" + _effectImg;
            _tiny_img_url = "AV:" + (_effectImg + "?imageView/2/w/320/h/504/format/jpeg");
            tpl_share_img = "AV:" + _coverImg;
        } else {
            // effect是图片地址
            _effect_img_url = "AV:" + effect;
            _tiny_img_url = "AV:" + (effect + "?imageView/2/w/320/h/504/format/jpeg");
            tpl_share_img = "AV:" + coverFile;
        }

        //fmacloud.Cloud.run('get_clouddate', {}, {
        //    success: function (result) {
        //reupdate_date = parseInt(new Date(result).getTime() / 1000).toString();
        var reupdate_date = parseInt(new Date().getTime() / 1000).toString();
        var tpl = getTpl().attributes;
        var animationMode = !!tpl.animation_mode ? JSON.parse(tpl.animation_mode) : {}
        animationMode.autoplay = this.state.autoPlay || false;
        animationMode.interval = this.state.autoPlayInterval;
        WorkDataUtil.saveTpl("", function (data) {
            _this.forceUpdate(function () {
                window.onbeforeunload = function () {
                    return null;
                };
                var tid = data.attributes.tpl_id;
                this.closeDialog();
                AutoSave.stop();
                DialogAction.show("finish", "", {tid: tid});
            });
        }.bind(this), function (err) {
            console.log(err);
            err = "发布失败(重新发布)";
            $(".publish-info-okBtn").html(err).removeAttr("disabled").removeClass("disabled");
        }.bind(this), {
            name: _obj.tpl_name,
            brief: _obj.tpl_description,
            tpl_privacy: _obj.tpl_privacy,
            comment_off: _obj.comment_off,
            //animation_mode: _obj.animation_mode,
            tpl_type: 11,
            tpl_state: 2, //设置已完成状态
            effect_img: _effect_img_url,
            tiny_img: _tiny_img_url,
            tpl_share_img: tpl_share_img,
            reupdate_date: reupdate_date,
            label: label,
            upload_url: uploadUrl,
            animation_mode: JSON.stringify(animationMode),
            tpl_loop: this.state.tplLoop,
            last_status: this.state.removeLastPage == "0" ? 0 : 1,
            tpl_domain: _obj.tpl_domain
            //using_count: 0,
            //read_int   : 0,
            //share_int  : 0,
            //store_count: 0,
            //like_int   : 0,
            //comment_int: 0
        });
        //    },
        //    error  : function (error) {
        //        console.log(error);
        //        $(".publish-info-okBtn").html("发布失败(重新发布)").removeAttr("disabled").removeClass("disabled");
        //    }
        //});

    },
    /**
     * 取作品名，公开性，动画，描述，个人/企业
     * @returns {*}
     * @private
     */
    _checkInput: function () {
        var tplName = $("#tpl-name"),
            tplNameV = GlobalFunc.htmlEncode(tplName.val());
        var tplClassType = $("#tpl-class-type"),
            tplClassTypeV = GlobalFunc.htmlEncode(tplClassType.val());
        var tplAnimationType = $("#tpl-animation-type"),
            tplAnimationTypeV = GlobalFunc.htmlEncode(tplAnimationType.val());
        var tplDescription = $("#tpl-description"),
            tplDescriptionV = GlobalFunc.htmlEncode(tplDescription.val());

        var radio = $("input[name='publish-radio']:checked "),
            radioV = radio.val();

        //验证只有作品名,数据库此字段为空
        if (tplName.length < 1) {
            tplName.focus();
            alert("请输入作品名");
            return false;
        }

        return {
            tpl_name: this.state.tplName + "",
            tpl_description: this.state.tplDescription + "",
            tpl_privacy: this.state.ifPublish ? "public" : "private",
            comment_off: this.state.commentOff
        };
    }

})
;
