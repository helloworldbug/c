/**
 * @name 导航条模块
 * @author 曾文彬
 * @datetime 2015-9-6
 */

'use strict';

// require core module
var React = require('react');

// define Footer component
var CompatibleTip = React.createClass({


    getInitialState() {
        return {
            show: false
        };
    },

    render() {
        if(!this.state.show){
            var style={
                height:0
            }
        }

        return (<div className="compatibleTips" style={style}>
            <div className="container">
                <p>
                    ME在当前浏览器下存在兼容问题，推荐使用
                    <a href='https://www.baidu.com/s?wd=谷歌浏览器' target='_blank'>谷歌浏览器</a>、
                    <a href='https://www.baidu.com/s?wd=360极速浏览器' target='_blank'>360极速浏览器</a>、
                    <a href='https://www.baidu.com/s?wd=QQ浏览器' target='_blank'>QQ浏览器</a>（V9.1及以上版本）
                </p>
                <button onClick={this.closeCompatible}>知道了</button>
            </div>
        </div>) ;
    },
    closeCompatible:function(){
        this.setState({show: false});
        //$("#header").animate({top: 0});
    },
    componentDidMount() {
        var explorer = navigator.userAgent;
        var showTips = true;
        if (explorer.indexOf("Chrome") >= 0&&explorer.indexOf("Edge") ==-1) {
            if (parseFloat(explorer.match(/Chrome\/([\d.]+)/)[1]) > 38) {
                showTips = false
            }
        } else if (/android/i.test(explorer) || /iphone|ipad|ipod/i.test(explorer)) {
            showTips = false
        }
        this.setState({show: showTips})


    }
});

// export Footer component
module.exports = CompatibleTip;
