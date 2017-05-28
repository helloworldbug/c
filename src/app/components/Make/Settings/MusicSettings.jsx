/**
 * @component MusicSettings
 * @description 音乐元素设置面板
 * @time 2015-09-23 16:06
 * @author Nick
 **/

var React = require('react');
var MakeActionCreators = require('../../../actions/MakeActionCreators');
var ElementStore = require('../../../stores/ElementStore');
var DialogActionCreator = require('../../../actions/DialogActionCreator');
var GlobalFunc = require('../../Common/GlobalFunc');
var ColorPicker = require('../../Common/ColorPicker');
var Range = require('../../Common/Range');
var musicDefaultImage = require('../../../../assets/images/make/musicDefault.jpg');
var moreColorImage = require('../../../../assets/images/make/moreColor.png');
var delColorImage = require('../../../../assets/images/make/delColor.png');

var musicWrapper = null,
    audio = null,
    notes = null,
    progressLi = null,
    progressCircle = null,
    musicMask = null,
    musicCurrentTime = null,
    musicDurationTime = null,
    moveAble = false;

function init() {
    musicWrapper = $("#music-wrapper");
    audio = musicWrapper.find("audio");
    notes = musicWrapper.find("div");
    progressLi = $(".setting-music-progress-li");
    progressCircle = $(".setting-music-progress-circle");
    musicMask = $(".setting-music-img-mask");
    musicCurrentTime = $(".setting-music-progress-currentTime");
    musicDurationTime = $(".setting-music-progress-durationTime");

    var _t = Math.round(audio[0].duration);
    musicDurationTime.html(minute(_t));
}

