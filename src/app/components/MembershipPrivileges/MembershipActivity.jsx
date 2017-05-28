/**
 * @description 会员活动页面
 * @time 2016-12-22
 * @author fisnYu
 */

'use strict';

//require core module
var React = require('react');

//require owner style
require("./MembershipActivity.css");

/**
 * 会员活动页面
 */
export default class MembershipActivity extends React.Component {
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
        //初始化状态
        this.state = {
            activities : []
        };
    }
    /**
     * 渲染活动模块
     *
     */
    renderItmesSection(){
        var activities = this.state.activities;
        var activitiesDom = activities.length > 0 ? (activities.map((_activity, index) => {
            var endDate = _activity.end_date.iso;
            var activityName = _activity.name;
            var startDate = _activity.start_date.iso;
            var _ingOrOVer = this.getStatusByDate(startDate, endDate) == "进行中" ? "activity-ing" : "activity-over";
            var _ingOrOVerStr = this.getStatusByDate(startDate, endDate);
            var _img = _activity.target_link ? (<a href={_activity.target_link} target="_blank"><img src={ _activity.activity_img } /></a>) :
                (<a><img src={ _activity.activity_img } /></a>);
            return (
                <li className="membership-activity-item" key={activities.length - index}>
                    <label className={_ingOrOVer}>{_ingOrOVerStr}</label>
                    {_img}
                    <div className="membership-activity-item-bottom">{activityName}<span>{this.getDateString(startDate, "yyyy/MM/dd")} — {this.getDateString(endDate,"yyyy/MM/dd")}</span></div>
                </li>
            );
        })) : (<div className="no-activity">暂无活动</div>);
        
        return activitiesDom;
    }
    /**
     * 根据日期来获取活动的状态
     */
    getStatusByDate(startDate, endDate){
        var res = "已结束";   //表示已结束
        var _date = new Date();
        var _endDate = new Date(endDate);
        var _startDate = new Date(startDate);
        if(_endDate > _date){
            if(_startDate > _date){
                res = "即将开始";   //表示还未开始
            }else{
                res = "进行中";    //表示正在进行中
            }
        }
        return res;
    }
    /**
     * 对Date的扩展，将 Date 转化为指定格式的String
     * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
     * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     * 例子：
     * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
     * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
    */
    getDateString(date, format) {
        var t = new Date(date);
        var tf = function (i) { return (i < 10 ? '0' : '') + i };
        return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
            switch (a) {
                case 'yyyy':
                    return tf(t.getFullYear());
                case 'MM':
                    return tf(t.getMonth() + 1);
                case 'mm':
                    return tf(t.getMinutes());
                case 'dd':
                    return tf(t.getDate());
                case 'HH':
                    return tf(t.getHours());
                case 'ss':
                    return tf(t.getSeconds());
            }
        });
    }
    /**
     *渲染界面
     */
    render() {
        //没有登录的情况下，直接跳转到登录页面，登录完成返回到转档页面
        var self = this;
        return (
            <div className="membership-activity-container">
                <div className="membership-activity-title"></div>
                <ul className="membership-activity-content">
                    {this.renderItmesSection()}
                </ul>
            </div>
        );
    }
    
    /**
     *组件装载事件
     */
    componentDidMount() {
        //加载活动数据
        this.loadActivitiesData();
    }
    /**
     *组件挂载事件
     */
    componentWillUnmount() {
    }
    
    /**
     *加载PC端活动的数据
     */
    loadActivitiesData(){
        var self = this;
        //TODO 需要优化，把1000条活动都查询出来了。
        var strCQL = "select * from me_activity where approved=2 and data_site=3  order by order_number desc limit 0,1000";
        fmacloud.Query.doCloudQuery(strCQL,{
            success : (data) => {
                if(data.results.length > 0){
                    var activities = this.convert_list_2_json(data.results);
                    this.setState({
                        activities : activities
                    });
                }
            }, 
            error : (err) => {
                console.log("查询PC端活动失败: ",err);
            }
        });
    }
    /**
     *转换tpl list 转换成JSON
     */
    convert_list_2_json (a){
        var result = [];
        var len = a.length;
        for(var i=0; i<len; i++){
            result[i] = a[i].toJSON();
        }
        return result;
    }
};