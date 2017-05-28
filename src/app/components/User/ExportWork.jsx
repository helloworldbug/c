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
    WorkDataUtil = require('../../utils/WorkDataUtil'),
    MakeWebAPIUtils = require('../../utils/MakeWebAPIUtils'),
    MagazineStore = require('../../stores/MagazineStore');
var MeConstants = require("../../constants/MeConstants");
var ElementType = MeConstants.Elements;
var jsPDF = require("jspdf");

var ExportWork = React.createClass({

    getInitialState: function () {
        return {
            quality: "标清",
            format : "pdf"
        }
    },


    export       : function () {
        console.log(this.props.tid);
        var _this = this;
        var isCanceled=false;
        GlobalFunc.addSmallTips("正在生成pdf...", null, {cancel:function(){
            isCanceled=true;
        }});
        this.close();
        MakeWebAPIUtils.getMagazineTreeDataById(this.props.tid, function (templateObject, pagesObject) {
            var _tpl = templateObject.toJSON();
            var _pages = MagazineStore.getPagesJSON(pagesObject.get("items"));
            if (!_pages) {
                GlobalFunc.addSmallTips("读作品数据出错", null, {clickCancel:true});
                return
            }
            _tpl.page_value = _pages;
            var magazineRender = new ms.MagazinePageRenderer(_tpl);

            var doc = new jsPDF();
            var pageCount = _pages.length;
            next(0);

            /**
             * 按顺序生成每页的图片并添加到pdf中
             * @param index
             */
            function next(index) {
                var rate = 1;
                if (_this.state.quality == "标清") {
                    rate = 0.5;
                }
                magazineRender.getImageDataByPageIndex(index, function (data) {
                    if (isCanceled) {
                        magazineRender.destroy();
                        magazineRender = undefined;
                        return;
                    }
                    var curPage = _pages[index];
                    //A4纸 210*297 ，边距设为5
                    var widthR = curPage.page_width / 200;
                    var heightR = curPage.page_height / 287;
                    var width, height;
                    if (heightR > widthR) {
                        var ratio = heightR / widthR;
                        width = parseInt(200 / ratio);
                        height = 287;
                    } else {
                        var ratio = widthR / heightR;
                        width = 200;
                        height = parseInt(287 / ratio);
                    }
                    if (index != 0) {
                        doc.addPage();
                    }
                    doc.addImage(data, 'jpeg', (210 - width) / 2, (297 - height) / 2, width, height); //210*297
                    if (pageCount == (index + 1) && magazineRender) {
                        magazineRender.destroy();
                        magazineRender = undefined;
                        finished();
                    } else {
                        index++;
                        next(index);
                    }
                }, "image/jpeg", rate);
            }

            function finished() {
                if (isCanceled) {
                    return;
                }
                GlobalFunc.addSmallTips("生成成功", 2);
                doc.save(_tpl.name + ".pdf")
            }


        },function error(err){
            GlobalFunc.addSmallTips("读作品数据出错", null, {clickCancel:true});
        });

    },
    changeQuality: function (qual) {
        this.setState({quality: qual});
    },
    close        : function () {
        this.props.close();
    },
    render       : function () {
        //var ifPublish = GlobalFunc.existInWork(this.state.tplData.get("pages"), ElementType.redEnvelope);
        return (
            <div className="select-dialog ">
                <div className="export-work-dialog">
                    <h1>下载作品</h1>
                    <div className="tab">
                        <ul className="title">
                            <li>PDF文件</li>
                        </ul>
                        <ul className="content">
                            <li>
                                <div className="content-header">常规</div>
                                <div className="line"><span>文件质量:</span> <input type="radio" value="标清" name="quality"
                                                                                defaultChecked
                                                                                onClick={this.changeQuality.bind(this,"标清")}/>标清<input
                                    type="radio" value="高清" name="quality"
                                    onClick={this.changeQuality.bind(this,"高清")}/>高清
                                </div>
                                <div className="line"><span>文件格式:</span> <input type="radio" value="pdf" name="format"
                                                                                defaultChecked/>pdf
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="modal-footer bottom">
                        <button onClick={this.close} className="cancel">取消</button>
                        <button onClick={this.export}>确定</button>

                    </div>
                    <div className="btn-close"  onClick={this.close} ></div>
                </div>
            </div>
        );

    }

});

// export User component
module.exports = ExportWork;
