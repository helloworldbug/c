/**
 * @component TemplateCardGrid
 * @description 模板卡片网格组件
 * @time 2015-09-09 17:39
 * @author StarZou
 **/

var React = require('react');
var TemplateCard = require('./TemplateCard');
var MagazineCard = require('./MagazineCard');
var UserMagazineCard = require('./UserMagazineCard');
var DesignerSeachCard = require('./DesignerSeachCard');

var CardTypes = require('../../utils/TemplateUtils').constants.CardTypes;
var MeStore = require('../../stores/MeStore');

var TemplateCardGrid = React.createClass({

    render: function () {
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
            case CardTypes.DesignerCard:
                WorksCardComponent = DesignerSeachCard;
                break;
            default :
                this.warpWorks(templates);
                WorksCardComponent = MagazineCard;
        }

        if (templates) {
            templateCardComponents = templates.map(function (template, index) {
                return (
                    <WorksCardComponent key={index} index={index} template={template} templateType={templateType}/>
                );
            });
        }

        return (
            <div className="template-card-grid">
                {templateCardComponents}
            </div>
        );
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
    }

});

module.exports = TemplateCardGrid;