/**
 * @FileName MakeComponent
 * @description 组件库
 * @create 2016-07-29 9:00
 * @author tony
 **/

var React = require('react');
//导入组件库CSS样式
require('../../../assets/css/make-component.css');

var GlobalFunc = require("../Common/GlobalFunc");
var ItemInit = require("../Common/ItemInit");
var RedEnvelope = require("../Common/RedEnvelope");

var MagazineStore = require('../../stores/MagazineStore');
var PageStore = require('../../stores/PageStore');
var ElementStore = require('../../stores/ElementStore');

var CommonUtils  = require('../../utils/CommonUtils');

var MeConstants = require('../../constants/MeConstants');
var ElementType = MeConstants.Elements;

var MakeComponentList = [
    [
        {name : "涂抹", css : "tumo", key : ElementType.scribble, isDrag : true},
        {name : "指纹", css : "zhiwen", key : ElementType.fingerprint, isDrag : true},
        {name : "地图", css : "ditu", key : ElementType.map, isDrag : true},
        {name : "摇一摇", css : "yaoyiyao", key : ElementType.shake, isDrag : true},
        {name : "一键拨号", css : "yijianbohao", key: ElementType.phone, isDrag : true},
        {name : "标签", css : "biaoqian", key : ElementType.label, isDrag : true},
        {name : "浮层", css : "fuceng", key : ElementType.displayFrame, isDrag : true},
        {name : "图集", css : "tuji", key : ElementType.picslide, isDrag : true}
    ]
]

var MakeComponent = React.createClass({

    getInitialState: function () {
        console.log("init");
        var userObj = GlobalFunc.getUserObj();
        if (userObj.speFunctionCode) {
            if (userObj.speFunctionCode.indexOf("PICFRAME_ABLE") > -1) {
                MakeComponentList[1]=   [
                    {name : "打赏", css : "dashang", key : ElementType.reward, isDrag : true},
                    {name : "投票", css : "toupiao", key : ElementType.vote, isDrag : true},
                    {name : "红包", css : "hongbao", key : ElementType.redEnvelope, isDrag : true},
                    {name : "SVG", css : "svg", key : ElementType.svg, isDrag : true},
                    {name:"虚拟全景", css:"panorama", key : ElementType.panorama, isDrag:true},
                    {name:"AR增强现实", css:"ar", key : ElementType.ar, isDrag:true},
                    {name:"VR虚拟现实", css:"vr", key : ElementType.vr, isDrag:true}
                ]
            }
        }else{
            MakeComponentList[1]=   [
                {name : "投票", css : "toupiao", key : ElementType.vote, isDrag : true},
                {name:"AR增强现实", css:"ar", key : ElementType.ar, isDrag:true},
                {name:"VR虚拟现实", css:"vr", key : ElementType.vr, isDrag:true}
            ]
        }
        return {
            tabIndex : 1
        }
    },

    componentDidMount: function () {
    },

    componentWillUnmount: function () {
    },

    componentWillReceiveProps: function (nextProps) {
    },

    /**
     * tab标签切换事件
     */
    onTabClickHandler : function(e){
        var target = e.target;
        var index = target.getAttribute("data-tab");
        if(index){
            this.setState({tabIndex:index});
        }
    },

    /**
     * 点击添加元素事件
     */
    onItemClickHandler : function(e){
        if(this.props.selectedState.type == "group"){
            GlobalFunc.addSmallTips("请选择一页添加组件",null, {clickCancel: true});
            return
        }
        var target = e.target;
        var key = target.getAttribute("data-key");
        CommonUtils.addElementByType(parseInt(key));
    },

    onDragStartHandler : function(e){
        /*拖拽开始(被拖拽元素) ondragstart 不可以写preventDefault事件*/
        var key = e.target.getAttribute("data-key");
        e.dataTransfer.setData("elementType", parseInt(key));//存储拖拽元素的id*/
    },

    render: function () {
        var components, list;
        var self = this;
        list = MakeComponentList[this.state.tabIndex-1];
        if(list.length > 0){
            components = list.map(function(obj, index){
                return <div className="list-item" key={index}><div className={obj.css} data-key={obj.key} onClick={self.onItemClickHandler} draggable="true" onDragStart={self.onDragStartHandler}></div><span>{obj.name}</span></div>;
            });
        }

        return (
            <div className="make-component">
                <div className="make-component-tab">
                    <span className={this.state.tabIndex == 1 ? "active" : ""} data-tab="1" onClick={this.onTabClickHandler}>基础组件</span>
                    <span className={this.state.tabIndex == 2 ? "active" : ""} data-tab="2" onClick={this.onTabClickHandler}>高级组件</span>
                </div>
                <div className="make-component-list">{components}</div>
            </div>
        );
    }

});

module.exports = MakeComponent;