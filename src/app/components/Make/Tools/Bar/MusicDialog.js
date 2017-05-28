var React = require("react");
var ReactDOM=require("react-dom");
var DialogMixin = require("./DialogMixin");
var DialogAction = require("../../../../actions/DialogActionCreator");
var MakeAction = require("../../../../actions/MakeActionCreators");
var GlobalFunc = require("../../../Common/GlobalFunc");
var musicDefaultImage = require('../../../../../assets/images/make/musicDefault.jpg');
var ItemInit = require("../../../Common/ItemInit");
var _confirmTime = 0;
var timeOut = null;

module.exports = React.createClass({

    mixins: [DialogMixin],

    getInitialState: function () {
        var _state = {
            indexSrc     : null,
            checked      : false,
            loading      : "",
            perPageNum   : 30,
            count        : 0,
            data         : [],
            labels       : [],
            isMultiDelete: false,
            deleteImgIds : []
        };
        switch (this.props.materialType) {
            case 10:
                _state.materialType = "音乐";
                _state.menuName = "我的音乐";
                break;
        }
        return _state;
    },

    queryLabels: function () {
        var _this = this;
        var query = new fmacloud.Query("me_musicstyle");
        query.ascending("style_sorting");
        query.find({
            success : function (results) {
                if (results) {
                    var labels = [];
                    for (var i = 0; i < results.length; i++) {
                        labels.push(results[i].attributes.style_name);
                    }
                    _this.setState({labels: labels});
                } else {
                    GlobalFunc.addSmallTips("标签查询失败,请稍后再试", 2, {clickCancel: true});
                }
            }, error: function (error) {
                console.log("Error: " + error.code + " " + error.message);
                GlobalFunc.addSmallTips("标签查询失败,请稍后再试", 2, {clickCancel: true});
            }
        });
    },

    okBtnClick: function () {
        var obj = {
            tpl_music         : this.state.indexSrc,
            tpl_music_img     : this.state.musicImgUrl,
            tpl_music_name    : this.state.musicName,
            tpl_music_replay  : false,
            tpl_music_autoplay: false
        };
        if (this.props.isSingerMusic) {
            var music = ItemInit.musicInit(obj);
            if(this.props.replace){
                console.log("replace");
                MakeAction.replaceElement({'type':'music','srcInfo':obj});
            }else{
                MakeAction.addElement({'type':'music','obj':music});
            }
        }else {
            MakeAction.updateTpl({"type": "music", obj: obj});    
        }
        

        this.setState({
            indexSrc   : null,
            musicImgUrl: null,
            musicName  : null
        }, function () {
            this._musicPause();
        }.bind(this));

        DialogAction.hide();

    },

    searchMusicClick: function (songid, path, music_img, music_name, e) {
        $(".tr.active").removeClass("active");
        var element = $(e.currentTarget);
        element.addClass("active");
        var _data = {
            indexSrc   : path,
            musicImgUrl: music_img,
            musicName  : music_name,
            checked    : false
        };
        this.setState(_data);
    },

    musicControl: function (src, imgUrl, name, songId, e) {
        if (!!($(".seach-music-line-listen.loading")[0])) {
            GlobalFunc.addSmallTips("正在加载音乐中 请稍候...", 2, {clickCancel: true, delBackGround: true});
            return false;
        }
        var _thisE = $(e.target);
        var _this = this;
        if ("" == src) {
            _thisE.addClass("loading");
            this.confirm_music_link(songId, function (_d) {
                var _result = _d.data;
                var _data = {
                    indexSrc   : _result.link,
                    musicImgUrl: imgUrl,
                    musicName  : _result.title,
                    checked    : false
                };
                _thisE.removeClass("loading");
                _this.setState(_data, function () {
                    //试听音乐
                    if (_thisE.hasClass("pause")) {
                        _this._musicPause(_thisE);
                    } else {
                        _this._musicPlay(_thisE);
                    }
                });
            }, function (_d) {
                console.log(_d);
                _thisE.removeClass("loading");
                GlobalFunc.addSmallTips("音乐获取失败", null, {clickCancel: true});
            });
        } else {
            _this.setState({
                indexSrc   : src,
                musicImgUrl: imgUrl,
                musicName  : name,
                checked    : true
            }, function () {
                //试听音乐
                if (_thisE.hasClass("pause")) {
                    _this._musicPause(_thisE);
                } else {
                    _this._musicPlay(_thisE);
                }
            });
        }

    },

    musicLink: function (path) {
        //console.log(path);
        window.open(path);
    },

    musicClick: function (src, imgUrl, name, songid, e) {
        var _this = $(e.target);
        if (_this[0].nodeName === "SPAN") {
            if (_this[0].className == "delImg") {
                return;
            }
        }
        this.musicControl(src, imgUrl, name, songid, e);
    },

    confirm_music_link: function (songid, cb_ok, cb_err) {
        _confirmTime = 0;
        this.ms_confirm_music_link(songid, cb_ok, cb_err);
    },

    ms_confirm_music_link: function (songid, cb_ok, cb_err) {
        var self = this;
        fmacapi.ms_confirm_music_link(songid, cb_ok,
            function () {
                _confirmTime++;
                if (_confirmTime < 3) {
                    self.ms_confirm_music_link(songid, cb_ok, cb_err);
                } else {
                    if (cb_err) {
                        cb_err();
                    }
                }
            }
        );
    },

    _musicPause: function () {
        var dom = ReactDOM.findDOMNode(this);
        var audio = $(dom).find("#test_audio");
        if (!!audio[0]) {
            audio[0].pause();
        }
        $(".pause").removeClass("pause");
    },

    _musicPlay: function (e) {
        var dom = ReactDOM.findDOMNode(this),
            $dom = $(dom);
        var audio = $dom.find("#test_audio");
        if (!!audio[0]) {
            audio[0].play();
        }
        $(".pause").removeClass("pause");
        e.addClass("pause")
    },

    showSearchMusic: function (event) {
        $(event.target).addClass('active');
    },

    hideSearchMusic: function (event) {
        $(event.target).removeClass('active');
    },

    searchMusic: function (event) {
        $(".tr.active").removeClass("active");
        var value = $.trim(event.target.value), _this = this;
        if ("" == value) {
            _this.setState({
                menuName: "查询",
                data    : [],
                count   : 0
            });
            return;
        }
        function searchEnd() {
            if (arguments.length > 0) {
                _this.setState({
                    menuName: "查询",
                    data    : arguments[0].data,
                    count   : arguments[0].data.length
                })
            } else {
                _this.setState({
                    menuName: "查询",
                    data    : [],
                    count   : 0
                })
            }
        }

        clearTimeout(timeOut);
        timeOut = setTimeout(function () {
            _this.getSearchMusicList(value, searchEnd);
        }, 500);
    },

    getSearchMusicList: function (keyword, cb_ok) {
        fmacapi.ms_search_music(keyword, cb_ok, cb_ok);
    },

    getFooter: function () {
        var _tips;
        if (this.state.menuName.indexOf("我的") == 0) {
            if (this.state.isMultiDelete) {
                let num = this.state.deleteImgIds.length;
                let allNum = this.state.data.length;
                _tips = <span className="select-all"><input className="select" type="checkbox" checked={num==allNum} onChange={this.selectAllDeleteImg}/>全选<span
                    className="count">已选择：{num} 张图片</span></span>
            } else {
                _tips = <span className="tips" onClick={this.enterMultiDelete}>批量删除</span>
            }
        }

        //if (this.props.materialType == 10) {
        //    _tips = "建议格式：mp3　　可同时上传多个音乐";
        //} else {
        //    _tips = "建议格式：JPG, PNG, GIF　　可同时上传多张图片";
        //}
        var okButton = <button className={this.state.checked ? "active" : ""} onClick={this.okBtnClick}>确定</button >;
        var cancelButton = <button className="cancel" onClick={this.closeDialog}>取消</button >;
        if (this.state.isMultiDelete) {
            okButton = <button className={this.state.checked ? "active" : ""} onClick={this.MultiDelete}>删除</button >;
            cancelButton = <button className="cancel" onClick={this.quitMultiDelete}>取消</button >
        }
        return (
            <div className="modal-footer">
                {_tips}
                {cancelButton}
                {okButton}
            </div>
        )
    },

    getBody: function () {
        var _showType = 0;
        switch (this.state.menuName) {
            case "我的音乐":
                _showType = 0;
                break;
            case "查询":
                _showType = 2;
                break;
            default:
                _showType = 1;
                break;
        }

        var images;
        var imgStyle = {height: "130px"},
            liStyle = {height: "144px"},
            addMaterialStyle = {paddingTop: "82px"};

        images = this.state.data.map(function (music, index) {
            var path = null,
                music_img = musicDefaultImage,
                music_name = "不明",
                singer = "不明",
                from = "未知来源";
            var songid;
            switch (_showType) {
                case 0:
                    path = music.attributes.material_src;
                    music_name = music.attributes.material_name;
                    break;
                case 1:
                    path = music.attributes.music_path;
                    music_img = music.attributes.music_bgimage ? music.attributes.music_bgimage + "?imageView2/2/w/130/h/130" : null;
                    music_name = music.attributes.music_name;
                    break;
                case 2:
                    singer = music.singer;
                    path = music.link;
                    music_name = music.title;
                    from = music.from;
                    songid = music.songid;
                    break;
            }

            //查询
            if (_showType != 2) {
                var class_name = (!!this.state.indexSrc) ? (this.state.indexSrc == path) ? "active" : "" : "";
                var img = ( !!music_img && music_img.indexOf("undefined") == -1 )
                    ? (<img src={music_img}/>)
                    : (<img src={musicDefaultImage}/>);

                if (this.state.isMultiDelete) {

                    return (<li key={index} style={liStyle}>
                        <div className={_.indexOf(this.state.deleteImgIds,music.id)>-1? "imgBorder active": "imgBorder"} style={imgStyle}
                             onClick={this.addMultiDeleteImg.bind(this, music.id)}>
                            <div className="imgOver">
                                <div className="imgBox" style={imgStyle}>
                                    {img}
                                    <span className="delete-select"> </span>
                                    <label>{music_name}</label>
                                </div>
                            </div>
                        </div>
                    </li>)

                } else {
                    return (
                        <li key={index} style={liStyle}>
                            <div className={"imgBorder " + class_name} style={imgStyle}
                                 onClick={this.musicClick.bind(this, path, music_img, music_name, "")}>
                                <div className="imgOver" onDoubleClick={this.okBtnClick}>
                                    <div className="imgBox" style={imgStyle}>
                                        <div className="musicCtrl" title="双击添加"></div>
                                        {img}
                                    <span className={this.state.menuName == "我的音乐" ? "delImg": "hide"}
                                          onClick={this.delMaterial.bind(this,music.id)}>
                                    </span>
                                        <label>{music_name}</label>
                                    </div>
                                </div>
                            </div>
                        </li>
                    )
                }
            } else {
                return (
                    <li key={index} className={ (index%2 == 1)?"seach-music-line":"" }>
                        <div className={"tr"}
                             onClick={this.searchMusicClick.bind(this,songid,path,music_img, music_name)}>
                            <span className={"td td0 hover"}>{index + 1}</span>
                            <span className={"td td1 hover"}>{music_name}</span>
                            <span className={"td td2 hover"}>{singer}</span>
                            <span className={"td td3 hover"}>{from}</span>
								<span className={"td td4"}>
									<div title={"试听"}
                                         onClick={this.musicControl.bind(this, path, music_img, music_name, songid)}
                                         className={"seach-music-line-listen"}></div>
									<div title={"来源"} onClick={this.musicLink.bind(this,path)}
                                         className={"seach-music-line-link"}></div>
								</span>
                        </div>
                    </li>
                )
            }
        }.bind(this));

        var _audio = (!!this.state.indexSrc)
            ? (<audio id="test_audio" src={this.state.indexSrc} preload="none"></audio>)
            : false;
        var showBlock;
        switch (_showType) {
            case 0:
                showBlock = <ul>
                    <li style={liStyle}>
                        <div className="imgBorder" style={imgStyle} onClick={this.openFile}>
                            <div className="imgOver">
                                <div className="imgBox" style={imgStyle}>
                                    <div className="addMaterial" style={addMaterialStyle}>添加音乐</div>
                                    <input id="addMaterial" type="file" accept="audio/x-mpeg"
                                           onChange={this.fileChange.bind(this, this.props.materialType, 1)}
                                           multiple/>
                                    {this.state.loading}
                                </div>
                            </div>
                        </div>
                    </li>
                    {images}
                    <div id="loadNewImg"></div>
                </ul>;
                break;
            case 1:
                showBlock = <ul>
                    {images}
                    <div id="loadNewImg"></div>
                </ul>;
                break;
            case 2:
                showBlock = <ul>
                    <li className={"seach-music-line"}>
                        <div className={"tr"}>
                            <span className={"td td0"}></span>
                            <span className={"td td1"}>音乐标题</span>
                            <span className={"td td2"}>歌手</span>
                            <span className={"td td3"}>来源</span>
                            <span className={"td td4"}></span>
                        </div>
                    </li>
                    {images}
                </ul>;
                break;
        }

        return (
            <div className={_showType==2?"modal-body search-music music":"modal-body music"}>
                {_audio}
                {showBlock}
            </div>
        )
    }

});