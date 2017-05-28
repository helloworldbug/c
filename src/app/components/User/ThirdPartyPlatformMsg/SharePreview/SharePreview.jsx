/**
 * @component 分享预览
 * @description 微博、微信等分享预览
 * @time 2016/7/1 10:00
 * @author guYY
 **/
var React = require("react");
//导入css 及相关组件
require('../../../../../assets/css/sharePreview.css');
var PreviewSingleNews = require('./PreviewSingleNews');
var PreviewMultiNews = require('./PreviewMultiNews');
var PreviewWechat = require('./PreviewWechat');
var PreviewNewsText = require('./PreviewNewsText');
var PreviewSina = require('./PreviewSina');
var PreviewFriend = require('./PreviewFriend');
//默认图片预加载
var phoneBg1 = require("../../../../../assets/images/sharePreview/phone_bg_01.png");
var phoneBg2 = require("../../../../../assets/images/sharePreview/phone_bg_02.png");
var default01 = require("../../../../../assets/images/sharePreview/default01.png");
var default02 = require("../../../../../assets/images/sharePreview/default02.png");
var KEY_SINGLE = "single",
    KEY_MULTI = "multi",
    KEY_TEXT = "text",
    KEY_WECHAT = "weChat",
    KEY_SINA = "sina",
    KEY_FRIEND = "friend";

//预览消息格式：title标题  author作者  content内容  digest摘要 auto_digest（无图内容,摘要为空时显示）thumb_media作品封面  content_source_url阅读全文链接  show_cover_pic true/false是否显示封面到正文
//获取数据
var msgItem = window.show_data ? window.show_data.msgItem : {};
var newsArr = msgItem ? msgItem.articles : [];
var newsLen = newsArr ? newsArr.length : 0;
//var userHeaderUrl = msgItem.userHeaderUrl ? msgItem.userHeaderUrl :"http://ac-syrskc2g.clouddn.com/abfa326e45bd1a5edf5d.jpg?imageView/2/w/300/h/300/q/100/format/png";
var userHeaderUrl = window.show_data ? window.show_data.headerUrl : "http://ac-syrskc2g.clouddn.com/abfa326e45bd1a5edf5d.jpg?imageView/2/w/300/h/300/q/100/format/png";
//根据索引获取消息对象
var getNewsByIndex = function (index) {
    if (!newsArr || index < 0 || index >= newsLen) {
        return {};
    }
    return newsArr[index];
}
//第一个消息对像
var firstNews = getNewsByIndex(0);
//当前显示消息对象
var currentNews = firstNews;
var currentIndex = 0;
//组件数组
var moduleArr = [];
//标题数组
var titleArr = [];
titleArr[KEY_SINGLE] = "图文消息";
titleArr[KEY_MULTI] = "图文消息";
titleArr[KEY_TEXT] = "消息正文";
titleArr[KEY_WECHAT] = "朋友圈";
titleArr[KEY_SINA] = "分享新浪微博";
titleArr[KEY_FRIEND] = "发送给朋友";

