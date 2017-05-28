/**
 * @component MagazineCard
 * @description 杂志卡片组件
 * @time 2015-09-22 11:32
 * @author StarZou
 **/

'use strict';

var React = require('react');
var Router = require('react-router');
var classNames = require('classnames');
var CommonUtils = require('../../utils/CommonUtils');
var MeActionCreators = require('../../actions/MeActionCreators');
var Notification = require('../../components/Common/Notification');
var GlobalFunc = require('./GlobalFunc');

var Route = Router.Route;
var Link = Router.Link;

require('../../../assets/css/magazine-card.css');

var     MagazineCard = React.createClass({

    getInitialState: function () {
        return {
            showQRCodeImage: false
        };
    },

    render: function () {

        var attributes = this.props.template.attributes;

        var showQRCodeImage = this.state.showQRCodeImage, url, qrCodeClassName, qrCodeComponent;

        var tid = this.tid = attributes.tpl_id;

        if (showQRCodeImage) {
            url = CommonUtils.generateViewTemplateUrl(tid);
            qrCodeClassName = classNames({
                'qr-code-image': true,
                'active'       : this.state.showQRCodeImage
            });

            qrCodeComponent = (
                <div className={qrCodeClassName}>
                    {CommonUtils.generateQRCode(url, 188)}
                </div>
            );
        }

        var previewParams = {
            tid: tid,
            uid: attributes.author
        };

        var starClassName = classNames({
            'star'  : true,
            'active': this.props.template.starred
        });

        return (
            <div className="works-card magazine-card">
                <div className="card-image">
                    <Link to="preview" params={previewParams}>
                        {/*<img src={attributes.tiny_img.substr(3)}/>*/}
                        <img src={GlobalFunc.subAvChar(attributes.tpl_share_img)}/>
                    </Link>
                </div>
                <div className="card-content">
                    <div className="avatar">
                        <img src={attributes.author_img || CommonUtils.getDefaultUserAvatar()}/>
                    </div>
                    <div className="info">
                        <div className="author" title={ attributes.author_name } >{attributes.author_name}</div>
                        <div className="date">{CommonUtils.fromNow(parseInt(attributes.reupdate_date) * 1000)}</div>
                    </div>
                    <div className="magazine-qr-code" onMouseOver={this.changeState.bind(this, true)} onMouseOut={this.changeState.bind(this, false)}></div>
                </div>
                {qrCodeComponent}
                <div className="card-divider"></div>
                <div className="card-action">
                    <div className="name">{attributes.name}</div>
                    <div className="number">阅读数：{attributes.read_pv}</div>
                    <div className={starClassName} title="收藏" onClick={this.handleCollect}></div>
                </div>
            </div>
        );
    },

    /*
     * 去掉url开头的 "AV:"
     
    subAvChar(url) {
        return url.substr(0, 3) == "AV:" ? url.substr(3) : url;
    },*/

    /**
     * 显示二维码
     * @param isShow
     */
    changeState: function (isShow) {
        this.setState({showQRCodeImage: isShow});
    },

    /**
     * 收藏
     */
    handleCollect: function () {
        MeActionCreators.addFavorite(this.tid).then(function (data) {
            Notification.currentNotification.show(data.message);
        }).catch(function (error) {
            Notification.currentNotification.show(error.message);
        });
    }

});

module.exports = MagazineCard;