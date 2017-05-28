/**
 * @component ActionBar
 * @description 动作栏组件
 * @time 2015-09-06 18:13
 * @author StarZou
 **/

var React = require('react');
var DialogAction = require("../../../../actions/DialogActionCreator");
var ActionButton = require('../Button/ActionButton');
var GlobalFunc = require('../../../Common/GlobalFunc');
var indexTooler = require("../indexTooler");
var PageStore = require('../../../../stores/PageStore');
var ElementStore = require('../../../../stores/ElementStore');
var MagazineStore = require('../../../../stores/MagazineStore');
var WorkDataUtil = require('../../../../utils/WorkDataUtil');
var _window = null;

//保存为一个未完成的作品
function saveModel(e) {
    indexTooler.createModel("", {
        tpl_type : 11
    });
    GlobalFunc.clickAnimation(e);
}

var actionButtons = [
    {
        type: 'preview', text: '预览', iconClass: 'action-button-preview', onClick: function () {
        null != _window ? (_window.close()) : false;
        var treeData = MagazineStore.getTplDataClone(false);
        var allPages = MagazineStore.getAllPagesRef(treeData.get("items"));
        treeData.set("pages", allPages)
        //var _tplData = WorkDataUtil.getJsonTplData();
        WorkDataUtil.filterItems(treeData);
        var _tplData = WorkDataUtil.avosTplData2Json(treeData)
        var tpl = WorkDataUtil.getJsonTpl();
        tpl.tpl_sign = 2;
        //templateObject.set("tpl_sign", 2); //ME刊作品
        _window = window.open('/makePreview', '_prev', 'width=500,height=700');
        _window.window.show_data = {
            tpl      : tpl,
            tplData  : _tplData,
            musicData: ElementStore.getTplMusic(),
            pageUid  : PageStore.getPageUid(),
            userNick : GlobalFunc.getUserObj().user_nick
        }
    }
    },
    {
        type: 'save', text: '保存', iconClass: 'action-button-save', onClick: saveModel
    },
    {
        type: 'publish', text: '发布', iconClass: 'action-button-publish', onClick: function () {
        DialogAction.show("publish")
    }
    },
    {
        type: 'quit', text: '退出', iconClass: 'action-button-quit', onClick: function () {
        DialogAction.show("tips", "", {
            contentText: "确定要退出吗?", onConfirm: function () {
                indexTooler.exitMake()
            }
        });
    }
    }
];

var ActionBar = React.createClass({

    render: function () {
        var actionButtonComponents = actionButtons.map(function (item, index) {
            return (
                <ActionButton key={index} {...item} />
            );
        });

        return (
            <div className="action-bar">
                {actionButtonComponents}
            </div>
        );
    }

});

module.exports = ActionBar;