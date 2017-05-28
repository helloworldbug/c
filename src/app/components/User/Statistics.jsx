/**
 * Created by GYY on 2016/7/26.
 * 数据统计组件
 */
var React = require("react");
var Base = require('../../utils/Base');
//导入css 及相关组件
var serverurl = require("../../config/serverurl");
require('../../../assets/css/statistics.css');
var GlobalFunc = require('../Common/GlobalFunc');
var WorkDataLine = require('../Chart/WorksDataLine');
var WorkDataPie = require('../Chart/WorksDataPie');
var WorkDataBar = require('../Chart/WorksDataBar');
var WorksDataMap = require('../Chart/WorksDataMap');
var MakeWebAPIUtils = require('../../utils/MakeWebAPIUtils');
var Dialog = require('../Common/Dialog');
var Cart = require('../Cart/Cart');

//一级分类 0总体趋势  1更多数据
var TOTAL_TREND = 0, MORE_DATA = 1;
//图表type 0拆线图  1地图  2饼图  3柱状图
var LINE_CHARTS = 0, MAP_CHARTS = 1, PIE_CHARTS = 2, BAR_CHARTS = 3;
//更多数据对应图谱索引  0区域图谱   1操作系统  2分类数据
var AREA_LI_INDEX = 0, SYSTEM_LI_INDEX = 1, CATEGORY_LI_INDEX = 2, PLATFORM_LI_INDEX = 3;
//平台选中    0全部平台   1微信  2新浪微博
var ALL_PLATFORM = 0, WECHAT_PLATFORM = 1, SINA_PLATFORM = 2;
//时间段 0近7天  1近30天  2近1年
var SEVEN_DAY = 0, THIRTY_DAY = 1, ONE_YEAR = 2;
//查询条件作品ID 开始时间 、结束时间 、平台索引(全部平台   1微信  2新浪微博)、更多数据类型索引（0区域图谱   1操作系统  2分类数据）、默认时间段 7天内（0近7天  1近30天  2近1年）
var workId = "", startTime, endTime;
/**
 * 根据时间段索引 重置时间段
 * @param periodIndex  0近7天  1近30天  2近一年
 */
var setDays = function (periodIndex) {
    var startDate = new Date();
    var endDate = new Date();
    if (periodIndex == SEVEN_DAY) {
        startDate.setDate(startDate.getDate() - 6);
        startDate.setHours(0, 0, 0);
        endDate.setDate(endDate.getDate());
        endDate.setHours(23, 59, 59);
    } else if (periodIndex == THIRTY_DAY) {
        endDate.setDate(endDate.getDate());
        endDate.setHours(23, 59, 59);
        startDate.setMonth(startDate.getMonth() - 1);
        startDate.setDate(startDate.getDate() + 1);
        startDate.setHours(0, 0, 0);
    } else if (periodIndex == ONE_YEAR) {
        endDate.setDate(endDate.getDate());
        endDate.setHours(23, 59, 59);
        startDate.setFullYear(startDate.getFullYear() - 1);
        startDate.setDate(startDate.getDate() + 1);
        startDate.setHours(0, 0, 0);
    }
    this.startTime = startDate.getTime();
    this.endTime = endDate.getTime();
}
//首次默认查询7天内数据

