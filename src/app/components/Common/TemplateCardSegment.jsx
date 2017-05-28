/**
 * @component TemplateCardSegment
 * @description 模板卡片块组件
 * @time 2015-09-14 10:56
 * @author StarZou
 **/

var React = require('react');
var mui = require('material-ui');

var MeActionCreators = require('../../actions/MeActionCreators');
var MeStore = require('../../stores/MeStore');
var TemplateCardGrid = require('../../components/Common/TemplateCardGrid');
var TemplateUtils = require('../../utils/TemplateUtils'),
    Base = require('../../utils/Base'),
    MakeActionCreators = require('../../actions/MakeActionCreators');

var Tabs = mui.Tabs;
var Tab = mui.Tab;

require('../../../assets/css/template-card-segment.css');

var TemplateCardSegment = React.createClass({
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

    render: function () {
        var pageConfig = this.pageConfig;

        var marginLeft = 0;

        var createButton;

        // 创建按钮
        if (pageConfig.showCreateButton) {
            marginLeft = 200;
            createButton = (
                <div className="create-button-wrapper">
                    <input id="createByPic" type="file" accept="image/jpeg,image/jpg,image/png" multiple
                           onChange={this.createByPic}/>
                    <Link className="create-button" to="/make"><span className="plus"> + </span>自由创作</Link>
                    <a className="create-button-pic" onClick={this.createByPicClick}>一键生成</a>
                </div>
            );
        }

        // 搜索表单
        var formContainer = pageConfig.showSearchForm ? (
            <div className="form-container">
                <form onSubmit={this.queryByText}>
                    <input type="text" placeholder="搜索作者/作品" value={this.state.text} onChange={this.handleTextChange}/>
                </form>
            </div>
        ) : null;

        // 更多按钮
        var moreButton = pageConfig.showMoreButton ? (
            <Link className="more-button btn1 btn-fill-vert btn-blue" to="/discovery">更多</Link>
        ) : null;

        // 加载更多按钮
        var loadMoreButton = this.hasNext() ? (
            <div className="load-more-button" onClick={this.query}>加载更多</div>
        ) : null;

        var styles = {
            contentContainerStyle: {
                backgroundColor: '#fff',
                paddingTop     : 30
            },
            inkBarStyle          : {
                height         : 6,
                marginLeft     : marginLeft,
                backgroundColor: '#666'
            },
            tabItemContainerStyle: {
                height         : 88,
                width          : 400,
                marginLeft     : marginLeft,
                backgroundColor: '#ececec'
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
            return (
                <Tab style={tabStyle} key={index} label={tab.label} value={tab.value}>
                    <TemplateCardGrid templates={this.state.templateMap[tab.value]} cardType={tab.cardType}/>
                </Tab>
            );
        }.bind(this));

        return (
            <div className="template-card-segment">

                <div className="tab-header-bar"></div>

                <div className="segment-container">
                    {createButton}

                    {moreButton}

                    {formContainer}

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
        var extraQueryOption, text = this.state.text;

        if (text) {
            text = "\'%" + text + "%\'";
            extraQueryOption = {
                whereCondition: {
                    '(name': ' like {0} or author_name like {0})'.format(text)
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

    queryByText: function (event) {
        event.preventDefault();

        // 查询第一页
        this.query({currentPage: 1}, {allow: true});
    },

    handleTextChange: function (event) {
        this.setState({text: event.target.value});
    },

    /**
     * tab切换, 设置当前选中tab, 执行查询
     * @param value
     */
    _handleTabsChange: function (value) {
        this.templateType = value;

        // 查询第一页
        if (this.getCurrentQueryOption().currentPage === 1) {
            this.query(null, {allow: true});
        }
    },

    createByPicClick: function () {
        $("#createByPic").trigger("click");
    },

    createByPic: function (event) {
        var user_id = Base.getCurrentUser().id;
        if (!user_id) {
            this.setState({notLogin: true});
        } else {
            var files = event.target.files;
            MakeActionCreators.createByPic(files);
            Base.linkToPath("/make");
            //event.target.value = "";
        }
    }


});

module.exports = TemplateCardSegment;