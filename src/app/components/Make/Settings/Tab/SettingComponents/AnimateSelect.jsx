var React = require('react');
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
var MakeActionCreators = require('../../../../../actions/MakeActionCreators');
var Range = require('../../../../Common/Range');
var UndoMixin = require("../../UndoMixin");
var GlobalFunc = require('../../../../Common/GlobalFunc');
var imgSrc = require('../../../../../../assets/images/make/animateHexagon.png');
var $ = require("jquery");
var enterAnimateArray = [
    { type: "none", value: "无" },
    { type: "bounceIn", value: "弹性进入" },
    { type: "bounceInDown", value: "上方弹入" },
    { type: "bounceInUp", value: "下方弹入" },
    { type: "bounceInLeft", value: "左方弹入" },
    { type: "bounceInRight", value: "右方弹入" },
    { type: "fadeIn", value: "渐显" },
    { type: "fadeInDown", value: "上方渐显" },
    { type: "fadeInUp", value: "下方渐显" },
    { type: "fadeInLeft", value: "左方渐显" },
    { type: "fadeInRight", value: "右方渐显" },
    { type: "fadeInDownBig", value: "上方速显" },
    { type: "fadeInUpBig", value: "下方速显" },
    { type: "fadeInLeftBig", value: "左方速显" },
    { type: "fadeInRightBig", value: "右方速显" },
    { type: "flipInX", value: "X轴翻入" },
    { type: "flipInY", value: "Y轴翻入" },
    { type: "lightSpeedIn", value: "光速进入" },
    { type: "rotateIn", value: "旋转进入" },
    { type: "rotateInDownLeft", value: "左降进入" },
    { type: "rotateInDownRight", value: "右降进入" },
    { type: "rotateInUpLeft", value: "右升进入" },
    { type: "rotateInUpRight", value: "左升进入" },
    { type: "slideInUp", value: "下方滑入" },
    { type: "slideInDown", value: "上方滑入" },
    { type: "slideInLeft", value: "左方滑入" },
    { type: "slideInRight", value: "右方滑入" },
    { type: "zoomIn", value: "变大进入" },
    { type: "zoomInDown", value: "变大掉入" },
    { type: "zoomInLeft", value: "左方扩进" },
    { type: "zoomInRight", value: "右方扩进" },
    { type: "zoomInUp", value: "变大飞入" },
    { type: "rollIn", value: "卷入" },
    { type: "ltSlideIn", value: "左上滑入" },
    { type: "rtSlideIn", value: "右上滑入" },
    { type: "lbSlideIn", value: "左下滑入" },
    { type: "rbSlideIn", value: "右下滑入" },
    { type: "scaleInToBig", value: "进入放大" },
    { type: "scaleInToSmall", value: "进入缩小" }
];

var userObj = GlobalFunc.getUserObj();
//
if (!!userObj.speFunctionCode) {
    enterAnimateArray.push(
        { type: "clipLeftNoTrans", value: "左渐显现" },
        { type: "clipRightNoTrans", value: "右渐显现" },
        { type: "clipTopNoTrans", value: "上渐显现" },
        { type: "clipBottomNoTrans", value: "下渐显现" }
    );
}

