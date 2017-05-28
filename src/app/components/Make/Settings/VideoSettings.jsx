/**
 * @component VideoSettings
 * @description 视频元素设置面板
 * @time 2015-09-06 17:12
 * @author Nick
 **/

var React = require('react');
var MakeActionCreators = require('../../../actions/MakeActionCreators');
var ElementStore = require('../../../stores/ElementStore');
var SettingsTabs = require('./Tab/SettingsTabs');
var VideoEditTab = require('./Tab/VideoEditTab');
var VideoStyleTab = require('./Tab/VideoStyleTab');

var VideoSettings = React.createClass({

    getInitialState: function () {
        return {
            currentMenu: "edit"
        }
    },

    render: function () {
        var attributes = ElementStore.getSelectedElement()[0].attributes;
        return (
            <div className="video-settings">
                {/*<div className="setting-title-blank">视频</div>
                 <div className="setting-video-edit">
                 <h1>视频通用代码</h1>
                 <textarea placeholder="粘贴通用代码" value={attributes["item_href"]} onChange={this._changeHref}/>
                 <a href="#/helper?type=常见问题" target="_blank">什么是视频通用代码？</a>
                 <span className="codeHelp">支持的视频格式：优酷、土豆、腾讯视频</span>
                 </div>*/}
                <SettingsTabs element={this.props.element}>
                    <VideoEditTab attributes={this.props.element.attributes} isTimelineFrame={this.props.isTimelineFrame}/>
                </SettingsTabs>
            </div>
        );
    },

    _changeHref: function (event) {
        var videoSrc = event.target.value;
        MakeActionCreators.updateElement({item_href: videoSrc});
    }

});

module.exports = VideoSettings;