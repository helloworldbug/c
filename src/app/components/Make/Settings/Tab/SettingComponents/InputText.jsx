var React = require('react');
var MakeActionCreators = require('../../../../../actions/MakeActionCreators');
var GlobalFunc=require('../../../../Common/GlobalFunc')
var SettingInputText = React.createClass({

    render: function () {
        return (
            <div className="setting-input-text">
                <h1>{this.props.title}</h1>
                <input type="text" value={this.props.value} maxLength={this.props.maxLength} onChange={this._changeValue}/>
            </div>
        );
    },

    _changeValue: function (event) {
        var parameter = this.props.parameter;
        MakeActionCreators.updateElement({[parameter]: GlobalFunc.htmlEncode(event.target.value)});

    }

});


module.exports = SettingInputText;