/**
 * @component ArSettings
 * @description AR元素设置面板
 * @time 2016-06-06 18:22
 * @author Yangjian
 **/

var React = require('react');
var SettingsTabs = require('./Tab/SettingsTabs');
var ArEditTab = require('./Tab/ArEditTab');


var ArSettings = React.createClass({

    render: function () {
        return (
            <div className="vote-form-settings">
                <SettingsTabs element={this.props.element}>
                    <ArEditTab attributes={this.props.element.attributes} isTimelineFrame={this.props.isTimelineFrame}/>
                </SettingsTabs>
            </div>
        );
    }

});

module.exports = ArSettings;