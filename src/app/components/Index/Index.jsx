/**
 * @component Index
 * @description 首页组件
 * @time 2015-9-10
 * @author 曾文彬
 **/

'use strict';
// require core module
var React = require('react'),
    jSwipe = require('../../lib/jquery.Swipe'),
    ReactDOM=require("react-dom"),
    Base = require('../../utils/Base'),
    Slider = require('../Common/Slider'),
    Scene = require('../Common/Scene'),
    QRCode = require('qrcode.react');
// require children component
var Footer = require('../Common/Footer'),
    Images = require('../Common/Image');
import {Link} from 'react-router'
// require common mixins
var ImageModules = require('../Mixins/ImageModules'); 

// define Index component
var Index = React.createClass({

    mixins: [ImageModules],

    getAppDownloadURL(type) {
        return type === 'ios' ? 'https://itunes.apple.com/cn/app/me-wei-za-zhih5wei-hai-bao/id917062901?l=en&mt=8' : 'http://me.agoodme.com/dl/me.apk';
    },

    /**
     * 生成二维码
    */
    generateQRCode(value, size = 128) {
        return (<QRCode value={value} size={size}/>);
    },

    getInitialState() {
        return {
            isShowVideo: false,
            banners : [],    //首页Banner数据
            imgLinks: [],   //友情链接的图片类型
            textLinks: []   //友情链接的文字类型
        };
    },

    speed : 50,

    MyMar : null,

    /**
     * 判断浏览设备
    */
    isMobileDevice: function () {
        var userAgent = navigator.userAgent;

        return /android/i.test(userAgent) || /iphone|ipad|ipod/i.test(userAgent);
    },
     // build Swipe jquery plugin config
    setJqueryPluginConfig() {
        return {
            mainCell: '.bd ul',
            effect: 'left',
            autoPlay : 5000
        };
    },

    // build Swipe jquery plugin
    buildJqueryPlugin(selector) {
        var context = this;

        return function () {

            return context.Swipe = new jSwipe($(selector).get(0), context.setJqueryPluginConfig());
        }
    },
    render: function () {

        if (this.isMobileDevice()) {
            Base.linkToPath('/phone');
            return null;
        }
var origin=location.origin;
        return (
            <div className="inner">
                <Slider ref="slider"/>
                <div className="home-bg">
                    {/* 场景 */}
                    <Scene single="hot" condition={{ 'bannertype =': '\'pc首页banner\'' }} jQPluginMethod={ this.buildJqueryPlugin('.explore-banner') } /> 
                    {/*
                    <div className="con">
                        <p className="p-animate">
                            <Images src={this.defineImageModules()['banner_text']} />
                        </p>
                        <p className="p-link p-animate1">
                            <Link to="/make" target="_blank" className="a1 btn-navy btn-fill-vert-o">免费制作</Link>
                            <Link to="/dataProcessing" target="_blank" className="a1 btn-navy btn-fill-vert-o up-icon-new">一键出版</Link>
                            <Link to="/download" target="_blank" className="a1 btn-navy btn-fill-vert-o">APP下载</Link>
                        </p>
                        <p className="p-animate2"><a href="javascript:;" onClick={this.handleClick()}  className="btn-vod">介绍视频</a></p>
                    </div>
                    <div className='readmore' onClick = { this.handleClickScroll }></div>
                    */}
                    {/*介绍和H5和一键出版*/}
                    <div className="home-operation-container">
                        <div className="home-common-operation">
                            <div className="home-common-operation-title h5-icon">在线编辑器</div>
                            <div className="home-common-operation-brief">极简制作流程，五分钟创作分享，丰富的在线编辑功能， 数据随时跟踪反馈，永久免费体验！ </div>
                            <Link to="/make" target="_blank" >立即创作</Link>
                            <a href="javascript:;" onClick={this.handleClick()}  className="h5-edit-intro">介绍视频</a>
                        </div>
                        <div className="home-common-operation">
                            <div className="home-common-operation-title book-icon">一键出版</div>
                            <div className="home-common-operation-brief">在线转换文档格式，让出版更加便捷。21天，快速出版。相比传统出版，效率提升8倍！</div>
                            <Link to="/dataProcessing" target="_blank" >一键转档</Link>
                        </div>
                    </div>
                </div>
                {!this.state.isShowVideo?null:<div id="video-bg" style={{ display:  'block'  }}>
                    <div id="close" onClick={this.handleClickClosePlayer()}></div>
                    <div className="home-video-box">
                        <video ref="video" controls="controls" preload="auto" id="home-video">
                            <source src="./video/me.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>}


                <div className="works">
                    <div className="wrod">
                        <h2>品牌合作案例</h2>

                        <p><Link target="_blank" to="/discovery">浏览更多></Link></p>
                    </div>
                    <div className="works-list">
                        <ul>
                            <li>
                                <Images src={this.defineImageModules()['case1']}  width="195" height="195" />
                                <Link to="/preview/tid=150b293a2547450f" target="_blank">
                                    <div className="code">
                                        <div className="qrcode-segent" title="点击或扫描浏览作品">
                                            { this.generateQRCode(origin+'/preview/tid=150b293a2547450f', 115) }
                                        </div>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Images src={this.defineImageModules()['case2']}  width="195" height="195" />
                                <Link to="/preview/tid=150cbc3f447e0ade" target="_blank">
                                    <div className="code">
                                        <div className="qrcode-segent" title="点击或扫描浏览作品">
                                            { this.generateQRCode(origin+'/preview/tid=150cbc3f447e0ade', 115) }
                                        </div>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Images src={this.defineImageModules()['case3']}  width="195" height="195" />
                                <Link to="/preview/tid=150cc6176eeeb417" target="_blank">
                                    <div className="code">
                                        <div className="qrcode-segent" title="点击或扫描浏览作品">
                                             { this.generateQRCode(origin+'/preview/tid=150cc6176eeeb417', 115) }
                                        </div>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Images src={this.defineImageModules()['case4']}  width="195" height="195" />
                                <Link to="/preview/tid=150f5548a0e2d506" target="_blank">
                                    <div className="code">
                                        <div className="qrcode-segent" title="点击或扫描浏览作品">
                                            { this.generateQRCode(origin+'/preview/tid=150f5548a0e2d506', 115) }
                                        </div>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Images src={this.defineImageModules()['case5']}  width="195" height="195" />
                                <Link to="/preview/tid=150f55e20decf391" target="_blank">
                                    <div className="code">
                                        <div className="qrcode-segent" title="点击或扫描浏览作品">
                                            { this.generateQRCode(origin+'/preview/tid=150f55e20decf391', 115) }
                                        </div>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Images src={this.defineImageModules()['case6']}  width="195" height="195" />
                                <Link to="/preview/tid=150f55526271f64c" target="_blank">
                                    <div className="code">
                                        <div className="qrcode-segent" title="点击或扫描浏览作品">
                                            { this.generateQRCode(origin+'/preview/tid=150f55526271f64c', 115) }
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="home-parnter">
                        <div className="parnter-top"></div>
                        <div id="parnter" ref="parnter" onMouseOver={this.parnterMouseover} onMouseOut={this.parnterMouseout} className="parnter-lists">
                            <div ref="parnter1">
                                <Images src={this.defineImageModules()['home-parnter']} width="1170" height="254" />
                                <Images src={this.defineImageModules()['home-parnter']} width="1170" height="254" />
                                <Images src={this.defineImageModules()['home-parnter']} width="1170" height="254" />
                                <Images src={this.defineImageModules()['home-parnter']} width="1170" height="254" />
                                <Images src={this.defineImageModules()['home-parnter']} width="1170" height="254" />
                            </div>
                            <div ref="parnter2"></div>
                        </div>
                        <div className="parnter-down"></div>
                    </div>
                </div>

                <div className="home-template">
                    <div className="wrod">
                        <h2>海量模版库</h2>
                        <p><Link target="_blank" to="/create">浏览更多></Link></p>
                    </div>
                    <div className="tpl">
                        <Images src={this.defineImageModules()['tpl_image']} />
                    </div>
                </div>

                <div className="musics">
                    <div className="wrod">
                        <h2>丰富的背景音乐库</h2>
                        <h3>本地音乐+线上搜索，多一种维度表达</h3>
                        <p><Link target="_blank" to="/make">体验更多></Link></p>
                    </div>
                    <div className="tpl">
                        <Images src={this.defineImageModules()['music_image']} />
                    </div>
                </div>

                <div className="musics2">
                    <div className="wrod">
                        <h2>炫酷动效，极致流畅</h2>
                        <h3>设计感十足的动态元素，让你的H5更加不凡</h3>
                    </div>
                    <div className="tpl">
                        <Images src={this.defineImageModules()['music_two_image']} />
                    </div>
                </div>

                <div className="statistics">
                    <div className="wrod">
                        <h2>强大的数据统计</h2>
                        <h3>掌握最新反馈，全面了解粉丝动态</h3>
                        <p><Link target="_blank" to="/user?index=4">体验更多></Link></p>
                    </div>
                    <div className="tpl">
                        <Images src={this.defineImageModules()['chart_image']} />
                    </div>
                </div>

                <div className="multi-platform">
                    <div className="wrod">
                        <h2>免费在线制作</h2>
                        <h3>APP、PC双端制作浏览,传播力极强</h3>
                        {/*<div className="down-link">
                            <a href={this.getAppDownloadURL('ios')} className="ios" target="_blank"></a>
                            <a href={this.getAppDownloadURL('android')} className="android" target="_blank"></a>
                        </div>*/}
                        <p className="p-link">
                            <Link to="/make" target="_blank" className="a1 btn-navy btn-fill-vert-o">免费创作</Link>
                            <Link to="/register" target="_blank" className="a1 btn-navy btn-fill-vert-o">立即注册</Link>
                        </p>
                        {/*<p><a target="_blank" href="#/register">立即注册></a></p>*/}
                    </div>
                </div>

                { this.generateFriendLink() }

                <Footer className="index-footer" />
            </div>
        );
    },

    /*
     * 友情链接
    */
    generateFriendLink: function() {
        return (
            <div className="home-friend-link">
                <h3>友情链接</h3>
                <ul>
                    {/*
                    <li><a href="http://www.pngone.com/" target="_blank"><Images src={this.defineFriendLink()['pngone']} title="拼玩官网" alt="拼玩官网" /></a></li>
                    <li><a href="http://www.h5-share.com/" target="_blank"><Images src={this.defineFriendLink()['h5Share']} title="H5案例分享" alt="H5案例分享" /></a></li>
                    <li><a href="http://www.xueps.cn/" target="_blank"><Images src={this.defineFriendLink()['ps']} title="PS技巧" alt="PS技巧" /></a></li>
                    <li><a href="http://www.iguoguo.net/html5" target="_blank"><Images src={this.defineFriendLink()['aiguoguo']} title="H5欣赏" alt="H5欣赏" /></a></li>
                    <li><a href="http://www.ui001.com/" target="_blank"><Images src={this.defineFriendLink()['UI']} title="UI设计第一站" alt="UI设计第一站" /></a></li>
                    <li><a href="http://www.yestone.com/" target="_blank"><Images src={this.defineFriendLink()['yswtone']} title="精选图库" alt="精选图库" /></a></li>
                    <li><a href="https://bearyboard.com/" target="_blank"><Images src={this.defineFriendLink()['baiban']} title="白板" alt="白板" /></a></li>
                    <li><a href="http://www.h5shuo.com/" target="_blank"><Images src={this.defineFriendLink()['h5shuo']} title="H5说" alt="H5说" /></a></li>
                    <li><a href="http://www.h6app.com" target="_blank"><Images src={this.defineFriendLink()['h6app']} title="未来应用" alt="未来应用" /></a></li>
                    <li><a href="http://tool.96weixin.com/" target="_blank"><Images src={this.defineFriendLink()['96winxin']} title="96微信工具" alt="96微信工具" /></a></li>
                    */}
                    {
                    this.state.imgLinks.map((item, index) =><li key={item.order_num}><a href={item.target} target="_blank"><Images src={item.content} title={item.alt} alt={item.alt} /></a></li>)
                    }
                </ul>
                <p>
                    {/*
                    <a href="http://www.logohhh.com/" title="狼牙创意网" target="_blank">狼牙创意网</a>
                    <a href="http://www.weimeifan.net/" title="唯美范" target="_blank">唯美范</a>
					<a href="http://www.bbtroom.com/" title="牛熊交易室" target="_blank">牛熊交易室</a>
                    */}
                    {
                    this.state.textLinks.map( (item, index) => <a key={index} href={item.target} title={item.alt} target="_blank">{item.content}</a>)
                    }
                </p>
            </div>
        );
    },

    componentDidMount: function () {
        !this.isMobileDevice() && this.parnterScroll();

        this.bindWindowScrollEvent();
        //动态查询友情链接
        this.loadBlogroll();
    },
    /**
     * 加载友情链接
     */
    loadBlogroll (){
        //TODO 需要优化，把1000条活动都查询出来了。
        var strCQL = "select * from website_link where status =0 order by order_num desc";
        fmacloud.Query.doCloudQuery(strCQL,{
            success : (data) => {
                if(data.results.length > 0){
                    var blogrollData = this.convert_list_2_json(data.results);
                    var _imgLinks = blogrollData.filter( item => item.link_type == 2);
                    var _textLinks = blogrollData.filter( item => item.link_type == 1);
                    this.setState({
                        imgLinks : _imgLinks,
                        textLinks : _textLinks
                    });
                }
            }, 
            error : (err) => {
                console.log("查询PC端活动失败: ",err);
            }
        });
    },
    /**
     *转换tpl list 转换成JSON
     */
    convert_list_2_json (a){
        var result = [];
        var len = a.length;
        for(var i=0; i<len; i++){
            result[i] = a[i].toJSON();
        }
        return result;
    },
    bindWindowScrollEvent(options) {
        var isUnset = !!options && options.isUnset,
            scrollCallback = this.windowScrollCallback;

        $(window)[isUnset ? 'unbind' : 'bind']('scroll', scrollCallback);
    },

    windowScrollCallback() {

        this.refs.slider.handleScroll();
    },

    componentWillUnmount: function () {
        !this.isMobileDevice() && this.parnterMouseover();
        this.bindWindowScrollEvent({ isUnset: true });
    },
 
    parnterScroll() {
        var parnter2 = ReactDOM.findDOMNode(this.refs.parnter2),
            parnter1 = ReactDOM.findDOMNode(this.refs.parnter1);
        parnter2.innerHTML = parnter1.innerHTML;

        this.MyMar = setInterval(this.Marquee, this.speed);
    },  

    parnterMouseover() {
      clearInterval(this.MyMar);
    },
    
    parnterMouseout() {
      this.MyMar = setInterval(this.Marquee, this.speed);
    },

    Marquee() {
        var parnter2 = ReactDOM.findDOMNode(this.refs.parnter2),
            parnter1 = ReactDOM.findDOMNode(this.refs.parnter1),
            parnter = ReactDOM.findDOMNode(this.refs.parnter);

        if( parnter2.offsetTop - parnter.scrollTop <= 0 )
            parnter.scrollTop -= parnter1.offsetHeight;
        else{
            parnter.scrollTop++;
        }
    },

    /*
     * 点击滚动
    */ 
    handleClickScroll: function() {
        $('html,body').animate({
            scrollTop:$('.works').offset().top  - 54}, 800);
    },

    handleClick() {
        return (_e => {
            this.setState({ isShowVideo: true });
        }).bind(this);
    },
    openPlayerState() {

        var node=ReactDOM.findDOMNode(this.refs.video);
        if(node)node[this.state.isShowVideo ? 'play' : 'pause']();
        //ReactDOM.findDOMNode(this.refs.video)[this.state.isShowVideo ? 'play' : 'pause']();
    },

    componentDidUpdate() {
        this.openPlayerState();
    },

    handleClickClosePlayer() {
        return (_e => {
            this.setState({ isShowVideo: false });
        }).bind(this);
    }
});

// export Index component
module.exports = Index;
