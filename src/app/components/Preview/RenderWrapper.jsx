/**
 * @description 对显示模块封装，管理翻页的状态
 * @time 2016-4-16
 * @author lifeng
 */

'use strict';

// require core module
var React = require('react');
var $ = require("jquery")
require("../../utils/render.js");
var Base = require('../../utils/Base');

class RenderWrapper {

    /**
     *
     * @param options
     *tpl:作品数据 *必填
     * container:渲染出来的dom ID *必填
     * groupIndex:初始显示的组
     * pageIndex:初始显示的页
     * onSwipeEnd:滑动翻组页后通知client
     */
    constructor(options) {
        this.ops = options || {};
        if (!this.ops.tpl || !this.ops.container) {
            throw "invalid options"
        }
        this.groupIndex = this.ops.groupIndex || 0;
        this.pageIndex = this.ops.pageIndex || 0;
        this.eventLock = false;
        this.musicId = this.ops.musicId;
        ///todo 转换成显示模块的结构
        this.data = tpl2ShowStruct(this.ops.tpl);
        this.renderHolder = new dms.MagazineDisplay2(this.ops.container);
        var _this = this;
        this.renderHolder.showMagazine(this.ops.tpl, 0);
        this.renderHolder.installMusicPlayer();
        if (_this.ops.onTouchSwipeEnd) {
            this.renderHolder.swipeEnd = _this.ops.onTouchSwipeEnd
        }

        this.renderHolder.pageToEnd = function () {
            //翻页
            //console.log("pageToEnd", _this.renderHolder.pageIndex);
            _this.renderHolder.changeGroupPageNumStatus();
            _this.pageIndex = _this.renderHolder.pageIndex;
            _this.groupIndex = _this.renderHolder.bookIndex;
            _this.eventLock = false
            if (_this.ops.onPageToEnd) {
                _this.ops.onPageToEnd(_this.pageIndex, _this.groupIndex)
            }
        };
        this.renderHolder.onSwipeTouchEnd = function () {
            //翻页
            //console.log("pageindex", _this.renderHolder.pageIndex);
            _this.pageIndex = _this.renderHolder.pageIndex;
            _this.groupIndex = _this.renderHolder.bookIndex;
            _this.eventLock = false;
            if (_this.ops.pageChanged) {
                _this.ops.pageChanged(_this.pageIndex, _this.groupIndex)
            }

            if (_this.ops.onSwipeEnd) {
                _this.ops.onSwipeEnd(_this.pageIndex, _this.groupIndex)
            }
        };
        this.renderHolder.onBookSwipeTouchEnd = function () {
            //翻组
            //console.log("groupIndex", _this.renderHolder.bookIndex, _this.renderHolder.pageIndex);
            _this.groupIndex = _this.renderHolder.bookIndex;
            _this.pageIndex = _this.renderHolder.pageIndex;
            _this.eventLock = false
            if (_this.ops.onSwipeEnd) {
                _this.ops.onSwipeEnd(_this.pageIndex, _this.groupIndex)
            }
        };
        if (window.dms) {
            //视频播放时调整样式

            dms.dispatcher.on(dms.OTHER_AUDIO_PLAY, pauseMainAudio);
            dms.dispatcher.on(dms.VIDEO_PLAY, pauseMainAudio);
            dms.dispatcher.on(dms.OTHER_AUDIO_END, replayMainAudio);
            function pauseMainAudio(data) {
                var $music = $(_this.musicId), $notes = $(".fly-note", $music), $mainAudio = $("audio", $music);
                //是点击播放iframe的时候,隐藏其他操作按钮
                if (data && data.target && data.target == "iframe") {
                    hideScreenOperationButton();
                    $musicWrapper.hide();
                }
                if ($mainAudio[0] && !$mainAudio[0].paused) {
                    $mainAudio[0].pause();
                    $music.removeClass("spin");
                    $notes.removeClass("note");
                    //isPlay = "off";
                    //switchMusicLabel("关闭音乐");
                }
            }


            function replayMainAudio(data) {
                //关闭播放iframe的时候,显示其他操作按钮
                var $music = $(_this.musicId), $notes = $(".fly-note", $music), $mainAudio = $("audio", $music);
                if (data && data.target && data.target == "iframe") {
                    showScreenOperationButton();
                    if (__tpl.tpl_music && __tpl.tpl_music !== "") {
                        $musicWrapper.show();
                    }
                }
                if ($mainAudio[0] && $mainAudio[0].paused) {
                    $mainAudio[0].play();
                    if (window.dms) {
                        //派发事件
                        var event = dms.createEvent(dms.MANI_AUDIO_PLAY, $music[0]);
                        dms.dispatcher.dispatchEvent(event);
                    }
                    $music.addClass("spin");
                    $notes.addClass("note");
                    //isPlay = "on";
                    //switchMusicLabel("开启音乐");
                }

            }

        }
        if (this.groupIndex != 0 || this.pageIndex != 0) {
            this.pageTo(this.pageIndex, this.groupIndex);
        }

    }

    showMagazine(tplData) {
        this.renderHolder.showMagazine(tplData, 0);
    }

    clearGlobalComponent() {
        this.renderHolder.clearGlobalComponent()
    }

    /**
     * 显示目录
     */
    showViewPorts() {
        this.renderHolder.showViewPorts();
    }

