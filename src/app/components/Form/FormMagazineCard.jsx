/**
 * @component FormMagazineCard
 * @description 表单处杂志卡片组件
 * @time 2015-10-10 11:32
 * @author StarZou
 **/

'use strict';

var React = require('react');
var Router = require('react-router');
var CommonUtils = require('../../utils/CommonUtils');
var MeAPI = require('../../utils/MeAPI');

var Route = Router.Route;
var Link = Router.Link;

require('../../../assets/css/form-magazine-card.css');

var FormMagazineCard = React.createClass({

    getInitialState: function () {
        return {
            showQRCodeImage: false
        };
    },

    render: function () {
        var template = this.state.template;
        var tid = this.tid = this.props.tid;

        if (!template) {
            return null;
        }

        var attributes = this.attributes = template.attributes;
        var previewParams = {
            tid: tid,
            uid: attributes.author
        };
        var query = {
            form: 'user'
        };

        return (
            <div className="works-card form-magazine-card">
                <div className="card-image">
                    <Link to="preview" params={previewParams} query={query}><img src={attributes.effect_img.substr(3)}/></Link>
                </div>

                <div className="card-content">
                    <div className="avatar">
                        <img src={attributes.author_img || CommonUtils.getDefaultUserAvatar()}/>
                    </div>
                    <div className="info">
                        <div className="author">{attributes.author_name}</div>
                        <div className="date">{CommonUtils.fromNow(parseInt(attributes.reupdate_date) * 1000)}</div>
                    </div>
                    <div className="magazine-qr-code" onMouseOver={this.changeState.bind(this, true)} onMouseOut={this.changeState.bind(this, false)}></div>
                </div>
                {this.generateQRCode()}
                <div className="card-divider"></div>
                <div className="card-action">
                    <div className="name">{attributes.name}</div>
                    <div className="statistics">
                        <div className="number">阅读数: {attributes.read_pv}</div>
                        {this.generateDataCount()}
                    </div>
                </div>
            </div>
        );
    },

    componentDidMount: function () {
        var me = this, tid = this.tid;

        // 查 作品, 数据数
        MeAPI.getWorksById(tid).then(function (template) {
            MeAPI.getDataCount(tid).then(function (count) {
                me.setState({dataCount: count, template: template});
            });
        });
    },

    /**
     * 显示二维码
     * @param isShow
     */
    changeState: function (isShow) {
        this.setState({showQRCodeImage: isShow});
    },

    /**
     * 生成二维码
     */
    generateQRCode: function () {
        if (this.state.showQRCodeImage) {
            return (
                <div className="qr-code-image active">
                    {CommonUtils.generateQRCode(CommonUtils.generateViewTemplateUrl(this.tid), 188)}
                </div>
            );
        }
    },

    /**
     * 生成数据数
     */
    generateDataCount: function () {
        var dataCount = +(this.state.dataCount || 0);

        if (dataCount < 1) {
            return;
        }

        return (
            <div className="data-count">数据数: {dataCount}</div>
        );
    }

});

module.exports = FormMagazineCard;