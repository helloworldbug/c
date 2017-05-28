/**
 * @component Range
 * @description 拉杆
 * @time 2015-09-17 10:29
 * @author Nick
 **/

var React = require("react");

module.exports = React.createClass({
    getInitialState: function () {
        return {
            className: 'hide',
            clicked: false
        }
    },
    // componentDidUpdate: function(){
    //   alert(111)
    //   this.setState({value: this.props.value})
    // },

    render: function () {
        var style = {
            width: this.props.width
        };
        var width = String(this.props.value).length * 4 + 10 - 9;
        var progressStyle = {
            left: (this.props.value - this.props.min) / (this.props.max - this.props.min) * (this.props.width - 14) - width + "px"
        };

        var selectArea = {
            width: (this.props.value - this.props.min) / (this.props.max - this.props.min) * (this.props.width - 14) + "px",
            height: "4px",
            position: "absolute",
            top: "11px",
            left: "0px",

            borderRadius: "2px",
            pointerEvents: "none"
        };
        return (
            <div className="range-box">
                <span style={selectArea} className="selected-area" />
                <div className={this.state.className + " range-progress"} style={progressStyle}>
                    {this.props.value}
                    {this.props.mod == "animate" ? "s" : ""}
                </div>
                <input onMouseDown={this.mouseDown} onMouseUp={this.mouseUp}
                       className={this.state.clicked==true?"range_clicked":""}
                       type="range"
                       style={style}
                       max={this.props.max}
                       min={this.props.min}
                       value={this.props.value}
                       step={this.props.step}
                       onChange={this._change}
                       onMouseEnter={this._mouseEnter}
                       onMouseLeave={this._mouseLeave}/>
            </div>
        )
    },
    _change: function (e) {
        this.props.change(e.target.value);
        this.setState({className: ""});
    },
    _mouseEnter: function (e) {
        this.setState({className: ""});
    },
    _mouseLeave: function (e) {
        this.setState({className: "hide"});
    },
    mouseDown:function(e){
        if(this.props.onMouseDown){
            this.props.onMouseDown(e)
        }
        this.setState({
            clicked: !this.state.clicked
        });
    },
    mouseUp:function(e){
        if(this.props.onMouseUp){
            this.props.onMouseUp(e)
        }
        var _this = $(e.target);
        if (_this.hasClass("range_clicked")) {
            this.setState({
                clicked: !this.state.clicked
            });
        }
    },

});
