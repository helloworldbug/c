/**
 * @module      DesignerApply
 * @description 3.0设计师模块 -> 申请
 * @time        2015-10-19
 * @author      misterY 
*/

'use strict';
// require core module
var React = require('react'),
    ReactDOM = require("react-dom");

   


var Dialog = require('../Common/Dialog');

var MeStore = require('../../stores/MeStore');
var MeActionCreators = require('../../actions/MeActionCreators');
var ContextUtils = require('../../utils/ContextUtils');
var TemplateUtils = require('../../utils/TemplateUtils');
var TemplateCardGrid = require('../../components/Common/TemplateCardGrid');
var Base=require("../../utils/Base");
var ImageModules = require('../Mixins/ImageModules');

// define DesignerApply component
var DesignerApply = React.createClass({

    mixins: [ImageModules],

    /**
     * 跳转到 router
    */
    goUrl(a_router,param,query) {
        this.props.changeModuleTitle("none");
        // this.transitionTo(a_router,param,query);
    },

    getInitialState(){
        var pageConfig = this.pageConfig = TemplateUtils.getPageConfigByPageType("designer");
        this.templateType = pageConfig.tabs[0].value;
        return this.getStateByDataType();
    },

    getStateByDataType() {
        var value, state = {
            templateMap: {},
            hasNextMap: {}
        }
        // 根据templateType, 动态生成state
        this.pageConfig.tabs.forEach(function (tab) {
            value = tab.value;
            state.templateMap[value] = MeStore.getTemplatesByType(value);
            state.hasNextMap[value] = MeStore.getHasNext(value)
        });

        if( !!state.templateMap[value] ){
            var min = this.props.DesignerAction.maxLength, len = state.templateMap[value].length,
                poor = len-min;
            poor < 0 &&
                this.props.changePrompt("你还需要创建"+(Math.abs(poor))+"个作品才能提交申请");
        }

        return state;
    },

    /*
     * 下一步
    */
    nextProgres() {
        (this.props.DesignerAction.getActionTpl().length == this.props.DesignerAction.maxLength) ?
            (this.props.changePrompt(" "),this.props.nextProgres(2)) :
                ( this.showDialog() );
    },

    /**
     * 查询数据
     */
    query: function (queryOption, config) {
        if (this.hasNext() || config.allow) {
            var templateType = this.templateType;
            MeActionCreators.queryTemplatesByCondition(
                TemplateUtils.configureQueryOptionByTemplateType(
                    templateType, 
                    queryOption, 
                    this.getExtraQueryOption()
                ),
                this.templateType
            );
        }
    },

    hasNext: function () {
        var nextValue = this.state.hasNextMap[this.templateType];
        return nextValue !== false;
    },

    /**
     * 取额外参数
     * @return extraQueryOption
     */
    getExtraQueryOption: function () {
        var extraQueryOption;

        var userId = this.user.id;

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
     * MeStore更新, 设置state
     */
    _onChange: function () {
        if (MeStore.isRefresh()) {
            return this.query({currentPage: 1}, {allow: true});
        }
        this.setState(this.getStateByDataType());
    },

    /**
     * 组件移除时
     */
    componentWillUnmount: function () {
        MeStore.removeChangeListener(this._onChange);
    },

    /**
     * 组件装载, 执行查询
     */
    componentDidMount: function () {
        // 取当前用户
        this.user = ContextUtils.getCurrentUser();

        // 查询
        this.query({currentPage: 1}, {allow: true});
        MeStore.addChangeListener(this._onChange);
    },

    popupDialog(state,h) {
        this.refs.dialog.setState({
            appearanceState: state,
            sureIsHide: h
        }); 
    },
    showDialog() {
        this.popupDialog(true,true);
    },
    hideDialog() {
        this.popupDialog(false,true);
    },
    componentDidUpdate(){
        var _outA = "", src = this.defineImageModules()["designer_create_work"];
        if( this._out > 0 ){
            _outA = '<div class="works-card-go-create works-card template-card designer-seach-card"><div class="card-box"><div class="card-image"><img src=' + src + ' width="188" height="188" /></div><div class="card-mask"><div class="radius_h"></div></div></div></div>';
        }
        var dom = ReactDOM.findDOMNode(this), $dom = $(dom);
        if( !$dom.find('.works-card-go-create')[0] )
            $dom.find('.template-card-grid').prepend(_outA);

        $('.works-card-go-create').on("click",function(){
            Base.linkToPath("/make");
        });
    },
    render() {
        this._out = 0;
        var works = this.pageConfig.tabs.map(function (tab, index) {
            var templates = this.state.templateMap[tab.value];
            if( templates && templates.length > 0 ){
                this._out = this.props.DesignerAction.maxLength - templates.length;
            }else{
                this._out = 1;
            }
            return (
                <TemplateCardGrid key={index} templates={templates} cardType={tab.cardType} templateType={tab.value}/>
            );
        }.bind(this));
        
        return (
            <div className="inner ds-works" id="scrollbar1">
                <Dialog ref="dialog" sureFn={this.hideDialog} title={"必须选择"+this.props.DesignerAction.maxLength+"个作品才能提交申请"} />
                <div className="viewport">
                    {works}
                </div>
                <div className="next-progres tc c_pointer btn-navy btn-fill-vert-o" onClick={this.nextProgres}>
                    下一步
                </div>
            </div>
        );
    }
});

// export DesignerApply component
module.exports = DesignerApply;