var msgItem, newsArr, newsLen, userHeaderUrl;
//分享预览组件 -主体部份
var SharePreview = React.createClass({
    //组件重置
    resetModule      : function () {
        moduleArr[KEY_SINGLE] = <PreviewSingleNews currentNews={firstNews } msgclick={this.showNewsText}/>;
        moduleArr[KEY_MULTI] = <PreviewMultiNews newsArr={newsArr} msgclick={this.showNewsText}/>;
        moduleArr[KEY_TEXT] = <PreviewNewsText currentNews={currentNews}/>;
        moduleArr[KEY_WECHAT] =
            <PreviewWechat currentNews={currentNews} userHeaderUrl={userHeaderUrl} msgclick={this.showNewsText}/>;
        moduleArr[KEY_SINA] =
            <PreviewSina currentNews={currentNews} userHeaderUrl={userHeaderUrl} msgclick={this.showNewsText}/>;
        moduleArr[KEY_FRIEND] =
            <PreviewFriend currentNews={currentNews} userHeaderUrl={userHeaderUrl} msgclick={this.showNewsText}/>;
    },
    getInitialState  : function () {
        this.resetModule();
        if (newsLen <= 1) {
            return {
                currModule: moduleArr[KEY_SINGLE], //当前组件
                title     : titleArr[KEY_SINGLE],        //标题
                bgUrl     : phoneBg1,                      //背景图
                navIndex  : 0                             //当前导航索引
            }
        } else {
            return {
                currModule: moduleArr[KEY_MULTI],
                title     : titleArr[KEY_SINGLE],
                bgUrl     : phoneBg1,
                navIndex  : 0                             //当前导航索引
            }
        }
    },
    componentDidMount: function () {
        msgItem = window.show_data ? window.show_data.msgItem : {};
        newsArr = msgItem ? msgItem.articles : [];
        newsLen = newsArr ? newsArr.length : 0;
//var userHeaderUrl = msgItem.userHeaderUrl ? msgItem.userHeaderUrl :"http://ac-syrskc2g.clouddn.com/abfa326e45bd1a5edf5d.jpg?imageView/2/w/300/h/300/q/100/format/png";
        userHeaderUrl = window.show_data ? window.show_data.headerUrl : "http://ac-syrskc2g.clouddn.com/abfa326e45bd1a5edf5d.jpg?imageView/2/w/300/h/300/q/100/format/png";
        console.log(userHeaderUrl);
    },
    /**
     * 点击导航
     * @param key 传参类型string表示对应组件key,  传number表示手动同步导航选中的导航索引
     * @param navIndex 导航索引
     * @param e
     */
    clickNavHandler  : function (key, navIndex, e) {
        //消息列表根据消息数量不同显示
        if (key == KEY_SINGLE && newsLen > 1) {
            key = KEY_MULTI;
        }
        if (key == 1) {
            key = KEY_TEXT;
        }
        var bgUrl = phoneBg1;
        //部分组件背景取白色图 消息正文 分享微信朋友圈
        if (key == KEY_TEXT || key == KEY_WECHAT) {
            bgUrl = phoneBg2;
        }
        //当前对象变化  需重置组件
        this.resetModule();
        this.setState({currModule: moduleArr[key], title: titleArr[key], navIndex: navIndex, bgUrl: bgUrl});
    },
    /**
     * 指向消息正文详情
     * @param index 消息索引  -1表示仍使用当前索引
     */
    showNewsText     : function (index) {
        if (index < 0 || index >= newsLen) {
            index = currentIndex;
        }
        currentNews = getNewsByIndex(index);
        currentIndex = index;
        moduleArr[KEY_TEXT] = <PreviewNewsText currentNews={currentNews}/>;
        this.setState({currModule: moduleArr[KEY_TEXT], title: titleArr[KEY_TEXT], bgUrl: phoneBg2});
        //同步导航选中-消息正文
        this.clickNavHandler(1, 1, null);
    },
    render           : function () {
        return (
            <div>
                <div id="sharePreview" style={{background:"url("+this.state.bgUrl+") no-repeat"}}>
                    <div className="shareArticleTitle">{this.state.title}</div>
                    <div id="sharePreviewContainer" className="sharePreview_pt">
                        {this.state.currModule }
                    </div>
                </div>
                <ul id="sharePreviewMenu">
                    <li onClick={this.clickNavHandler.bind(this,KEY_SINGLE,0)}
                        className={this.state.navIndex == 0?"li_ck":""}>图文消息
                    </li>
                    <li onClick={this.clickNavHandler.bind(this,KEY_TEXT,1)}
                        className={this.state.navIndex == 1?"li_ck":""}>消息正文
                    </li>
                    <li onClick={this.clickNavHandler.bind(this,KEY_WECHAT,2)}
                        className={this.state.navIndex == 2?"li_ck":""}>分享微信朋友圈
                    </li>
                    <li onClick={this.clickNavHandler.bind(this,KEY_SINA,3)}
                        className={this.state.navIndex == 3?"li_ck":""}>分享新浪微博
                    </li>
                    <li onClick={this.clickNavHandler.bind(this,KEY_FRIEND,4)}
                        className={this.state.navIndex == 4?"li_ck last_li":"last_li"}>发送给朋友
                    </li>
                </ul>
            </div>
        );

    }
});
module.exports = SharePreview;
