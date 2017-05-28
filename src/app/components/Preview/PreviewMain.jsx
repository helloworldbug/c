/**
 * @component PreViewMain
 * @description 作品详情页显示模块
 * @time 2015-10-23 16:00
 * @author Nick
 **/
var React = require('react'),
    QRCode = require('qrcode.react'),
    WorkDataUtil = require("../../utils/WorkDataUtil"),
    MakeWebAPIUtils = require("../../utils/MakeWebAPIUtils"),
    GlobalFunc = require("../Common/GlobalFunc");

var RenderWrapper = require("./RenderWrapper");
var Base = require('../../utils/Base');
var LoadingWave;
function nop() {

}
var img_ffffff = "data:image/png;base64,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";
var img_mask = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAABgCAYAAACZvLX0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjBDNDZFNzM5MUQwMTFFNTgxQTJENzZERUM1OUNDNDMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjBDNDZFNzQ5MUQwMTFFNTgxQTJENzZERUM1OUNDNDMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCMEM0NkU3MTkxRDAxMUU1ODFBMkQ3NkRFQzU5Q0M0MyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCMEM0NkU3MjkxRDAxMUU1ODFBMkQ3NkRFQzU5Q0M0MyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pi3bb/4AAAVVSURBVHja7J1PaBxlGMZ3dpPNTtZs0ojxECkWUvBi6sVLvcQI9Sa5RBEU60GPQk/Rk9CLESk9eBA92Z4kKFTtxSBVpPRSaKHSIm39k1pasSabbZrMJpOd+DzpbtgOs23+zGS/mXleeJlN2P3me3/77ft98+3s81pra2sZU8227VHXdcfw8CD6ud/zvBL/n81m71qWdQ0Pz3V2dp5yHOeMqTFYJgIuFAqHAPZj9G0P3MO/9sEr8F7fU28D9Aq8DNAT1Wp12rhgCNgU7+npeQawfoHfYNe26DW87irbMCkmIzoxODj4eC6X+xwf/cVtgH3A0cYS2vqUbaYe8Pj4eB4f7SMYeXcB59ZO4TYcgH8E6Fm2zXOkEnBXV9crAHsbQJywwPod7V8H6Os8V2oAF4vFAwj6MgBUowIbAHoOo/pnnjuxgAcGBp5EoF8jYHe3wPp8Fm/sAkB/wb4kBvDIyEgBgU0C7nKbwPr9JtfRHR0d77NvsQaMSeYwwC4aAtbvf6JvM/l8/tXYAcaFwovo/O+Ggm32BU60SBtnu7u7nzcecH9//1Po7E/o+GoM4Db730gb8+j7ScZgHODh4eEictpxjAY3ZmD9q43L8Api+ZAxmQA4izz7JpdBcQbr8wri+Q0j+hZjY4xtAWzb9gvoxAV0aD5BcJudG0k3kDbOM9ZdA9zb27sPJ53Cyf9FJxYTCrfZ72AglRkzY48M8NDQUAm5abK+FzuTArD+/DxTXz9PkkVogKempnLIRe/iBLM40VzawAaAvslPL5i8QzY7Aoz17Eto7Ar8TtrBBoD+B/4rGW0ZcKlU2o8XT8MX0Ng9AW3p98CI6+dvyWxTgDH03+blLdwxJIhyDEZzGfm5QnYPBcxvFdq425WEtFHGJDgRCBjvwJeCFArkpXw+/9oGYH5TC7jHcFwRoNAgO409DdpbghK+I92eIOAOjN7nPM/LyMK1Wq32BvLxVzk8nqjf2CEL+aYe3pxk8RIQQ3mveIRm3PzqWyd8/yLNqgJwl7hEMIQta9mqJ2VZhHlCgAVYgGUCLMACLBNgARZgmQALsEyABViAZQIswAIsE2ABFmBhEGABlgmwAAuwTIAFWIBlAizAMgEWYAGWCbAAx902fvAiwBrBCQVMPUfP8x4TivCNbAn4EgA/KxzhGxUFszieF4oIUoNlXaNqTKavr+9p/F3L6BfyoToVUNbZ8if3IP1dXQdNcEKSaGzIGWyIelITLBNTzRwDR+/8hiBHQ/qEMiggL4WpEOA+ICnTLOBDQR88geJzFcHaFty5lqJIzbJeTNAGyXrFRgzpkbJeAcJ0EkraXAWaC5sWpvNLK6KB3V5dlGM0sc4/qkbHVsVBNQneTwfLSKNHdywO2kLedikTYfUWw8GuYn37Tajyti0Emk+nDDLz7NlIBZpbSIyzaN5ygsGuUpULefbldovk8yowaXLjXHYdaZtIfkCZh48MKqezowkMKfAzU8o8BBUq+T6O62fWAEHffzCyUInfWbZmfbM5m/0r5PVxVHn2SixK7fidhZg4ScAvmbi/US+2ejj25c5YWoy7TKaI7TMdsARb7Mud+Qv2sVgevwhEkLPtWnZxjkhUwb6gkpMsalqvf/THLoFdYZnLRJecDCqaiqCvRr2xw+pamAteT23ZX0D+IBNN5QOO2k9SW/bXv7+BkXYR7oWxIQM/rcLVAY7Vxii/kd3m/obL15pWet1qlCIwyQqFwiHXdY/jYcnzvCKOe1rc3HERh704/of17HvVanXauBtQTATcMNu2RwF6DJDH8OcT6Guhfs8XS65xJ+8cwJ5yHOeMqTH8L8AAuUvnMqNkUAcAAAAASUVORK5CYII=";
var img_logo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAAuCAYAAACMAoEVAAAB4UlEQVRoge2WsYoUQRCG/6qu6VlPvGP1dDFZcFB8CEP1FQzkDMyE83HM5AITH0JjczNBOPEuM9ED5dzp6e4yODdRYXrgwKulv3R+ivmqaoohZoc1RHyfmZ4R8T0iLABiXHg0q+KLan6Xs77suttv1k+I2YGIvHPuQET2nBM450BE//ONJ6GqSCkhpYgY4+uU0tOuuxOEiCAiB963e03T4LesOTkRRc4JwzA8DqHPAJ6Q9+2Dtp299b6FcwzAjtTfKFLKCKFH368euq2ty6+axi9FHGyLAQCBmdab19H29rz33ntmA7ejkJwzQgiBmclb+r5KICIwk2drx6OEtdPm7OI/2Gg5mRKesr6qei51p9T5k2I51YydnavfSvMnJ1/nVPD3NlJXAFxJKaHve4TQT2owzefXtGn8aDDGiNXqJ6UUR7POCWazSyoy3ruxusvlLQZwF8D+6emP/RCGIsFhCNMml1LCMAwFaYJqPpe6h4cfMxF9EJHni8XN66rhUen0TBwUVUWMEUT8IueypgFG5IAzQe/9+ykHxowcABwff/4+JW9K7owNndxUqpxVqpxVqpxVqpxVqpxVqpxVqpxVqpxVqpxVqpxVqpxVqpxVqpxVZHf3RnH46OhTUU414yLU/QWVg7xKGuhYqgAAAABJRU5ErkJggg=="

