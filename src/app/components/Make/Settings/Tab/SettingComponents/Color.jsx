var React = require('react');
var MakeActionCreators = require('../../../../../actions/MakeActionCreators');
var moreColorImage = require('../../../../../../assets/images/make/moreColor.png');
var delColorImage = require('../../../../../../assets/images/make/delColor.png');
var ColorPicker = require('../../../../Common/ColorPicker');

var SettingColor = React.createClass({

    render: function () {
        var value = this.props.value;
        return (
            <div className="setting-color">
                <h1>{this.props.title}</h1>
                <ul>
                    <li className={value == "" ? "colorState" : ""} style={{background: "url(" + delColorImage + ")",backgroundSize:"cover"}}
                        onClick={this._changeColor.bind(this, "")}/>
                    <li className={value == "rgb(255,255,255)" ? "colorState" : ""} style={{backgroundColor: "rgb(255,255,255)"}}
                        onClick={this._changeColor.bind(this, "rgb(255,255,255)")}/>
                    <li className={value == "rgb(255,0,0)" ? "colorState" : ""} style={{backgroundColor: "rgb(255,0,0)"}}
                        onClick={this._changeColor.bind(this, "rgb(255,0,0)")}/>
                    <li className={value == "rgb(255,102,0)" ? "colorState" : ""} style={{backgroundColor: "rgb(255,102,0)"}}
                        onClick={this._changeColor.bind(this, "rgb(255,102,0)")}/>
                    <li className={value == "rgb(255,255,0)" ? "colorState" : ""} style={{backgroundColor: "rgb(255,255,0)"}}
                        onClick={this._changeColor.bind(this, "rgb(255,255,0)")}/>
                    <li className={value == "rgb(102,204,0)" ? "colorState" : ""} style={{backgroundColor: "rgb(102,204,0)"}}
                        onClick={this._changeColor.bind(this, "rgb(102,204,0)")}/>
                    <li className={value == "rgb(0,0,0)" ? "colorState" : ""} style={{backgroundColor: "rgb(0,0,0)"}}
                        onClick={this._changeColor.bind(this, "rgb(0,0,0)")}/>
                    <li className={value == "more" ? "colorState" : ""} style={{background:"url(" + moreColorImage + ")"}}>
                        <ColorPicker value={value} changeParameter={this._changeColor}/></li>
                </ul>
            </div>
        );
    },

    _changeColor: function (color) {
        MakeActionCreators.updateElement({[this.props.parameter]: color});
    }

});

module.exports = SettingColor;