/**
 * @description 第三方作品导入
 * @time 2016-3-11
 * @author Nick
 */

'use strict';

// require core module
var React = require('react'),
    _ = require("lodash"),
    Base = require('../../utils/Base'),
    GlobalFunc = require('../Common/GlobalFunc'),
    WorkDataUtil = require('../../utils/WorkDataUtil');
var MeConstants = require("../../constants/MeConstants");
var ElementType = MeConstants.Elements
var uploadCoverSrc;
var LabelsModel = require('../../utils/LabelsModel'),
    labelsModel = new LabelsModel();
var defaultURL = "http://ac-hf3jpeco.clouddn.com/1537a35ca1614c9c.png"
// define User component
var ImportThirdParty = React.createClass({

    getInitialState: function () {
        return {
            tplName:"",
            tplDescription:"",
            tagsLib     : [],
            selectedTags: [],
            thirdURL    : ""
        }
    },

    componentDidMount: function () {
        var _this = this;
        labelsModel.getLabelsBySQL({
            fieldColumn   : '*',
            whereCondition: {
                ['type in ']: '(\'pc-trade\',\'pc-function\')'
            },
            orderCondition: "order desc",
            currentPage   : 1,
            pageSize      : 6
        }).then(function (_data) {
            var tagsLib = _data.results.map((item)=> {
                return item.get("name")
            });
            _this.setState({
                tagsLib: tagsLib

            });
        });

        this.setState({
            tplName       : GlobalFunc.getUserObj().user_nick,
            tplClass      : 0,
            tplDescription: "我做的H5作品，欢迎来围观哦！"
        });
        this._showEffectImg()
    },

    toggleLabel: function (index) {
        var selectedArr = this.state.selectedTags;
        var i = _.indexOf(selectedArr, index);
        if (selectedArr.length >= 3 && i == -1) {
            //no more than 3 tag selected
            return;
        }
        if (i == -1) {
            selectedArr.push(index)

        } else {
            selectedArr.splice(i, 1);
        }
        this.setState({selectedTags: selectedArr});

    },

    _showEffectImg: function () {
        var _this = this;
        var $screenShot = $("#publish-info-screenshot"), $screenImage = $('#screenImage');

        $screenShot.find(".tips").remove();
        var boundX,
            boundY,
            xSize = $screenShot.width(),
            ySize = $screenShot.height();


        $screenImage.attr("src", defaultURL);

        var $replace = $screenShot.find(".replace"),
            $edit = $screenShot.find(".edit"),
            $img = $screenShot.find("img");
        $replace.click(function () {
            $("#croped-img-url").unbind("finished");
            $("#croped-img-url").unbind("upload").on("upload", function (event, url) {
                uploadCoverSrc = url
            })
            $("#publish-info-uploadFile").find("input").trigger("click");
        });
        $edit.click(function () {
            _this.props.recrop(defaultURL);
        });
        $img.click(function () {
            _this.props.recrop(defaultURL);
        });
    },


    _changeName: function (event) {
        var value = event.target.value.substr(0, 40);
        this.setState({
            tplName: GlobalFunc.htmlEncode(value)
        })
    },

    _changeDescription: function (event) {
        var value = GlobalFunc.htmlEncode(event.target.value).substr(0, 100);
        this.setState({
            tplDescription: value
        })
    },
    _changeURL        : function (event) {
        var value = event.target.value;
        this.setState({
            thirdURL: value
        })
    },

    _determine: function () {
        var check = this._checkInput();
        if (!check) return;
        if (!this.state.thirdURL) {
            console.log("url is empty");
            ///url is empty
            return
        }
        var labelArr = this.state.selectedTags.map((selectedIndex)=> {
            return this.state.tagsLib[selectedIndex];
        });
        $(".publish-info-okBtn").html("发布中...").attr("disabled", "disabled").addClass("disabled");
        var cropedUrl = $("#croped-img-url").val();
        this.saveThirdWork(check, labelArr, cropedUrl ? cropedUrl : defaultURL, uploadCoverSrc);

        //this._uploadEffectImg(function (file) {
        //    this._uploadTplObj(file, check, uploadedFile, labelArr);
        //}.bind(this), function () {
        //    console.log("上传效果图失败");
        //    $(".shareDialog-info-okBtn").html("发布失败(重新发布)").removeAttr("disabled").removeClass("disabled");
        //});

    },

    //保存 数据
    saveThirdWork: function (inputs, label, coverFileURL, uploadCoverSrc) {
        var _this = this;
        var tplObj = fmaobj.tpl.create(),
            tplData = fmaobj.tpl_data.create();
        tplObj = WorkDataUtil.initTplWithObj(tplObj, GlobalFunc.getUserObj());
        tplObj.set("page_int", 1);
        tplObj.set("tpl_delete", 0);
        var ItemInit = require("../Common/ItemInit");
        var PageInit = require("../Common/PageInit");
        var page = PageInit.createBlankPageObj();
        var background = ItemInit.createBlankItemObj();
        var item = ItemInit.makeLink(this.state.thirdURL)
        item.set("item_layer", 1);
        page.set("item_object", [background, item]);
        tplData.set("pages", [page]);
        tplData.set("key_id", tplObj.get("tpl_id"));
        var _obj = inputs, _effectImg = coverFileURL, _coverImg = coverFileURL;
        if (!!_obj) {
            var _effect_img_url = "AV:" + _effectImg,
                _tiny_img_url = "AV:" + (_effectImg + "?imageView/2/w/320/h/504/format/jpeg"),
                tpl_share_img = _coverImg,
                reupdate_date;
            //fmacloud.Cloud.run('get_clouddate', {}, {
            //    success: function (result) {
            //reupdate_date = parseInt(new Date(result).getTime() / 1000).toString();
            reupdate_date = parseInt(new Date().getTime() / 1000).toString();
            var addTplObj = {
                name         : _obj.tpl_name,
                tpl_class    : parseInt(1),
                brief        : _obj.tpl_description,
                tpl_privacy  : _obj.tpl_privacy,
                tpl_type     : 11,
                tpl_state    : 2, //设置已完成状态
                effect_img   : _effect_img_url,
                tiny_img     : _tiny_img_url,
                tpl_share_img: tpl_share_img,
                reupdate_date: reupdate_date,
                label        : label,
                upload_url   : uploadCoverSrc ? uploadCoverSrc : tplObj.get("upload_url")
            }
            for (var prop in addTplObj) {
                tplObj.set(prop, addTplObj[prop]);
            }
            WorkDataUtil.saveRawWork(tplObj, tplData, function (data) {
                _this.props.thirdPartyToggle();
            }.bind(this), function (err) {
                console.log(err);

                err = "发布失败(重新发布)";
                $(".publish-info-okBtn").html(err).removeAttr("disabled").removeClass("disabled");
            }.bind(this));

        }
    },

    _checkInput: function () {
        var tplName = $("#tpl-name-import"),
            tplNameV = GlobalFunc.htmlEncode(tplName.val());
        var tplClassType = $("#tpl-class-type"),
            tplClassTypeV = GlobalFunc.htmlEncode(tplClassType.val());
        var tplDescription = $("#tpl-description-import"),
            tplDescriptionV = GlobalFunc.htmlEncode(tplDescription.val());

        var radio = $("input[name='publish-radio']:checked "),
            radioV = radio.val();

        if (tplNameV.length < 1) {
            tplName.focus();
            alert("请输入作品名");
            return false;
        }
        if (radioV.length < 1) {
            radioV = "public";
        }

        return {
            tpl_name       : tplNameV + "",
            tpl_class      : tplClassTypeV + "",
            tpl_description: tplDescriptionV + "",
            tpl_privacy    : radioV + ""
        };
    },
    preview    : function () {
        if (this.state.thirdURL == "") {
            console.log("url is empty");
        } else {
            window.open(this.state.thirdURL, "previewthirdurl")
        }

        //console.log(this.state.thirdURL);
    },
    render     : function () {

        var labels = this.state.tagsLib.map((label, index)=> {
            var selected = _.indexOf(this.state.selectedTags, index) != -1;
            return <li key={index} className={selected ? "label selected" : "label"}
                       onClick={this.toggleLabel.bind(this,index)}>{label}</li>
        });
        //var ifPublish = GlobalFunc.existInWork(this.state.tplData.get("pages"), ElementType.redEnvelope);
        return (
            <div className="select-dialog import-work-dialog">

                <div className="publish-dialog-import">

                    <h1>基本信息</h1>

                    <div className="base-info">

                        <div className="publish-info-screen">
                            <div id="publish-info-screenshot">
                                <img id='screenImage'/>
                                <span className='replace'/>
                                <span className='edit'/>
                            </div>
                        </div>
                        <div className="publish-info-text">

                            <input id="tpl-name-import" value={GlobalFunc.htmlDecode(this.state.tplName)} placeholder="作品名"
                                   onChange={this._changeName}/>
                        </div>
                        <div className="publish-info-textarea">
                            <textarea id="tpl-description-import" placeholder="作品简介" value={GlobalFunc.htmlDecode(this.state.tplDescription)}
                                      onChange={this._changeDescription}/>
                        </div>
                        <div className="publish-info-radio">
                            <input id="tpl-private" name="publish-radio" type="radio" value="private"
                                   defaultChecked={false}/>
                            <label htmlFor="tpl-private">不公开</label>
                            <input id="tpl-public" name="publish-radio" type="radio" value="public"
                                   defaultChecked={true}/>
                            <label htmlFor="tpl-public">公开</label>

                        </div>

                    </div>

                    <div className="line"></div>

                    <h1 className="">高级设置</h1>

                    <div className="advanced-settings">
                        <textarea className="third-url" placeholder="请输入第三方链接地址" value={this.state.thirdURL}
                                  onChange={this._changeURL}/>
                        <div className="tpl_label fl">
                            <h2>选择标签</h2>
                            <ul>{labels}</ul>
                        </div>
                    </div>
                    <div className="btn-group">
                        <button onClick={this.preview}>预&nbsp;&nbsp;&nbsp;&nbsp;览</button>
                        <button onClick={this._determine} className="publish-info-okBtn">发&nbsp;&nbsp;&nbsp;&nbsp;布
                        </button>
                        <button onClick={this.props.thirdPartyToggle}>取&nbsp;&nbsp;&nbsp;&nbsp;消</button>
                    </div>
                </div>


            </div>
        );

    }

});

// export User component
module.exports = ImportThirdParty;
