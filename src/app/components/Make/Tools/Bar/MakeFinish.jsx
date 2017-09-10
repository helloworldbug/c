/**
 * @component 发布作品
 * @description 发布作品
 * @time 2015-09-19 19:20
 * @author Nick
 **/
var React = require("react");
var QRCode = require('qrcode.react');
var copy = require("../../../../../vendor/zeroclipboard/ZeroClipboard");
var DialogAction = require("../../../../actions/DialogActionCreator");
var PreviewShare = require('../../../Preview/PreviewShare');
var TplObjModel = require('../../../../utils/TplObjModel');
var GlobalFunc = require("../../../Common/GlobalFunc");
var AutoSave = require("../autoSave");
var Base=require('../../../../utils/Base');
import {Link} from 'react-router'

module.exports = React.createClass({

    componentDidMount: function () {
        copy.config({swfPath: "http://www.agoodme.com/vendor/zeroclipboard/ZeroClipboard.swf"});
        new copy(document.getElementById("copyLink"));
        this.initShare();
        AutoSave.stop();
    },
    close            : function () {
        AutoSave.start();
        DialogAction.hide()
    },
    render           : function () {
        var _href = this._getTplPcPrevHref(this.props.tid);
        var _host =location.host; //Base.getTplDomain();
        return (
            <div className="select-dialog">
                <div className="finish-dialog">
                    <div className="qrcode">
                        <QRCode size={160}
                                value={`http://${_host}/${this.props.tid}/shareme.html?tid=${this.props.tid}&dataFrom=pc2-0`}/>
                    </div>
                    <p className="content">
                        恭喜！你的作品已经发布成功！ {/**优质作品将有机会显示在 <Link to="/discovery" target="_blank">精品推荐</Link> 
                       <span id="copyLink" data-clipboard-target="linkContent" onClick={this.copyTip}>复制作品链接</span>**/}
                        <a id="linkContent" href={_href}><span>{_href}</span></a>
                    </p>
                    <PreviewShare ref="shareProduct"/>

                    <div className="finish-footer">
                        <ul>
                            <li onClick={this._prevTplHref}>
                                <div><span className="icon"></span>查看作品</div>
                            </li>
                            <li onClick={this._reMake}>
                                <div><span className="icon"></span>再做一张</div>
                            </li>
                            <li onClick={this._goUser}>
                                <div><span className="icon"></span>个人中心</div>
                            </li>
                        </ul>
                    </div>
                    <div className="close" onClick={this.close}></div>
                </div>
            </div>
        )
    },
    copyTip          : function () {
        GlobalFunc.addSmallTips("复制完成", 0.5);
    },
    initShare() {
        var tid = this.props.tid;
        var tplObjModel = new TplObjModel({tid: tid});
        tplObjModel.getTplObj(tid,
            ((_tpl) => {
                var title = _tpl[0].attributes.name;
                var pic = _tpl[0].attributes.tpl_share_img;
                var summary = _tpl[0].attributes.brief;
                var url = this._getTplPcPrevHref(this.props.tid);
                var shareComponentObject = {
                    url        : encodeURIComponent(url),
                    title      : title,
                    content    : title,
                    pic        : pic,
                    pics       : pic,
                    summary    : summary,
                    comment    : summary,
                    description: summary
                };
                var shareComponentObjects = {};

                ['tsina', 'renren', 'tqq', 'tqzone', 'kaixin', 'tieba', 'cqq'].forEach(_name => {
                    shareComponentObjects[_name] = shareComponentObject;
                });

                this.refs.shareProduct.setState(shareComponentObjects);
            }).bind(this)
        );
    },
    hideDialog       : function () {
        DialogAction.hide();
    },

    _getTplPcPrevHref: function (tid) {
        if (!tid) return;
        return "http://" + location.host + "/preview/tid=" + tid;
    },

    _prevTplHref: function () {
        var h = this._getTplPcPrevHref(this.props.tid);
        window.open(h);
        //window.location.href = h;
    },

    _reMake: function () {
        var h = "http://" + location.host + "/make";
        Base.linkToPath("/make")
        window.location.reload();
    },

    _goUser: function () {
        // var h = "http://" + location.host + "/user";
        Base.linkToPath("/user")
        // window.location.href = h;
    }

});
