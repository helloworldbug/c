/**
 * @component PageSettings
 * @description 页设置面板
 * @time 2016-11-22 09:40
 * @author Nick
 **/

var React = require('react');
import {Link} from 'react-router'
var MakeActionCreators = require('../../../actions/MakeActionCreators');
var PositionAndSize = require("./Tab/SettingComponents/PositionAndSize");
var UndoMixin = require("./UndoMixin");
var Range = require('../../Common/Range');

var obj = {};

var PageSettings = React.createClass({

    mixins: [UndoMixin],

    getInitialState: function () {
        var attributes = this.props.element.attributes;

        //设置初始动画属性
        var valueSubObj = attributes['item_val_sub'] || '{"delay": 0, "duration": 1, "infinite": "1", "a1": 0, "a2": 0, "b1": 0, "b2": 0}';
        obj = JSON.parse(valueSubObj);
        return obj;
    },

    componentWillReceiveProps: function (nextProps) {
        var attributes = nextProps.element.attributes;
        var valueSubObj = attributes['item_val_sub'] || '{"delay": 0, "duration": 1, "infinite": "1", "a1": 0, "a2": 0, "b1": 0, "b2": 0}';
        obj = JSON.parse(valueSubObj);
        this.setState(obj)
    },

    keyDown: function (parameter, event) {
        var keyCode = event.which, value = event.target.value;
        if (keyCode == 13) {
            this._changeValue(parameter, value);
        }
    },
    _changeName    : function (event) {
        MakeActionCreators.updateElement({f_name: event.target.value});
    },
    render: function () {
        var attributes = this.props.element.attributes;

        var height = document.body.clientHeight - 54 - 40;
        return (
            <div className="setting-container" style={{height:height}}>

                <div className="setting-title-blank">编辑</div>
                <span className="clearTop"/>
                <div className="setting-input-text">
                    <h1>元素名称</h1>
                    <input type="text" value={attributes.f_name} onChange={this._changeName} maxLength="20"/>
                </div>
                <header onClick={this._headerClick.bind(this, "base-style", "setting-base-style")}><span>基础样式</span><b id="base-style"/></header>
                <div id="setting-base-style">
                    <span className="clearTop"/>

                    <PositionAndSize attributes={attributes}/>
                </div>

                <header onClick={this._headerClick.bind(this, "svg-style", "setting-svg")}><span>SVG动画</span><b id="svg-style"/></header>
                <div id="setting-svg">
                    <div className="setting-svg-code">
                        <h1>SVG代码</h1>
                        <textarea placeholder="粘贴SVG代码" value={attributes["item_val"]} onChange={this._changeCode}/>
                        <Link to="/helper?type=常见问题&index=6" target="_blank">什么是SVG代码？</Link>
                    </div>

                    <div className="setting-range">
                        <h1>动画时间</h1>
                        <Range max={10} min={0.1} width={130} step={0.1} value={obj.duration || 0.1}
                               change={this._changeValue.bind(this, "duration")}  onMouseUp={this.endRecord}/>
                        <input type="number" step="0.1" className="range-number" value={this.state.duration}
                               onBlur={this._changeValue.bind(this, "duration")} onKeyDown={this.keyDown.bind(this, "duration")}
                               onChange={this._changeValueState.bind(this, "duration")}/>
                    </div>

                    <div className="setting-range">
                        <h1>延迟时间</h1>
                        <Range max={20} min={0} width={130} step={0.1} value={obj.delay || 0}
                               change={this._changeValue.bind(this, "delay")} onMouseUp={this.endRecord}/>
                        <input type="number" step="0.1" className="range-number" value={this.state.delay}
                               onBlur={this._changeValue.bind(this, "delay")} onKeyDown={this.keyDown.bind(this, "delay")}
                               onChange={this._changeValueState.bind(this, "delay")}/>
                    </div>

                    <div className="setting-select">
                        <h1>动画次数</h1>
                        <select value={this.state.infinite} onChange={this._changeValue.bind(this, "infinite")}>
                            <option value="1">1次</option>
                            <option value="2">2次</option>
                            <option value="3">3次</option>
                            <option value="4">4次</option>
                            <option value="5">5次</option>
                            <option value="infinite">永久循环</option>
                        </select>
                    </div>
                    <div className="setting-number">
                        <h1>起点位置</h1>

                        <div>
                            <span>A1</span>
                            <input type="text" value={this.state.a1}
                                   onBlur={this._changeValue.bind(this, "a1")} onKeyDown={this.keyDown.bind(this, "a1")}
                                   onChange={this._changeValueState.bind(this, "a1")}/>
                            <span>&nbsp;%</span>
                        </div>
                        <div className="fr right">
                            <span>A2</span>
                            <input type="text" value={this.state.a2}
                                   onBlur={this._changeValue.bind(this, "a2")} onKeyDown={this.keyDown.bind(this, "a2")}
                                   onChange={this._changeValueState.bind(this, "a2")}/>
                            <span>&nbsp;%</span>
                        </div>
                    </div>
                    <div className="setting-number">
                        <h1>终点位置</h1>

                        <div>
                            <span>B1</span>
                            <input type="text" value={this.state.b1}
                                   onBlur={this._changeValue.bind(this, "b1")} onKeyDown={this.keyDown.bind(this, "b1")}
                                   onChange={this._changeValueState.bind(this, "b1")}/>
                            <span>&nbsp;%</span>
                        </div>
                        <div className="fr right">
                            <span>B2</span>
                            <input type="text" value={this.state.b2}
                                   onBlur={this._changeValue.bind(this, "b2")} onKeyDown={this.keyDown.bind(this, "b2")}
                                   onChange={this._changeValueState.bind(this, "b2")}/>
                            <span>&nbsp;%</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    _headerClick: function (buttonID, contentID) {
        $("#" + contentID).slideToggle();
        $("#" + buttonID).toggleClass("hide").toggleClass("show");
    },

    _changeValueState: function (parameter, event) {
        var value = event.target.value;
        this.setState({
            [parameter]: value
        });
    },

    _changeValue: function (parameter, value) {

        if (!!value.target) {
            value = value.target.value;
        }

        switch (parameter) {
            case "duration":
                value = parseFloat(value) || 1;
                if (value < 0.1) value = 0.1;
                if (value > 10) value = 10;
                break;
            case "delay":
                value = parseFloat(value) || 0;
                if (value < 0) value = 0;
                if (value > 20) value = 20;
                break;
            case "a1":
            case "a2":
            case "b1":
            case "b2":
                value = parseInt(value);
                if (value < 0) value = 0;
                if (value > 100) value = 100;
                break;
        }
        this.setState({[parameter]: value}, function () {
            var str = JSON.stringify(this.state);

            console.log(str);
            MakeActionCreators.updateElement({item_val_sub: str});
        });

        //obj = obj || {'delay': 0, 'duration': 1, 'infinite': "1", 'a1': 0, 'a2': 0, 'b1': 0, 'b2': 0};
    },

    _changeCode: function (event) {
        var value = event.target.value;
        MakeActionCreators.updateElement({item_val: value});
    }

});

module.exports = PageSettings;