var eventLock = false;
var nextPage;
var loadPageNum = 0;

var PreviewMain = React.createClass({

    getInitialState() {
        return {
            showMusic: false,
            autoPlay: true,
            animationOver: true,//no used
            addReadIntNum: 1,//no used

        };
    },
    componentDidMount() {
        this.changeMiddleSize(this.props.fullScreen);
        MakeWebAPIUtils.getRESTfulData({
            url: `/v1/sm/works/tpl/${this.props.tid}`,
            success: (data) => {
                if (!data.err) {

                    var logoInfo = data.result;
                    if (logoInfo.logo && logoInfo.logo_used) {
                        //自定义logo
                        LoadingWave = require("../../lib/wave_1");
                        LoadingWave.start(logoInfo.logo, "previewMain");
                    } else {
                        LoadingWave = require("../../lib/wave");
                        LoadingWave.start(undefined, { img_wave: img_ffffff, img_logo: img_logo, img_mask: img_mask, id: "previewMain" });
                    }
                    // this.setState({ logo: logoInfo.logo || "", customLogo: logoInfo.logo_used, logoID: logoInfo.id })
                } else {
                    LoadingWave = require("../../lib/wave");
                    LoadingWave.start(undefined, { img_wave: img_ffffff, img_logo: img_logo, img_mask: img_mask, id: "previewMain" });
                }
                this.showByTid();
            },
            error: function (err) {
                LoadingWave = require("../../lib/wave");
                LoadingWave.start(undefined, { img_wave: img_ffffff, img_logo: img_logo, img_mask: img_mask, id: "previewMain" });
                this.showByTid();
            }
        });

        $("#phone-container").children()[0].addEventListener("wheel", (event) => {
            ///滚动翻页与长页冲突
            //    var delta = 0;
            //    if (!event) /* For IE. */
            //        event = window.event;
            //    if (event.wheelDelta) { /* IE或者Opera. */
            //        delta = event.wheelDelta / 120;
            //        /** 在Opera9中，事件处理不同于IE
            //         */
            //        if (window.opera)
            //            delta = -delta;
            //    } else if (event._zzjsnet) { /** 兼容Mozilla. */
            //        /** In Mozilla, sign of delta is different than in IE.
            //         * Also, delta is multiple of 3.
            //         */
            //        delta = -event._zzjsnet / 3;
            //    }
            //
            //    if (delta>0){
            //        this.prePage();
            //    }else{
            //        this.nextPage();
            //
            //    }
            event.stopPropagation();
        });

        document.addEventListener("keydown", this.keyDownHandler, false)

    },
    clearGlobalComponent() {
        this.state.renderWrapper && this.state.renderWrapper.clearGlobalComponent()
    },

    componentWillReceiveProps: function (nextProps) {

        //tid更新时重置所有状态
        // LoadingWave&&LoadingWave.end();
        if (this.props.tid !== nextProps.tid) {
            var swiperWrapper = $(".swiper-wrapper");
            swiperWrapper.html("");
            swiperWrapper.css("transform", "");
            if (nextPage) clearTimeout(nextPage);
            loadPageNum = 0;
            eventLock = false;
            MakeWebAPIUtils.getRESTfulData({
                url: `/v1/sm/works/tpl/${nextProps.tid}`,
                success: (data) => {
                    if (!data.err) {

                        var logoInfo = data.result;
                        if (logoInfo.logo && logoInfo.logo_used) {
                            //自定义logo
                            LoadingWave = require("../../lib/wave_1");
                            LoadingWave.start(logoInfo.logo, "previewMain");
                        } else {
                            LoadingWave = require("../../lib/wave");
                            LoadingWave.start(undefined, { img_wave: img_ffffff, img_logo: img_logo, img_mask: img_mask, id: "previewMain" });
                        }
                        // this.setState({ logo: logoInfo.logo || "", customLogo: logoInfo.logo_used, logoID: logoInfo.id })
                    } else {
                        LoadingWave = require("../../lib/wave");
                        LoadingWave.start(undefined, { img_wave: img_ffffff, img_logo: img_logo, img_mask: img_mask, id: "previewMain" });
                    }
                    this.showByTid(nextProps.tid);
                },
                error: function (err) {
                    LoadingWave = require("../../lib/wave");
                    LoadingWave.start(undefined, { img_wave: img_ffffff, img_logo: img_logo, img_mask: img_mask, id: "previewMain" });
                    this.showByTid(nextProps.tid);
                }
            });
            this.setState({ addReadIntNum: 1 });

        }
        //判断是否自动播放
        if (this.props.tid == nextProps.tid && this.props.autoPlay !== nextProps.autoPlay) {
            if (nextProps.autoPlay) {
                this.autoPlay(this.state.tplObj, nextProps.autoPlay, nextProps);
            } else {
                if (nextPage) clearTimeout(nextPage);
            }
        }
        //判断是否全屏
        if (this.props.tid == nextProps.tid && this.props.fullScreen !== nextProps.fullScreen) {
            this.changeMiddleSize(nextProps.fullScreen);
        }
    },

    componentWillUnmount: function () {
        if (nextPage) clearTimeout(nextPage);
        this.state.renderWrapper && this.state.renderWrapper.unmount();
        document.removeEventListener("keydown", this.keyDownHandler)
    },

    render: function () {
        var leftList = [], rightList = [], leftArrow, rigthArrow,
            groupsEffectImg = this.state.groupsEffectImg;
        if (this.state.tplObj && this.state.tplObj.tpl_sign == 2) {
            ///期刊作品
            var disableSlip = this.state.renderWrapper.data && this.state.renderWrapper.data.groups[this.state.renderWrapper.groupIndex].f_slip_status;
            var hasPrevGroup = this.state.renderWrapper.hasPrevGroup();
            var hasNextGroup = this.state.renderWrapper.hasNextGroup();
            var groupIndex = this.state.renderWrapper.getGroupIndex();
            var groupCount = this.state.renderWrapper.getBrotherGroupsRef().length;
            leftArrow = (<div className={"arrow-le" + (hasPrevGroup && !disableSlip ? "" : " disable")}
                onClick={hasPrevGroup && !disableSlip ? this.preGroup : nop}></div>);
            rigthArrow = (<div
                className={"arrow-ri" + (hasNextGroup && !disableSlip ? "" : " disable")}
                onClick={hasNextGroup && !disableSlip ? this.nextGroup : nop}></div>);
            if (hasPrevGroup) {
                for (var i = 0; i < groupIndex; i++) {
                    leftList.unshift(<li key={i} onClick={disableSlip ? nop : this.goGroup.bind(this, i, true)} className={disableSlip ? 'disable' : ''}>
                        <div className="img"><img
                            src={groupsEffectImg ? groupsEffectImg[i] : ""} width="96" height="151" /></div>
                    </li>);
                }
                //if (leftList.length > 0) {
                //    leftList = leftList.map(function (val) {
                //        return val;
                //    })
                //}
            }
            if (hasNextGroup) {
                for (var i = groupIndex + 1; i < groupCount; i++) {
                    rightList.push(<li key={i} onClick={disableSlip ? nop : this.goGroup.bind(this, i, true)} className={disableSlip ? 'disable' : ''}>
                        <div className="img"><img
                            src={groupsEffectImg ? groupsEffectImg[i] : ""} width="96" height="151" /></div>
                    </li>);
                }
                //if (rightList.length > 0) {
                //    rightList = rightList.map(function (val) {
                //        return val;
                //    })
                //}
            }

        } else if (this.state.tplObj) {
            ///老作品，没有组
            var leftCount = this.state.pageIndex, rightCount = this.state.pageCount - this.state.pageIndex - 1;
            leftArrow = (<div className={"arrow-le disable"}></div>);
            rigthArrow = (<div className={"arrow-ri disable"}></div>);
            if (leftCount > 0) {
                //左边的页数生成点和hover效果图片
                for (var i = 0; i < leftCount; i++) {
                    leftList.unshift(<li key={i} onClick={this.goPage.bind(this, i, true)}>
                        <div className="img"><img
                            src={groupsEffectImg ? groupsEffectImg[i] : ""} width="96" height="151" /></div>
                    </li>);
                }
                //if (leftList.length > 0) {
                //    leftList = leftList.map(function (val) {
                //        return val;
                //    })
                //}
            }

            if (rightCount > 0) {
                //右边的页数生成点和hover效果图片
                for (var i = 0; i < rightCount; i++) {
                    var _pageIndex = i + 1 + this.state.pageIndex;
                    rightList.push(<li key={_pageIndex} onClick={this.goPage.bind(this, _pageIndex, true)}>
                        <div className="img"><img
                            src={groupsEffectImg ? groupsEffectImg[_pageIndex] : ""} width="96" height="151" /></div>
                    </li>);
                }
                //if (rightList.length > 0) {
                //    rightList = rightList.map(function (val) {
                //        return val;
                //    })
                //}
            }
        }

        //背景音乐
        var phoneMusic = <div id="phone-music">
            <audio id="phone-music-audio" preload="none" loop="loop" />
            <div className="fly-note1"></div>
            <div className="fly-note2"></div>
            <section>
                <menu id="phone-music-menu" />
            </section>
        </div>;

        //中间的二维码
        var showQRCode = <div className="QRCodeBox animated fadeIn">
            <div className="QRCode">
                <QRCode size={306} value={Base.generateQRCodeUrl(this.props.tid)} />
            </div>
        </div>;

        //APP下载二维码
        var showAppCode = <div className="QRCodeBox animated fadeIn">
            <div className="APPCode">

            </div>
        </div>;

        var fullScreenBar = <div className="fullScreenBar">
            <div className="content">
                <div className="line"></div>
                <div className="minus" onClick={this.changeDelayTime.bind(this, this.props.delayTime - 2)}>
                    <span>{this.props.delayTime - 2 >= 0 ? (this.props.delayTime - 2) + "s" : null}</span>
                </div>
                <div className={this.props.autoPlay ? "pause" : "play"} onClick={this.changeAutoPlay}>
                    <span>{(this.props.delayTime) + "s"}</span>
                </div>
                <div className="plus" onClick={this.changeDelayTime.bind(this, this.props.delayTime + 2)}>
                    <span>{this.props.delayTime + 2 <= 15 ? (this.props.delayTime + 2) + "s" : null}</span>
                </div>
            </div>
        </div>;

        return (
            <div>
                <div className="dire-le">
                    <div className="dire-lists">
                        <div className="line"></div>

                        <div className="dire-list">
                            <ul>{leftList}</ul>
                        </div>

                        {leftArrow}

                    </div>
                </div>

                <div className="middle" id="previewMain">

                    <div id="phone-container">
                        <div className="swiper-wrapper"></div>
                        {this.props.showQRCode ? showQRCode : null}
                        {this.props.showAppCode ? showAppCode : null}
                    </div>

                    {this.state.showMusic ? phoneMusic : null}

                    {this.props.fullScreen ? fullScreenBar : null}

                </div>

                <div className="dire-ri">
                    <div className="dire-lists">
                        <div className="line"></div>

                        <div className="dire-list">
                            <ul>{rightList}</ul>
                        </div>
                        {rigthArrow}

                    </div>
                </div>

                <div
                    className="cur-page">{this.state.renderWrapper && (this.state.renderWrapper.getPageIndex() + 1) + "/" + this.state.renderWrapper.getBrotherPagesRef().length}</div>

            </div>
        )
    },
    /**
     * 页是否锁定
     */
    isLockPage: function () {
        return this.state.renderWrapper ? this.state.renderWrapper.isLockPage() : false;
    },
    hasNextPage() {
        return this.state.renderWrapper ? this.state.renderWrapper.hasNextPage() : false;
    },
    getPageDataObjects(pageIndex) {
        return this.state.renderWrapper ? this.state.renderWrapper.getPageDataObjects(pageIndex) : false;
    },
    getPageIndex() {
        return this.state.renderWrapper ? this.state.renderWrapper.getPageIndex() : false;
    },
    hasPrevPage() {
        return this.state.renderWrapper ? this.state.renderWrapper.hasPrevPage() : false;
    },
    /**
     * 根据全屏状态生成作品显示区
     * @param fullScreen  全屏状态
     */
    changeMiddleSize: function (fullScreen) {
        var middle = $(".middle"),
            middleWidth = middle[0].clientWidth,
            middleHeight = middleWidth / 0.63492,
            container = "#phone-container",
            scale = middleWidth / 640;
        var bodyHeight;
        if (fullScreen) {
            //全屏，按高度==窗口高度计算缩放值
            bodyHeight = $("body")[0].clientHeight;
            middleWidth = middleWidth / (middleHeight / bodyHeight);
            middleHeight = bodyHeight;
            scale = middleHeight / 1008;

            middle.css({
                width: middleWidth,
                height: middleHeight
            });

            $(container).css({
                "width": 640,
                "height": 1008,
                "-webkit-transform": "scale3d(" + scale + ", " + scale + ", 1)",
                "transform": "scale3d(" + scale + ", " + scale + ", 1)",
                "transform-origin": "0 0"
            });

            $(window).resize(function () {
                bodyHeight = $("body")[0].clientHeight;
                middleWidth = middleWidth / (middleHeight / bodyHeight);
                middleHeight = bodyHeight;
                scale = middleHeight / 1008;
                middle.css({ width: middleWidth, "height": middleHeight });
                $(container).css({
                    "-webkit-transform": "scale3d(" + scale + ", " + scale + ", 1)",
                    "transform": "scale3d(" + scale + ", " + scale + ", 1)"
                });
            });
        } else {
            //不全屏时，根据自适应宽度计算高度
            middle.css({ width: "25%" });
            middleWidth = middle[0].clientWidth;
            middleHeight = middleWidth / 0.63492;
            scale = middleWidth / 640;
            middle.css({ height: middleHeight });

            $(container).css({
                "width": 640,
                "height": 1008,
                "-webkit-transform": "scale3d(" + scale + ", " + scale + ", 1)",
                "transform": "scale3d(" + scale + ", " + scale + ", 1)",
                "transform-origin": "0 0"
            });

            $(window).resize(function () {
                middleWidth = middle[0].clientWidth;
                middleHeight = middleWidth / 0.63492;
                scale = middleWidth / 640;
                middle.css({ height: middleHeight });
                $(container).css({
                    "-webkit-transform": "scale3d(" + scale + ", " + scale + ", 1)",
                    "transform": "scale3d(" + scale + ", " + scale + ", 1)"
                });
            });

        }

    },
    swipeChanged: function () {
        if (this.props.pageChanged) {
            this.props.pageChanged();
        }
        this.forceUpdate();
    },
    newPageChanged: function (pageIndex, groupIndex) {
        if (this.props.newPageChanged) {
            this.props.newPageChanged(pageIndex, groupIndex);
        }
    },
    touchSwipeEnd: function () {
        this.stopAutoPlay();
        if (this.props.pageChanged) {
            this.props.pageChanged();
        }
        this.forceUpdate();
    },
    pageChanged: function (pageIndex, groupIndex) {
        if (this.props.pageChanged) {
            var disableSlip = this.state.renderWrapper.data && this.state.renderWrapper.data.groups[this.state.renderWrapper.groupIndex].f_slip_status;
            if (disableSlip) {
                this.stopAutoPlay();
            }
            this.props.pageChanged();
        }
        this.forceUpdate();
    },
    showByTid: function (tid) {
        var _this = this;

        var fileUrlConf = "http://ac-syrskc2g.clouddn.com/";//测试服的jsonurl域名
        if (fmawr === "999") {
            fileUrlConf = "http://ac-hf3jpeco.clouddn.com/";//正式服的jsonurl域名
        }
        MakeWebAPIUtils.getTPL(tid || this.props.tid).then(function (tplObjAvos) {
            var tplObj = tplObjAvos.toJSON();
            try {
                tplObj = JSON.parse(GlobalFunc.escapeHtml(JSON.stringify(tplObj)))
            } catch (e) {

            }

            if (tplObj.tpl_delete != 0) {
                return;
            }
            var tplsign = tplObj.tpl_sign;
            if (tplObj && tplObj.json_url && tplObj.tpl_fbstate != 1) {
                var jsonurl = tplObj.json_url;
                var url = "";
                if (GlobalFunc.isJsonObject(jsonurl)) {
                    jsonurl = JSON.parse(jsonurl);
                    var postfix = jsonurl.postfix || "";
                    url = fileUrlConf + jsonurl.key + postfix + "?" + Date.now();
                } else {
                    url = fileUrlConf + jsonurl + ".json?" + Date.now();
                }
                //取生成的静态对象文件
                $.ajax({
                    type: "GET",
                    url: url,
                    dataType: "json",
                    success: function (data) {
                        try {
                            var str = JSON.stringify(data);
                            data = JSON.parse(GlobalFunc.escapeHtml(str))
                        } catch (e) {

                        }

                        //oldLoadWay(tplObj);
                        if (tplsign == 2) {
                            tplObj.groups = data.tplData.groups;
                        } else {
                            tplObj.page_value = data.tplData.pages;
                        }
                        console.log(tplObj)
                        successFunc(tplObj);
                    },
                    error: function (error) {
                        console.log("ajax", error);
                        oldLoadWay(tplObj);
                    }
                });
            } else {
                if (!tplObj) {
                    errorFunc();
                } else {
                    oldLoadWay(tplObj);
                }
            }
        }).catch(function () {
            errorFunc();
        });

        //如果没有静态文件，则取作品数据生成js对象
        function oldLoadWay(tplObj) {
            var id;
            if (tplObj.get) {
                id = tplObj.tpl_id
            } else {
                id = tplObj.tpl_id
            }

            var sign = tplObj.tpl_sign;
            if (sign == 2) {
                ////todo
                MakeWebAPIUtils.getMagazineTreeDataById(id, function (templateObject, pagesObject) {
                    var WorkDataUtil = require("../../utils/WorkDataUtil")
                    tplObj.groups = WorkDataUtil.avosTplData2Json(pagesObject).groups
                    successFunc(tplObj);
                }, function (error) {
                    console.log(error);
                    errorFunc();
                })
            } else {
                MakeWebAPIUtils.cld_get_tpl_data_local(tid || _this.props.tid, function (tplData) {
                    tplObj.page_value = MakeWebAPIUtils.convertTplDataToJson(tplData).pages;
                    successFunc(tplObj);
                }, function (error) {
                    console.log(error);
                    errorFunc();
                });
            }

        }

        //数据获取成功后，传给显示模块
        function successFunc(obj) {
            // debugger;
            if (obj.review_status == 4 || obj.review_status == 5 || obj.review_status == 6) {
                var info = {
                    tid: obj.tpl_id,
                    name: obj.name,
                    createdAt: GlobalFunc.parseNewDate(new Date(obj.createdAt))
                }
                localStorage.setItem("appealWorkStr", JSON.stringify(info));
                Base.linkToPath("/workinvalid");
                return
            }


            if (_this.renderWrapper) {
                _this.renderWrapper.clearGlobalComponent();
            }
            var renderWrapper = new RenderWrapper({
                container: "#phone-container",
                tpl: obj,
                onSwipeEnd: _this.swipeChanged,
                onTouchSwipeEnd: _this.touchSwipeEnd,
                musicId: "#phone-music",
                pageChanged: _this.newPageChanged
            });
            var tpl = obj;
            var animationMode = !!tpl.animation_mode ? JSON.parse(tpl.animation_mode) : {};
            var autoPlay = animationMode.autoplay;
            if (typeof autoPlay == "boolean") {
                var changeAutoPlayInterval = setInterval(() => {
                    if (_this.renderWrapper) {
                        _this.props.changeAutoPlay(autoPlay, (animationMode.interval / 1000) || 0);
                        clearInterval(changeAutoPlayInterval);
                        changeAutoPlayInterval = null;
                    }
                }, 1000)
            }
            if (_this.props.pageChanged) {
                _this.props.pageChanged();
            }
            _this.setState({
                tplType: obj.tpl_type,
                renderWrapper: renderWrapper,
                tplObj: obj
            }, function () {
                //$("#phone-container").children()[0].addEventListener("mousewheel", function (e) {
                //    e.stopPropagation();
                //    return false;
                //}, true);
                if (_this.props.newPageChanged) {
                    _this.props.newPageChanged(0, 0);
                }
                if (_this.props.pageChanged) {
                    _this.props.pageChanged();
                }
                var i = 0;
                _this.addReadInt(obj);
                _this.getPagesEffects(obj);//显示页效果图
                // _this.state.md.showMagazine(obj, 0);
                // _this.state.md.onSwipeTouchEnd = function () {
                //     console.log("pageindex",_this.state.md.pageIndex);
                //     _this.setState({
                //         pageIndex: _this.state.md.pageIndex
                //     });
                //     eventLock = false;
                // };
                // _this.state.md.onBookSwipeTouchEnd = function () {
                //     //翻组
                //     console.log("pageindex",_this.state.md.bookIndex);
                //     _this.setState({
                //         groupIndex: _this.state.md.bookIndex
                //     });
                //     eventLock = false;
                // };                //

                //_this.setState({
                //    pageCount : _this.state.md.getAllPagesLength(),
                //    groupCount: !!obj.groups? obj.groups.length:0,
                //    pageIndex : 0,
                //    showMusic : false
                //});
                LoadingWave.end();
                _this.setState({
                    showMusic: false
                });
                _this.showMusic(obj);//显示音乐

                if (_this.props.autoPlay) {
                    _this.autoPlay(obj);
                }
                //if (_this.props.autoPlay && obj.page_value.length > 1) {
                //    _this.autoPlay(obj);
                //}
                // $(_this.state.container).children().one("mousewheel", function () {
                //     _this.goPage(_this.state.md.currentPage, true);
                // });
                //_this.state.md.onPageResourceLoaded = function (index) {
                //    i++;
                //    if (index != 0) return;
                //    LoadingWave.end();
                //    //_this.piwik();
                //    _this.showMusic(obj);//显示音乐
                //    if (_this.props.autoPlay && obj.page_value.length > 1) {
                //        _this.autoPlay(obj);
                //    }
                //    $(_this.state.container).children().one("mousewheel", function () {
                //        _this.goPage(_this.state.md.currentPage, true);
                //    });
                //};
            });
        }

        //数据获取失败
        function errorFunc() {
            LoadingWave.end();
            Base.linkToPath("/404");
            //GlobalFunc.addSmallTips("找不到该作品。");
            _this.setState({
                pageCount: 0,
                pageIndex: 0,
                md: null
            });
        }

    },


    stopAutoPlay() {
        if (!eventLock) {
            if (this.props.autoPlay) {
                this.setState({
                    autoPlay: false
                });
                this.props.changeAutoPlay(false);
                if (nextPage) {
                    clearTimeout(nextPage);
                    nextPage = null;
                }
            }
        }
    },
    goGroup: function (index, stopAutoPlay) {

        if (stopAutoPlay) this.stopAutoPlay();

        var groupIndex = parseInt(index);
        this.state.renderWrapper.pageTo(0, groupIndex);


    },

    goPage: function (index, stopAutoPlay) {

        if (stopAutoPlay) this.stopAutoPlay();
        var pageIndex = parseInt(index);
        //if (pageIndex < 0 || pageIndex > this.state.pageCount - 1) return;
        //var direct = pageIndex > this.state.pageIndex ? -1 : 1;
        this.state.renderWrapper.pageTo(pageIndex, 0);

    },

    /**
     * 背景音乐的显示和增加控制事件
     * @param data TPL
     */
    showMusic: function (data) {

        var musicSrc = data.tpl_music, _this = this;
        if (!musicSrc) return;
        _this.state.renderWrapper.renderHolder.installMusicPlayer();
        this.setState({
            showMusic: true
        }, function () {
            var audio = document.getElementById('phone-music-audio');
            audio.addEventListener("play", _this.musicPlay, false);
            audio.addEventListener("pause", _this.musicPause, false);
            audio.src = musicSrc;
            audio.autoplay = true;
        });
    },

    musicPlay: function () {
        var musicWrapper = $('#phone-music'),
            notes = musicWrapper.find('div'),
            audio = $('#phone-music-audio');
        musicWrapper.addClass("spin");
        notes.addClass("note");
        musicWrapper.unbind("click").bind("click", function () {
            audio[0].pause();
        });
        this.state.renderWrapper.mainMusicPlay();
    },

    musicPause: function () {
        var musicWrapper = $('#phone-music'),
            notes = musicWrapper.find('div'),
            audio = $('#phone-music-audio');
        musicWrapper.removeClass("spin");
        notes.removeClass("note");
        musicWrapper.unbind("click").bind("click", function () {
            audio[0].play();
        });
    },

    /**
     * 生成页的缩略图
     * @param tpl
     */
    getPagesEffects(tpl) {
        var imgArr = [], groups = tpl.groups || tpl.page_value, _this = this, successNum = 0;
        //magazineRender = new ms.MagazinePageRenderer(tpl);
        for (var i = 0; i < groups.length; i++) {
            var effectImg = groups[i].f_cover || groups[i].page_effect_img;
            if (effectImg) {
                imgArr[i] = effectImg;
                _this.setState({
                    groupsEffectImg: imgArr
                });
            }

        }
    },
    /**
     * 保存页缩略图
     * @param pageid 页ID
     * @param url 缩略图地址
     */
    freshPageEffect(pageid, url) {
        var query = new fmacloud.Query("page");
        query.equalTo("objectId", pageid);
        query.descending("createdAt");
        query.first({
            success: function (pageObj) {
                if (pageObj) {
                    pageObj.set("page_effect_img", url);
                    pageObj.save(null, {
                        success: function () {
                            console.log("页缩略图保存成功", pageid, url);
                        },
                        error: function () {
                            console.log("页缩略图保存失败", pageid, url);
                        }
                    });
                } else {
                    console.log("页数据查询失败", pageid, url);
                }
            }, error: function () {
                console.log("页数据查询失败", pageid, url);
            }
        });
    },

    /**
     * 自动播放
     * @param obj 作品对象
     * @param nextAutoPlay 当props.autoPlay更新时处理
     */
    autoPlay(obj, nextAutoPlay, nextProps) {
        var _this = this, _autoPlay = nextAutoPlay === true ? nextAutoPlay : this.props.autoPlay;
        if (!_autoPlay) return;
        var pageObj = this.state.renderWrapper.getCurrentPageRef();
        var itemObj = pageObj.item_object,
            delay = nextProps ? nextProps.delayTime : this.props.delayTime, usefulTime = 0;
        var pageAnimation = JSON.parse(pageObj.page_animation || "{}");
        if (pageAnimation.lock) {
            this.props.changeAutoPlay(false);
            return;
        }
        //计算自动播放时间，取当页元素（动画时间+延迟时间）最大值
        for (var i = 0; i < itemObj.length; i++) {
            var animation = itemObj[i].item_animation_val;
            if (animation) {
                if (animation.indexOf("[") != -1 && animation.indexOf("]") == animation.length - 1) {
                    animation = GlobalFunc.toJson(animation);
                } else {
                    var arrayObj = [];
                    arrayObj.push(GlobalFunc.toJson(animation));
                    animation = arrayObj;
                }
                animation.forEach((ainimationItem) => {
                    var animationTime = parseFloat(ainimationItem.duration) + parseFloat(ainimationItem.delay);
                    if (animationTime > usefulTime) {
                        usefulTime = animationTime;
                    }
                });
            }
        }
        delay = delay + usefulTime;

        loadPageNum++;
        clearTimeout(nextPage);
        nextPage = null;
        //定时回调
        nextPage = setTimeout(function () {
            if (!_this.state.renderWrapper.hasNextPage() && !_this.state.renderWrapper.hasNextGroup()) {
                if (_this.state.renderWrapper.getAllPagesLength() > 1) {
                    //第一组第一页
                    _this.state.renderWrapper.pageTo(0, 0);
                }
                if (!_this.state.tplObj.tpl_loop) {
                    //不循环
                    _this.props.changeAutoPlay(false);
                } else {
                    _this.autoPlay(obj);
                }

            } else {
                if (_this.state.renderWrapper.hasNextPage()) {
                    _this.state.renderWrapper.nextPage();
                } else if (_this.state.renderWrapper.hasNextGroup()) {
                    var disableSlip = _this.state.renderWrapper.data && _this.state.renderWrapper.data.groups[_this.state.renderWrapper.getGroupIndex()].f_slip_status;
                    if (disableSlip) {
                        _this.props.changeAutoPlay(false);
                    } else {
                        _this.state.renderWrapper.nextGroup()
                    }

                }
                _this.autoPlay(obj);
            }

        }, delay * 1000)
    },

    addReadInt(obj) {
        if (this.state.tplType == 10) return;
        var _tid = this.props.tid;

        var _this = this;
        var query = new fmacloud.Query("tplobj");
        query.equalTo("tpl_id", _tid);
        query.descending("createdAt");
        query.first({
            success: function (tplObj) {
                if (tplObj) {
                    var readPv = tplObj.attributes.read_pv,
                        pageLength = _this.state.renderWrapper.getAllPagesLength();
                    //console.log(pageLength);
                    readPv = parseInt(Math.random() * 10 % 4 + 2) * pageLength + readPv;
                    tplObj.set("read_pv", readPv);
                    tplObj.save(null, {
                        success: function (post) {
                            //console.log("PV+1", _tid, post.attributes.read_pv);
                        },
                        error: function (post, error) {
                            //console.log("PV+1失败", _tid, post.attributes.read_pv, error);
                        }
                    });
                } else {
                    console.log("PV查询失败", _tid);
                }
            }, error: function () {
                console.log("PV查询失败", _tid);
            }
        });
    },

    changeDelayTime(time) {
        this.props.changeDelayTime(time);
    },

    changeAutoPlay() {
        this.props.changeAutoPlay(!this.props.autoPlay)
    },

    changeFullScreen() {
        this.props.changeFullScreen(!this.props.fullScreen)
    },

    /**
     * 控制鼠标滚轮翻页
     * @param event
     */
    mouseWheelHandler(event) {
        event.stopPropagation();
        var delta = event.wheelDelta, index;
        if (delta > 0) {
            index = this.state.pageIndex - 1 < 0 ? this.state.pageCount - 1 : this.state.pageIndex - 1;
            this.goPage(index, true)
        } else if (delta < 0) {
            index = this.state.pageIndex + 1 >= this.state.pageCount ? 0 : this.state.pageIndex + 1;
            this.goPage(index, true)
        }
    },
    nextGroup() {
        this.props.changeAutoPlay(false);
        this.state.renderWrapper.nextGroup();
        // if (this.state.groupCount > 0 && this.state.groupIndex < this.state.groupCount) {
        //     this.state.md.hNext();
        // }

    },
    preGroup() {
        this.props.changeAutoPlay(false);
        this.state.renderWrapper.prevGroup();
        //if (this.state.groupCount > 0 && this.state.groupIndex > 0) {
        //    this.state.md.hPrev();
        //}

    },
    nextPage() {
        this.props.changeAutoPlay(false);
        this.state.renderWrapper.nextPage()
        // this.state.md.vNext();
    },
    prePage() {
        this.props.changeAutoPlay(false);
        this.state.renderWrapper.prevPage();
        //if(this.state.groupCount > 0){
        //    this.state.md.vPrev();
        //    this.setState({pageIndex: this.state.pageIndex - 1});
        //}else{
        //    if (this.state.pageCount <= 1) return;
        //    var index = this.state.pageIndex;
        //    if (index == 0) return;
        //    this.goPage(index - 1, true);
        //}

    },
    keyDownHandler(event) {
        var code = event.which, _this = this;
        switch (code) {
            case 37: //左箭头 上一组
                this.preGroup();
                break;
            case 38: //上箭头 上一页
                this.prePage();
                break;
            case 39: //右箭头 下一组
                this.nextGroup();
                break;
            case 40: //下箭头 下一页
                this.nextPage();
                break;
            case 13: //回车 全屏
                _this.changeFullScreen();
                break;
            case 32: //空格 自动播放
                _this.changeAutoPlay();
                break;
            default:
                //console.log(code);
                break;
        }
    }

});

module.exports = PreviewMain;