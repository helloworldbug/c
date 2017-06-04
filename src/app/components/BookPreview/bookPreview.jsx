/**
 * @description 书籍预览界面
 * @time 2016-11-25
 * @author tony
 */

'use strict';

//require core module
var React = require('react');
import {Link} from 'react-router';
var Base = require('../../utils/Base');
var ContextUtils = require('../../utils/ContextUtils');
//require owner style
require("./bookPreview.css");
require("../../../assets/css/reader/readerAll.css");

var serverurl = require("../../config/serverurl");

//require submodule

/**
 * 一键转档页面
 */
export default class BookPreview extends React.Component {
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
        //初始化状态
        var user = ContextUtils.getCurrentUser();
        this.userId = user.id || "20160808";    //目前只是测试ID
        //获取路由的参数
        var params = this.props.params;
        this.hash = params.hash || "1002";
    }
    /**
     *渲染转档提示界面
     */
    renderBookPreviewSection() {
        var api = serverurl.convertApi;
        console.log(api);
        var readerPC = new Reader({
            // 阅读器 DOM节点 
            domWrapId: "#reader-wrap",
            hostUrl: api + "/v1/transfer/readonline",
            // 可选, 比如: 未登录状态-试读  
            user_id: this.userId,
            // 必选 ，书籍id
            book_id: this.hash,
            /* *** *** *** */
            // 绑定事件,  true:手机/pad(默认), false: PC;
            isMobile: false,
            // 阅读器布局类型: PC, PAD, MOBILE
            clientType: "PC",
            // true: APP, 小精灵客户端(默认); false: 网页浏览器;
            isClient: false,
            /* *** *** *** */
            // true: 开启版权保护(默认); false: 关闭版权保护
            usePublish: false,
            //  {Number} 定义页面格式, 1: 一页版; 2: 两页版; 
            pageColumn: 2,
            // 重要. true: 不分页,直接读取 epub源文件; false: 需要分页计算(默认).
            useEpubFile: false,
            // 是否使用书签 true:默认使用
            useBookmark: false,
            // 是否使用笔记 true:默认使用
            useNote: false,
            /**
             * custom_nav_menus 为自定义导航栏。最多增加两个。
             * 
             * 考虑iphone5及其以下尺寸手机时,显示文字（text）不要超过两个字（在4寸手机以下，显示不下）
             */
            // custom_nav_menus: [{ // 自定义导航菜单，显示在目录、笔记、书签，之后
            //     text: "自定义", // 显示文字
            //     name: "custom", // 自定义书签名称
            //     prompt: "自定义111111", // 无自定义内容时显示
            //     cbFunc: function(bodyObj) { // 点击自定义书签后就执行
                    
            //         var dataVal = new Date().getTime();
            //         console.info("%c 自定义111导航的函数被点击了->" + dataVal, "color:white;background:black;");
            //         bodyObj.html(dataVal);
            //     },
            // }
            // ],
            
            probotionCb: function(){
                console.log("DEMO-->试读结束!");
            },
            
            exitReaderCb:function(){
                console.log("DEMO-->退出阅读器!");
            },
            getDisableChaptCb:function(){
                console.log("DEMO-->无权限 点击章节阅读!");
            },
            
            // 分享笔记--参数配置.
            note_share_conf : {
                "flag" : true,
                "share_items" : [{
                        // 微信好友
                        "type" : "wx",
                        //  开关(是否使用该分享). false: 关闭(默认); true: 打开,此时必须注册回调函数!
                        "flag" : true,
                        // 回调函数--分享逻辑
                        "share_cb" : function(data){
                            // 包括: book_id, chapter_id, note_txt
                            console.log("微信好友 AAA--> 回调函数!");
                            console.log(data);
                        }
                    }, {
                        // 微信朋友圈
                        "type" : "wx_moments",
                        "flag" : false,
                        "share_cb" : null
                    }, {
                        // 新浪微博
                        "type" : "sina_weibo",
                        "flag" : true,
                        "share_cb" : function(data){
                            console.log("新浪微博--> 回调函数!");
                        }
                    }, {
                        // qq好友
                        "type" : "qq",
                        "flag" : true,
                        "share_cb" : null
                    }, {
                        // qq空间
                        "type" : "qq_zone",
                        "flag" : false,
                        "share_cb" : null
                    }
                ]
            }
        });
    }
    
    /**
     *渲染界面
     */
    render() {
        //没有登录的情况下，直接跳转到登录页面，登录完成返回到转档页面
        var self = this;
        return (
            <div className="book-preview-wrap">
                <div id="reader-wrap" className="reader-box"></div>
            </div>
        );
    }
    
    /**
     *组件装载事件
     */
    componentDidMount() {
        var self = this;
        //实例化阅读器，必须先导入依赖的包
        // requirejs(["/vendor/underscore/underscore-min.js",
        //     "/vendor/matchjax/MathJax.js?config=MML_SVG",
            // "/vendor/reader/reader.dev.js"
        // ], function(){
        //     console.log("835545");
        //     self.renderBookPreviewSection();
        // });
        self.renderBookPreviewSection();
    }
    /**
     *组件挂载事件
     */
    componentWillUnmount() {
    }
};