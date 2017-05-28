/**
 * @description 数据统计
 * @time 2016-7-25
 * @author 杨建
 */

'use strict';

// require core module
var React = require('react');
var Base = require('../../utils/Base');
var $ = require('jquery');
var GlobalFunc = require('../Common/GlobalFunc');
var Statistics = require('./Statistics');
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.css';
var MakeWebAPIUtils = require('../../utils/MakeWebAPIUtils');
var Dialog = require('../Common/Dialog');
var Cart = require('../Cart/Cart');

require('../../../assets/css/user-data-collection.css');


var CollectionBox = React.createClass({

    getInitialState: function () {
        return {
            isShowDataTable: false, //显示表格数据
            summary: {}, //数据对象
            currentTag: '', //当前标签
            tags: [],
            pvType: '总pv',
            dataPvs: [],  //pv数据
            showDialog: false,
            cartData: [],
            dialogTitle: '',
            showHeader: false,
            AdvancedStatisticsUsed: false,
            sureFn: function () { }
        }
    },
    /**
     * 作品信息Dom
     */
    workInfoDom: function () {
        var data = this.props.data,
            attributes = data.attributes;

        return (
            <div className="dc-work-info">
                <div className="fl">
                    <dl>
                        <dt><img src={GlobalFunc.subAvChar(attributes.tpl_share_img)} width="60" height="60" /> </dt>
                        <dd>
                            <p className="title">{attributes.name}</p>
                            <p className="time">创建时间：{GlobalFunc.formatTimeToStr(data.createdAt, "yyyy-MM-dd HH:mm")}
                            </p>
                        </dd>
                    </dl>
                </div>
                <div className="fr">

                    <span>最后更新于</span>{this.state.summary.date || GlobalFunc.formatTimeToStr(data.createdAt, "yyyy/MM/dd")}

                </div>
            </div>
        );
    },

    /**
     * 作品数据信息Dom
     */
    workDataDom: function () {
        var summary = this.state.summary, //总数居
            currentTag = this.state.currentTag, //当前显示标签
            tags = this.state.tags, //所有标签数据
            dataPvs = this.state.dataPvs;

        var currentTagObj = this.state.currentTagObj;

        var today, yesterday, todayData, yesterdayData, allData;
        today = this.GetDateStr(0); //今日
        yesterday = this.GetDateStr(-1); //昨日

        for (var i = 0, len = dataPvs.length; i < len; i++) {
            var date = dataPvs[i].date,
                sum = dataPvs[i].pv;

            switch (date) {
                case today:
                    todayData = sum;
                    break;
                case yesterday:
                    yesterdayData = sum;
                    break;
                case "9999/99/99":
                    allData = sum;
                    break;
            }
        }

        var pvs;
        switch (this.state.pvType) {
            case "总pv":
                pvs = allData;
                break;
            case "昨日pv":
                pvs = yesterdayData;
                break;
        }
        var tagTitle = _.keys(tags); //获取到所有标签
        //遍历标签列表
        var typeList = tagTitle.map(function (item, index) {
            return <Option value={item} key={index}>{item}</Option>;
        });


        //标签数据变化趋势
        var tagRankingClass = '';
        if (currentTagObj != undefined) {
            switch (currentTagObj.ranking) {
                case 1:
                    tagRankingClass = 'up';
                    break;
                case 0:
                    tagRankingClass = 'flat';
                    break;
                case -1:
                    tagRankingClass = "down";
                    break;
            }
        }

        //总排名趋势
        var totalRankingClass = '';
        switch (summary.ranking) {
            case 1:
                totalRankingClass = 'up';
                break;
            case 0:
                totalRankingClass = 'flat';
                break;
            case -1:
                totalRankingClass = "down";
                break;
        }

        var pvsData = '';
        if (typeof currentTagObj != "undefined" && typeof currentTagObj.rank_num != "undefined") {
            pvsData = <span className={tagRankingClass}>{currentTagObj.rank_num}</span>;
        } else {
            pvsData = "暂无数据";
        }
        var expandBtn;
        if (this.state.isShowDataTable) {
            expandBtn = <a href="javascript:;" onClick={this.changeShowDataTable} className="close">收起高级数据</a>;
        } else if (this.state.AdvancedStatisticsUsed) {
            expandBtn = <a href="javascript:;" onClick={this.changeShowDataTable} className="open">展开高级数据</a>;
        } else {
            expandBtn = <a href="javascript:;" onClick={this.changeShowDataTable} className="expand">开启高级数据</a>
        }

        return (
            <div className="work-data">
                <div className="title">
                    <div className="title-pv">
                        <ul>
                            <li className="down-lists">
                                <Select className="userdata-select select-pv" value={this.state.pvType} dropdownClassName="pv-select-down" onChange={this.onChangePvtypeHandler} showSearch={false} >
                                    <Option value="总pv">总pv</Option>
                                    <Option value="昨日pv">昨日pv</Option>
                                </Select>
                            </li>
                            <li>今日pv</li>
                        </ul>
                    </div>
                    <div className="title-label">
                        <ul>
                            <li className="down-lists">{typeList.length > 0 ? (
                                <Select className="userdata-select select-type" value={currentTag} dropdownClassName="type-select-down" onChange={this.onChangeTagtypeHandler} showSearch={false} >
                                    {typeList}
                                </Select>
                            ) : "无"}
                            </li>
                            <li>总排行</li>
                        </ul>
                    </div>
                    <div className="title-nums">
                        <ul>
                            <li>分享数</li>
                            <li>评论数</li>
                            <li>点赞数</li>
                        </ul>
                    </div>
                </div>
                <div className="data">
                    <div className="title-pv">
                        <ul>
                            <li>{pvs || 0}</li>
                            <li>{todayData || 0}</li>
                        </ul>
                    </div>
                    <div className="title-label">
                        <ul>
                            <li>{pvsData}</li>
                            <li><span className={totalRankingClass}>{summary.rank_num > 10000 ? "10000+" : summary.rank_num}</span></li>
                        </ul>
                    </div>
                    <div className="title-nums">
                        <ul>
                            <li>{summary.share_num || 0}</li>
                            <li>{summary.comment_num || 0}</li>
                            <li>{summary.like_num || 0}</li>
                        </ul>
                    </div>
                </div>
                <div className="show-data">
                    {expandBtn}
                </div>
            </div>
        );
    },

    checkUsedState: function () {
        var userId = Base.getCurrentUser().id;
        var workId = this.props.data.attributes.tpl_id;
        //判断作品是否使用高级数据特权
        MakeWebAPIUtils.ifWorkUsed(workId, userId, "Svc_AdvancedStatistics").then(used => {
            if (used) {
                this.setState({ AdvancedStatisticsUsed: true })
            } else {
                this.setState({ AdvancedStatisticsUsed: false })
            }
        })
    },
    render: function () {
        return (
            <div>

                {/*作品信息Dom*/}
                {this.workInfoDom()}

                {/*作品数据信息Dom*/}
                {this.workDataDom()}

                {/*表格数据*/}
                {this.state.isShowDataTable ? (
                    <div className="data-table">
                        <Statistics workId={this.props.data.attributes.tpl_id} />
                    </div>
                ) : null}

                <Dialog ref="dialog" title={this.state.dialogTitle} showHeader={this.state.showHeader} appearanceState={this.state.showDialog} sureFn={this.state.sureFn} cancelFn={this.hideDialog} />
                <Cart ref="cart" data={this.state.cartData} onOk={this.onPayOk.bind(this, this.state.cartData)} />
            </div>
        )
    },

    /**
     * 改变表格数据显示状态
     */
    changeShowDataTable: function () {
        var _this = this;
        var userId = Base.getCurrentUser().id;
        var workId = this.props.data.attributes.tpl_id;
        //判断作品是否使用高级数据特权
        MakeWebAPIUtils.ifWorkUsed(workId, userId, "Svc_AdvancedStatistics").then(used => {
            if (used) { //已使用过
                _this.setState({
                    isShowDataTable: !_this.state.isShowDataTable
                });
            } else {
                //作品没使用过高级数据
                MakeWebAPIUtils.loadOwnGoods(userId, true).then(data => {
                    //看用户是否有购买过足够的开启高级数据特权
                    if (data.err) {
                        return 0
                    }
                    var ownGoods = data.result;
                    for (var i = 0, len = ownGoods.length; i < len; i++) {
                        var item = ownGoods[i];
                        if (item.item_description.item_id == "Svc_AdvancedStatistics" && item.item_count > 0) {
                            return item.item_count;
                        }
                    }
                    return 0
                }).then(nums => {
                    if (nums) {
                        _this.setState({
                            dialogTitle: "开启作品高级数据特权剩余使用" + nums + "次<br\>确定使用该特权?",
                            showDialog: true,
                            showHeader: true,
                            sureFn: function () {
                                //用户还有开启高级数据特权可用，使用一次开启高级数据特权
                                MakeWebAPIUtils.usePrivilege(["Svc_AdvancedStatistics"], workId, "works", userId).then(ret => {
                                    if (ret.err) {
                                        console.log(ret.err);
                                        //使用失败用户需要购买开启高级数据特权
                                        _this.payShowData();
                                        return;
                                    }
                                    //更新缓存中用户拥有特权信息
                                    MakeWebAPIUtils.updateOwnGoods(ret);
                                    _this.setState({ //改变高级数据显示状态
                                        isShowDataTable: !_this.state.isShowDataTable,
                                        AdvancedStatisticsUsed: true
                                    }, function () {
                                        _this.setState({
                                            showDialog: false //隐藏对话框
                                        })
                                    });
                                }, err => {
                                    //更新owngoods，提醒用户失败
                                    // pop dialog
                                    MakeWebAPIUtils.clearOwnGoods();
                                    MakeWebAPIUtils.loadOwnGoods(userID, true).then(() => {
                                        _this.changeShowDataTable();
                                    })
                                });
                            }
                        });

                    } else {
                        _this.payShowData();
                    }
                })
            }
        });
    },

    payShowData: function () {
        var _this = this;
        this.setState({
            dialogTitle: "高级数据统计需要购买特权",
            showDialog: true,
            showHeader: true,
            sureFn: function () {
                _this.hideDialog();
                MakeWebAPIUtils.getGoodPrice(["Svc_AdvancedStatistics"], true,"service").then((goodsInfos) => {
                    var netgoodsInfos = goodsInfos.map(item => {
                        var expire = !!item.end_at ? item.end_at : "永久";
                        return { name: item.name, icon: item.icon, price: (item.price / 100).toFixed(2), sum: "1", qixian: expire, id: item.id, custom_code: item.custom_code }
                    });
                    _this.setState({ cartData: netgoodsInfos }, () => {
                        _this.refs["cart"].changeDialogStatus(true,0);
                    })
                });

            }
        });
    },

    onPayOk: function (cartData, status, result) {
        var _this = this;
        if (status != 2) {
            return
        } else {
            var tplID = this.props.data.attributes.tpl_id;
            var userID = Base.getCurrentUser().id;
            MakeWebAPIUtils.usePrivilege(["Svc_AdvancedStatistics"], tplID, "works", userID).then(ret => {
                if (ret.err) {
                    console.log(ret.err);
                    //使用失败用户需要购买下载
                    // pop dialog
                    return;
                }
                MakeWebAPIUtils.updateOwnGoods(ret);
                this.setState({ //改变高级数据显示状态
                    isShowDataTable: !_this.state.isShowDataTable,
                    AdvancedStatisticsUsed: true
                }, function () {
                    _this.setState({
                        showDialog: false //隐藏对话框
                    })
                });

            }, err => {
                //更新owngoods，提醒用户失败
                // pop dialog
                MakeWebAPIUtils.clearOwnGoods()
                MakeWebAPIUtils.loadOwnGoods(userID, true).then(() => {
                   this.changeShowDataTable();
                })
            })
        }
    },

    componentDidMount: function () {
        this.getDataFun();
        this.checkUsedState();
    },

    /**
     * 获取数据
     */
    getDataFun: function () {
        var _this = this;
        var workId = this.props.data.attributes.tpl_id;
        //var workId = "1566e544aaed85c1"
        var url = "/v1/statistics/works/" + workId + "/summary";
        var RESTfulData = {
            type: 'GET',
            url: url,
            success: function (result) {
                if (typeof result.err != "undefined") {
                    _this.setState({
                        summary: { rank_num: "10000+" },
                        tags: {},
                        currentTag: '',
                        currentTagObj: {},
                        dataPvs: []
                    });
                } else {
                    var summary = result.summary;
                    var defaultTag = '';
                    var currentTagObj = {};
                    if (typeof summary.tags != "undefined") {
                        var tagTitle = _.keys(summary.tags); //获取到所有标签
                        defaultTag = tagTitle[0];
                        currentTagObj = summary.tags[defaultTag];
                    }

                    _this.setState({
                        summary: summary,
                        tags: summary.tags || {},
                        currentTag: defaultTag,
                        currentTagObj: currentTagObj,
                        dataPvs: summary.pvs || []
                    });
                }
            },
            'contentType': 'application/json'
        };

        MakeWebAPIUtils.getRESTfulData(RESTfulData);

    },

    /**
     * 改变标签事件
     * @param value
     */
    onChangeTagtypeHandler: function (value) {
        var currentTagObj = this.state.tags[value];
        //更新当前标签数据
        this.setState({
            currentTagObj: currentTagObj,
            currentTag: value
        });
    },

    onChangePvtypeHandler: function (value) {
        //Pv标签
        this.setState({
            pvType: value
        });
    },

    /*获取日期*/
    GetDateStr: function (AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1;//获取当前月份的日期
        var d = dd.getDate();
        return y + "/" + m + "/" + d;
    },

    /**
     * 改变对话框状态
    */
    showDialog(states) {
        this.refs["dialog"].setState(states);
    },

    /**
     * 隐藏对话框状态
     */
    hideDialog() {
        this.setState({
            showDialog: false
        });
    }


});

module.exports = CollectionBox;