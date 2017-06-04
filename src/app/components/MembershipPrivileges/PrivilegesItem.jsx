// 文件名：PrivilegesItem.jsx
//
// 创建人：tony
// 创建日期：2016/9/8 10:27
// 描述： 特权条目组件

'use strict';
var React = require('react');
var Base = require('../../utils/Base');

require("../../../assets/css/membershopPrivileges.css");
var IconMore=require("../../../assets/images/membershipPrivileges/icon-more.png")
var PrivilegesItem = React.createClass({

    getInitialState(){
        return {isShowPrice : true};
    },

    /**
     * 购买事件
     * @param e
     */
    onBuyHandler : function(e){
        e.stopPropagation();
        e.preventDefault();

        this.props.onBuyHandler(this.props.good);
    },
    
    onBuyMouseOver : function(e){
        e.stopPropagation();
        e.preventDefault();

        this.setState({isShowPrice : false})
    },

    onBuyMouseOut : function(e){
        e.stopPropagation();
        e.preventDefault();

        this.setState({isShowPrice : true})
    },

    //组件渲染前
    componentWillMount() {
    },

    //组件渲染完成
    componentDidMount(){
    },

    /**
     * 组件被移除前
     */
    componentWillUnmount() {
    },

    render : function() {
        var data = this.props.good;
        var iconUrl = "";           //特权图标
        var titleStr = "";          //特权标题
        var helpIcon = "";
        var descStr = "";           //特权描述
        var priceStr = "";          //特权价格
        var txtComponents = "";
        if(data){
            iconUrl = data.icon;
            titleStr = data.name;
            if(data.show_url){
                helpIcon = <a href={data.show_url} target='_blank' title="查看详情"><span className='MP-item-help'></span></a>
            }
            descStr = data.description;
            priceStr = data.price / 100.0 + "元";
           /** 去除原来的逻辑
            * var _unit = "次";
            var _service = data.price_info.goods_list[0].goods.service;
            if(_service.hasOwnProperty("services")){ //TODO 后期需要去循环获取 modify by tony  2016-12-9
                _unit = _service.services[0].service.unit_name || "次";
            }*/
            // if(data.unit){
            //     _unit = data.unit; 
            // }
            //通过前台得到_unit add by Mr xu 2016/5/24
            let _unit = data.unit_name === '永久'?'次':data.unit_name;
            priceStr += "/" + _unit;
            if(this.state.isShowPrice == false){
                priceStr = "立即购买";
            }
            txtComponents = <div><div className="MP-item-txt"><div className="MP-item-title">{titleStr}</div>{helpIcon}<div className="MP-item-desc">{descStr}</div></div><div className="MP-item-btn-price" onMouseOver={this.onBuyMouseOver} onMouseOut={this.onBuyMouseOut} onClick={this.onBuyHandler}>{priceStr}</div></div>;
        }else{
            iconUrl = IconMore;
            txtComponents = <div className="MP-item-moreInfo">更多功能敬请期待</div>;
        }

        var iconStyle = {
            backgroundImage : "url('"+iconUrl+"')",
            backgroundSize : "cover"
        };

        return (
            <div className="MP-item">
                <div className="MP-item-icon" style={iconStyle}></div>
                {txtComponents}
            </div>
        );
    }
});

/** export component **/
module.exports = PrivilegesItem;