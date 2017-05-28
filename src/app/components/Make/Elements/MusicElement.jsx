/**
 * @component MusicElement
 * @description 音乐元素
 * @time 2015-09-23 14:50
 * @author Nick
 **/

var React = require('react');
var ReactDOM=require("react-dom");
var ElementStore = require('../../../stores/ElementStore');
var MakeActionCreators = require('../../../actions/MakeActionCreators');

var ImageElement = React.createClass({

    getInitialState: function () {
        return {
            isPlay: false
        }
    },

    componentDidMount: function () {
        this._musicBindEv();
        ReactDOM.findDOMNode(this).oncontextmenu = function () {
            return false;
        }
    },

    render: function () {
        var style = {};
        if (this.props.selectedElementIndex == -1) {
            style.border = "3px solid rgb(26, 188, 156)";
            style.borderRadius = "50%";
        }

        var music_src = this.props.music.tpl_music;

        return (
            <div id="music-wrapper" onClick={this._mouseDown} className={!!music_src?"show":"hide"} style={style}>
                <audio id="music-wrapper-audio" src={music_src}></audio>
                <div className={this.state.isPlay?"fly-note1 note":"fly-note1"}></div>
                <div className={this.state.isPlay?"fly-note2 note":"fly-note2"}></div>
                <section style={{width: "100%",height: "100%"}}>
                    <menu id="music" className=""></menu>
                </section>
                <div id="triggerMusicClick" onClick={this._musicClick}></div>
            </div>
        )
    },

    _mouseDown: function() {
        MakeActionCreators.selectElement(-1);
    },

    _musicClick: function () {
        this.setState({
            isPlay: !this.state.isPlay
        }, function () {
            this._musicInitialState(this.state.isPlay);
        }.bind(this));
    },

    _musicBindEv: function () {
        var _this = this;
        var musicWrapper = $("#music-wrapper"),
            audio = musicWrapper.find("audio"),
            notes = musicWrapper.find("div");
        var eventListener = {

            handleEvent: function (event) {
                switch (event.type) {
                    case "play":
                        this.playFn(event);
                        break;
                    case "pause":
                        this.pauseFn(event);
                        break;
                    case "beforeunload":
                        this.removeFn(event);
                        break;
                    case "ended":
                        this.endedFn(event);
                        break;
                }
            },

            playFn: function () {
                //console.log("play");
                musicWrapper.addClass("spin");
                notes.addClass("note");
            },

            pauseFn: function () {
                //console.log("pause");
                musicWrapper.removeClass("spin");
                notes.removeClass("note");
            },

            endedFn: function () {
                audio[0].currentTime = 0;
                _this.state.isPlay = false;
            },

            removeFn: function () {
                audio[0].removeEventListener("play", this, false);
                audio[0].removeEventListener("pause", this, false);
                audio[0].removeEventListener("ended", this, false);
            }

        };
        if (!!this.props.music && this.props.music !== "" && this.props.music !== undefined) {
            audio[0].addEventListener("play", eventListener, false);
            audio[0].addEventListener("pause", eventListener, false);
            audio[0].addEventListener("ended", eventListener, false);
        }
    },

    _musicInitialState: function (play) {
        var audio = document.getElementById("music-wrapper-audio");
        (!!play) ? audio.play() : audio.pause()
    }

});

module.exports = ImageElement;