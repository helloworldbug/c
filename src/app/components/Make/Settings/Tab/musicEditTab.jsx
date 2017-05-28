/**
 * @component musicEditTab
 * @description 音频编辑设置
 * @time 2016-03-03 10:29
 **/

var React = require('react');
var MakeActionCreators = require('../../../../actions/MakeActionCreators');
var PositionAndSize = require("./SettingComponents/PositionAndSize");
var DisplayStateEdit = require("./DisplayStateEdit")

var musicDefaultImage = require('../../../../../assets/images/make/musicDefault.jpg');
var DialogAction = require("../../../../actions/DialogActionCreator");
var GlobalFunc=require("../../../Common/GlobalFunc")
var audio = null;
function minute(s) {
    return (~~(s / 60) + ":" + ((s % 60) < 10 ? ("0" + (s % 60)) : (s % 60)) );
}


var musicEditTab = React.createClass({

    getInitialState          : function () {
        return {
            isPlay           : false,
            musicDurationTime: "",
            musicCurrentTime : "0:00",
            progress         : 0
        }
    },
    /**
     * 播放时更新当前播放时间和进度条
     * @private
     */
    _timeupdate              : function () {

        var scale = (audio.currentTime / audio.duration) * 100;
        var t = Math.round(audio.currentTime);
        this.setState({musicCurrentTime: minute(t), progress: scale})
    },
    /**
     * 重置为初始状态
     * @param nextProps
     */
    componentWillReceiveProps: function (nextProps) {

        if(nextProps.attributes.item_id!=this.props.attributes.item_id){
            //加载另一个音乐的属性时更新状态
            this.setState({
                isPlay           : false,
                musicDurationTime: "",
                musicCurrentTime : "0:00",
                progress         : 0
            })
        }


    },
    _addEventListener:function(){
        var _this = this;
        audio = document.getElementById(this.props.attributes.item_id);
        audio.onloadedmetadata = function () {
            var _t = Math.round(audio.duration);
            _this.setState({musicDurationTime: minute(_t)})
        }
        audio.ontimeupdate = this._timeupdate;
    },
    componentDidUpdate       : function (prevProps) {
        if(prevProps.attributes.item_id!=this.props.attributes.item_id){
            //加载另一个音乐的属性时更新事件绑定
            this._addEventListener();
        }
    },
    componentDidMount        : function () {
        this._addEventListener();

    },
    _changeName              : function (event) {
        MakeActionCreators.updateElement({f_name: GlobalFunc.htmlEncode(event.target.value)});
    },

    render        : function () {
        var attributes = this.props.attributes;
        if (this.props.isTimelineFrame === true) {
            return <div className="setting-container music-settings">
                <span className="clearTop"/>
                <PositionAndSize attributes={attributes} hideChangeSize={true}/>
            </div>
        }
        return (
            <div className="setting-container music-settings">
                <span className="clearTop"/>
                <div className="setting-input-text">
                    <h1>元素名称</h1>
                    <input type="text" value={GlobalFunc.htmlDecode(attributes.f_name)} onChange={this._changeName} maxLength="20"/>
                </div>
                <PositionAndSize attributes={attributes} hideChangeSize={true}/>
                <DisplayStateEdit attributes={attributes}/>
                <div className="setting-music-img"
                     style={{backgroundImage:"url("+(attributes.music_img||musicDefaultImage)+")"}}>
                    <div className="setting-music-title">{attributes.music_name || "作品的默认音乐"}</div>
                    <div className="setting-music-time">
                        <span className="setting-music-progress-currentTime">{this.state.musicCurrentTime}</span>
                        <span className="setting-music-progress-durationTime">{this.state.musicDurationTime}</span>
                    </div>
                    <div className={this.state.isPlay?"setting-music-img-mask play":"setting-music-img-mask"}
                         onClick={this._funMusicClick}>
                    </div>
                </div>
                <ul className="setting-music-progress">
                    <li className="setting-music-progress-li" style={{width:this.state.progress + "%"}}/>
                </ul>
                <audio id={attributes.item_id} src={attributes.item_val}></audio>
                <ul id="setting-music-menu">
                    <li onClick={this._rePlace}>
                        <span className="replace">替换音乐</span>
                    </li>
                    <li onClick={this._delete}>
                        <span className="delete">删除音乐
                    </span></li>
                </ul>
            </div>
        )
    },
    _funMusicClick: function () {
        this.state.isPlay == false ? audio.play() : audio.pause();

        this.setState({
            isPlay: !this.state.isPlay
        });
    },

    _rePlace: function () {
        DialogAction.show("music", "", {materialType: 10, isSingerMusic: true, replace: true});
    },

    _delete: function () {
        MakeActionCreators.removeElement();
    },
});

module.exports = musicEditTab;