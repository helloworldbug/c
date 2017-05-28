var React = require('react');
var MakeActionCreators = require('../../../../../actions/MakeActionCreators');
var Range = require('../../../../Common/Range');
var UndoMixin = require("../../UndoMixin");
var $ = require("jquery");

var ElementMove = React.createClass({

    mixins: [UndoMixin],

    getInitialState: function () {
        var value=$.extend({}, this.props.data);
        return {
            value: value
        }
    },

    componentWillReceiveProps: function (nextProps) {
        var value = $.extend({}, nextProps.data);
        this.setState({
            value: value
        })

    },
    keyDown                  : function (type, event) {
        if (event.keyCode == 13) {
            this._changeValue(type, event)
        } else {
            //var stateValue=this.state.value;
            //stateValue[type]=event.target.value;
            //this.setState({value:stateValue})
        }
    },

    render: function () {


        var stateValue = this.state.value;
        var propValue = this.props.data;

        return (
            <div >
                <div className="setting-select">
                    <h1>移动类型</h1>
                    <select value={stateValue.position} onChange={this._changeValue.bind(this, "position")}>
                        <option value="relative">相对</option>
                        <option value="absolute">绝对</option>
                    </select>
                </div>
                <div className="setting-number">
                    <h1>位置</h1>
                    <div>
                        <span>X</span>
                        <input type="text" value={parseFloat(propValue.to.x)}
                               onChange={this.changePos.bind(this,"x")}/>
                    </div>
                    <div className="fr right">
                        <span>Y</span>
                        <input type="text" value={parseFloat(propValue.to.y)}
                               onChange={this.changePos.bind(this,"y")}/>
                    </div>
                </div>
                <div className="setting-range">
                    <h1>延迟时间</h1>
                    <Range  step="1" max="20" min="0" width={130}  value={parseFloat(propValue.delay)}
                            change={this._changeValue.bind(this, "delay")}
                            onMouseUp={this.endRecord}/>
                    <input type="number" className="range-number" step="1" max="100" min="0"
                           value={stateValue.delay}
                           onBlur={this._changeValue.bind(this, "delay")}
                           onKeyDown={this.keyDown.bind(this, "delay")}
                           onChange={this._changeValueState.bind(this, "delay")}/>
                </div>
                <div className="setting-range">
                    <h1>移动时间</h1>
                    <Range  step="1" max="20" min="0" width={130}  value={parseFloat(propValue.speed)}
                           change={this._changeValue.bind(this, "speed")}
                           onMouseUp={this.endRecord}/>
                    <input type="number" className="range-number" step="1" max="20" min="0"
                           value={stateValue.speed}
                           onBlur={this._changeValue.bind(this, "speed")}
                           onKeyDown={this.keyDown.bind(this, "speed")}
                           onChange={this._changeValueState.bind(this, "speed")}/>
                </div>
            </div>
        );
    },
    changePos:function(type,event){
        var stateValue = this.state.value;
        stateValue.to[type]=event.target.value
        this.setState({value:stateValue})
        this.props.change(type, stateValue);
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
            case "speed":
                if (!newValue) newValue = 1;
                if (newValue > 10) newValue = 10;
                if (newValue < 0.1) newValue = 0.1;
                break;
            case "delay":
                if (!newValue) newValue = 1;
                if (newValue > 100) newValue = 100;
                if (newValue < 0.1) newValue = 0.1;


                break;

        }
        animationVal[type] = +newValue;
        this.setState({
            value: animationVal
        });


    },

    _changeValue: function (type, value) {
        this._changeValueState(type, value);
        var isRange = !!value.target ? false : true
        this.props.change(type, this.state.value, isRange);
        //console.log(value);

    },

});

module.exports = ElementMove;