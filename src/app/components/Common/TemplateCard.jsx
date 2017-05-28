/**
 * @component TemplateCard
 * @description 模板卡片组件
 * @time 2015-09-09 17:15
 * @author StarZou
 **/

'use strict';
var React = require('react');
var Router = require('react-router');
var classNames = require('classnames');
var CommonUtils = require('../../utils/CommonUtils');
var ComponentActionCreators = require('../../actions/ComponentActionCreators');
var GlobalFunc = require('./GlobalFunc');

var Route = Router.Route;
var Link = Router.Link;

require('../../../assets/css/template-card.css');

var TemplateCard = React.createClass({

    getInitialState: function () {
        return {
            showQRCodeImage: false
        };
    },

    render: function () {

        var attributes = this.props.template.attributes;

        var showQRCodeImage = this.state.showQRCodeImage, url, qrCodeClassName, qrCodeComponent;

        if (showQRCodeImage) {
            url = CommonUtils.generateViewTemplateUrl(attributes.tpl_id);
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

        return (
            <div className="works-card template-card">
                <div className="card-image" title="预览模版" onClick={this.showTemplatePreview}>
                    {/*<img src={attributes.tiny_img.substr(3)}/>*/}
                    <img src={GlobalFunc.subAvChar(attributes.tpl_share_img)} />
                </div>
                <div className="card-content">
                    <div className="name" title={ attributes.name }>{attributes.name}</div>
                    <div className="number">阅读数：{attributes.read_pv}</div>
                </div>
                {qrCodeComponent}
                <div className="card-divider"></div>
                <div className="card-action">
                    <div className="use-template-button">
                        <Link to="make" params={{tid:attributes.tpl_id}}>使用模板asd</Link>
                    </div>
                    <div className="template-qr-code" onMouseOver={this.changeState.bind(this, true)} onMouseOut={this.changeState.bind(this, false)}></div>
                </div>
            </div>
        );
    },

    /*
     * 去掉url开头的 "AV:"
     
    subAvChar(url) {
        return url.substr(0, 3) == "AV:" ? url.substr(3) : url;
    },*/

    changeState: function (isShow) {
        this.setState({showQRCodeImage: isShow});
    },

    /**
     * 预览模板作品
     */
    showTemplatePreview: function () {
        ComponentActionCreators.showTemplatePreview(this.props.template);
    }

});

module.exports = TemplateCard;