/**
 * @description 我的订单
 * @time 2016-09-09
 * @author tony
 */

'use strict';

//require core module
var React = require('react');
import {Link} from 'react-router'
var Base = require('../../utils/Base');
//导入CSS样式
require('../../../assets/css/myPrivileges.css');
require('rc-pagination/assets/index.css');
const Pagination = require('rc-pagination');

var ContextUtils = require('../../utils/ContextUtils');
var MyPrivilegeListItem = require('./MyPrivilegeListItem');
var MemberActionCreators = require('../../actions/MembershipPrivilegesActionCreators');
var MemberStore = require('../../stores/MembershipPrivilegeStore');
var defaultPrivilege=require('../../../assets/images/membershipPrivileges/no-privilege.png');
const PageSize = 10;

/**
 * 我的订单界面
 */
var MyPrivileges = React.createClass({
    /**
     * 设置默认值
     *
     */
    getInitialState : function(){
        return {
            currentPage: 1
        };
    },

    /**
     * 当前页改变事件
     * @param index
     */
    onPageChange : function(index){
        this.setState({currentPage : index});
    },

    /**
     * 数据改变
     * @param e
     */
    onDataChange : function(e){
        var data = MemberStore.getMyPrivilegeData();
        this.setState({data : data})
    },

    render : function () {
        var data = this.state.data || [], itemComponents = "";
        var start = (this.state.currentPage - 1) * PageSize, end = start + PageSize;
        var total = data.length, list = data.slice(start, end);
        itemComponents = list.map(function(data, index){
            return <MyPrivilegeListItem key={index} data={data} />;
        });
        return (
            <div className="myPrivilegesView">
                <div className="title-div">
                    <span className="title-txt">我的特权</span>
                    <span className="btn-view-txt"><a href="/membershipPrivileges" target="_blank">查看更多特权</a></span>
                </div>
                <div className="privilege-title-div">
                    <div className="title-name">名称</div>
                    {/*<div className="title-data">有效期</div>*/}
                    <div className="title-times">剩余次数/有效期</div>
                </div>
                {
                    itemComponents.length > 0 ?
                        <div className="privilegesList">
                            {itemComponents}
                        </div>
                        : <div className="no-privilegesList"><img src={defaultPrivilege} /><div>你还没有任何特权</div></div>
                }
                {
                    total > 0 ?
                        <div className="page-box">
                            <Pagination className="showQuickJumper" showQuickJumper onChange={this.onPageChange} pageSize={PageSize} current={this.state.currentPage} defaultCurrent={1} total={total} />
                        </div>
                        : null
                }
                <div className="clear"></div>
            </div>
        )
    },

    /**
     * 组件加载完成
     */
    componentDidMount : function(){
        MemberStore.addChangeListener(this.onDataChange);
        this.queryMyPrivilegeData();
    },

    /**
     * 组件被移除前
     */
    componentWillUnmount() {
        MemberStore.removeChangeListener(this.onDataChange);
    },

    /**
     * 请求数据
     */
    queryMyPrivilegeData : function(){
        var userId = ContextUtils.getCurrentUser().id;
        if(!userId) return;
        var opt = {};
        opt.userID = userId;
        MemberActionCreators.queryMyPrivilegeData(opt);
    }
});

module.exports = MyPrivileges;