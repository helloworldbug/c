/**
 * @description 一键转档公告栏页面
 * @time 2016-11-7
 * @author fisnYu
 */

'use strict';
//require owner style
require("./dataProcessingAnnounce.css");
//require core module
var React = require('react');
import {Link} from 'react-router';
import _ from 'lodash';

//todo 测试数据
const PublisherArray = [
    "安徽科学技术出版社",
    "安徽少年儿童出版社",
    "巴蜀书社",
    ",北京印刷学院",
    "成都地图出版社",
    "成都电子科技大学出版社",
    "党建读物出版社",
    "第四军医大学出版社",
    "敦煌文艺出版社",
    "福建人民出版社",
    "广西师范大学出版社",
    "贵州科技出版社",
    "湖北人民出版社",
    "湖北长江报刊传媒（集团）有限公司", 
    "江苏教育出版社",
    "江苏人民出版社",
    "宁波出版社",
    "清华大学国际合作与交流处",
    "清华大学智能技术国家重点实验室",
    "人民大学历史学院",
    "人民文学出版社",
    "陕西三秦出版社",
    "陕西未来出版社",
    "上海产业技术研究院",
    "上海出版印刷高等专科学校",
    "上海辞书出版社",
    "上海古籍出版社",
    "上海计算机软件技术开发中心",
    "上海交通大学出版社",
    "上海科学技术出版社",
    "上海新华传媒集团",
    "上海炫动传播股份有限公司",
    "上海张江文化传媒有限公司",
    "世界图书出版公司北京公司",
    "世界图书出版广东有限公司",
    "四川少年儿童出版社",
    "天津人民美术出版社",
    "西南交通大学出版社",
    "中国纺织出版社",
    "中国福利会出版社",
    "中国科技出版传媒股份有限公司",
    "中国人民大学历史学院",
    "中国书籍出版社",
    "中国新闻出版研究院",
    "安徽科学技术出版社"
];
const ContainerHeight = 32; //容器的高度
const H = "horizontal";     //水平
const V = "vertical";       //垂直
/**
 * 一键转档公告栏页面
 */
export default class DataProcessingAnnounce extends React.Component{
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
        this.timer = null;
        this.state = {
			activeIndex: 0  //当前显示的出版社
        }
    }
    /**
     * 下一条公告
     */
    moveNext(loop){
        var self = this;
		if(this.state.activeIndex >= PublisherArray.length - 2){    //额外追加了第一项
			if(loop != false){
                //为了增加，最后一项过度到第一项的动画
                self.setState({activeIndex: this.state.activeIndex + 1});
                setTimeout(function() {
                    self.setState({activeIndex: 0});
                }, 4950);
            }
		}else{
			this.setState({activeIndex: this.state.activeIndex + 1}); 
		}
	}

    /**
     * 上一条公告
     */
	movePrev(loop){
		if(this.state.activeIndex <= 0) return;
		this.setState({activeIndex: this.state.activeIndex - 1});
	}
    /**
     * 获取宽度
     */
    getWidth(){
		return parseInt(document.body.clientWidth);
	}
    /**
     * 获取高度
     */
    getHeight(){
        return ContainerHeight;
    }
    /**
     *渲染公告数组
     */
    renderAnnounceArraySection(_style){
        return _.map(PublisherArray, (item, index) => <div className="publisher-announce" style={_style} key={index}>{`${item}已经入驻，正在使用转档功能`}</div>);
    }
    /**
     * 通过方向来设置跑马灯的动画
     */
    setAnimationOrientation(orientation){
        var width = this.getWidth();
        var height = this.getHeight();
        var obj = {};
        var _style = {};
        var _transform = "";
        var _width = 0;
        var _height = 0;
        var _float = "";
        if(orientation == H){    //水平
            _transform = "translate3d(-" + this.state.activeIndex * width + "px,0px, 0px)";   
            _width = width*PublisherArray.length;
            _height = height;
            _float = "left";
        }else if(orientation == V){    //垂直
            _width = width;
            _height = height*PublisherArray.length;
            _transform = "translate3d(0px,-"+  this.state.activeIndex * height +"px, 0px)"; 
            _float = "";
        }
        _style.width = width;
        _style.height = height;
        _style.float = _float;

        obj._transform = _transform;
        obj._style = _style;
        obj._width = _width;
        obj._height = _height;
        return obj;
    }

    /**
     *渲染界面
     */
    render() {
        
        var animationStyle = {};
        //水平跑
        // animationStyle = this.setAnimationOrientation(H);
        //垂直跑
        animationStyle = this.setAnimationOrientation(V);
        //处理最后返回到第一页的，闪动。
        var duration = "2.0s";  
        if(this.state.activeIndex == 0){
            duration = "0s";
        }
        return (
            <div className="data-processing-announce-container">
                <div className="announce-collection" style={{width: animationStyle._width,height: animationStyle._height, transform: animationStyle._transform, transitionDuration : duration}} >
                    {this.renderAnnounceArraySection(animationStyle._style)}
                </div>
                <button className="data-processing-announce-close" onClick={this.hideAnnounceHandler.bind(this)} ></button>
            </div>
        );
    }
    /**
     *隐藏公告
     */
    hideAnnounceHandler(e){
        if(this.timer != null){
			window.clearInterval(this.timer);
			this.timer = null;
		}
        this.props.hideAnnounce();
    }
    /**
     *装载组件的时候
     */
    componentDidMount(){
        var self = this;
        this.timer = setInterval(function(){self.moveNext(true);}, 10 * 1000);
    }
    /**
     *卸载组件的时候
     */
    componentWillUnmount() {
        if(this.timer != null){
			window.clearInterval(this.timer);
			this.timer = null;
		}
        this.props.hideAnnounce();
    }

};