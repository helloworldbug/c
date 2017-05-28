/**
 * @component UserMagazineCard
 * @description 用户杂志卡片组件
 * @time 2015-09-22 11:32
 * @author StarZou
 **/

'use strict';

var React = require('react');
var Router = require('react-router');
var CommonUtils = require('../../utils/CommonUtils');
var MeStore = require('../../stores/MeStore');
var MeActionCreators = require('../../actions/MeActionCreators');
var MeAPI = require('../../utils/MeAPI');
var Dialog = require('../Common/Dialog');

var Link = Router.Link;

require('../../../assets/css/user-magazine-card.css');

// 作品类型与HeadBar映射
var TemplateTypeToHeadBarMap = {

    publishedMagazine: {
        edit           : true,
        create         : true,
        deleteWorks    : true,
        deleteFavorites: false
    },

    unpublishedMagazine: {
        edit           : true,
        create         : true,
        deleteWorks    : true,
        deleteFavorites: false
    },

    myFavoritesMagazine: {
        edit           : false,
        create         : false,
        deleteWorks    : false,
        deleteFavorites: true
    },

    myTemplate: {
        edit           : true,
        create         : false,
        deleteWorks    : true,
        deleteFavorites: false
    }

};

var UserMagazineCard = React.createClass({

    getInitialState: function () {
        return {
            showQRCodeImage: false
        };
    },

    render: function () {
        var attributes = this.attributes = this.props.template.attributes;
        var tid = this.tid = attributes.tpl_id;
        var previewParams = {
            tid: tid,
            uid: attributes.author
        };
        var query = {
            form: 'user'
        };

        return (
            <div className="works-card user-magazine-card">
                <div className="card-image">
                    <Link to="preview" params={previewParams} query={query}><img src={attributes.effect_img.substr(3)}/></Link>
                </div>

                <div className="card-head-bar">
                    {this.generateHeadBar()}
                </div>

                <div className="card-content">
                    <div className="avatar">
                        <img src={attributes.author_img || CommonUtils.getDefaultUserAvatar()}/>
                    </div>
                    <div className="info">
                        <div className="author" title={attributes.author_name}>{attributes.author_name}</div>
                        <div className="date">{CommonUtils.fromNow(parseInt(attributes.reupdate_date) * 1000)}</div>
                    </div>
                    <div className="magazine-qr-code" onMouseOver={this.changeState.bind(this, true)} onMouseOut={this.changeState.bind(this, false)}></div>
                </div>
                {this.generateQRCode()}
                <div className="card-divider"></div>
                <div className="card-action">
                    <div className="name" title={ attributes.name }>{attributes.name}</div>
                    <div className="statistics">
                        <div className="number">阅读数: {attributes.read_pv}</div>
                        {this.isNeedGetDataCount() ? this.generateDataCount() : null}
                    </div>
                </div>
                <Dialog title={this.state.dialogTitle} appearanceState={this.state.showDialog} sureFn={this.state.sureFn} cancelFn={this.hideDialog}/>
            </div>
        );
    },

    componentDidMount: function () {
        // 查数据数
        if (this.isNeedGetDataCount()) {
            var me = this;

            MeAPI.getDataCount(this.tid).then(function (count) {
                me.setState({dataCount: count});
            });
        }
    },

    /**
     * 显示二维码
     * @param isShow
     */
    changeState: function (isShow) {
        this.setState({showQRCodeImage: isShow});
    },

    /**
     * 关闭dialog
     */
    hideDialog: function () {
        this.setState({
            showDialog: false
        });
    },

    /**
     * 生成模板
     */
    createTemplate: function () {
        if (confirm('要生成模板吗？')) {
            MeActionCreators.createTemplate(this.props.template);
        }
    },

    /**
     * 删除作品
     */
    deleteWorks: function () {
        this.setState({
            dialogTitle: '确定要删除吗？',
            showDialog : true,
            sureFn     : this._deleteWorks
        });
    },

    _deleteWorks: function () {
        MeActionCreators.deleteWorks(this.props.template);
        this.hideDialog();
    },

    /**
     * 删除收藏
     */
    deleteFavorites: function () {
        this.setState({
            dialogTitle: '确定要删除收藏吗？',
            showDialog : true,
            sureFn     : this._deleteFavorites
        });
    },

    _deleteFavorites: function () {
        MeActionCreators.deleteFavorites(this.tid);
        this.hideDialog();
    },

    /**
     * 生成头部栏
     */
    generateHeadBar: function () {
        var templateType = this.props.templateType,
            hearBarOption = TemplateTypeToHeadBarMap[templateType],
            headBar = [];

        if (!hearBarOption) {
            return null;
        }

        if (hearBarOption.edit) {
            var editParams;
            if(templateType == "myTemplate"){
                editParams = {
                    tid   : this.tid
                };

                headBar.push(
                    <Link key="1" to="make" params={editParams}>
                        <span className="edit" title="进入编辑"></span>
                    </Link>
                );
            }else{
                editParams = {
                    tid   : this.tid,
                    reEdit: true
                };

                headBar.push(
                    <Link key="1" to="reMake" params={editParams}>
                        <span className="edit" title="进入编辑"></span>
                    </Link>
                );
            }
        }

        if (hearBarOption.create) {
            headBar.push(
                <span key="2" className="create" title="生成模版" onClick={this.createTemplate}>生成模版</span>
            );
        }

        if (hearBarOption.deleteWorks) {
            headBar.push(
                <span key="3" className="delete" title="删除作品" onClick={this.deleteWorks}></span>
            );
        }

        if (hearBarOption.deleteFavorites) {
            headBar.push(
                <span key="4" className="delete" title="删除收藏" onClick={this.deleteFavorites}></span>
            );
        }

        return headBar;
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

        var formParams = {
            tid: this.tid
        };

        return (
            <div className="data-count">
                <Link to="form" params={formParams}>数据数: {dataCount}</Link>
            </div>
        );
    },

    /**
     * 是否需要查询数据数, 已发布的作品需要查询
     * @return {boolean}
     */
    isNeedGetDataCount: function () {
        return this.props.templateType === 'publishedMagazine';
    }

});

module.exports = UserMagazineCard;