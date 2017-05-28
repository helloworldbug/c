/**
 * @component showPreView
 * @description 预览组件
 * @time 2015-09-21 18:50
 * @author Nick
 **/
var React = require("react");
var $ = require("jquery");
var RenderWrapper = require("../Preview/RenderWrapper");
var GlobalFunc = require("../Common/GlobalFunc");
var isChrome = !!window.chrome;
var eventLock = false;
var preViewInit = {
    container: "#phone-container",
    tid: null,
    option: null,
    tplOption: null,
    renderWrapper: null,
    tplData: null
};

var callbackObj = {};

module.exports = React.createClass({

    getInitialState: function () {
        return {
            showMusic: false,
            pageSum: 1,
            pageNumber: 0
        }
    },
    showViewPorts: function () {
        preViewInit.renderWrapper.showViewPorts();
    },
    hideViewPorts: function () {
        preViewInit.renderWrapper.hideViewPorts();
    },
    componentWillMount: function () {
        this.isFristTime();
    },

    render: function () {

        var showOne = false, showNext = false, showPrev = false;
        if (this.props.type == "publish") {
            if (preViewInit.renderWrapper) {
                showNext = preViewInit.renderWrapper.hasNextGroup();
                showPrev = preViewInit.renderWrapper.hasPrevGroup();
            }

        } else {
            if (preViewInit.renderWrapper) {
                showNext = preViewInit.renderWrapper.hasNextGroup() || preViewInit.renderWrapper.hasNextPage();
                showPrev = preViewInit.renderWrapper.hasPrevGroup() || preViewInit.renderWrapper.hasPrevPage();
            }

        }
        if (showNext ^ showPrev) {
            showOne = true;
        }
        var phoneMusic = <div id="phone-music">
            <audio id="phone-music-audio" preload="none" loop="loop"></audio>
            <div className="fly-note1"></div>
            <div className="fly-note2"></div>
            <section>
                <menu id="phone-music-menu"></menu>
            </section>
        </div>;

        var guide = this.state.isFristTime ? <div className="makePreview-guide" onClick={ this.guideHandleClick }></div> : null;

        var buttonContainer = showOne ? "phone-home-button1" : "phone-home-button";
        if (!showPrev && !showNext) buttonContainer += " btHide";

        var type = this.props.type;

        return (
            <div className="preview-phone">
                { type != "publish" ? guide : null }
                <div className="title">{this.props.userNick}</div>

                <div className="phone-container" id="make-preview">
                    <div id="phone-container">
                        <div className="swiper-wrapper">
                        </div>
                    </div>
                </div>

                <div id="phone-home-button" className={buttonContainer}>
                    <span id="pageToPrev" className={  showPrev ? "pageToPrev " : "pageToPrev btHide"}
                        onClick={this.prevPage.bind(this, callbackObj) }></span>
                    <span id="pageToNext" className={  showNext ? "pageToNext " : "pageToNext btHide"}
                        onClick={this.nextPage.bind(this, callbackObj) }></span>
                </div>
                {this.state.showMusic ? phoneMusic : null}
            </div>


        )
    },
    pageChanged: function (pageIndex, groupIndex) {
        if (this.props.pageChanged) {
            this.props.pageChanged();
        }
        this.forceUpdate();
    },
    clearGlobalComponent() {
        preViewInit.renderWrapper.clearGlobalComponent();
    },
    showMagazine(tplData) {
        preViewInit.renderWrapper.showMagazine(tplData);
        //this.renderHolder.showMagazine(tplData, 0);
    },
    //componentWillReceiveProps (nextProps) {
    //
    //    preViewInit.tid =nextProps.tid || null;
    //    preViewInit.tplData = nextProps.tplData || null;
    //    preViewInit.musicData = nextProps.musicData || null;
    //    preViewInit.renderWrapper = new RenderWrapper({
    //        container : "#phone-container",
    //        tpl       : nextProps.tplData,
    //        onSwipeEnd: this.pageChanged,
    //        musicId:"#phone-music"
    //    });
    //},

    componentDidMount: function () {

        preViewInit.tid = this.props.tid || null;
        preViewInit.tplData = this.props.tplData || null;
        preViewInit.musicData = this.props.musicData || null;
        preViewInit.renderWrapper = new RenderWrapper({
            container: "#phone-container",
            tpl: this.props.tplData,
            onSwipeEnd: this.pageChanged,
            musicId: "#phone-music"
        });
        if (this.props.type != "publish") {
            if (this.props.pageUid) {
                //debugger;
                preViewInit.renderWrapper.pageToId(this.props.pageUid)
            }
        }
        $(preViewInit.container).children()[0].addEventListener("mousewheel", function (e) {
            e.stopPropagation();
            return false;
        }, true);
        this.showByData();




    },

    componentWillUnmount: function () {
        //this.musicPause();
        preViewInit.renderWrapper.unmount();
    },

    showByData: function () {

        var tplData = preViewInit.tplData;
        console.log(tplData);
        //preViewInit.renderWrapper.showMagazine(tplData, 0);
        //showMagazine

        //callbackObj.callback({
        //    length: preViewInit.renderWrapper.pageLength,
        //    index : preViewInit.renderWrapper.currentPage
        //});
        //
        this.showMusic(preViewInit.musicData);

    },


    goPage: function () {

        var number = parseInt(this.props.pageNumber);

    },
    hasPrevPage() {
        return preViewInit.renderWrapper == null ? false : preViewInit.renderWrapper.hasPrevPage()
    },
    hasPrevGroup() {
        return preViewInit.renderWrapper == null ? false : preViewInit.renderWrapper.hasPrevGroup()
    },
    hasNextPage() {
        return preViewInit.renderWrapper == null ? false : preViewInit.renderWrapper.hasNextPage()
    },
    hasNextGroup() {
        return preViewInit.renderWrapper == null ? false : preViewInit.renderWrapper.hasNextGroup()
    },
    nextGroup() {
        preViewInit.renderWrapper.nextGroup()
    },
    nextPage: function () {
        preViewInit.renderWrapper.nextPage();
    },
    prevGroup() {
        preViewInit.renderWrapper.prevGroup();
    },
    prevPage: function () {
        preViewInit.renderWrapper.prevPage();
    },

    showMusic: function (data) {

        var musicSrc = data.tpl_music, _this = this;

        if (!musicSrc) return;
        preViewInit.renderWrapper.renderHolder.installMusicPlayer();
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
        preViewInit.renderWrapper.mainMusicPlay();
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

    //判断是否为第一次打开预览
    isFristTime: function () {
        var fristTime = GlobalFunc.getUserExtra('isFristTime');
        if (!!fristTime) {
            this.setState({ isFristTime: false });
        } else {
            this.setState({ isFristTime: true });
        }
    },

    guideHandleClick: function () {
        GlobalFunc.setUserExtra("isFristTime");
        this.setState({ isFristTime: false });
    }

});