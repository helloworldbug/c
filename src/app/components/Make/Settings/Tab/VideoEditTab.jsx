/**
 * @component VideoEditTab
 * @description 视频设置
 * @time 2015-11-30 15:30
 * @author Nick
 **/

var React = require('react');
import {Link} from "react-router"
var MakeActionCreators = require('../../../../actions/MakeActionCreators');
var DialogAction = require("../../../../actions/DialogActionCreator");
var GlobalFunc = require('../../../Common/GlobalFunc');
var PositionAndSize = require("./SettingComponents/PositionAndSize");
var Range = require("./SettingComponents/Range");
var DisplayStateEdit = require("./DisplayStateEdit");

var VideoEditTab = React.createClass({

    getInitialState: function () {
        return {
            choose: "upload"
        }
    },

    componentDidMount: function () {
        var attributes = this.props.attributes;
        if (attributes['item_href'].indexOf("iframe") > -1) {
            this.setState({choose: "url"})
        }
    },

    componentDidUpdate: function (prevProps) {
        var attributes = this.props.attributes;
        if (this.props.attributes != prevProps.attributes) {
            if (attributes['item_href'].indexOf("iframe") > -1) {
                this.setState({choose: "url"})
            } else {
                this.setState({choose: "upload"})
            }
        }
    },

    render: function () {
        var attributes = this.props.attributes;
        var height = document.body.clientHeight - 54 - 48;
        if (this.props.isTimelineFrame === true) {
            return <div className="setting-container" style={{height:height}}>
                <span className="clearTop"/>
                <PositionAndSize attributes={attributes}/>

            </div>
        }
        var itemHrefContent;
        if (this.state.choose == "upload") {
            itemHrefContent = <div className="replace-image">
                <button onClick={this._uploadClick}>{attributes["item_href"] ? "替换视频文件" : "上传视频文件"}</button>
                <input id="setting-video-uploadFile" type="file" accept="video/mp4" onChange={this._uploadVideo}/>
            </div>
        } else if (this.state.choose == "url") {
            itemHrefContent = <div className="setting-video-edit">
                <textarea placeholder="粘贴通用代码" value={attributes["item_href"]} onChange={this._changeHref}/>
                <Link to="/helper?type=常见问题&index=5" target="_blank">什么是视频通用代码？</Link>
                <span className="codeHelp">支持的视频格式：优酷、土豆、腾讯视频</span>
            </div>
        }
        return (
            <div className="setting-container" style={{height:height}}>
                <span className="clearTop"/>
                <div className="setting-input-text">
                    <h1>元素名称</h1>
                    <input type="text" value={GlobalFunc.htmlDecode(attributes.f_name)} onChange={this._changeName} maxLength="20"/>
                </div>
                <header onClick={this._headerClick.bind(this, "base-style", "setting-base-style")}><span>基础样式</span><b id="base-style"/></header>
                <div id="setting-base-style">
                    <span className="clearTop"/>

                    <PositionAndSize attributes={attributes}/>

                    <Range title="不透明度" parameter="item_opacity" value={attributes["item_opacity"]}
                           defaultValue={0} max={100} min={0} step={1} isNumber={true}/>

                    <Range title="旋转角度" parameter="rotate_angle" value={attributes["rotate_angle"]}
                           defaultValue={0} max={360} min={0} step={1} isNumber={true}/>
                    <div className="replace-image">
                        <button onClick={this._replaceImg}>替换视频封面</button>
                        <input id="setting-video-cover" type="file" accept="image/jpeg,image/jpg,image/png,image/gif"
                               onChange={this._changeCoverImg}/>
                    </div>
                    <div className="name-manage">
                        {!!attributes.video_cover_name ? (<div>
                            <div className="name img fl" title={attributes.video_cover_name}>{attributes.video_cover_name.length > 12 ? attributes.video_cover_name.substring(0, 12) + "..." : attributes.video_cover_name }</div>
                            <div className="del fr" onClick={this.onDelVideoImageHandle}></div>
                        </div>) : null}
                    </div>
                </div>
                <header onClick={this._headerClick.bind(this, "add-style", "setting-video-add")}><span>添加视频</span><b id="add-style"/></header>
                <div id="setting-video-add">
                    <div className="setting-choose">
                    <input id="setting-video-upload" type="radio" checked={this.state.choose == "upload"}
                           onChange={this._changeChoose.bind(this, "upload")}/>
                    <label htmlFor="setting-video-upload">本地视频</label>
                    <input id="setting-video-url" type="radio" checked={this.state.choose == "url"}
                           onChange={this._changeChoose.bind(this, "url")}/>
                    <label htmlFor="setting-video-url">网络视频</label>
                    {itemHrefContent}
                    </div>
                    <div className="name-manage">
                        {!!attributes.video_name ? (<div>
                            <div className="name vod fl" title={attributes.video_name}>{attributes.video_name.length > 12 ? attributes.video_name.substring(0, 12) + "..." : attributes.video_name }</div>
                            <div className="del fr" onClick={this.onDelVideoFileHandle}></div>
                        </div>) : null}

                    </div>
                </div>
            </div>
        );
    },
    _changeName    : function (event) {
        MakeActionCreators.updateElement({f_name: GlobalFunc.htmlDecode(event.target.value)});
    },
    _headerClick: function (buttonID, contentID) {
        $("#" + contentID).slideToggle();
        $("#" + buttonID).toggleClass("hide").toggleClass("show");
    },

    /**
     * 删除视频封面图
    */
    onDelVideoImageHandle: function() {
        MakeActionCreators.updateElement({item_val: 'http://ac-hf3jpeco.clouddn.com/15161d41f98f1ee5.png?imageView2/2/w/640/h/1008', video_cover_name : ''});
    },

    /**
     * 删除视频文件
    */
    onDelVideoFileHandle: function() {
        MakeActionCreators.updateElement({item_href: '', video_name : ''});
    },

    _changeParameter: function (key, event) {
        MakeActionCreators.updateElement({[key]: Math.round(event.target.value)});
    },

    _replaceImg: function () {
        $("#setting-video-cover").trigger("click");
    },

    getFileUrl: function(sourceId) {
        var url;
        if (navigator.userAgent.indexOf("Chrome") > 0) { // Chrome
            url = window.URL.createObjectURL(document.getElementById(sourceId).files.item(0));
        } else {
            alert(' 您使用的浏览器不支持此功能，请使用推荐浏览器：“Chrome、360极速” ');
            return {};
        }
        return {
            url : url,
            name: document.getElementById(sourceId).files.item(0).name,
            obj : document.getElementById(sourceId).files.item(0)
        };
    },

    _changeCoverImg: function (event) {
        var file = event.target.files;
        var url=  window.URL.createObjectURL(file[0]);
        var image = new Image();

        var fileUrl = this.getFileUrl("setting-video-cover");

        if (fileUrl == null) {
            return;
        }

        console.log(fileUrl.name);
        if(GlobalFunc.isGif(fileUrl.name)) {

            var newFile = new fmacloud.File(fileUrl.name, fileUrl.obj);
            newFile.save().then(function (object) {
                var _url = object.get("url");
                MakeActionCreators.updateElement({
                    item_val   : _url, //使用带压缩的地址
                    video_cover_name : file[0].name, //图片名称
                });
            }, function (error) {
                console.log(error);
            });

        } else {
            image.onload = function () {

                var imageWidth = image.width,
                    imageHeight = image.height,
                    clientWidth = document.body.clientWidth,
                    clientHeight = document.body.clientHeight;

                if (imageWidth >= imageHeight && imageWidth >= clientWidth) {
                    imageWidth = clientWidth - 100;
                    imageHeight = imageHeight / ( image.width / imageWidth );
                } else if (imageHeight > imageWidth && imageHeight >= clientHeight) {
                    imageHeight = clientHeight - 100;
                    imageWidth = imageWidth / ( image.height / imageHeight );
                }
                if (imageHeight >= clientHeight) {
                    imageWidth = image.width / ( image.height / (clientHeight - 100) );
                    imageHeight = clientHeight - 100;
                }
                if (imageWidth >= clientWidth) {
                    imageHeight = image.height / ( image.width / (clientWidth - 100) );
                    imageWidth = clientWidth - 100;
                }

                DialogAction.show("crop", null, {src: url,type:"origin",cropScale:"default",ok:function(url){
                    console.log(url);
                    MakeActionCreators.updateElement({
                        item_val   : url, //使用带压缩的地址
                        video_cover_name : file[0].name, //图片名称
                    });
                },imgDim:{width:imageWidth,height:imageHeight,top:(clientHeight-imageHeight)/2,left:(clientWidth-imageWidth)/2}})
            }
            image.src=url;

        }

        //var newFile = new fmacloud.File("videoCover.jpg", file[0]);
        //newFile.save().then(function (object) {
        //    var _url = object.url() + "?imageView2/2/w/640/h/1008";
        //    MakeActionCreators.updateElement({item_val: _url});
        //    //GlobalFunc.addSmallTips("视频封面上传成功", 0, {clickCancel: true, delBackGround: true});
        //}, function (error) {
        //    console.log(error);
        //    GlobalFunc.addSmallTips("视频封面上传失败", 0, {clickCancel: true, delBackGround: true});
        //})
    },

    _uploadClick: function () {
        $("#setting-video-uploadFile").trigger("click");
    },

    _uploadVideo: function (event) {
        var file = event.target.files;
        if (file[0].size >= 20 * 1024 * 1024) {
            GlobalFunc.addSmallTips("上传的视频不能超过20M,大于20M的可先到视频网站上传后添加网络视频", 0, {clickCancel: true, delBackGround: true});
            return;
        }
        if (file[0].type != "video/mp4") {
            GlobalFunc.addSmallTips("暂时只支持mp4格式", 0, {clickCancel: true, delBackGround: true});
            return;
        }
        GlobalFunc.addSmallTips("正在上传本地视频，请稍后...", 0, {cancel: true});
        var newFile = new fmacloud.File("video.mp4", file[0]);
        newFile.save().then(function (object) {
            MakeActionCreators.updateElement({item_href: object.get("url"), video_name: file[0].name});
            GlobalFunc.addSmallTips("视频上传成功", 2, {clickCancel: true, delBackGround: true});
        }, function (error) {
            console.log(error);
            GlobalFunc.addSmallTips("视频上传失败", 0, {clickCancel: true, delBackGround: true});
        })
    },

    _changeChoose: function (value) {
        this.setState({choose: value})
    },

    _changeHref: function (event) {
        var videoSrc = event.target.value;
        MakeActionCreators.updateElement({item_href: videoSrc});
    }

});

module.exports = VideoEditTab;