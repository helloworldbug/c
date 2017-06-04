/**
 * @description 推送消息管理--消息View样式
 * @time 2016-07-04
 * @author tony
 */
'use strict';

// require core module
var React = require('react');
var Base = require('../../../utils/Base');
//导入消息管理CSS样式
require('../../../../assets/css/weixinmanager.css');
/**导入平台组件**/
var PlatformItem = require('./PushMsgPlatform');
/**按钮组件**/
var MsgBtns = require('./PushMsgItemBtns');
/**导入TabIndex 静态变量**/
const TabIndex = require('../../../constants/MeConstants').UserTab;

var CommonUtils = require('../../../utils/CommonUtils');

/**
 * 消息管理视图查看组件
 */
var PushMsgViewItem = React.createClass({
    /**
     * 初始化值
     * @returns {{}}
     */
    getInitialState : function () {
        return {}
    },

    render : function () {
        //获取值
        var data = this.props.msgObj;
        if(!data) return;

        var id = data.id;
        //名称
        var title = data.title || "";
        //封面图
        var coverPic = data.cover_pic || "";
        //创建时间
        var createDate = data.createDate || "";
        //发布时间
        var publishDate = data.publishDate || "";
        var platformsArr = data.plantfoms || [];
        //已推送平台
        var platformObj ={};
        platformsArr.forEach(function(platform, index){
            var name = platform.name;
            if(platformObj[name]){
                platformObj[name] += 1;
            }else{
                platformObj[name] = 1;
            }
        });
        var platforms = [];
        for(var k in platformObj){
            var obj = {};
            obj.name = k;
            obj.count = platformObj[k];
            platforms.push(<PlatformItem key={k} platform={obj} />)
        }

        var imageStyle = {
            backgroundImage : "url('"+coverPic+"')",
            backgroundSize : "cover"
        };

        var pcHref = "/views/pushing/pc.html?gid="+id;

        return (
            <div className='msgViewItem'>
                <div className="msgViewItem-div">
                    <div className="msgViewItem-image-div">
                        <a href={pcHref} target="_blank">
                            <div className="msgViewItem-image" style={imageStyle} ></div>
                            {this.generateQRCode(id)}
                        </a>
                    </div>
                    <div className="msgViewItem-name">{title}</div>
                    <MsgBtns showPushMsgDialog={this.props.showPushMsgDialog} msgObj={data} viewType="1" tabIndex = {this.props.tabIndex} />
                </div>
                {
                    this.props.tabIndex == TabIndex.WEIXINMGR
                        ?
                        <div className="msgViewItem-share-div">
                            <span className="msgViewItem-share-title">已推送：</span>
                            {platforms}
                        </div>
                        :
                        null
                }
            </div>
        )
    },

    /**
     * 生成二维码
     */
    generateQRCode: function (id) {
        return (
            <div className="msgViewItem-code-image" title="点击或扫描浏览消息">
                {CommonUtils.generateQRCode(CommonUtils.generateViewMessageUrl(id), 78)}
            </div>
        );
    }
});

module.exports = PushMsgViewItem;