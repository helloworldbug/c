/**
 * @component 图片裁切
 * @description 图片裁切
 * @time 2015-09-25 01:40
 * @author Nick
 **/
var React = require("react");
var ReactDOM=require("react-dom");
var Jcrop = require("jcrop");
var DialogAction = require("../../../../actions/DialogActionCreator");
var MakeActionCreators = require("../../../../actions/MakeActionCreators");
var ElementStore = require("../../../../stores/ElementStore");
var GlobalFunc = require("../../../Common/GlobalFunc");
var ActionButton = require('../Button/ActionButton');
var $ = require("jquery");
var userObj, attributes, offset, jCropApi;
var boxStyle = {}, imgStyle = {}, cropImgSize = {};
var ShortCut = require("../../shortcut/ShortCut.js");

module.exports = React.createClass({

    getInitialState: function () {
        return {
            cropScale: "free",
            showMenu : false
        }
    },

    componentWillMount: function () {
        var deviceScale = GlobalFunc.getDeviceScale();
        userObj = GlobalFunc.getUserObj();
        attributes = ElementStore.getSelectedElement()[0].attributes;
        offset = $("#device-content").offset();
        var elements = ElementStore.getElements(), itemLeft = attributes['item_left'], itemTop = attributes['item_top'],
            itemWidth = attributes['item_width'], itemHeight = attributes['item_height'];
        if (!!attributes['group_id']) {
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].get("group_id") == attributes['group_id'] && elements[i].get("item_type") == 17) {
                    itemLeft = itemLeft + elements[i].get("item_left");
                    itemTop = itemTop + elements[i].get("item_top");
                }
            }
        }

        imgStyle.width = itemWidth * deviceScale;
        imgStyle.height = itemHeight * deviceScale;
        if (this.props.cropScale) {
            this.setState({
                cropScale: this.props.cropScale
            });
        }
        if (!!this.props.replace) {
            this.setState({
                cropScale: "default"
            });
            var imgObj = GlobalFunc.getImgWidth(this.props.img);
            var widthScale = imgObj.width / itemWidth, heightScale = imgObj.height / itemHeight;

            if (widthScale < heightScale) {
                boxStyle.width = imgObj.width / widthScale * deviceScale;
                boxStyle.height = imgObj.height / widthScale * deviceScale;
                boxStyle.left = itemLeft * deviceScale + offset.left;
                boxStyle.top = (itemTop - (imgObj.height / widthScale - itemHeight) / 2) * deviceScale + offset.top;
            } else if (widthScale > heightScale) {
                boxStyle.width = imgObj.width / heightScale * deviceScale;
                boxStyle.height = imgObj.height / heightScale * deviceScale;
                boxStyle.left = (itemLeft - (imgObj.width / heightScale - itemWidth) / 2) * deviceScale + offset.left;
                boxStyle.top = itemTop * deviceScale + offset.top;
            } else {
                boxStyle.width = itemWidth * deviceScale;
                boxStyle.height = itemHeight * deviceScale;
                boxStyle.left = itemLeft * deviceScale + offset.left;
                boxStyle.top = itemTop * deviceScale + offset.top;
            }

        } else if (this.props.imgDim) {
            var imgDim = this.props.imgDim;
            boxStyle.width = imgDim.width;
            boxStyle.height = imgDim.height;
            boxStyle.left = imgDim.left;
            boxStyle.top = imgDim.top;
            //imgStyle=imgDim
        } else {
            boxStyle.width = itemWidth * deviceScale;
            boxStyle.height = itemHeight * deviceScale;
            boxStyle.left = itemLeft * deviceScale + offset.left;
            //boxStyle.left = itemLeft  + offset.left;
            var top = itemTop * deviceScale + offset.top;
            boxStyle.top = (top <= 0) ? 0 : top;
        }
        boxStyle.position = "absolute";
    },
    render            : function () {
        var popMenu;
        var menuStyle = {}
        if (this.state.showMenu) {
            menuStyle.display = "block";
        }else{
            menuStyle.display = "none";
        }

        if(this.state.menuPosition){
            menuStyle.top = this.state.menuPosition.top;
            menuStyle.left = this.state.menuPosition.left;
        }

        popMenu = <ul ref="menuContent" className="menuContent pop-menu crop-menu" style={menuStyle}>
            <li className={(this.state.cropScale =="free" ? "active" : "") + " menu-free item"} onClick={this._changeCropScale.bind(this, "free")}>自由裁切</li>
            <li className="menu-line" />
            <li className={(this.state.cropScale =="1:1" ? "active" : "") + " item"} onClick={this._changeCropScale.bind(this, "1:1")}>1：1</li>
            <li className={(this.state.cropScale =="2:1" ? "active" : "") + " item"} onClick={this._changeCropScale.bind(this, "2:1")}>2：1</li>
            <li className={(this.state.cropScale =="4:3" ? "active" : "") + " item"} onClick={this._changeCropScale.bind(this, "4:3")}>4：3</li>
            <li className={(this.state.cropScale =="9:16" ? "active" : "") + " item"} onClick={this._changeCropScale.bind(this, "9:16")}>9：16</li>
            <li className={(this.state.cropScale =="16:9" ? "active" : "") + " item"} onClick={this._changeCropScale.bind(this, "16:9")}>16：9</li>
            <li className={(this.state.cropScale =="default" ? "active" : "") + " menu-default item"} onClick={this._changeCropScale.bind(this, "default")}>原图比例</li>
            <li className="menu-line" />
            <li className="menu-close item" onClick={this._cropCancel} />
            <li className="menu-confirm item" onClick={this._cropConfirm}>裁切</li>
        </ul>;

        return (
            <div id="crop-dialog">
                <div ref="cropContent" style={boxStyle} onDoubleClick={this._cropConfirm}>
                    <img id="cropImg" width={ boxStyle.width } height={ boxStyle.height }
                         src={ this.props.src || attributes.item_val }/>
                </div>
                {popMenu}
            </div>
        )

    },

    getMenuPos : function(c){
        var maxWidth = document.body.clientWidth, maxHeight = document.body.clientHeight;
        var picDom = ReactDOM.findDOMNode(this.refs.cropContent);
        var picSize = {};
        if(!c){
            picSize.x = picDom.offsetLeft;
            picSize.y = picDom.offsetTop;
            picSize.w = picDom.offsetWidth;
            picSize.h = picDom.offsetHeight;
        }else{
            picSize.x = picDom.offsetLeft + c.x;
            picSize.y = picDom.offsetTop + c.y;
            picSize.w = c.w;
            picSize.h = c.h;
        }

        var menuDom = $(".menuContent");
        var posX, posY, gap = 5;

        if(picSize.x + picSize.w > maxWidth){
            posX = maxWidth - menuDom.outerWidth() - gap;
        }else{
            posX = picSize.x + picSize.w - menuDom.outerWidth() - gap;
        }
        if(posX < 0) posX = gap;

        if(picSize.y + picSize.h + menuDom.outerHeight() > maxHeight){
            posY = picSize.y - menuDom.outerHeight() - gap >= 0 ? picSize.y - menuDom.outerHeight() - gap : picSize.y + gap;
        }else{
            posY = picSize.y + picSize.h + gap;
        }
        return {left : posX+"px", top : posY+"px"}
    },

    componentDidMount: function () {
        var _this = this;
        ShortCut.unInit();
        this._cropStart();
        document.addEventListener('keydown', this._keyDown);
        var dom = ReactDOM.findDOMNode(this.refs.cropContent);
        dom.oncontextmenu = function (event) {
            event.preventDefault();

            var p = _this.getMenuPos();
            _this.setState({
                showMenu    : true,
                menuPosition: {
                    top : p.top,
                    left: p.left
                }
            })
        };

        document.addEventListener("click", this._hideMenu);

        if (!GlobalFunc.getUserExtra("hideCropTips")) {
            GlobalFunc.addSmallTips("双击完成裁切", null, {
                confirm   : true, margin: "0 0 0 -60px",
                cb_confirm: function () {
                    GlobalFunc.setUserExtra("hideCropTips");
                }
            })
        }

    },

    componentWillUnmount: function () {
        ShortCut.init();
        document.removeEventListener('keydown', this._keyDown);
        document.removeEventListener("click", this._hideMenu);
    },

    _hideMenu: function () {
        // this.setState({
        //     showMenu: false
        // })
    },

    _keyDown: function (event) {
        if (event.keyCode == 27) {
            this._cropCancel();
        } else if (event.keyCode == 13) {
            this._cropConfirm();
        }
    },

    _cropCancel: function () {
        DialogAction.hide();
    },

    _cropStart: function () {
        var _this = this;
        var $cropCtrlBar = $("#crop-dialog").find(".cropCtrlBar");
        var cropChange = function (c) {
            $cropCtrlBar.hide();
            cropImgSize.x = c.x;
            cropImgSize.x2 = c.x2;
            cropImgSize.y = c.y;
            cropImgSize.y2 = c.y2;
            cropImgSize.w = c.w;
            cropImgSize.h = c.h;

            var p = _this.getMenuPos(c);
            _this.setState({
                showMenu : true,
                menuPosition: {
                    top : p.top,
                    left: p.left
                }
            })
        };
        var cropSelect = function (c) {
            if (!!jCropApi) {
                $cropCtrlBar.show();
                $cropCtrlBar.css({
                    left: c.x2 - 140,
                    top : c.y2 + 2
                });
            }

            var p = _this.getMenuPos(c);
            _this.setState({
                showMenu : true,
                menuPosition: {
                    top : p.top,
                    left: p.left
                }
            })
        };
        $('#cropImg').Jcrop({
                onChange   : cropChange,
                onSelect   : cropSelect,
                bgColor    : null,
                aspectRatio: _this.state.cropScale == "default" ? imgStyle.width / imgStyle.height : 0,
                keySupport : false
            },
            function () {
                jCropApi = this;
                var _width = imgStyle.width, _height = imgStyle.height, _left = 0, _top = 0;
                if (!!_this.props.replace || !!_this.props.imgDim) {
                    if (boxStyle.width > _width) {
                        _left = _left + (boxStyle.width - _width) / 2;
                    }
                    if (boxStyle.height > _height) {
                        _top = _top + (boxStyle.height - _height) / 2;
                    }
                }
                jCropApi.setSelect([_left, _top, _left + _width, _top + _height]);
            }
        )
    },

    _cropConfirm: function () {
        if (!userObj) {
            GlobalFunc.addSmallTips("无法裁切, 请先登陆!", 2, {clickCancel: true});
        } else {
            $(".jcrop-holder > div:first-child").append("<div class='saveLoading'><span>裁切中...</span></div>");
            var $cropDialog = $("#crop-dialog"),
                $cropCtrlBar = $cropDialog.find(".cropCtrlBar"),
                $cropRatioBar = $cropDialog.find(".cropRatioBar");
            $cropCtrlBar.hide();
            $cropRatioBar.hide();
            jCropApi.disable();

            var _this = this, materialType;
            switch (attributes['item_type']) {//materialType,元素类型（1.贴纸，2.边框，3.形状，4.背景，5.图片）
                case 1:
                    materialType = 5;
                    break;
                case 3:
                    if (attributes['frame_style'] == 1) {
                        materialType = 1;
                    } else if (attributes['frame_style'] == 3) {
                        materialType = 3;
                    }
                    break;
                case 10:
                    materialType = 2;
                    break;
                case 18:
                    materialType = 5;
                    break;
                default:
                    // console.log(attributes['item_type']);
                    break;
            }
            var deviceScale = GlobalFunc.getDeviceScale(),
                width = cropImgSize.w / deviceScale,
                height = cropImgSize.h / deviceScale,
                left = cropImgSize.x / deviceScale,
                top = cropImgSize.y / deviceScale,
                canvas = $('<canvas width=' + width + ' height=' + height + '></canvas>')[0],
                ctx = canvas.getContext('2d'),
                image = new Image(),
                base64;
            image.crossOrigin = "Anonymous";

            image.onload = function () {
                if (_this.props.type == "origin") {
                    var ratio = image.width / _this.props.imgDim.width;
                    canvas.width = cropImgSize.w * ratio;
                    canvas.height = cropImgSize.h * ratio;
                    ctx.drawImage(image,
                        cropImgSize.x * ratio, cropImgSize.y * ratio,//开始剪切的坐标位置
                        cropImgSize.w * ratio, cropImgSize.h * ratio,//原始图像的宽高
                        0, 0,//在画布上图像开始的坐标位置。
                        cropImgSize.w * ratio, cropImgSize.h * ratio);//要使用的图像的宽高
                } else {
                    var itemWidth = attributes['item_width'] * attributes['x_scale'],
                        itemHeight = attributes['item_height'] * attributes['y_scale'];
                    if (_this.props.replace) {
                        itemWidth = boxStyle.width / deviceScale;
                        itemHeight = boxStyle.height / deviceScale;
                    }
                    left = left / (itemWidth / image.width);
                    top = top / (itemHeight / image.height);
                    if(image.src.indexOf(".gif")>-1){
                        ///gif裁切

                        var cropRatio=image.width/boxStyle.width;
                        var gifUrl=`${image.src}?imageMogr2/crop/!${Math.round(cropImgSize.w*cropRatio)}x${Math.round(cropImgSize.h*cropRatio)}a${Math.round(cropImgSize.x*cropRatio)}a${Math.round(cropImgSize.y*cropRatio)}`;
                        let left = (boxStyle.left - offset.left + cropImgSize.x) / deviceScale;
                        let top = attributes['item_top'] + ( cropImgSize.y) / deviceScale;
                        if (attributes['item_type'] == 1 && !!attributes['group_id']) {
                            var picFramePos = GlobalFunc.getPicFramePosByObjArr(attributes);
                            if (!!picFramePos) {
                                // console.log("pck", picFramePos)
                                left -= picFramePos.left;
                                top -= picFramePos.top
                            }

                        }
                        MakeActionCreators.updateElement({
                            item_val   :gifUrl,
                            item_width : width,
                            item_height: height,
                            item_left  : left,
                            item_top   : top
                        });
                        _this._cropCancel();
                        return;
                    }
                    ctx.drawImage(image,
                        left, top,//开始剪切的坐标位置
                        image.width, image.height,//原始图像的宽高
                        0, 0,//在画布上图像开始的坐标位置。
                        itemWidth, itemHeight);//要使用的图像的宽高
                }


                base64 = canvas.toDataURL();

                var errorCallBack = function () {
                    $(".jcrop-holder > div:first-child .saveLoading span").html("裁切失败，请重新裁切...");
                    setTimeout(function () {
                        $(".jcrop-holder > div:first-child .saveLoading").remove();
                        $cropCtrlBar.show();
                        $cropRatioBar.show();
                        jCropApi.enable();
                    }, 2000);
                };
                var file = new fmacloud.File("cropImg.png", {base64: base64});
                file.save().then(function (imgObj) {
                    //var _url = imgObj._url + "?imageView2/2/w/640/h/1008";
                    var _url = imgObj.get("url");
                    var newImage = new Image();
                    newImage.onload = function () {
                        let left = (boxStyle.left - offset.left + cropImgSize.x) / deviceScale;
                        let top = attributes['item_top'] + ( cropImgSize.y) / deviceScale;
                        if (attributes['item_type'] == 1 && !!attributes['group_id']) {
                            var picFramePos = GlobalFunc.getPicFramePosByObjArr(attributes);
                            if (!!picFramePos) {
                                // console.log("pck", picFramePos)
                                left -= picFramePos.left;
                                top -= picFramePos.top
                            }

                        }
                        if (_this.props.ok) {
                            _this.props.ok(_url);
                        } else {
                            MakeActionCreators.updateElement({
                                item_val   : _url + "?imageView2/2/w/" + parseInt(width), //使用带压缩的地址
                                item_width : width,
                                item_height: height,
                                //item_left  : attributes['item_left'] + (imgStyle.width / deviceScale - boxStyle.width / deviceScale) / 2 + left,
                                //item_top   : attributes['item_top'] + (imgStyle.height / deviceScale - boxStyle.height / deviceScale) / 2 + top
                                item_left  : left,
                                item_top   : top
                            });
                        }

                        _this._cropCancel();
                    };
                    newImage.src = _url;
                }, function (err) {
                    errorCallBack();
                    console.log(err);
                });
            };
            image.src = document.getElementById("cropImg").src;
        }
    },

    _changeCropScale: function (type) {
        switch (type) {
            case "free":
                jCropApi.setOptions({
                    aspectRatio: 0
                });
                break;
            case "default":
                jCropApi.setOptions({
                    aspectRatio: imgStyle.width / imgStyle.height
                });
                break;
            case "1:1":
                jCropApi.setOptions({
                    aspectRatio: 1 / 1
                });
                break;
            case "2:1":
                jCropApi.setOptions({
                    aspectRatio: 2 / 1
                });
                break;
            case "4:3":
                jCropApi.setOptions({
                    aspectRatio: 4 / 3
                });
                break;
            case "9:16":
                jCropApi.setOptions({
                    aspectRatio: 9 / 16
                });
                break;
            case "16:9":
                jCropApi.setOptions({
                    aspectRatio: 16 / 9
                });
                break;
            default:
                jCropApi.setOptions({
                    aspectRatio: 0
                });
                break;
        }
        this.setState({cropScale: type});
    },

    _cancelByReplace: function () {
        var _this = this, imgObj = GlobalFunc.getImgWidth(this.props.img);
        MakeActionCreators.updateElement({
            item_val   : _this.props.src,
            item_width : imgObj.width,
            item_height: imgObj.height
        });
        this._cropCancel();
    }

});
