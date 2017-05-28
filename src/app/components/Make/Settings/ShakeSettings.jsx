/**
 * @component VoteSettings
 * @description 投票元素设置面板
 * @time 2015-09-25 15:20
 * @author Nick
 **/

var React = require('react');
var SettingsTabs = require('./Tab/SettingsTabs');
var FingerprintEditTab = require('./Tab/FingerprintEditTab.jsx');
var FingerprintStyleTab = require('./Tab/FingerprintStyleTab.jsx');


var FingerprintSettings = React.createClass({

    render: function () {
        return (
            <div className="vote-form-settings">
                <SettingsTabs element={this.props.element}>
                    <FingerprintEditTab attributes={this.props.element.attributes}/>
                </SettingsTabs>
            </div>
        );
    }

});

module.exports = FingerprintSettings;