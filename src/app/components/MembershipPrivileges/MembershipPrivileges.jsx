// 文件名：MembershipPrivileges.jsx
//
// 创建人：zhao
// 创建日期：2016/9/8 10:27
// 描述： 会员特权

'use strict';
var React = require('react');
var Base = require('../../utils/Base');
var PrivilegeItem = require('./PrivilegesItem');
var MemberActionCreators = require('../../actions/MembershipPrivilegesActionCreators');
var MemberStore = require('../../stores/MembershipPrivilegeStore');
var CartView = require('../Cart/Cart');
const TabIndex = require('../../constants/MeConstants').UserTab;

var ContextUtils = require('../../utils/ContextUtils');

require("../../../assets/css/membershopPrivileges.css");

const BookTransferCount = "Svc_BookTransferCount";  //转档次数的 custom_code

var MembershipPrivileges = React.createClass({

    getInitialState(){
        return {
            cartData : null,
            list : []
        };
    },

    //组件渲染前
    componentWillMount() {
    },

    //组件渲染完成
    componentDidMount(){
        MemberStore.addChangeListener(this._onChange);
        MemberActionCreators.queryMembershipPrivileges();
    },

    /**
     * 组件被移除前
     */
    componentWillUnmount() {
        MemberStore.removeChangeListener(this._onChange);
    },

    /**
     * MemberStore更新, 设置state
     */
    _onChange: function () {
        this.setState({list : MemberStore.getMembershipData()});
    },

    /**
     * 购买特权
     * @param data
     */
    onBuyHandler : function(data){
        var user = ContextUtils.getCurrentUser();
        if(!user){
              var hashs = location.pathname;
        localStorage.setItem("referer", hashs);
            Base.linkToPath(`/login`);
            return;
        }

        var expire = !!data.end_at ? data.end_at : "永久";
        var cartData =  { name: data.name, icon: data.icon, price: (data.price / 100.0).toFixed(2), sum: "1", qixian: Base.formattime(expire, 'yyyy-MM-dd'), id: data.id, custom_code: data.custom_code };
        console.log(cartData, "xxx");
        this.setState({
            cartData : [cartData]
        });
        this.refs["cartView"].changeDialogStatus(true,0);
    },

    /**
     * 查看我的特权事件
     * @param e
     */
    onClickHandler : function(e){
        e.stopPropagation();
        e.preventDefault();

        var user = ContextUtils.getCurrentUser();
        if(!user){
              var hashs = location.pathname;
        localStorage.setItem("referer", hashs);
            Base.linkToPath(`/login`);
            return;
        }

        Base.linkToPath(`/user/tab/${TabIndex.MYPRIVILEGES}`);
    },
    sortList : function (list) {
      /**由于后台show_order排序不生效,由前台处理数据
       * @Author Mrxu
       * @Time 2017/5/24
       * @param this.state.list Array
       * @result Array(排序后,增加unit_name的数组)
       * */
        var arr=[];
        for(let value of list){
            //将包年放在首位
            if(value.custom_code === 'Svc_Year'){
                arr[0] = value;
                continue;
            }
            //将包月放在第二位
            if(value.custom_code === 'Svc_Mouth'){
                arr[1] = value;
                continue;
            }
            if(arr.length<3){
                arr[arr.length+2] = value;
                continue;
            }
            arr[arr.length] = value;
            debugger;
        }
        /**
         * 循环完毕处理,arr中的undefined
        * */
        return arr.filter((item,index)=>{
            //新增unit_name用于后面判断
            if(typeof item.custom_code !== 'undefined'){
                item.unit_name = Base.change_end_at(item.custom_code);
            }
            return typeof item !== 'undefined';
        });

    },

    render : function() {
        var list = this.state.list || [];
        list = this.sortList(list);
        var self = this;
        //modify by fishYu 2016-12-7 增加转档特权
        var h5List = list.filter((item) => item.custom_code != BookTransferCount);
        var privilegeItemComponents1 = h5List.map(function(good, index){
            return <PrivilegeItem key={index}  good={good} onBuyHandler={self.onBuyHandler} />
        });
        privilegeItemComponents1.push(<PrivilegeItem key={h5List.length}  good={null} />);
        // add by 删除后台代码
        // var privilegeItemComponents1_len=privilegeItemComponents1.length;
        // 删除特权中"导出数据表功能" --konghuachao--2017-04-20
        // privilegeItemComponents1.splice(privilegeItemComponents1_len-2,1);
        var convertList = list.filter((item) => item.custom_code == BookTransferCount);     //转档特权
        var privilegeItemComponents2 = convertList.map(function(good, index){
            return <PrivilegeItem key={"convert" + index}  good={good} onBuyHandler={self.onBuyHandler} />
        });
        privilegeItemComponents2.push(<PrivilegeItem key={"convert" + convertList.length}  good={null} />);
        return (
            <div className="MP-container container">
                <div className="MP-banner-div">
                    <div className="MP-banner"></div>
                    <div className="MP-banner-tip-div">
                        <div className="MP-banner-tip"></div>
                        <a className="MP-btn-view" onClick={this.onClickHandler}>查看我的特权</a>
                    </div>
                </div>
                <div className="MP-content-list-title">H5作品特权</div>
                <div className="MP-content-list">
                    {privilegeItemComponents1}
                </div>
                <div className="MP-content-list-title clear">一键转档特权</div>
                <div className="MP-content-list-convert">
                    {privilegeItemComponents2}
                </div>
                <CartView ref="cartView" data={this.state.cartData} />
            </div>
        );
    }
});

/** export component **/
module.exports = MembershipPrivileges;