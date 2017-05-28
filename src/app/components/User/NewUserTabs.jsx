/**
 * @component UserTabs
 * @description
 * @time 2015-09-21 19:42
 * @author StarZou
 **/

'use strict';

var React = require('react');
import { Link } from 'react-router'
var Base = require('../../utils/Base');
var MeActionCreators = require('../../actions/MeActionCreators');
var MeStore = require('../../stores/MeStore');
var TemplateCardGrid = require('../../components/Common/NewTemplateCardGrid');
var TemplateUtils = require('../../utils/TemplateUtils');
var CommonUtils = require('../../utils/CommonUtils');
var ContextUtils = require('../../utils/ContextUtils');
var MakeWebAPIUtils = require('../../utils/MakeWebAPIUtils');
var UserDesigner = require('./UserDesigner');
var UserSettings = require('./UserSettings'); //个人资料
var Account = require('./Account');//我的账户
var MyOrder = require('./MyOrder');             //我的订单
var MyPrivileges = require('./MyPrivileges');     //我的特权
var UserData = require('./UserData'); //数据统计
var DomainBind = require('./DomainBind');//域名绑定
var UserDataCollection = require('./UserDataCollection'); //用户资料收集
var ElectricitySupplier = require('./ElectricitySupplier');//电商管理
var Authorized = require('./ThirdPartyPlatformMsg/Authorized');//授权管理
var MeConstants = require('../../constants/MeConstants');
var ActionTypes = MeConstants.ActionTypes;
var MeDispatcher = require('../../dispatcher/MeDispatcher');
var MeAPI = require('../../utils/MeAPI');
var WeixinMsgEntrance = require("./ThirdPartyPlatformMsg/WeixinMsgEntrance");//一键推送（编辑入口）
var WeixinMsgEdit = require("./ThirdPartyPlatformMsg/WeixinMsgEdit");//消息编辑
var WeiXinMGR = require('./ThirdPartyPlatformMsg/PushMsgManager');//推送消息管理
const TabIndex = require('../../constants/MeConstants').UserTab;
const MsgTabName = require('../../constants/MeConstants').MsgTabName;

var ConvertRecords = require('./GhostPublish/convertRecords');     //转换记录
var OnlineReadManager = require('./GhostPublish/onlineReadManager');     //在线阅读管理
var MyBookrank = require('./GhostPublish/myBookrank');     //我的书架

var CollectionSetting = require('./CollectionSetting');     //采集设置
var CollectionContent = require('./CollectionContent');     //内容采集
var MyContent = require('./MyContent');     //我的内容
var ComposeProduct = require('./ComposeProduct');     //合成作品
var ContentUpload = require('./ContentUpload');     //合成作品


const contentIndexMap = {
    [TabIndex.MYPRODUCT]: "publishedMagazine",
    [TabIndex.MYDRAFT]: "unpublishedMagazine", //我的草稿
    [TabIndex.RECYCLE]: "recycle", //我的回收站
    [TabIndex.MYCOLLECTION]: "myFavoritesMagazine", //我的收藏
    [TabIndex.MYMODE]: "myTemplate", //我的模板
    [TabIndex.WEIXINMGR]: MsgTabName.PUBLISH_MESSAGE, //推送消息管理
    [TabIndex.WEIXINMGRDRAFT]: MsgTabName.UNPUBLISH_MESSAGE, //推送消息管理--草稿
    [TabIndex.WEIXINMGRREC]: MsgTabName.RECYCLE_MESSAGE, //推送消息管理--回收站
    [TabIndex.USERDATACOLLECTION]: "publishedMagazine", //作品-用户资料收集
    [TabIndex.CHARGEDTEMPLATE]: "chargedTemplate", //已购买模板
    [TabIndex.ILLEGALWORK]: "illegalWork" //异常作品
}

require('../../../assets/css/user-tabs.css');

