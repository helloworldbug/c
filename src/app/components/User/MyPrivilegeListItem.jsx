/**
 * @description 我的特权列表Item
 * @time 2016-09-09
 * @author zhao
 */

'use strict';

//require core module
var React = require('react');
//导入CSS样式
require('../../../assets/css/myPrivileges.css');

/**
 * 我的订单界面
 */
var MyPrivilegeListItem = React.createClass({
    /**
     * 设置默认值
     *
     */
    getInitialState : function(){
        return {};
    },

    render : function () {
        var data = this.props.data, itemVal;
        switch(data.available_type){
            case 2:
                itemVal = data.available_time_end;
                break;
            default:
                itemVal = "永久";
                break;
        }

        var iconStyle = {background:'url("'+data.item_description.item_icon+'?imageMogr2/thumbnail/!80x80r") no-repeat center'};
        var userTimeOrCount;
        if(data.external_item_id === 'Svc_Mouth' || data.external_item_id === 'Svc_Year'){
            userTimeOrCount = <div className="privilege-item-times">{data.available_end_at.split('T')[0]}</div>
        }else {
            userTimeOrCount = <div className="privilege-item-times">{data.item_count}</div>
        }

        return (
            <div className="privilege-item">
                <div className="privilege-item-name-div">
                    <div className="privilege-item-icon" style={iconStyle}></div>
                    <span className="privilege-item-desc">{data.item_description.item_name}</span>
                </div>
                {/*<div className="privilege-item-data">{itemVal}</div>*/}
                {/*<div className="privilege-item-times">{data.item_count}</div>*/}
                {userTimeOrCount}
            </div>
        )
    }
});

module.exports = MyPrivilegeListItem;