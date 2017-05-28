/**
 * @component MakeApp
 * @description 制作模块, 根据tid加载作品并制作
 * @time 2015-08-27 15:24
 * @author StarZou
 **/

var React = require('react');

var Header = require('./Header');
var MagazineMainSection = require('./MagazineMainSection');
var MakeActionCreators = require('../../actions/MakeActionCreators');
var DialogFactory = require('./Tools/Bar/DialogFactory');
var ShortCut = require('./shortcut/ShortCut');
var Base = require("../../utils/Base");
var User = require("../../utils/user");
var WorkDataUtil = require("../../utils/WorkDataUtil");
var MakeWebAPIUtils = require("../../utils/MakeWebAPIUtils");
var Dialog = require('../Common/Dialog.jsx');
var AutoSave = require("./Tools/autoSave");
var PageStore = require("../../stores/PageStore");
var ElementStore = require("../../stores/ElementStore");
var MakeStore = require("../../stores/MakeStore");
var GlobalFunc = require("../Common/GlobalFunc");
var ChargeDialog = require("../Common/ChargeDialog");
var Cart = require("../Cart/Cart");
require("../../lib/makeloadingwave");
var img_wave = require("../../../assets/images/wave-wave.png");
var img_logo = require("../../../assets/images/wave-logo.png");
var img_mask = require("../../../assets/images/wave-mask.png");