var exitAnimateArray = [
    { type: "none", value: "无" },
    { type: "bounceOut", value: "弹性退出" },
    { type: "bounceOutDown", value: "下方弹出" },
    { type: "bounceOutUp", value: "上方弹出" },
    { type: "bounceOutLeft", value: "左方弹出" },
    { type: "bounceOutRight", value: "右方弹出" },
    { type: "fadeOut", value: "渐隐" },
    { type: "fadeOutDown", value: "下方渐隐" },
    { type: "fadeOutUp", value: "上方渐隐" },
    { type: "fadeOutLeft", value: "左方渐隐" },
    { type: "fadeOutRight", value: "右方渐隐" },
    { type: "fadeOutDownBig", value: "下方速隐" },
    { type: "fadeOutUpBig", value: "上方速隐" },
    { type: "fadeOutLeftBig", value: "左方速隐" },
    { type: "fadeOutRightBig", value: "右方速隐" },
    { type: "flipOutX", value: "X轴翻出" },
    { type: "flipOutY", value: "Y轴翻出" },
    { type: "lightSpeedOut", value: "光速退出" },
    { type: "rotateOut", value: "旋转退出" },
    { type: "rotateOutDownLeft", value: "右降退出" },
    { type: "rotateOutDownRight", value: "左降退出" },
    { type: "rotateOutUpLeft", value: "左升退出" },
    { type: "rotateOutUpRight", value: "右升退出" },
    { type: "slideOutUp", value: "上方滑出" },
    { type: "slideOutDown", value: "下方滑出" },
    { type: "slideOutLeft", value: "左方滑出" },
    { type: "slideOutRight", value: "右方滑出" },
    { type: "zoomOut", value: "缩小退出" },
    { type: "zoomOutDown", value: "缩小掉落" },
    { type: "zoomOutLeft", value: "左方缩退" },
    { type: "zoomOutRight", value: "右方缩退" },
    { type: "zoomOutUp", value: "缩小飞出" },
    { type: "rollOut", value: "滚出" },
    { type: "ltSlideOut", value: "左上滑出" },
    { type: "rtSlideOut", value: "右上滑出" },
    { type: "lbSlideOut", value: "左下滑出" },
    { type: "rbSlideOut", value: "右下滑出" },
    { type: "hinge", value: "掉落" },
    { type: "zoomInFadeOut", value: "先进后出" }
];