    /**
     * 隐藏目录
     */
    hideViewPorts() {
        this.renderHolder.hideViewPorts();
    }

    /**
     *卸载
     */
    unmount() {
        if (window.dms) {
            dms.dispatcher.removeAllEventListeners(dms.VIDEO_PLAY);
            dms.dispatcher.removeAllEventListeners(dms.OTHER_AUDIO_END);
            dms.dispatcher.removeAllEventListeners(dms.OTHER_AUDIO_PLAY);
        }
    }

    /**
     * 取作品所有页的长度
     */
    getAllPagesLength() {
        return this.renderHolder.getAllPagesLength();
    }

    hasNextGroup() {
        return this.groupIndex < this.data.groups.length - 1
    }

    /**
     * 页是否锁定
     */

    isLockPage() {
        var page = this.data.groups[this.groupIndex].pages[this.pageIndex];
        var pageAnimation = JSON.parse(page.page_animation || "{}");
        return pageAnimation.lock;
    }

    hasNextPage() {
        var pagesRoot = this.data.groups[this.groupIndex];
        return this.pageIndex < pagesRoot.pages.length - 1
    }

    hasPrevGroup() {
        return this.groupIndex > 0
    }

    hasPrevPage() {
        return this.pageIndex > 0
    }

    nextGroup() {
        if (this.hasNextGroup()) {
            this.pageTo(0, this.groupIndex + 1);
            //this.pageIndex = 0;
            //this.groupIndex = this.groupIndex + 1;
        }
    }

    nextPage() {
        if (this.hasNextPage()) {
            this.pageTo(this.pageIndex + 1, this.groupIndex);
            //this.pageIndex = this.pageIndex + 1;
        } else if (this.hasNextGroup()) {
            this.nextGroup()
            //this.pageTo(0, this.groupIndex + 1);
            //this.pageIndex=0;
            //this.groupIndex=this.groupIndex+1;
        }
    }

    /**
     * 更新当前组页码显示
     */
    changeGroupPageNumStatus() {
        this.renderHolder.changeGroupPageNumStatus();
    }

    prevGroup() {
        if (this.hasPrevGroup()) {
            this.pageTo(0, this.groupIndex - 1);

            //this.groupIndex = this.groupIndex - 1;
            //this.pageIndex = 0;
        }
    }

    prevPage() {
        if (this.hasPrevPage()) {
            this.pageTo(this.pageIndex - 1, this.groupIndex)
            //this.pageIndex =this.pageIndex - 1;
        } else if (this.hasPrevGroup()) {
            ///todo 第二组不能跳转到向前第一组最后一页 15417d376ed570cf
            var pageRoot = this.data.groups[this.groupIndex - 1];
            this.pageTo(pageRoot.pages.length - 1, this.groupIndex - 1);
            //this.pageIndex = pageRoot.pages.length - 1;
            //this.groupIndex = this.groupIndex - 1;
        }
    }

    pageTo(pageIndex, groupIndex) {
        if (this.eventLock == false) {
            this.pageIndex = pageIndex;
            this.groupIndex = groupIndex;
            //this.eventLock = true;
             
            this.renderHolder.pageTo(pageIndex, groupIndex);
            //this.renderHolder.changeGroupPageNumStatus()
            //if (this.ops.onSwipeEnd) {
            //    this.ops.onSwipeEnd(this.pageIndex, this.groupIndex)
            //}
        }
    }

    pageToId(pageUid) {
        this.renderHolder.pageToId(pageUid);
    }
    getPageDataObjects(pageIndex) {
        return this.renderHolder.getPageDataObjects(pageIndex);
    }
    /**
     * 返回当前页在同层页中的下标
     */
    getPageIndex() {
        return this.pageIndex;
    }
    /**
     * 返回当前组在同层组中的下标
     */
    getGroupIndex() {
        return this.groupIndex;
    }

    /**
     * 返回当前作品在显示时的结构
     */
    getTpl() {
        return this.data;
    }

    /**
     * 返回当前页同层的所有页
     */
    getBrotherPagesRef() {
        var pagesRoot = this.data.groups[this.groupIndex];
        return pagesRoot.pages;
    }

    /**
     * 返回当前组同层的所有组
     */
    getBrotherGroupsRef() {
        return this.data.groups;
    }

    getCurrentPageRef() {
        var pagesRoot = this.data.groups[this.groupIndex];
        return pagesRoot.pages[this.pageIndex];
    }

    mainMusicPlay() {
        if (window.dms) {
            //派发事件
            var event = dms.createEvent(dms.MANI_AUDIO_PLAY, $(this.musicId)[0]);
            dms.dispatcher.dispatchEvent(event);
        }
    }

}

function tree2Line(group) {
    var pages = [];
    var children = group.pages;
    if (children) {
        children.forEach((child)=> {
            if (child.f_type == 2) {
                pages = pages.concat(tree2Line(child))
            } else {
                pages.push(child)
            }
        })
    }

    return pages

}
function tpl2ShowStruct(tpl) {
    var tpl = $.extend({}, tpl, true)
    if (tpl.tpl_sign == 2) {
        tpl.groups.forEach((group)=> {
            group.pages = tree2Line(group);
        });
    } else {
        ///me magazine
        tpl.groups = [{pages: tpl.page_value}];
        delete tpl.page_value;

    }
    // console.log("render struct", tpl);
    return tpl
}

// define Preview component
module.exports = RenderWrapper;

