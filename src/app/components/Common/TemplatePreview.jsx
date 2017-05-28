/**
 * @component TemplatePreview
 * @description 模板预览组件
 * @time 2015-09-30 11:38
 * @author StarZou
 **/

'use strict';

var React = require('react');
var Router = require('react-router');
var ComponentActionCreators = require('../../actions/ComponentActionCreators');
var ShowPreView = require('./ShowPreView');
var CommonUtils = require('../../utils/CommonUtils');

var Link = Router.Link;

require('../../../assets/css/template-preview.css');

var TemplatePreview = React.createClass({

    render: function () {
        var attributes = this.props.template.attributes;
        var tid = attributes.tpl_id, authorName = attributes.author_name;

        return (
            <div className="template-preview">
                <div className="template-preview-backdrop"></div>

                <div className="template-preview-modal-dialog">

                    <div className="template-preview-modal-content">
                        <div className="template-preview-device">
                            <ShowPreView userNick={authorName} tid={tid}/>
                        </div>

                        <div className="template-preview-info">
                            <div className="template-preview-close-btn" title="点击关闭" onClick={this.hideTemplatePreview}></div>

                            <div className="template-preview-text">手机扫描二维码查看</div>
                            <div>
                                {CommonUtils.generateQRCode(CommonUtils.generateViewTemplateUrl(tid), 200)}
                            </div>
                            <div className="template-preview-use-btn">
                                <Link to="make" params={{tid:tid}}>使用模板</Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    },

    /**
     * 隐藏模板预览组件
     */
    hideTemplatePreview: function () {
        ComponentActionCreators.hideTemplatePreview();
    }

});

module.exports = TemplatePreview;