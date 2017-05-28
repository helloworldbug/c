/**
 * @component TemplateCardGrid
 * @description 模板卡片网格组件
 * @time 2015-09-09 17:39
 * @author StarZou
 **/

var React = require('react');
var TemplateCard = require('./TemplateCard');
var MagazineCard = require('./MagazineCard');
var UserMagazineCard = require('./NewUserMagazineCard');
var CardTypes = require('../../utils/TemplateUtils').constants.CardTypes;
var MeStore = require('../../stores/MeStore');
var ChargeDialog = require("./ChargeDialog");

var TemplateCardGrid = React.createClass({
    getInitialState:function(){
      return {
          templeteStatus:true
      }
    },
    componentDidMount:function(){
        var _this=this;
        var user_status=fmacloud.User.current();
        var createTime=user_status.get("createdAt");
        //账号创建时间的时间戳
        var milliseconds1=(new Date(createTime)).getTime();
        //当前时间的时间戳
        var milliseconds2=(new Date().getTime());
        debugger;
        if (milliseconds2-milliseconds1<86400000){
            this.setState({templeteStatus:false})
        }
        var user_id=user_status.get("id");
        fmacloud.Cloud.rpc('getUserById', {userid:user_id}, {
            success: function (data) {
                var user_label=data[0].get("user_label");
                if (!!user_label && user_label>=3550 && user_label<=3599){
                    _this.setState({templeteStatus:false})
                }

            },
            error: function (error) {   debugger;
                console.log("查询失败");
            }
        });



    },
    render: function () {
        var _this = this;
        var props = this.props,
            WorksCardComponent,// 卡片组件
            templateCardComponents,// 模板卡片组件列表
            cardType = props.cardType,// 卡片类型
            templateType = props.templateType,// 模板类型
            templates = props.templates;// 模板数组
        switch (cardType) {
            case CardTypes.UserMagazineCard:
                WorksCardComponent = UserMagazineCard;
                break;
            case CardTypes.TemplateCard:
                WorksCardComponent = TemplateCard;
                break;
            default:
                this.warpWorks(templates);
                WorksCardComponent = MagazineCard;
        }

        if (templates) {
            templateCardComponents = templates.map(function (template, index) {
                template.attributes.templeteStatus=_this.state.templeteStatus;
                return (
                    <WorksCardComponent key={index} viewState={props.viewState} index={index} template={template} templateType={templateType} refresh={_this.props.refresh} exportWork={_this.props.exportWork} showCharge={_this.showChargeDialog}/>
                );
            });
        }

        var updateDateTitle = '发布日期',
            createDateTime = '创建日期';
        switch (props.templateType) {
            case "publishedMagazine":
                updateDateTitle = '发布日期';
                break;
            case "unpublishedMagazine":
                updateDateTitle = "修改日期";
                break;
            case "recycle":
                updateDateTitle = "删除日期";
                break;
            case "myFavoritesMagazine":
                updateDateTitle = "收藏日期";
                createDateTime = "发布日期";
                break;
            case "myTemplate":
                updateDateTitle = "生成日期";
                break;
                 case "illegalWork":
                updateDateTitle = "申诉解封";
                  createDateTime = "";
                break;
            default:
                updateDateTitle = "发布日期";
                createDateTime = "创建日期";
        }

        var title = props.viewState == 2 ? (
            <div className="template-list">
                <ul>
                    <li className="title title-color">名称</li>
                    <li className="time title-color line">{createDateTime}</li>
                    <li className="time title-color line">{updateDateTitle}</li>
                </ul>
            </div>
        ) : null;

        return (
            <div className={props.viewState == 1 ? "template-card-grid" : "template-list-box"}>
                {title}
                {templateCardComponents}
                <ChargeDialog ref="chargeDialog"/>
                
            </div>
        );
    },

    showChargeDialog: function (onOk, onCancel, text) {
        this.refs.chargeDialog.showCharge(onOk, onCancel, text);
    },
    /**
     * 包装作品对象, 计算是否是收藏的
     * @param works
     */
    warpWorks: function (works) {
        var favorites = MeStore.getFavorites();

        var workObject, favoriteObject;

        if (works && works.length > 0 && favorites && favorites.length > 0) {
            for (var i = 0; i < works.length; i++) {
                workObject = works[i];

                for (var j = 0; j < favorites.length; j++) {
                    favoriteObject = favorites[j];

                    if (workObject.attributes.tpl_id == favoriteObject.attributes.fav_id) {
                        workObject.starred = true;
                    }
                }

            }
        }
    },

    /*
     * 收藏信息
    */
    favInfo: function (works) {
        var favorites = MeStore.getFavorites();

        var workObject, favoriteObject;

        if (works && works.length > 0 && favorites && favorites.length > 0) {
            for (var i = 0; i < works.length; i++) {
                workObject = works[i];

                for (var j = 0; j < favorites.length; j++) {
                    favoriteObject = favorites[j];

                    if (workObject.attributes.tpl_id == favoriteObject.attributes.fav_id) {
                        workObject.attributes.fav_date = favoriteObject.createdAt;
                    }
                }

            }
        }

        return workObject;
    }

});

module.exports = TemplateCardGrid;