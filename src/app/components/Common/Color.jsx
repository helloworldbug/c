/**
 * @description 颜色组件
 * 
 * @author lifeng
*/

var React = require('react');
var MakeActionCreators = require('../../actions/MakeActionCreators');
var moreColorImage = require('../../../assets/images/make/moreColor.png');
var delColorImage = require('../../../assets/images/make/delColor.png');
var ColorPicker = require('./ColorPicker');

var Color = React.createClass({

    render: function () {
        var value = this.props.value;
        return (
            <div className="setting-color">
                <ul>
                    <li className={value == "rgb(0,0,0)" ? "colorState" : ""} style={{backgroundColor: "rgb(0,0,0)"}}
                        onClick={this.props.changeColor.bind(null, "rgb(0,0,0)")}/>
                    <li className={value == "rgb(255,255,255)" ? "colorState" : ""} style={{backgroundColor: "rgb(255,255,255)"}}
                        onClick={this.props.changeColor.bind(null, "rgb(255,255,255)")}/>
                    <li className={value == "rgb(255,0,0)" ? "colorState" : ""} style={{backgroundColor: "rgb(255,0,0)"}}
                        onClick={this.props.changeColor.bind(null, "rgb(255,0,0)")}/>
                    <li className={value == "rgb(255,102,0)" ? "colorState" : ""} style={{backgroundColor: "rgb(255,102,0)"}}
                        onClick={this.props.changeColor.bind(null, "rgb(255,102,0)")}/>
                    <li className={value == "rgb(255,255,0)" ? "colorState" : ""} style={{backgroundColor: "rgb(255,255,0)"}}
                        onClick={this.props.changeColor.bind(null, "rgb(255,255,0)")}/>
                    <li className={value == "rgb(102,204,0)" ? "colorState" : ""} style={{backgroundColor: "rgb(102,204,0)"}}
                        onClick={this.props.changeColor.bind(null, "rgb(102,204,0)")}/>
                    <li className={value == "rgb(0,222,255)" ? "colorState" : ""} style={{backgroundColor: "rgb(0,222,255)"}}
                        onClick={this.props.changeColor.bind(null, "rgb(0,222,255)")}/>
                    <li className={value == "rgb(0,72,255)" ? "colorState" : ""} style={{backgroundColor: "rgb(0,72,255)"}}
                        onClick={this.props.changeColor.bind(null, "rgb(0,72,255)")}/>
                    <li className={value == "rgb(183,0,216)" ? "colorState" : ""} style={{backgroundColor: "rgb(183,0,216)"}}
                        onClick={this.props.changeColor.bind(null, "rgb(183,0,216)")}/>
                    <li className={value == "more" ? "colorState" : ""} style={{background:"url(" + moreColorImage + ")"}}>
                        <ColorPicker value={value} changeParameter={this.props.changeColor}/></li>
                </ul>
            </div>
        );
    }
});

module.exports = Color;