var MakeMagazine = React.createClass({

    getInitialState() {
        MakeActionCreators.workInit();
        return { loading: true, cartData: [] }
    },

    render: function () {
        if (!Base.isLogin()) {
            //window.location.hash = "/user"
            Base.linkToPath("/login&back=true");
        }

        if (this.state.loading) {
            return (
                <div><div id="pre-make-page">
                    <div id="make-load"></div>

                </div>
                    <ChargeDialog ref="chargeDialog"/>
                    <Cart ref="cart" data={this.state.cartData} onOk={this.onPayOk.bind(this, this.state.cartData) }/>
                </div>
            )
        }

        return (
            <div className="user_select_none">
                {<div className="load-font" style={{ display: "none" }}>loadFont</div>}
                <div className="make-app">
                    <Header/>
                    <MagazineMainSection/>
                    <div id='save-tip'></div>
                    <div id='drag-select'></div>
                </div>
                <DialogFactory/>
            </div>

        );
    },
    onPayOk: function (cartData, status) {
        if (status != 2) {
            return
        } else {
            var params = this.props.params;
            var userID = Base.getCurrentUser().id;
            MakeWebAPIUtils.clearOwnGoods()
            MakeWebAPIUtils.loadOwnGoods(userID, true).then(() => {
                MakeActionCreators.getMagazineData(params.tid, params.reEdit, this.fill, this.error);
            })

        }
    },
    componentWillUnmount: function () {
        ShortCut.unInit();
        AutoSave.stop();
        var ClientState = require("../../utils/ClientState");
        ClientState.unInit();
        window.onbeforeunload = null;
    },

    componentDidMount: function () {
        var explorer = window.navigator.userAgent,
            isUserAgentUseful = false,
            loadText = $(".loadText");

        if (explorer.indexOf("Chrome") >= 0 && explorer.indexOf("Edge") == -1) {
            if (parseFloat(explorer.match(/Chrome\/([\d.]+)/)[1]) > 38) {
                isUserAgentUseful = true;
            }
        }
        if (!isUserAgentUseful) {
            $("#pre-make-page").css({ background: "#333" });
            $("#make-load").remove();
            $("#pre-make-page").html("<div class='compatible-tip'><div></div>您目前使用的浏览器无法进行编辑<br />" +
                "推荐使用<a href='https://www.baidu.com/s?wd=谷歌浏览器' target='_blank'>谷歌浏览器</a>、" +
                "<a href='https://www.baidu.com/s?wd=360极速浏览器' target='_blank'>360极速浏览器</a>、" +
                "<a href='https://www.baidu.com/s?wd=QQ浏览器' target='_blank'>QQ浏览器</a>（V9.1及以上版本）进行操作</div>");
            return;
        }

        if (!Base.isLogin()) return;
        MakeLoadingWave.start(undefined, { img_wave: img_wave, img_logo: img_logo, img_mask: img_mask, id: "make-load", backgroud: "transprent" });
        var url = location.href;
        var type = "magazine";
        if (/\/make(\/|$)/.test(url)) {
            type = "onegroup";
        }
        //console.log(type);
        var _this = this, params = this.props.params;

        var uid = Base.getCurrentUser().id
        Base.getLatestUserInfo(uid).then((userObj) => {
            if (userObj.get("user_type") == 4) {
                alert("账号异常，请联系客服");
                return
            }

            if (params.tid) {
                // debugger;
                var templateCode = `Tpl_${params.tid}`
                //取收费模板
                MakeWebAPIUtils.getGoodPriceByType("template").then((data) => {
                    //是否是收费模板
                    if (data.length == 0) {
                        return false
                    }
                    var tpls = data;
                    for (var i = 0, len = tpls.length; i < len; i++) {
                        var tpl = tpls[i];
                        if (templateCode == tpl.custom_code) {
                            var expire = !!tpl.end_at ? tpl.end_at : "永久";
                            return { name: tpl.name, icon: tpl.icon, price: (tpl.price / 100).toFixed(2), sum: "1", qixian: expire, id: tpl.id, custom_code: tpl.custom_code }
                        }
                    }
                    return false
                }).then((priceInfo) => {
                    if (priceInfo) {
                        //收费模板，看自己是否买过
                        MakeWebAPIUtils.loadOwnGoods().then((data) => {
                            if (data.result) {
                                var ownGoods = data.result;
                                for (var i = 0, len = ownGoods.length; i < len; i++) {
                                    var goodInfo = ownGoods[i];
                                    if (templateCode == goodInfo.item_description.item_id) {
                                        //已购买
                                        MakeActionCreators.getMagazineData(params.tid, params.reEdit, _this.fill, _this.error);
                                        return
                                    }
                                }
                            }

                            //收费
                            this.refs.chargeDialog.showCharge(() => {
                                this.setState({ cartData: [priceInfo] }, () => {
                                    this.refs["cart"].changeDialogStatus(true,0);
                                })
                            }, undefined, "使用此模板需要购买")
                        })
                    } else {
                        //免费模板
                        MakeActionCreators.getMagazineData(params.tid, params.reEdit, _this.fill, _this.error);
                    }
                }).catch(function(){
                      MakeActionCreators.getMagazineData(params.tid, params.reEdit, _this.fill, _this.error);
                })



            } else {
                window.onbeforeunload = function () {
                    return "提示：未保存的内容将会丢失";
                };
                ShortCut.init();
                AutoSave.start();
                var createByPic = MakeStore.getImageArr();
                if (createByPic) {
                    this.createByPic(createByPic);
                    MakeStore.setCreateByPic(null);
                } else {
                    MakeLoadingWave.end(function () {
                        if (type == "onegroup") {
                            MakeActionCreators.createBlankMode();
                        } else {
                            MakeActionCreators.createBlankMagazine();
                        }
                        _this.setState({
                            loading: false
                        });
                    })

                }
                _this.addLabel();
            }

        }).catch(function () {
            alert("账号验证，请重新登陆")
        })

    },
    error: function (error) {
        console.log(error);
        //$("#loadBox").css({background: "#333"});
        //$("#pre-make-page").remove();
        Base.linkToPath("/404")

    },
    fill: function () {
        window.onbeforeunload = function () {
            return "提示：未保存的内容将会丢失";
        };
        ShortCut.init();
        AutoSave.start();
        this.setState({
            loading: false
        });
        this.addLabel();
    },
    addLabel: function () {
        if (!this.props.params.label) return;
        var _tpl = MagazineStore.getTpl(), label = _tpl.get("label");
        label.push(this.props.params.label);
        _tpl.set("label", label);

    },

    createByPic: function (files) {
        var WorkDataUtil = require("../../utils/WorkDataUtil");
        var _this = this,
            _tid = WorkDataUtil.createTplId(),
            _tpl = fmaobj.tpl.create(),
            _tplData = fmaobj.tpl_data.create();
        MagazineStore.setTpl(_tpl);
        PageStore.setTplData(_tplData);

        var loadText = $(".loadText"),
            fileLength = files.length, successNum = 0, errorNum = 0,
            userID = GlobalFunc.getUserObj().objectId;
        loadText.html("正在生成微杂志，成功导入 " + successNum + "/" + fileLength + "张");
        for (var i = 0; i < files.length; i++) {
            var fileName = files[i].name.substring(0, files[i].name.indexOf("."));
            var fileType;
            switch (files[i].type) {
                case "image/jpeg":
                    fileType = "jpg";
                    break;
                case "image/jpg":
                    fileType = "jpg";
                    break;
                case "image/png":
                    fileType = "png";
                    break;
                case "image/gif":
                    fileType = "gif";
                    break;
                default:
                    GlobalFunc.addSmallTips("未识别的图片类型！(暂时只支持jpg,png,gif)", null, { clickCancel: true });
                    _this.setState({ loading: "" });
                    break;

            }
            if (!fileType) return;
            if (fileType) {
                User.uploadMaterial(function (data) {
                    if (data.results !== false) {
                        successCallBack(data.data)
                    } else {
                        errorNum++;
                    }
                }.bind(this), userID, 4, 1, files[i]);
            } else {
                GlobalFunc.saveAsThumbnail({
                    file: files[i],
                    fileName: fileName,
                    format: {
                        w: 640,
                        h: 1008,
                        q: 85,
                        scaleToFit: true,
                        fmt: fileType
                    },
                    success: function (file) {
                        GlobalFunc.saveMaterialObj({
                            fileUrl: file._url,
                            fileName: file._name.substring(0, file._name.indexOf(".")),
                            materialOwner: 1,
                            materialType: 4,
                            userId: userID
                        }, function (obj) {
                            // debugger;
                            successCallBack(obj)
                        }, function (obj, err) {
                            // debugger;
                            GlobalFunc.addSmallTips(err.message, null, { clickCancel: true });
                            errorNum++;
                        });
                    },
                    error: function (err) {
                        GlobalFunc.addSmallTips('图片上传失败: ' + (err.message || err), null, { clickCancel: true });
                        errorNum++;
                    }
                });
            }
        }
        function successCallBack(obj) {

            successNum++;
            loadText.html("正在生成微杂志，成功导入 " + successNum + "/" + fileLength + "张");
            console.log(obj.attributes.material_src);
            var src = obj.attributes.material_src,
                image = new Image();
            image.onload = function () {
                var itemObj = { type: 'img', src: src, img: image };
                MakeActionCreators.addPage();
                MakeActionCreators.addElement(itemObj);

                if (successNum + errorNum == fileLength) {
                    _this.setState({
                        loading: false
                    });
                    if (PageStore.getPages().length >= successNum) {
                        MakeActionCreators.selectPage(successNum - 1);
                        $("#page-list").animate({ scrollTop: $('.pages-container-whitespace').offset().top }, 0);
                    }

                }
            };
            image.src = src;
        }

        var musicObj = {
            src: "http://ac-hf3jpeco.clouddn.com/mVsvGy5CGvJHtnpkLzN8DHuiHuLbPaSmCMOGVnBa.mp3",
            imgUrl: null,
            name: "梦中的婚礼",
            replay: true,
            autoplay: true
        };
        MakeActionCreators.updateTpl({ "type": "music", obj: musicObj });

    }
});

module.exports = MakeMagazine;
