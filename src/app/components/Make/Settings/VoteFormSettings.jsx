/**
 * @component VoteFormSettings
 * @description 单选、多选元素设置面板
 * @time 2015-09-25 15:20
 * @author Nick
 **/

var React = require('react');
var SettingsTabs = require('./Tab/SettingsTabs');
var VoteFormEditTab = require('./Tab/VoteFormEditTab');


var VoteFormSettings = React.createClass({

    render: function () {
        return (
            <div className="vote-settings">
                <SettingsTabs changeSelectedIndex={this.changeSelectedIndex} element={this.props.element}>
                    <VoteFormEditTab attributes={this.props.element.attributes} isTimelineFrame={this.props.isTimelineFrame}/>
                </SettingsTabs>
            </div>
        );
    }

});

module.exports = VoteFormSettings;