//当前图表
var Statistics = React.createClass({
    getInitialState: function () {
        setDays.call(this, SEVEN_DAY);
        this.receiveProps = false;
        this.workId = this.props.workId; // "1543cab649311eb5";////"15427cf0a3424a18";//
        return {
            currChartsType: MAP_CHARTS,
            startTime: this.startTime,
            endTime: this.endTime,
            oneCategory: MORE_DATA,       //一级分类 0总体趋势  1更多数据
            indexForTypeOne: ALL_PLATFORM, //总体趋势下 平台选中索引 0全部平台   1微信  2新浪微博
            indexForTypeTwo: AREA_LI_INDEX,//更多数据下 类型选中索引 0区域图谱   1操作系统  2分类数据
            days: SEVEN_DAY,                          //数据查询时间段索引 0近7天  1近30天  2近1年
            showDialog: false,
            cartData: [],
            dialogTitle: '',
            showHeader:false,
            sureFn: function() {}
        }
    },
    componentWillReceiveProps: function (nextProps) {
        this.receiveProps = true;
    },
    shouldComponentUpdate: function () {
        if (this.receiveProps) {
            this.receiveProps = false
            return false;
        }
        return true;
    },
    //切换时间段 图表类型不做调整
    changePeroid: function (e) {
        var self = this;
        if (e.target.selectedIndex == self.state.days) return;
        //根据选中时间段 重置 开始时间 结束时间
        setDays.call(this, e.target.selectedIndex);
        self.setState({
            "days": e.target.selectedIndex,
            "startTime": this.startTime,
            "endTime": this.endTime
        });
    },
    //点击总体趋势、更多数据
    clickOneCategoryHandler: function (e) {
        var self = this;
        var selectedIndex = e.currentTarget.dataset["index"];
        if (this.state.oneCategory == selectedIndex) return;
        if (selectedIndex == TOTAL_TREND) {
            self.setState({
                "currChartsType": LINE_CHARTS,
                "oneCategory": selectedIndex
            });
        } else {
            if (self.state.indexForTypeTwo == AREA_LI_INDEX) {
                self.setState({
                    "currChartsType": MAP_CHARTS,
                    "oneCategory": selectedIndex
                });
            } else if (self.state.indexForTypeTwo == SYSTEM_LI_INDEX) {
                self.setState({
                    "currChartsType": PIE_CHARTS,
                    "oneCategory": selectedIndex
                });
            } else if (self.state.indexForTypeTwo == CATEGORY_LI_INDEX) {
                self.setState({
                    "currChartsType": BAR_CHARTS,
                    "oneCategory": selectedIndex
                });
            }
        }
    },
    //点击切换平台 图表类型不做调整
    changePlatform: function (e) {
        var self = this;
        var selectedIndex = e.target.dataset["index"];
        if (this.state.indexForTypeOne == selectedIndex) return;
        self.setState({ "indexForTypeOne": selectedIndex });
    },
    //点击切换更多类型
    changeMoreType: function (e) {
        var self = this;
        var cIndex = e.target.dataset["index"];
        if (self.state.indexForTypeTwo == cIndex) return;
        //重新渲染图表
        if (cIndex == AREA_LI_INDEX) {
            self.setState({
                "currChartsType": MAP_CHARTS,
                "indexForTypeTwo": cIndex
            });
        } else if (cIndex == SYSTEM_LI_INDEX) {
            self.setState({
                "currChartsType": PIE_CHARTS,
                "indexForTypeTwo": cIndex
            });
        } else if (cIndex == CATEGORY_LI_INDEX) {
            self.setState({
                "currChartsType": BAR_CHARTS,
                "indexForTypeTwo": cIndex
            });
        } else if (cIndex == PLATFORM_LI_INDEX) {
            self.setState({
               "currChartsType": PIE_CHARTS,
                "indexForTypeTwo": cIndex
            });
        }
    },
    render: function () {
        var currentCharts, self = this;
        var API="";
        switch(parseInt(this.state.indexForTypeTwo)){
            case PLATFORM_LI_INDEX:
                 API="platform";
                 break;
                  case CATEGORY_LI_INDEX:
                 API="tags";
                 break;
                  case SYSTEM_LI_INDEX:
                 API="os";
                 break;
        }
        switch (this.state.currChartsType) {
            case LINE_CHARTS:
                currentCharts = <WorkDataLine tid="lineCharts" workId={this.workId} startTime={self.state.startTime} endTime = {self.state.endTime} indexForTypeOne={self.state.indexForTypeOne }/>;
                break;
            case MAP_CHARTS:
                currentCharts = <WorksDataMap tid="mapCharts" workId={this.workId} startTime={self.state.startTime} endTime = {self.state.endTime}/>;
                break;
            case PIE_CHARTS:
                currentCharts = <WorkDataPie tid="pieCharts" workId={this.workId} startTime={self.state.startTime} endTime = {self.state.endTime} API={API}/>;
                break;
            case BAR_CHARTS:
                currentCharts = <WorkDataBar tid="barCharts" workId={this.workId} startTime={self.state.startTime} endTime = {self.state.endTime}/>;
                break;
        }
        var ulList = <div id="types" onClick={this.changeMoreType}><li className={this.state.indexForTypeTwo == AREA_LI_INDEX ? "li_ck" : ""} data-index={AREA_LI_INDEX}>区域图谱</li><li className={this.state.indexForTypeTwo == SYSTEM_LI_INDEX ? "li_ck" : ""} data-index={SYSTEM_LI_INDEX}>操作系统</li><li className={this.state.indexForTypeTwo == CATEGORY_LI_INDEX ? "li_ck" : ""} data-index={CATEGORY_LI_INDEX}>分类数据</li><li className={this.state.indexForTypeTwo == PLATFORM_LI_INDEX ? "li_ck" : ""} data-index={PLATFORM_LI_INDEX}>平台数据</li></div>;
        if (this.state.oneCategory == TOTAL_TREND) {
            ulList = <div id="types" onClick={this.changePlatform}><li className={this.state.indexForTypeOne == ALL_PLATFORM ? "li_ck" : ""} data-index={ALL_PLATFORM}>全部平台</li><li className={this.state.indexForTypeOne == WECHAT_PLATFORM ? "li_ck" : ""} data-index={WECHAT_PLATFORM}>微信</li><li className={this.state.indexForTypeOne == SINA_PLATFORM ? "li_ck" : ""} data-index={SINA_PLATFORM}>新浪微博</li></div>;
        }
        return (
            <div id="statistics-container">
                <ul id="tabs">
                    {/*<li className={this.state.oneCategory == TOTAL_TREND ? "li_ck" : ""} data-index={TOTAL_TREND} onClick={this.clickOneCategoryHandler}><div className="img"></div>总体趋势</li>*/}
                    <li className={this.state.oneCategory == MORE_DATA ? "li_ck" : ""} data-index={MORE_DATA} onClick={this.clickOneCategoryHandler}><div className="img"></div>更多数据</li>
                </ul>
                <select id="period" onChange={this.changePeroid} defaultValue={this.state.days}>
                    <option value={SEVEN_DAY} >近7天</option>
                    <option value={THIRTY_DAY} >近30天</option>
                    <option value={ONE_YEAR} >近一年</option>
                </select>
                <div id="dataImport" onClick={this.checkImportData}>导出表格</div>
                {currentCharts }
                {ulList}
                <Dialog ref="dialog" title={this.state.dialogTitle} showHeader={this.state.showHeader} appearanceState={this.state.showDialog} sureFn={this.state.sureFn} cancelFn={this.hideDialog}/>
                <Cart ref="cart" data={this.state.cartData} onOk={this.onPayOk.bind(this, this.state.cartData) }/>
            </div>
        );
    },

    /**
     * 导出表格判断(是否购买)
    */
    checkImportData: function() {
        var _this = this;
        var userId = Base.getCurrentUser().id;
        var workId = this.props.workId;
        MakeWebAPIUtils.ifWorkUsed(workId, userId, "Svc_ExportReport").then(used => {
            if (used) { //已使用过
                _this.importData();
            }else {
                //作品没使用过高级数据
                MakeWebAPIUtils.loadOwnGoods(userId, true).then(data => {
                    //看用户是否有购买过足够的开启导出数据报表
                    if (data.err) {
                        return 0
                    }
                    var ownGoods = data.result;
                    for (var i = 0, len = ownGoods.length; i < len; i++) {
                        var item = ownGoods[i];
                        if (item.item_description.item_id == "Svc_ExportReport" && item.item_count > 0) {
                            return item.item_count;
                        }
                    }
                    return 0
                }).then(nums => {
                    if (nums) {
                        _this.setState({
                            dialogTitle: "导出数据报表特权剩余使用" + nums + "次<br\>确定使用该特权?",
                            showDialog: true,
                            showHeader: true,
                            sureFn: function() {
                                //用户还有开启高级数据特权可用，使用一次导出数据报表特权
                                MakeWebAPIUtils.usePrivilege(["Svc_ExportReport"], workId, "works", userId).then(ret => {
                                    if (ret.err) {
                                        console.log(ret.err);
                                        //使用失败用户需要购买导出数据报表特权
                                        _this.payShowData();
                                        return;
                                    }
                                    //更新缓存中用户拥有特权信息
                                    MakeWebAPIUtils.updateOwnGoods(ret);
                                    _this.importData();
                                    _this.setState({
                                        showDialog: false //隐藏对话框
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
            dialogTitle: "导出数据报表需要购买特权",
            showDialog: true,
            showHeader: true,
            sureFn: function() {
                _this.hideDialog();
                MakeWebAPIUtils.getGoodPrice(["Svc_ExportReport"], true,"service").then((goodsInfos) => {
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

    onPayOk: function (cartData,status, result) {
        if (status != 2) {
            return
        } else {
            var tplID = this.props.workId;
            var userID = Base.getCurrentUser().id;
            MakeWebAPIUtils.usePrivilege(["Svc_ExportReport"], tplID, "works", userID).then(ret => {
                if (ret.err) {
                    console.log(ret.err);
                    //使用失败用户需要购买下载
                    // pop dialog
                    return;
                }
                 MakeWebAPIUtils.updateOwnGoods(ret);
                 this.importData();
            }, err => {
                //更新owngoods，提醒用户失败
                // pop dialog
                MakeWebAPIUtils.clearOwnGoods()
                MakeWebAPIUtils.loadOwnGoods(userID, true).then(() => {
                    this.checkImportData();
                })
            })
        }
    },

    importData: function () {
        // alert("baidu");
        var url = "/v1/statistics/works/" + this.workId + "/export?date_from=" + GlobalFunc.formatTimeToStr(this.state.startTime, "yyyy/M/d") + "&date_to=" + GlobalFunc.formatTimeToStr(this.state.endTime, "yyyy/M/d") + "&access_token=";
        var server = serverurl.api;//"http://api.dev.agoodme.com";//serverurl.api;
        window.open(server + "" + url);
        //  window.open("http://www.baidu.com");
        //var contentType = "application/json";
        //$.ajax({
        //    type       : "GET",
        //    url        : server + "" + url,
        //    contentType: contentType,
        //    success    : function (result) {
        //        alert("导出成功");
        //    },
        //    error      : function (msg) {
        //        alert("导出失败");
        //    },
        //    dataType   : "json"
        //});
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
module.exports = Statistics;