var stressAnimateArray = [
    { type: "none", value: "无" },
    { type: "bounce", value: "抖动" },
    { type: "flash", value: "闪烁" },
    { type: "shake", value: "晃动" },
    { type: "rubberBand", value: "橡皮筋" },
    { type: "swing", value: "摆动" },
    { type: "tada", value: "得瑟" },
    { type: "wobble", value: "摇晃" },
    { type: "flip", value: "翻转" },
    { type: "jello", value: "摆动" },
    { type: "pulse", value: "脉动" },
    { type: "scaleElastic", value: "规则跳动" },
    { type: "directWhirlIn", value: "顺时旋转" },
    { type: "inverseWhirlIn", value: "逆时旋转" },
    { type: "enlargeMinify", value: "放大还原" },
    { type: "minifyEnlarge", value: "缩小还原" },
    { type: "driftUpDown", value: "浮动" },
    { type: "sway", value: "震动" },
    { type: "pulseScale", value: "心脏跳动" },
    { type: "swingAround", value: "中心摇动" },
    { type: "moveTopALittle", value: "上移一点" },
    { type: "moveBotALittle", value: "下移一点" },
    { type: "moveLeftALittle", value: "左移一点" },
    { type: "moveRightALittle", value: "右移一点" },
    { type: "blurALittle", value: "模糊一点" },
    { type: "clearToBlur", value: "清晰模糊" },
    { type: "moveTopALittleNoTrans", value: "放大上移" },
    { type: "moveBotALittleNoTrans", value: "放大下移" },
    { type: "moveLeftALittleNoTrans", value: "放大左移" },
    { type: "moveRightALittleNoTrans", value: "放大右移" },
    { type: "slowToBigNoTrans", value: "慢慢放大" },
    { type: "slowToSmallNoTrans", value: "慢慢缩小" },
    { type: "ltSlideALittle", value: "左上移动" },
    { type: "lbSlideALittle", value: "左下移动" },
    { type: "rtSlideALittle", value: "右上移动" },
    { type: "rbSlideALittle", value: "右下移动" }
];
var animationTypes = {};
stressAnimateArray.forEach((item) => {
    animationTypes[item.type] = "stress"
})
exitAnimateArray.forEach((item) => {
    animationTypes[item.type] = "out"
})
enterAnimateArray.forEach((item) => {
    animationTypes[item.type] = "in"
})
var AnimateSelect = React.createClass({

    mixins: [UndoMixin],

    getInitialState: function () {
        var value = $.extend({}, this.props.data);

        value.name = value.name || "none";
        //{type: "clipLeftNoTrans", value: "左渐显现"},
        //{type: "clipRightNoTrans", value: "右渐显现"},
        //{type: "clipTopNoTrans", value: "上渐显现"},
        //{type: "clipBottomNoTrans", value: "下渐显现"}
        var userObj = GlobalFunc.getUserObj();
        if ((value.name == "clipLeftNoTrans" || value.name == "clipRightNoTrans" || value.name == "clipTopNoTrans" || value.name == "clipBottomNoTrans") && !userObj.speFunctionCode) {
            value.name = "none";
        }
        return {
            value: value
        }
    },

    componentWillReceiveProps: function (nextProps) {
        var value = $.extend({}, nextProps.data);
        var userObj = GlobalFunc.getUserObj();
        if ((value.name == "clipLeftNoTrans" || value.name == "clipRightNoTrans" || value.name == "clipTopNoTrans" || value.name == "clipBottomNoTrans") && !userObj.speFunctionCode) {
            value.name = "none";
        }
        value.name = value.name || "none"
        var type = value.type || animationTypes[value.name]
        this.setState({
            value: value,
            selectType: type
        })

    },
    keyDown: function (type, event) {
        if (event.keyCode == 13) {
            this._changeValue(type, event)
        } else {
            //var stateValue=this.state.value;
            //stateValue[type]=event.target.value;
            //this.setState({value:stateValue})
        }
    },
    _changeSelectType: function (event) {
        var value = event.target.value;
        this.setState({ selectType: value });
        // this._changeValue("type", value);
        //this.props.nameChange(value);
    },
    _changeAnimate: function (event) {
        var value = event.currentTarget.dataset.type;
        var type = animationTypes[value]
        this.props.nameChange(value, type);
    },
    render: function () {


        var stateValue = this.state.value;
        var propValue = this.props.data;
        var currentAnimation;
        var animationType = this.state.selectType || animationTypes[stateValue.name];
        var selectTab = 0;
        switch (animationType) {
            case "in":
                currentAnimation = enterAnimateArray;
                break;
            case "out":
                selectTab = 1
                currentAnimation = exitAnimateArray;
                break;
            case "stress":
                selectTab = 2
                currentAnimation = stressAnimateArray;
                break;
        }
        var typesIn = enterAnimateArray.map((item) => {
            return <li key={item["type"]} className={ stateValue.name == item.type ? "selected-animate" : "" }
                onClick={this._changeAnimate}
                onMouseEnter={this._hoverAnimate}
                onMouseLeave={this._leaveAnimate} data-type={item["type"]}>
                <img src={imgSrc} data-type={item["type"]} style={{ opacity: .5 }}/>
                <span>{item["value"]}</span>
            </li>
        })
        var typesOut = exitAnimateArray.map((item) => {
            return <li key={item["type"]} className={ stateValue.name == item.type ? "selected-animate" : "" }
                onClick={this._changeAnimate}
                onMouseEnter={this._hoverAnimate}
                onMouseLeave={this._leaveAnimate} data-type={item["type"]}>
                <img src={imgSrc} data-type={item["type"]} style={{ opacity: .5 }}/>
                <span>{item["value"]}</span>
            </li>
        })
        var typesStress = stressAnimateArray.map((item) => {
            return <li key={item["type"]} className={ stateValue.name == item.type ? "selected-animate" : "" }
                onClick={this._changeAnimate}
                onMouseEnter={this._hoverAnimate}
                onMouseLeave={this._leaveAnimate} data-type={item["type"]}>
                <img src={imgSrc} data-type={item["type"]} style={{ opacity: .5 }}/>
                <span>{item["value"]}</span>
            </li>
        })
        return (
            <div >
                <div className="setting-range">
                    <h1>动画时间</h1>
                    <Range max="10" min="0.1" width={130} step="0.1" value={parseFloat(propValue.duration) }
                        change={this._changeValue.bind(this, "duration") }
                        onMouseUp={this.endRecord}/>
                    <input type="number" className="range-number" step="0.1" max="10" min="0.1"
                        value={stateValue.duration}
                        onBlur={this._changeValue.bind(this, "duration") }
                        onKeyDown={this.keyDown.bind(this, "duration") }
                        onChange={this._changeValue.bind(this, "duration") }/>
                </div>
                <div className="setting-range">
                    <h1>延迟时间</h1>
                    <Range max="20" min="0" width={130} step="0" value={parseFloat(propValue.delay) }
                        change={this._changeValue.bind(this, "delay") }
                        onMouseUp={this.endRecord}/>
                    <input type="number" className="range-number" step="0.1" max="10" min="0"
                        value={stateValue.delay}
                        onBlur={this._changeValue.bind(this, "delay") } onKeyDown={this.keyDown.bind(this, "delay") }
                        onChange={this._changeValue.bind(this, "delay") }/>
                </div>

                <div className="setting-select">
                    <h1>动画次数</h1>
                    <select value={stateValue.infinite} onChange={this._changeValue.bind(this, "infinite") }>
                        <option value="1">1次</option>
                        <option value="2">2次</option>
                        <option value="3">3次</option>
                        <option value="4">4次</option>
                        <option value="5">5次</option>
                        <option value="infinite">永久循环</option>
                    </select>
                </div>
                <div className="setting-select">
                    <h1>选择动画</h1>
                </div>
                {/*<div className="setting-select">
                    <h1>动画类型</h1>
                    <select value={animationType}
                        onChange={this._changeSelectType}>
                        <option value="in">进入</option>
                        <option value="out">退出</option>
                        <option value="stress">强调</option>
                    </select>
                </div>*/}
                <Tabs className="tabs-h32" selectedIndex={selectTab} >
                    <TabList >
                        <Tab>进入</Tab>
                        <Tab>退出</Tab>
                        <Tab>强调</Tab>
                    </TabList>
                    <TabPanel ><ul className="setting-animation-type">{typesIn}</ul></TabPanel>
                    <TabPanel ><ul className="setting-animation-type">{typesOut}</ul></TabPanel>
                    <TabPanel><ul className="setting-animation-type">{typesStress}</ul></TabPanel>
                </Tabs>
               
            </div>
        );
    },

    _changeValueState: function (type, value) {
        var animationVal = this.state.value;
        var newValue;
        if (!!value.target) {
            newValue = parseFloat(value.target.value);
            if (isNaN(newValue)) {
                animationVal[type] = value.target.value;
                this.setState({
                    value: animationVal
                });
                return;
            }
        } else {
            newValue = value
        }
        switch (type) {
            case "duration":
                if (!newValue) newValue = 1;
                if (newValue > 10) newValue = 10;
                if (newValue < 0.1) newValue = 0.1;

                break;
            case "delay":
                if (!newValue) newValue = 0;
                if (newValue > 20) newValue = 20;
                if (newValue < 0) newValue = 0;
                break;
        }
        animationVal[type] = newValue;
        this.setState({
            value: animationVal
        });


    },

    _changeValue: function (type, value) {
        this._changeValueState(type, value);
        var isRange = !!value.target ? false : true
        this.props.rangeChange(type, this.state.value, isRange);
        //console.log(value);

    },
    _hoverAnimate: function (event) {
        var type = event.currentTarget.dataset.type;
        var dom = event.currentTarget;
        var $animateEl = $(dom).children("img")
        $animateEl.addClass(type + " animated");
        this.timer=setInterval(function () {
            $animateEl.removeClass(type + " animated");
            setTimeout(function () {
                $animateEl.addClass(type + " animated");
            }, 10)
        }, 2000)

    }
    ,

    _leaveAnimate: function (event) {
        clearInterval(this.timer);
        var type = event.currentTarget.dataset.type;
        $(event.currentTarget).children("img").removeClass(type + " animated");

    }

});

module.exports = AnimateSelect;