var UserTabs = React.createClass({
    getInitialState: function () {
        // 取pageConfig
        var pageConfig = this.pageConfig = TemplateUtils.getPageConfigByPageType(this.props.pageType);
        //console.log(pageConfig);
        // 设置默认的模板类型
        this.templateType = this.props.tabIndex ? contentIndexMap[this.props.tabIndex] : pageConfig.tabs[0].value;

        var initState = {
            viewlist: 1, //视图列表序号， 1：缩略图， 2：列表
            authList: [], //授权账号列表
            isShowNoMore: false
        }

        return $.extend(initState, this.getStateFormStore());
    },
    /**
     * 消息编辑提示保存
     * @param config
     */
    confirmSave: function (config) {
        if (this.refs.msgEdit) {
            this.refs.msgEdit.confirmSaveDialogShow(config);
        }
    },
    getStateFormStore: function () {
        var value, state = {
            templateMap: {},
            hasNextMap: {},
            contentIndex: 5,
            isLoading: false
        };

        // 根据templateType, 动态生成state
        this.pageConfig.tabs.forEach(function (tab) {
            value = tab.value;
            state.templateMap[value] = MeStore.getTemplatesByType(value);
            state.hasNextMap[value] = MeStore.getHasNext(value);
        });

        var messageTypes = [MsgTabName.PUBLISH_MESSAGE, MsgTabName.UNPUBLISH_MESSAGE, MsgTabName.RECYCLE_MESSAGE, contentIndexMap[TabIndex.CHARGEDTEMPLATE]];
        messageTypes.forEach(function (type) {
            state.templateMap[type] = MeStore.getTemplatesByType(type);
            state.hasNextMap[type] = MeStore.getHasNext(type);
        });

        return state;
    },

    render: function () {
        var pageConfig = this.pageConfig;
        var noWork;

        if (this.props.tabIndex == 2) {
            noWork = <div className="word">该回收站为空</div>;
        } else if (this.props.tabIndex == 3) {
            noWork = <div className="word">暂时没有收藏，到<Link to="/discovery">发现页</Link>逛逛</div>;
        } else if (this.props.tabIndex == 4) {
            noWork =
                <div className="word">暂时没有模版，到<Link to="/user" onClick={this.changeParentState.bind(this, 0)}>我的作品</Link>生成
                </div>;
        } else if (this.props.tabIndex == TabIndex.ILLEGALWORK) {
            noWork = <div className="word">没有异常作品</div>;
        } else {
            noWork = <div className="word">没有相关作品，试着<Link to="/create">创建</Link>一份ME作品</div>;
        }

        var loadMoreArr = [TabIndex.MYPRODUCT, TabIndex.MYDRAFT, TabIndex.RECYCLE, TabIndex.MYCOLLECTION, TabIndex.MYMODE,
        TabIndex.WEIXINMGR, TabIndex.WEIXINMGRDRAFT, TabIndex.WEIXINMGRREC, TabIndex.USERDATACOLLECTION, TabIndex.ILLEGALWORK];
        var loadMoreState = loadMoreArr.indexOf(this.props.tabIndex) >= 0 ? true : false;
        //TODO 那些需要添加滚动事件的，  modify by fishYu 2016-12-8 过滤下只是需要增加滚轮的才增加
        if (loadMoreState) {  //增加滚动
            this.bindWindowScrollEvent();
        } else {  //移除滚动
            window.removeEventListener('mousewheel', this.windowScrollCallback);
        }
        //todo
        var loadMoreButton = this.hasNext() && loadMoreState ? (
            <div className="load-more" ref='load-more' style={{ display: 'none' }}>加载更多</div>
        ) : null;

        var loading = this.state.isLoading && loadMoreState ? (<div className="loading">
            <div className="loading-box">
                <div className="loading-boll"></div>
                <span>正在加载中...</span>
            </div>
        </div>) : null;


        //todo
        var noMore = !this.hasNext() && loadMoreState && this.state.isShowNoMore && this.templateMapLen() ? (<div className="no-more">

            <div>没有更多作品了</div>
        </div>) : null; //没有更多作品

        var tabs = pageConfig.tabs.map(function (tab, index) {
            //this.state.templateMap里是各种选项卡里的作品数据，pageConfig.tabs是生成一个作品卡的类型
            var templates = tab.dataKey?this.state.templateMap[tab.dataKey]:this.state.templateMap[tab.value];
            return (
                <div key={index} label={tab.label} value={tab.value}>
                    {
                        templates && templates.length > 0 ?
                            <TemplateCardGrid templates={templates} cardType={tab.cardType} templateType={tab.value}
                                callbackParent={this.changeParentState} viewState={this.state.viewlist}
                                refresh={this.refresh} exportWork={this.props.exportWork} /> :
                            <div className="no-works">
                                {noWork}
                            </div>
                    }
                </div>
            );
        }.bind(this));
       
        // var tabInfo = pageConfig.tabs[TabIndex.MYMODE];
        // var templatesData = this.state.templateMap[contentIndexMap[TabIndex.CHARGEDTEMPLATE]];
        // tabs[TabIndex.CHARGEDTEMPLATE] = (<div label={tabInfo.label} value={tabInfo.value}>
        //     {
        //         templatesData && templatesData.length > 0 ?
        //             <TemplateCardGrid templates={templatesData} cardType={tabInfo.cardType} templateType={tabInfo.value}
        //                 callbackParent={this.changeParentState} viewState={this.state.viewlist}
        //                 refresh={this.refresh} /> :
        //             <div className="no-works">
        //                 {noWork}
        //             </div>
        //     }
        // </div>)
        var userDataTpls = this.state.templateMap["publishedMagazine"];

        tabs[TabIndex.USERDATACOLLECTION] = <UserDataCollection templates={userDataTpls} refresh={this.refresh} />; //用户资料收集
        tabs[TabIndex.ELECTRICITYSUPPLIER] = <ElectricitySupplier />; //电商管理

        tabs[TabIndex.MYDATA] = <UserData />;
        tabs[TabIndex.MYSETTING] = (<div key={tabs.length} label="设置">
            <UserSettings />
        </div>);
        tabs[TabIndex.MYACCOUNT] = (<div key={tabs.length} label="账户">

            <Account />
        </div>);
        tabs[TabIndex.MYORDER] = <MyOrder />;
        tabs[TabIndex.MYPRIVILEGES] = <MyPrivileges />;

        tabs[TabIndex.AUTH] = <Authorized />
        tabs[TabIndex.DOMAINBIND] = <DomainBind />;
        tabs[TabIndex.WEIXINPUSH] = <WeixinMsgEntrance />;
        tabs[TabIndex.WEIXINEDIT] = <WeixinMsgEdit {...this.props} ref="msgEdit" />;

        var publishMsgData = this.state.templateMap[MsgTabName.PUBLISH_MESSAGE];
        var unpublishMsgData = this.state.templateMap[MsgTabName.UNPUBLISH_MESSAGE];
        var recycleMsgData = this.state.templateMap[MsgTabName.RECYCLE_MESSAGE];
        tabs[TabIndex.WEIXINMGR] = <WeiXinMGR tabIndex={TabIndex.WEIXINMGR} viewStatus={this.state.viewlist}
            changeViewFun={this.changeViewState} msgData={publishMsgData} />;
        tabs[TabIndex.WEIXINMGRDRAFT] = <WeiXinMGR tabIndex={TabIndex.WEIXINMGRDRAFT} viewStatus={this.state.viewlist}
            changeViewFun={this.changeViewState} msgData={unpublishMsgData} />;
        tabs[TabIndex.WEIXINMGRREC] = <WeiXinMGR tabIndex={TabIndex.WEIXINMGRREC} viewStatus={this.state.viewlist}
            changeViewFun={this.changeViewState} msgData={recycleMsgData} />;
        //add by fishYu 2016-11-2 增加一键发布页面
        tabs[TabIndex.CONVERTRECORDS] = <ConvertRecords />; //转档管理
        tabs[TabIndex.ONLINEREAD] = <OnlineReadManager />;     //在线阅读管理
        tabs[TabIndex.MYBOOKRACK] = <MyBookrank />;     //我的书架
        
        tabs[TabIndex.COLLECT_SETTING] = <CollectionSetting />;     //采集设置
        tabs[TabIndex.COLLECT_CONTENT] = <CollectionContent />;     //内容采集
        tabs[TabIndex.MY_CONTENT] = <MyContent />;     //我的内容
        tabs[TabIndex.COMPOSE_PRODUCT] = <ComposeProduct />;     //合成作品-TODO
        tabs[TabIndex.UPLOAD_CONTENT] = <ContentUpload />;     //内容上传


        //var blank=<div></div>;
        //if(this.props.tabIndex!=4 && this.props.tabIndex!=5 && this.props.tabIndex!=6){
        //    blank=<div className="myTemplateOptions"></div>;
        //}

        return (
            <div className="user-tabs">

                {this.props.tabIndex == 0 || this.props.tabIndex == 1 || this.props.tabIndex == 2 || this.props.tabIndex == TabIndex.ILLEGALWORK
                    ? <div className="myTemplateOptions">
                        <span onClick={this.changeParentState.bind(this, 0)}
                            className={this.props.tabIndex == 0 ? "selected" : ""}>已发布</span>
                        <span onClick={this.changeParentState.bind(this, 1)}
                            className={this.props.tabIndex == 1 ? "selected" : ""}>草稿箱</span>
                        <span onClick={this.changeParentState.bind(this, 2)}
                            className={this.props.tabIndex == 2 ? "selected" : ""}>回收站</span>
                        <span onClick={this.changeParentState.bind(this, TabIndex.ILLEGALWORK)}
                            className={this.props.tabIndex == TabIndex.ILLEGALWORK ? "last selected" : "last"}>异常作品</span>
                        <div className="view">
                            <ul>
                                <li onClick={this.changeViewState.bind(this, 1)}
                                    className={this.state.viewlist == 1 ? "on" : ""} title="缩略图"></li>
                                <li onClick={this.changeViewState.bind(this, 2)}
                                    className={this.state.viewlist == 2 ? "on" : ""} title="列表"></li>
                            </ul>
                        </div>
                    </div>
                    : null}
                {this.props.tabIndex == TabIndex.MYMODE || this.props.tabIndex == TabIndex.CHARGEDTEMPLATE
                    ? <div className="myTemplateOptions">
                        <span onClick={this.changeParentState.bind(this, TabIndex.MYMODE)}
                            className={this.props.tabIndex == TabIndex.MYMODE ? "selected" : ""}>已生成</span>
                        <span onClick={this.changeParentState.bind(this, TabIndex.CHARGEDTEMPLATE)}
                            className={this.props.tabIndex == TabIndex.CHARGEDTEMPLATE ? "last selected" : "last"}>已购买</span>
                        <div className="view">
                            <ul>
                                <li onClick={this.changeViewState.bind(this, 1)}
                                    className={this.state.viewlist == 1 ? "on" : ""} title="缩略图"></li>
                                <li onClick={this.changeViewState.bind(this, 2)}
                                    className={this.state.viewlist == 2 ? "on" : ""} title="列表"></li>
                            </ul>
                        </div>
                    </div>
                    : null}
                {this.props.tabIndex == 3
                    ? <div className="myTemplateOptions">
                        <div className="view">
                            <ul>
                                <li onClick={this.changeViewState.bind(this, 1)}
                                    className={this.state.viewlist == 1 ? "on" : ""}></li>
                                <li onClick={this.changeViewState.bind(this, 2)}
                                    className={this.state.viewlist == 2 ? "on" : ""}></li>
                            </ul>
                        </div>
                    </div>
                    : null}

                <div className="segment-container">
                    <div className="tabs-container">
                        {tabs[this.props.tabIndex]}
                    </div>
                </div>
                {noMore}
                {loading}
                {loadMoreButton}
            </div>
        );
    },
    refresh: function () {
        this.setState({ refresh: true })
    },
    //改变父组件slidebar
    changeParentState: function (state) {
        this.props.callbackParent(state);
        //deleted by zhao
        // MeStore.addChangeListener(this._onChange);
    },

    //改变视图状态
    changeViewState: function (state) {
        this.setState({
            viewlist: state
        });
    },

    /**
     * 组件装载, 执行查询
     */
    componentDidMount: function () {
        // 查询
        this.query({ currentPage: 1 }, { allow: true });
        MeStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
        MeStore.removeChangeListener(this._onChange);
        window.removeEventListener('mousewheel', this.windowScrollCallback);
    },


    //属性改变之后查询数据
    componentWillReceiveProps: function (nextProps) {
        this._handleTabsChange(contentIndexMap[nextProps.tabIndex]);
    },

    bindWindowScrollEvent: function (options) {
        var scrollCallback = this.windowScrollCallback;
        window.addEventListener('mousewheel', scrollCallback);
    },

    windowScrollCallback: function () {
        if (document.body.scrollTop + $(window).height() > document.body.scrollHeight - 30) {
            this.query();

            this.setState({
                isShowNoMore: true
            });
        }
    },

    /**
     * MeStore更新, 设置state
     */
    _onChange: function () {
        if (MeStore.isRefresh()) {
            return this.query({ currentPage: 1 }, { allow: true });
        }
        this.setState(this.getStateFormStore());
    },

    /**
     * 根据templateType, 取当前查询参数
     */
    getCurrentQueryOption: function () {
        return TemplateUtils.getQueryOptionByTemplateType(this.templateType);
    },
    /**
     * 取额外参数
     * @return extraQueryOption
     */
    getExtraQueryOption: function () {
        var extraQueryOption;

        var userId = ContextUtils.getCurrentUser().id;
        if ([contentIndexMap[TabIndex.WEIXINMGR], contentIndexMap[TabIndex.WEIXINMGRDRAFT], contentIndexMap[TabIndex.WEIXINMGRREC]].indexOf(this.templateType) >= 0) {
            extraQueryOption = {
                whereCondition: {
                    'author': userId
                }
            }
            return extraQueryOption;
        }

        if (userId && this.templateType != 'myFavoritesMagazine') {
            extraQueryOption = {
                whereCondition: {
                    'author': '=\'' + userId + '\''
                }
            };
        } else {
            var inSql = CommonUtils.getSelectSQL({
                className: 'me_favorites',
                selectColumns: 'fav_id',

                whereCondition: {
                    user_id: `='${userId}' limit 1000`
                }
            });

            extraQueryOption = {
                whereCondition: {
                    tpl_id: ' in (' + inSql + ') '
                }
            };
        }

        return extraQueryOption;
    },

    /**
     * 查询数据
     */
    query: function (queryOption, config) {
        var _this = this;
        //if (this.state.isLoading == true ||!this.hasNext()) {
        if (this.state.isLoading) {
            if (!this.state.refresh) {
                return;
            }
        }

        this.setState({
            isLoading: true,
            refresh: false
        }, function () {
            if (_this.hasNext() || (config && config.allow)) {
                var templateType = _this.templateType;
                switch (templateType) {
                    case contentIndexMap[TabIndex.CHARGEDTEMPLATE]:
                        MakeWebAPIUtils.loadOwnGoods(ContextUtils.getCurrentUser().id).then((data) => {
                            var ret = [];
                            var goods = data.result;
                            if (goods) {
                                goods.forEach(good => {
                                    if (good.type == "template") {
                                        var tplInfo = {
                                            attributes: {
                                                tpl_id: good.item_description.item_id.substring(4),
                                                name: good.item_description.item_name,
                                                tpl_share_img: good.item_description.item_icon,
                                                data_site: "1"
                                            },
                                            createdAt: new Date(good.available_start_at)
                                        }
                                        ret.push(tplInfo)
                                    }
                                })

                            }
                            return ret;
                        }).then((tplArr) => {
                            var ret = {}
                            if (tplArr && tplArr.length > 0) {
                                tplArr.forEach(workItem => {
                                    workItem.attributes.nofree = true;
                                })
                                ret.results = tplArr;
                                ret.count = 1;
                                MeDispatcher.dispatch({
                                    type: ActionTypes.QUERY_TEMPLATES_BY_CONDITION,
                                    templateType: templateType,
                                    queryOption: { currentPage: 1 },
                                    data: ret
                                });
                            }
                        });
                        break;
                    case contentIndexMap[TabIndex.MYMODE]:
                    case contentIndexMap[TabIndex.MYPRODUCT]:
                    case contentIndexMap[TabIndex.MYDRAFT]:
                    case contentIndexMap[TabIndex.RECYCLE]:
                    case contentIndexMap[TabIndex.MYCOLLECTION]:

                    case contentIndexMap[TabIndex.USERDATACOLLECTION]:
                    case contentIndexMap[TabIndex.ILLEGALWORK]:
                        MeActionCreators.queryTemplatesByCondition(TemplateUtils.configureQueryOptionByTemplateType(templateType, queryOption, this.getExtraQueryOption()), this.templateType);
                        break;
                    case contentIndexMap[TabIndex.WEIXINMGR]:
                    case contentIndexMap[TabIndex.WEIXINMGRDRAFT]:
                    case contentIndexMap[TabIndex.WEIXINMGRREC]:
                        MeActionCreators.queryMessageManagerByTabName(TemplateUtils.configureQueryOptionByTemplateType(templateType, queryOption, this.getExtraQueryOption()), this.templateType);
                        break;
                    default:
                        _this.setState({
                            isLoading: false
                        });
                }

            } else {
                _this.setState({
                    isLoading: false
                });
            }
        });

    },

    hasNext: function () {
        var nextValue = this.state.hasNextMap[this.templateType];
        return nextValue !== false;
    },

    templateMapLen: function () {
        var list = this.state.templateMap[this.templateType];
        return list.length;
    },

    /**
     * tab切换, 设置当前选中tab, 执行查询
     * @param value
     */
    _handleTabsChange: function (value) {
        if (!value) {
            return;
        }

        this.setState({
            isShowNoMore: false,
            //add by zhao 切换tab时 loading为false
            isLoading: false
        }, function () {
            console.log("false");
        });

        this.templateType = value;
        // 查询第一页
        this.query({ currentPage: 1 }, { allow: true });
    }

});

module.exports = UserTabs;