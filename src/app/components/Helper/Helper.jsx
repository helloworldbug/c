/**
 * @module      Helper
 * @description 帮助中心
 * @time        2015-11-2
 * @author      Liu
 */

'use strict';
// require core module
var React = require('react');

var HelperContent = require('./HelperContent');
var Slider = require('../Common/Slider');
require('../../../assets/css/mistery-base.css');
require('../../../assets/css/helper.css');

var HelperAction = require('../../actions/HelperAction');

// define Helper component
var Helper = React.createClass({

    getInitialState(){
        this.mounted=true;
        //判断是否从制作页转入
        var search = window.location.search;

        var param = {};
        var hashArray = search.substr(search.indexOf("?") + 1).split('&');

        hashArray.forEach(function (str) {
            var values = str.split('=');
            param[values[0]] = decodeURI(values[1]);
        });

        console.log(param);
        //初始化类别标签
        return {
            helper: null,
            label : param.type || null,
            index   : param.index || null,
            time  : 0
        }

    },

    //第一次渲染
    componentWillMount() {
        this.getStateByDataType();
    },

    componentDidMount(){
        var $helpSide = $(this.refs.helpSide);
        var minH = parseInt($helpSide.css("min-height"));
        var clientMinH = document.body.clientHeight - 77
        if (minH < clientMinH) {
            $helpSide.css("min-height", `${clientMinH}px`)
        }
        //绑定滚动条事件
        this.bindWindowScrollEvent();
    },

    componentWillUnmount() {
        // WorkStore.removeChangeListener(this.onChange);
        this.bindWindowScrollEvent({isUnset: true});
        this.mounted=false
    },

    //获取帮助中心内容（去重）
    getStateByDataType() {
        var _this = this;

        HelperAction.getHelpCenterType(function (data) {
            if(_this.mounted){
                _this.setState({
                    helper: data,
                    label : _this.state.label || data[0].attributes.helptype
                });
            }

        }, function () {
            if(_this.mounted){
                _this.setState({
                    helper: null
                });
            }

        });
    },

    //生成侧边栏标签
    getClassBy_t(helper){

        if (helper) {
            var works = {n: null, c: null};
            works.n = helper.map(function (helperType,index) {
                var attr = helperType.attributes;
                return (
                    <div key={index} data-label={attr.helptype}
                         style={this.state.label == attr.helptype ? {backgroundColor:"#262f38",color:"#ffffff"} : {}}
                         onClick={this.changeLabel}>
                        <span>{attr.helptype}</span>
                    </div>
                )
            }.bind(this));
            return works;
        }else {
            return null;
        }
    },

    render() {
        var slideLabel = this.getClassBy_t(this.state.helper);
        return (
            <div style={{width:'100%',height:'100%'}}>
                <Slider ref="slider"/>
                <div id="helper" className="helper">

                    <div id="userSlide" ref="helpSide"  className={"selected "+this.props.params._t} style={{top:'81px'}}>
                        <div className="slideHeader">
                            ME问题反馈QQ群<br />
                            450828388
                        </div>
                        {slideLabel?slideLabel.n:null}
                        {slideLabel?slideLabel.c:null}
                    </div>
                    <HelperContent type={this.state.label} index={this.state.index} time={this.state.time}/>
                </div>
            </div>
        );
    },

    //改变标签
    changeLabel(e){
        this.setState({
            label  : e.currentTarget.dataset.label,
            time   : (this.state.time + 1),
            index  : null
        });
    },
    //滚轮事件
    bindWindowScrollEvent(options) {
        var isUnset = !!options && options.isUnset,
            scrollCallback = this.windowScrollCallback;

        $(window)[isUnset ? 'unbind' : 'bind']('scroll', scrollCallback);
    },

    windowScrollCallback() {
        this.refs.slider.handleScroll();
    }

});
// export Helper component                 
module.exports = Helper;