function minute(s) {
    return (~~(s / 60) + ":" + ((s % 60) < 10 ? ("0" + (s % 60)) : (s % 60)) );
}
var eventListener = {

    handleEvent: function (event) {
        switch (event.type) {
            case "timeupdate":
                this.timeupdate(event);
                break;
            case "play":
                this.playFn(event);
                break;
            case "pause":
                this.pauseFn(event);
                break;
        }
    },

    playFn: function () {
        var t = Math.round(audio[0].duration);
        musicMask.addClass("play");
        musicDurationTime.html(minute(t));
    },

    pauseFn: function () {
        musicMask.removeClass("play");
    },

    timeupdate: function () {
        var scale = (audio[0].currentTime / audio[0].duration) * 100;
        progressLi.css({"width": scale + "%"});
        progressCircle.css({"left": scale + "%"});

        var t = Math.round(audio[0].currentTime);
        musicCurrentTime.html(minute(t));
    }

};
var MusicSettings = React.createClass({

    getInitialState: function () {
        var music = this.props.music;
        return {
            lrcObj: this.lrcObjToJSON(music.tpl_music_lrc)
        };
    },

    lrcObjToJSON: function (str) {
        if (!!str) {
            var lrcObj = GlobalFunc.toJson(str);
            return {
                url          : lrcObj.url || "http://",
                color        : lrcObj.color || "",
                singing_color: lrcObj.singing_color || "",
                font_size    : lrcObj.font_size || "24px",
                show_type    : lrcObj.show_type || "bottom",
                pos          : lrcObj.pos || [32, 800],
                frame_size   : lrcObj.frame_size || [576, 176]
            };
        } else {
            return {
                url          : "http://",
                color        : "",
                singing_color: "",
                font_size    : "24px",
                show_type    : "bottom",
                pos          : [32, 800],
                frame_size   : [576, 176]
            };
        }
    },

    componentDidMount: function () {
        init();
        this._addMusicListener();
    },

    componentWillUnmount: function () {
        this._removeMusicListener();
    },

    render: function () {
        var music = this.props.music,
            lrcObj = this.lrcObjToJSON(music.tpl_music_lrc);

        var lrcContainer;

        if (music.tpl_lrc_on === 1) {
            lrcContainer = <div>
                <header onClick={this._headerClick}><span>歌词显示设置</span><b id="typeStyle"/></header>
                <div id="setting-music-lrc">
                    <span className="clearTop"/>
                    <div className="setting-number">
                        <h1>显示范围</h1>

                        <div>
                            <span>W</span>
                            <input type="text" value={this.state.lrcObj.frame_size[0]}
                                   onBlur={this._changeValue} onKeyDown={this._keyDown} onChange={this._changeDim.bind(this, 0)}/>
                        </div>
                        <div className="fr right">
                            <span>H</span>
                            <input type="text" value={this.state.lrcObj.frame_size[1]}
                                   onBlur={this._changeValue} onKeyDown={this._keyDown} onChange={this._changeDim.bind(this, 1)}/>
                        </div>
                    </div>
                    <div className="setting-number">
                        <h1>显示位置</h1>

                        <div>
                            <span>X</span>
                            <input type="text" value={this.state.lrcObj.pos[0]}
                                   onBlur={this._changeValue} onKeyDown={this._keyDown} onChange={this._changePos.bind(this, 0)}/>
                        </div>
                        <div className="fr right">
                            <span>Y</span>
                            <input type="text" value={this.state.lrcObj.pos[1]}
                                   onBlur={this._changeValue} onKeyDown={this._keyDown} onChange={this._changePos.bind(this, 1)}/>
                        </div>
                    </div>
                    <div className="setting-input-text">
                        <h1>歌词地址</h1>
                        <input type="text" value={lrcObj.url} onChange={this._changeValue.bind(this, "url")}/>
                    </div>
                    <div className="setting-color">
                        <h1>歌词颜色</h1>
                        <ul>
                            <li className={lrcObj.color == "" ? "colorState" : ""} style={{background: "url(" + delColorImage + ")"}}
                                onClick={this._changeValue.bind(this, "color", "")}/>
                            <li className={lrcObj.color == "rgb(255,255,255)" ? "colorState" : ""} style={{backgroundColor: "rgb(255,255,255)"}}
                                onClick={this._changeValue.bind(this, "color", "rgb(255,255,255)")}/>
                            <li className={lrcObj.color == "rgb(255,0,0)" ? "colorState" : ""} style={{backgroundColor: "rgb(255,0,0)"}}
                                onClick={this._changeValue.bind(this, "color", "rgb(255,0,0)")}/>
                            <li className={lrcObj.color == "rgb(255,102,0)" ? "colorState" : ""} style={{backgroundColor: "rgb(255,102,0)"}}
                                onClick={this._changeValue.bind(this, "color", "rgb(255,102,0)")}/>
                            <li className={lrcObj.color == "rgb(255,255,0)" ? "colorState" : ""} style={{backgroundColor: "rgb(255,255,0)"}}
                                onClick={this._changeValue.bind(this, "color", "rgb(255,255,0)")}/>
                            <li className={lrcObj.color == "rgb(102,204,0)" ? "colorState" : ""} style={{backgroundColor: "rgb(102,204,0)"}}
                                onClick={this._changeValue.bind(this, "color", "rgb(102,204,0)")}/>
                            <li className={lrcObj.color == "rgb(0,0,0)" ? "colorState" : ""} style={{backgroundColor: "rgb(0,0,0)"}}
                                onClick={this._changeValue.bind(this, "color", "rgb(0,0,0)")}/>
                            <li className={lrcObj.color == "more" ? "colorState" : ""} style={{background:"url(" + moreColorImage + ")"}}>
                                <ColorPicker changeParameter={this._changeValue.bind(this, "color")}/></li>
                        </ul>
                    </div>
                    <div className="setting-color">
                        <h1>播放颜色</h1>
                        <ul>
                            <li className={lrcObj.singing_color == "" ? "colorState" : ""} style={{background: "url(" + delColorImage + ")"}}
                                onClick={this._changeValue.bind(this, "singing_color", "")}/>
                            <li className={lrcObj.singing_color == "rgb(255,255,255)" ? "colorState" : ""}
                                style={{backgroundColor: "rgb(255,255,255)"}}
                                onClick={this._changeValue.bind(this, "singing_color", "rgb(255,255,255)")}/>
                            <li className={lrcObj.singing_color == "rgb(255,0,0)" ? "colorState" : ""} style={{backgroundColor: "rgb(255,0,0)"}}
                                onClick={this._changeValue.bind(this, "singing_color", "rgb(255,0,0)")}/>
                            <li className={lrcObj.singing_color == "rgb(255,102,0)" ? "colorState" : ""}
                                style={{backgroundColor: "rgb(255,102,0)"}}
                                onClick={this._changeValue.bind(this, "singing_color", "rgb(255,102,0)")}/>
                            <li className={lrcObj.singing_color == "rgb(255,255,0)" ? "colorState" : ""}
                                style={{backgroundColor: "rgb(255,255,0)"}}
                                onClick={this._changeValue.bind(this, "singing_color", "rgb(255,255,0)")}/>
                            <li className={lrcObj.singing_color == "rgb(102,204,0)" ? "colorState" : ""}
                                style={{backgroundColor: "rgb(102,204,0)"}}
                                onClick={this._changeValue.bind(this, "singing_color", "rgb(102,204,0)")}/>
                            <li className={lrcObj.singing_color == "rgb(0,0,0)" ? "colorState" : ""} style={{backgroundColor: "rgb(0,0,0)"}}
                                onClick={this._changeValue.bind(this, "singing_color", "rgb(0,0,0)")}/>
                            <li className={lrcObj.singing_color == "more" ? "colorState" : ""} style={{background:"url(" + moreColorImage + ")"}}>
                                <ColorPicker changeParameter={this._changeValue.bind(this, "singing_color")}/></li>
                        </ul>
                    </div>
                    <div className="setting-range">
                        <h1>歌词字号</h1>
                        <Range max={200} min={12} width={130} step={1} change={this._changeValue.bind(this, "font_size")}
                               value={lrcObj.font_size.slice(0, -2)}/>
                        <input type="number" className="range-number" step={1} max={200} min={12}
                               value={this.state.lrcObj.font_size.slice(0, -2)}
                               onBlur={this._changeValue} onKeyDown={this._keyDown} onChange={this._changeValueState.bind(this, "font_size")}/>
                    </div>
                </div>
            </div>
        }

        var height = document.body.clientHeight - 54 - 40;

        return (
            <div className="setting-container music-settings" style={{height:height}}>
                <div className="setting-title-blank">背景音乐</div>
                <div className="setting-music-img" style={{backgroundImage:"url("+(music.tpl_music_img||musicDefaultImage)+")"}}>
                    <div className="setting-music-title">{music.tpl_music_name || "作品的默认音乐"}</div>
                    <div className="setting-music-time">
                        <span className="setting-music-progress-currentTime">0:00</span>
                        <span className="setting-music-progress-durationTime"/>
                    </div>
                    <div className="setting-music-img-mask" onClick={this._funMusicClick}></div>
                </div>
                <ul className="setting-music-progress">
                    <li className="setting-music-progress-li"/>
                </ul>
                <ul id="setting-music-menu">
                    <li onClick={this._rePlace}>
                        <span className="replace">替换音乐</span>
                    </li>
                    <li onClick={this._delete}>
                        <span className="delete">删除音乐</span>
                    </li>
                </ul>
                <span className="clearTop"/>
                {/*<div className="setting-select">
                    <h1>歌词显示</h1>
                    <select value={music.tpl_lrc_on} onChange={this._changeParameter.bind(this, "tpl_lrc_on")}>
                        <option value="0">关</option>
                        <option value="1">开</option>
                    </select>
                </div>*/}

                {lrcContainer}

            </div>
        );
    },

    _funMusicClick: function () {
        $("#triggerMusicClick").trigger("click");
    },

    _rePlace: function () {
        DialogActionCreator.show("music", "", {materialType: 10});
        //$("#tool-media").trigger("click");
    },

    _delete: function () {
        function deleteMusic() {
            var _music = {tpl_music: ""};
            MakeActionCreators.updateTpl({type: "music", obj: _music})
        }

        DialogActionCreator.show("tips", "", {contentText: "确定删除音乐？", onConfirm: deleteMusic});
        //_showDialog(<TipsDialog isShow={true} type="deleteMusic" contentText="确定删除音乐？"/>);
    },

    _addMusicListener: function () {
        audio[0].addEventListener("timeupdate", eventListener, false);
        audio[0].addEventListener("play", eventListener, false);
        audio[0].addEventListener("pause", eventListener, false);
    },

    _removeMusicListener: function () {
        audio[0].removeEventListener("timeupdate", eventListener, false);
        audio[0].removeEventListener("play", eventListener, false);
        audio[0].removeEventListener("pause", eventListener, false);
    },

    _headerClick: function () {
        $("#setting-music-lrc").slideToggle();
        $("#typeStyle").toggleClass("hide").toggleClass("show");
    },

    _changeParameter: function (parameter, value) {
        if (!!value.target) value = value.target.value;

        var musicObj = this.props.music;
        switch (parameter) {
            case "tpl_lrc_on":
                value = parseInt(value);
                if (value == 1) {
                    var lrcObj = this.lrcObjToJSON(musicObj.tpl_music_lrc);
                    musicObj.tpl_music_lrc = JSON.stringify(lrcObj);
                } else {
                    musicObj.tpl_music_lrc = '';
                }
        }
        musicObj[parameter] = value;
        MakeActionCreators.updateTpl({type: "music", obj: musicObj})
    },

    _changeDim: function (key, event) {
        var value = parseInt(event.target.value);
        var lrcObj = this.state.lrcObj;
        lrcObj.frame_size[key] = value;
        this._changeValueState("frame_size", lrcObj.frame_size);
    },

    _changePos: function (key, event) {
        var value = parseInt(event.target.value);
        var lrcObj = this.state.lrcObj;
        lrcObj.pos[key] = value;
        this._changeValueState("pos", lrcObj.pos);
    },

    _changeValueState: function (parameter, value) {
        if (!!value.target) value = value.target.value;
        if (parameter == "font_size") value = value + "px";
        var lrcObj = this.state.lrcObj;
        lrcObj[parameter] = value;
        this.setState({
            lrcObj: lrcObj
        })
    },

    _changeValue: function (parameter, value) {
        var lrcObj = this.state.lrcObj;
        if (typeof parameter == "string") {
            if (value.target) value = value.target.value;
            if (parameter == "font_size") {
                value = value + "px";
            }
            lrcObj[parameter] = value;
        } else {
            console.log("enter");
            var fontSize = parseInt(lrcObj.font_size.slice(0, -2));
            if (!fontSize) {
                fontSize = 12;
                this._changeValueState("font_size", fontSize)
            } else if (fontSize < 12) {
                fontSize = 12;
                this._changeValueState("font_size", fontSize)
            } else if (fontSize > 200) {
                fontSize = 200;
                this._changeValueState("font_size", fontSize)
            } else {
                fontSize = fontSize + "px";
            }
            lrcObj.fontSize = fontSize;
            console.log("fontSize", fontSize);
        }
        this._changeParameter("tpl_music_lrc", JSON.stringify(lrcObj));
    },

    _keyDown: function (event) {
        var keyCode = event.which;
        if (keyCode == 13) this._changeValue();
    }

});

module.exports = MusicSettings;