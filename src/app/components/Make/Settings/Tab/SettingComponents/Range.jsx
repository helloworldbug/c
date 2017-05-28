var React = require('react');
var MakeActionCreators = require('../../../../../actions/MakeActionCreators');
var Range = require('../../../../Common/Range');
var UndoMixin = require("../../UndoMixin");

var SettingRange = React.createClass({

    mixins: [UndoMixin],

    getInitialState: function () {
        var value = this.getFitValue(this.props.value);
        return {
            value: value
        }
    },
    getFitValue    : function (value) {

        var tempVal = parseFloat(value);
        if (isNaN(tempVal) && typeof this.props.defaultValue != "undefined") {
            tempVal = parseFloat(this.props.defaultValue);
        }
        if (isNaN(tempVal)) {
            return value;
        } else {
            return tempVal;
        }
    },
    keyDown        : function (event) {
        var keyCode = event.which, value = event.target.value;
        if (keyCode == 13) {

            value = parseFloat(value);
            if (isNaN(value)) {
                value = this.props.defaultValue
                this.setState({value: value})
            } else {
                if (value > this.props.max) value = this.props.max;
                if (value < this.props.min) value = this.props.min;
            }
            this._changeValue(value);
        }
    },

    componentWillReceiveProps: function (nextProps) {
        if (nextProps.value != this.state.value) {
            var value = this.getFitValue(nextProps.value);
            this.setState({
                value: value
            })

        }
    },

    render: function () {

        var rangeValue = this.getFitValue(this.props.value);
        return (
            <div className="setting-range">
                <h1>{this.props.title}</h1>
                <Range max={this.props.max} min={this.props.min} width={130} step={this.props.step}
                       change={this._changeValue}
                       value={rangeValue}
                       onMouseUp={this.endRecord}/>
                <input type="number" className="range-number" step={this.props.step} max={this.props.max}
                       min={this.props.min} value={this.state.value}
                       onBlur={this._changeValue} onKeyDown={this.keyDown} onChange={this._changeValue}/>
            </div>
        );
    },

    _changeValueState: function (value) {
        value = value.target.value;
        console.log(value);
        this.setState({
            value: value
        });
    },

    _changeValue: function (value) {

        var parameter = this.props.parameter, obj, child = this.props.child, isNumber = this.props.isNumber;
        if (!!value.target) {
            value = parseFloat(value.target.value);
            if (isNaN(value)) {
                value = this.props.defaultValue
            } else {
                if (value > this.props.max) value = this.props.max;
                if (value < this.props.min) value = this.props.min;
            }

            this.setState({
                value: value
            });
            filterParameter();
            if (this.props.change) {
                this.props.change(value);
            } else {
                MakeActionCreators.updateElement({[parameter]: value});
            }

        } else {
            value = parseFloat(value);
            filterParameter();
            if (this.props.change) {
                this.props.change(value, "range");
            } else {
                MakeActionCreators.updateElement({[parameter]: value}, undefined, {type: "range"});
            }

        }

        function filterParameter() {
            if (parameter == "font_size") {
                value = value + "px";
            } else if (parameter == "item_animation_val") {
                obj[child] = value;
                value = JSON.stringify(obj);
            } else if (isNumber) {
                value = parseFloat(value);
            } else {
                value = value + "";
            }

            if (parameter == "frame_pixes") {
                MakeActionCreators.updateElement({font_frame: true});
            }

        }

    }

});

module.exports = SettingRange;