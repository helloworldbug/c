/**
  * @name 右侧浮动组件
  * @author 曾文彬
  * @datetime 2015-9-10  
*/

'use strict';

// require core module
var React = require('react'),
    Base = require('../../utils/Base');

// require css module
var SliderCSS = require('../../../assets/css/slider.css');

// define slider component
var Slider = React.createClass({

  defineInfo() {
    return {
      scrollCallback: this.handleScroll.bind(this)
    };
  },

  handleMouseover(event) {
    var currNode = this.getCurrNode(event.target, this.props.equalStyle),
        isTop = currNode.classList.contains(this.props.otherStyle);

    // 改变state    
    this.setAttributes(currNode, {
      'data-changebg': 'ed',
      'data-changeshape': !isTop ? 'ed' : '',
      'data-show': !isTop ? 'ed' : ''
    });
  },

  handleMouseout(event) {
    var currNode = this.getCurrNode(event.target, this.props.equalStyle);

    this.setAttributes(currNode, ['data-changebg', 'data-changeshape', 'data-show'], true);
  },

  handleScroll() {
    // 设置slider动画的样式
    this.setState({
      animationStatus: $(window).scrollTop() > this.props.defaultOffsetTop
    });
  },

  handleScrollToTop() {
    Base.backToTop($, 400);
  },

  getCurrNode(node, checkStyle) {
    return node.classList.contains(checkStyle)
              ? node
              : node.parentNode;
  },

  setAttributes(node, styles, action) {
    (styles instanceof Array ? styles : Object.keys(styles)).forEach((style) => {
      action ? node.removeAttribute(style) : node.setAttribute(style, styles[style]);
    });
  },

  // setWindowScrollEvent(options) {

  //   var isUnset = !!options && options.isUnset;

  //   var scrollCallback = this.defineInfo().scrollCallback;

  //   $(window)[isUnset ? 'unbind' : 'bind']('scroll', scrollCallback);
  // },

  emuableQuestionItem() {
    if (!this.props.emuabled) {
        return (
            <div>
                <div className="concel follow" onMouseOver={this.handleMouseover} onMouseOut={this.handleMouseout}>
                <p className="concel-p1">关注我们</p>
                <div className="ewm-group">
                    <div></div>
                    <p>微信扫描关注</p>
                </div>
            </div>
            <div className="concel download" onMouseOver={this.handleMouseover} onMouseOut={this.handleMouseout}>
              <p className="concel-p1">下载APP</p>
              <div className="ewm-group">
                <div></div>
                <p>手机扫描下载APP</p>
              </div>
            </div>
            <div className="concel question" onMouseOver={this.handleMouseover} onMouseOut={this.handleMouseout}>
                <p className="concel-p1">问题反馈</p>
                <div className="ewm-group">
                    <div></div>
                    <p>ME解决你的问题</p>
                </div>
            </div>
            <div className="concel question" onMouseOver={this.handleMouseover} onMouseOut={this.handleMouseout}>
                <p className="concel-p1">商务合作</p>
                <div className="group">
                    <ul>
                        <li>021-58385236</li>
                        <li>2102534037</li>
                        <li>service@gli.cn</li>
                        <li>9:00-18:00</li>
                    </ul>
                </div>
            </div>
            </div>        
        );
    }
  },

  getDefaultProps() {
    return {
      otherStyle: 'fir',
      equalStyle: 'concel',
      defaultOffsetTop: 40
    };
  },

  getInitialState() {
    return {
      animationStatus: !!this.props.animationStatus
    };
  },

  render() {
    return (
      <div className={location.pathname.slice(1)=="user"?"fix-sidebar fix-sidebar-down":"fix-sidebar"} data-animation={this.state.animationStatus ? "opacity" : ""}>
        <div className="concel fir" onClick={this.handleScrollToTop} onMouseOver={this.handleMouseover} onMouseOut={this.handleMouseout}></div>
    
        {this.emuableQuestionItem()}
      
      </div>
    );
  },
  componentDidMount() {
    // 绑定滚动事件
    //this.setWindowScrollEvent();
  },
  componentWillUnmount() {
    // 解除滚动事件
    //this.setWindowScrollEvent({ isUnset: true });
  }
});

// export slider component
module.exports = Slider;