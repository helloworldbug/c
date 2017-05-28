/**
 * @component UserTabs
 * @description
 * @time 2015-09-21 19:42
 * @author StarZou
 **/

'use strict';

var React = require('react');
var mui = require('material-ui');
var Tabs = mui.Tabs;
var Tab = mui.Tab;
var MeActionCreators = require('../../actions/MeActionCreators');
var MeStore = require('../../stores/MeStore');
var TemplateCardGrid = require('../../components/Common/TemplateCardGrid');
var TemplateUtils = require('../../utils/TemplateUtils');
var CommonUtils = require('../../utils/CommonUtils');
var ContextUtils = require('../../utils/ContextUtils');
var UserDesigner = require('./UserDesigner');
import {Link} from 'react-router'

require('../../../assets/css/user-tabs.css');

var UserTabs = React.createClass({
    getInitialState: function () {
        // 取pageConfig
        var pageConfig = this.pageConfig = TemplateUtils.getPageConfigByPageType(this.props.pageType);

        // 设置默认的模板类型
        this.templateType = pageConfig.tabs[0].value;

        return this.getStateFormStore();

    },

    getStateFormStore: function () {
        var value, state = {
            templateMap: {},
            hasNextMap : {}
        };

        // 根据templateType, 动态生成state
        this.pageConfig.tabs.forEach(function (tab) {
            value = tab.value;
            state.templateMap[value] = MeStore.getTemplatesByType(value);
            state.hasNextMap[value] = MeStore.getHasNext(value)
        });

        return state;
    },
    render           : function () {
        var pageConfig = this.pageConfig;
        var marginLeft = 0;

        var loadMoreButton = this.hasNext() ? (
            <div className="load-more-button" onClick={this.query}>加载更多</div>
        ) : null;

        var styles = {
            contentContainerStyle: {
                backgroundColor: '#fff',
                borderTop      : '1px solid rgba(0,0,0,.3)',
                paddingTop     : 30
            },
            inkBarStyle          : {
                height         : 6,
                marginLeft     : marginLeft,
                backgroundColor: '#666'
            },
            tabItemContainerStyle: {
                height         : 88,
                width          : 600,
                marginLeft     : marginLeft,
                backgroundColor: '#f9f9f9'
            }
        };

        var tabStyle = {
            height    : 82,
            fontSize  : 18,
            color     : '#000',
            fontWeight: 700,
            fontFamily: 'Microsoft YaHei'
        };

        var tabs = pageConfig.tabs.map(function (tab, index) {
            var templates = this.state.templateMap[tab.value];

            return (
                <Tab style={tabStyle} key={index} label={tab.label} value={tab.value}>
                    {
                        templates && templates.length > 0 ?
                            <TemplateCardGrid templates={templates} cardType={tab.cardType} templateType={tab.value}/> :
                            <div className="no-works">
                                <div className="word">没有相关微杂志~~，试着<Link to="/create">创建</Link>一份ME微杂志</div>
                            </div>
                    }
                </Tab>
            );
        }.bind(this));

        // 设计师特权Tab
        tabs.push(
            <Tab style={tabStyle} key={tabs.length} label="设计师特权">
                <UserDesigner user={ContextUtils.getCurrentUser()}/>
            </Tab>
        );

        return (
            <div className="user-tabs">

                <div className="tab-header-bar"></div>

                <div className="segment-container">
                    <div className="tabs-container">
                        <Tabs onChange={this._handleTabsChange} {...styles}>
                            {tabs}
                        </Tabs>
                    </div>
                </div>

                {loadMoreButton}
            </div>
        );
    },

    /**
     * 组件装载, 执行查询
     */
    componentDidMount: function () {
        // 查询
        this.query({currentPage: 1}, {allow: true});
        MeStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function () {
        MeStore.removeChangeListener(this._onChange);
    },

    /**
     * MeStore更新, 设置state
     */
    _onChange: function () {
        if (MeStore.isRefresh()) {
            return this.query({currentPage: 1}, {allow: true});
        }
        this.setState(this.getStateFormStore());
    },

    /**
     * 根据templateType, 取当前查询参数
     */
    getCurrentQueryOption: function () {
        return TemplateUtils.getQueryOptionByTemplateType(this.templateType);
    },


    /**
     * 取额外参数
     * @return extraQueryOption
     */
    getExtraQueryOption: function () {
        var extraQueryOption;

        var userId = ContextUtils.getCurrentUser().id;

        if (userId && this.templateType != 'myFavoritesMagazine') {
            extraQueryOption = {
                whereCondition: {
                    'author': '=\'' + userId + '\''
                }
            };
        } else {
            var inSql = CommonUtils.getSelectSQL({
                className     : 'me_favorites',
                selectColumns : 'fav_id',
                whereCondition: {
                    user_id: '=\'' + userId + '\''
                }
            });

            extraQueryOption = {
                whereCondition: {
                    tpl_id: ' in (' + inSql + ') '
                }
            };
        }

        return extraQueryOption;
    },

    /**
     * 查询数据
     */
    query: function (queryOption, config) {
        if (this.hasNext() || config.allow) {
            var templateType = this.templateType;
            MeActionCreators.queryTemplatesByCondition(TemplateUtils.configureQueryOptionByTemplateType(templateType, queryOption, this.getExtraQueryOption()), this.templateType);
        }
    },

    hasNext: function () {
        var nextValue = this.state.hasNextMap[this.templateType];
        return nextValue !== false;
    },

    /**
     * tab切换, 设置当前选中tab, 执行查询
     * @param value
     */
    _handleTabsChange: function (value) {
        if (!value) {
            return;
        }

        this.templateType = value;

        // 查询第一页
        this.query({currentPage: 1}, {allow: true});
    }
});

module.exports = UserTabs;