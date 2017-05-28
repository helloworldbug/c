/**
 * @component PageSettings
 * @description 页设置面板
 * @time 2016-11-22 09:40
 * @author Nick
 **/

var React = require('react');
var PageStore = require('../../../stores/PageStore');
var Constans = require("../../../constants/MeConstants");
var ElementStore = require('../../../stores/ElementStore');
var MakeActionCreators = require('../../../actions/MakeActionCreators');
var GlobalFunc=require('../../Common/GlobalFunc')
var tplAnimationConfig = [
    {
        animationName : "禁止翻页",  //动画名
        animationValue: {
            "name"     : "",//横向立体翻转
            "autoplay" : false,
            "interval" : 10000,
            "direction": 0,// 0横向  1纵向
            "lock"     : true
        },  //动画
        animationState: 1  //动画是否可用 , 1 为可用 , 0 为不可用
    }
];

var PageSettings = React.createClass({

    getInitialState          : function () {
        var pageData = this.props.pageData;
        return {
            pageHeight: parseInt(pageData.attributes['page_height']),
            pageAnimation: pageData.attributes['page_animation']
        }
    },
    componentWillReceiveProps: function (nextProps) {
        var pageData = nextProps.pageData;
        this.setState({
            pageHeight: parseInt(pageData.attributes['page_height']),
            pageAnimation: pageData.attributes['page_animation']
        })
    },
    keyDown: function (event) {
        var keyCode = event.which, value = event.target.value;
        if (keyCode == 13) {
            this._changePageHeight(value);
        }
    },

    render                : function () {
        var pageData = this.props.pageData;

        var selectOption = [];
        var animation_mode;
        if (pageData.attributes.page_animation) {
            animation_mode = JSON.parse(pageData.attributes.page_animation).name;
        }
        for (var i = 0; i < tplAnimationConfig.length; i++) {
            var animationName = tplAnimationConfig[i].animationName;
            selectOption.push(<option key={i} selected={animation_mode == tplAnimationConfig[i].animationValue.name}
                                      value={i}>{animationName}</option>);
        }
        return (
            <div className="setting-container">
                <div className="setting-title-blank">编辑页面</div>
                <span className="clearTop"/>
                <div className="setting-input-text">
                    <h1>页面名称</h1>
                    <input type="text" value={GlobalFunc.htmlDecode(pageData.attributes.f_name)} onChange={this.changeName} maxLength="20"/>
                </div>
                <div className="setting-input-text">
                    <h1>页面高度</h1>
                    <input type="text" value={this.state.pageHeight}
                           onBlur={this._changePageHeight} onKeyDown={this.keyDown}
                           onChange={this._changePageHeightState}/>
                </div>
                <div className="setting-select">
                    <h1>禁止翻页</h1>
                    <input type="checkbox" checked={!!this.state.pageAnimation} onChange={this._changeAnimationType} />
                </div>
                {/*<div className="setting-select">
                 <h1>翻页方式</h1>
                 <select onChange={this._changeAnimationType}>
                 <option selected={!animation_mode} value="">无</option>
                 {selectOption}
                 </select>
                 </div>*/}
            </div>
        );
    },
    changeName            : function (event) {
        MakeActionCreators.updateAttr(this.props.selectInfo, {f_name: GlobalFunc.htmlEncode(event.target.value)});
    },
    _changePageHeightState: function (value) {
        value = value.target.value;
        this.setState({
            pageHeight: value
        });
    },

    _changePageHeight: function (value) {
        var pageData = this.props.pageData;

        if (!!value.target) {
            value = parseInt(value.target.value);
        } else {
            value = parseInt(value);
        }

        if (!value) value = 1008;
        if (value < 1008) value = 1008;
        if(value>Constans.Defaults.MAXINPUT){
            value=Constans.Defaults.MAXINPUT
        }
        this.setState({
            pageHeight: value
        });
        pageData.set("page_height", value);
        ElementStore.emitChange();
    },

    _changeAnimationType: function (event) {
        var pageData = this.props.pageData, value = event.target.checked;
        var page_animation_val = "";
        if (value) {
            page_animation_val = JSON.stringify(tplAnimationConfig[0].animationValue)
        }

        this.setState({
            pageAnimation: page_animation_val
        });
        MakeActionCreators.updatePageProp({"page_animation": page_animation_val});
        //pageData.set("page_animation", JSON.stringify(tplAnimationConfig[value].animationValue));
    }

});

module.exports = PageSettings;