/*
 * Created by 95 on 2015/8/3.
 */

var React = require('react');
var ReactDOM = require("react-dom");
var ElementStore = require('../../../stores/ElementStore');
var PageStore = require('../../../stores/PageStore');
var GlobalFunc = require("../../Common/GlobalFunc");
var DialogActionCreator = require("../../../actions/DialogActionCreator");
var MakeActionCreators = require('../../../actions/MakeActionCreators');

var UndoStore = require('../../../stores/UndoStore');
var UndoAction = require('../../../actions/UndoAction');
var ClipBoard = require('../../../utils/Clipboard.util');
var panelClick = false;
var CommonTool = React.createClass({

    elChange         : function () {
        this.forceUpdate();
    },

    capture: function () {
        panelClick = false;
    },

    undo: function (e) {
        GlobalFunc.clickAnimation(e);

        if (UndoStore.canUndo())UndoAction.createUndo();
    },

    redo: function (e) {
        GlobalFunc.clickAnimation(e);

        if (UndoStore.canRedo()) UndoAction.createRedo();
    },

    copyItem: function (e) {
        GlobalFunc.clickAnimation(e);

        var canCopy = GlobalFunc.itemCopyParseAble();
        if (canCopy === true) {
            ClipBoard.copy(PageStore.getPageUid());
            MakeActionCreators.pasteElement();
        } else if (canCopy != false) {
            GlobalFunc.addSmallTips(canCopy, null, {clickCancel: true});
        }
    },

    layerToTop: function (e) {
        GlobalFunc.clickAnimation(e);
        if (GlobalFunc.canLayerUp()) {
            MakeActionCreators.changeLayer("toTop");
        }

    },

    layerToBottom: function (e) {
        GlobalFunc.clickAnimation(e);
        if (GlobalFunc.canLayerDown()) {
            MakeActionCreators.changeLayer("toBottom");
        }

    },

    layerUp: function (e) {

        GlobalFunc.clickAnimation(e);
        if (GlobalFunc.canLayerUp()) {
            MakeActionCreators.changeLayer("up");
        }

    },

    layerDown: function (e) {
        GlobalFunc.clickAnimation(e);

        if (GlobalFunc.canLayerDown()) {
            MakeActionCreators.changeLayer("down");
        }

    },

    crop: function (e) {
        GlobalFunc.clickAnimation(e);

        if (GlobalFunc.canCrop()) {
            DialogActionCreator.show("crop");
        }
    },


    clearStyle: function (e) {
        GlobalFunc.clickAnimation(e);
        if (GlobalFunc.canClearStyle()) {
            GlobalFunc.clearStyle();
        }


    },

    zoomIn: function(e){
        GlobalFunc.clickAnimation(e);
        if (GlobalFunc.canZoomIn()) {
            GlobalFunc.setDeviceZoom("in");
            ElementStore.emitChange();
            var scale = GlobalFunc.getDeviceScale();
            GlobalFunc.addSmallTips(parseInt(scale * 100) + "%", 0.3, {delBackGround: true, margin: "0 0 0 -60px"})
        }
    },

    zoomOut: function(e){
        GlobalFunc.clickAnimation(e);
        if (GlobalFunc.canZoomOut()) {
            GlobalFunc.setDeviceZoom("out");
            ElementStore.emitChange();
            var scale = GlobalFunc.getDeviceScale();
            GlobalFunc.addSmallTips(parseInt(scale * 100) + "%", 0.3, {delBackGround: true, margin: "0 0 0 -60px"})
        }
    },

    itemDelete: function(e) {
        GlobalFunc.clickAnimation(e);
        if(GlobalFunc.itemDeleteAble()) {
            MakeActionCreators.removeElement();
        }
    },

    stoppropagation: function () {
        panelClick = true;
    },

    lock                : function (e) {
        GlobalFunc.clickAnimation(e);
        if (GlobalFunc.canLock()) {
            MakeActionCreators.align("lock");
        }
    },

    unLock              : function (e) {
        GlobalFunc.clickAnimation(e);
        if (GlobalFunc.canUnLock()) {
            MakeActionCreators.align("unlock");
        }

    },
    compose                : function (e) {
        GlobalFunc.clickAnimation(e);
        MakeActionCreators.align("compose");

    },
    unCompose                : function (e) {
        GlobalFunc.clickAnimation(e);
        MakeActionCreators.align("uncompose");

    },
    alignEdge           : function (type,e) {
        GlobalFunc.clickAnimation(e);
        MakeActionCreators.align(type);
    },

    render: function () {

        var canAlign=GlobalFunc.canAlign();
        var canAjust=GlobalFunc.canAjust();

        var cls = "toolBtn ";
        var  unlock = GlobalFunc.canUnLock() ? (<li className={cls + " unlock"} onClick={this.unLock}><span className="fadeInLeft animated">解锁</span></li>) : (<li className={cls + " lock dis"} onClick={this.lock}><span className="fadeInLeft animated">锁定</span></li>);
        var unCompose = GlobalFunc.canUnCompose()? (<li className={cls + " ungroup"} onClick={this.unCompose}><span className="fadeInLeft animated">取消组合</span></li>) : (<li className={cls + " group dis"} onClick={this.compose}><span className="fadeInLeft animated">组合</span></li>);
        return (<ul className="toolPanel">
            <div className="left">
                <li className={cls +(UndoStore.canUndo()===true?"undo":"undo dis")} onClick={this.undo}>
                    <span className="fadeInLeft animated">撤销</span>
                </li>
                <li className={cls +(UndoStore.canRedo()?"redo":"redo dis")} onClick={this.redo}>
                    <span className="fadeInLeft animated">恢复</span>
                </li>
                <li className={cls +(GlobalFunc.itemCopyParseAble()===true?"copy":"copy dis")} onClick={this.copyItem}>
                    <span className="fadeInLeft animated">复制</span>
                </li>
                <li className={cls +(GlobalFunc.canCrop()?"crop":"crop dis")} onClick={this.crop}>
                    <span className="fadeInLeft animated">裁切</span>
                </li>
                {GlobalFunc.canLock() ? (<li className={cls + " lock"} onClick={this.lock}><span className="fadeInLeft animated">锁定</span></li>) : unlock }
                {GlobalFunc.canCompose() ? (<li className={cls + " group"} onClick={this.compose}><span className="fadeInLeft animated">组合</span></li>) : unCompose}

                <li className={cls +(canAlign?"alignleft":"alignleft dis")} onClick={this.alignEdge.bind(this,"left")}><span className="fadeInLeft animated">左对齐</span>
                </li>
                < li className={cls +(canAlign?"alignright":"alignright dis")} onClick={this.alignEdge.bind(this,"right")}><span className="fadeInLeft animated">右对齐</span></li>
                <li className={cls +(canAlign?"aligntop":"aligntop dis")} onClick={this.alignEdge.bind(this,"top")}><span className="fadeInLeft animated">上对齐</span></li>
                <li className={cls +(canAlign?"alignbottom":"alignbottom dis")} onClick={this.alignEdge.bind(this,"bottom")}><span className="fadeInLeft animated">下对齐</span></li>
                <li className={cls +(canAlign?"aligncenter":"aligncenter dis")} onClick={this.alignEdge.bind(this,"center")}><span className="fadeInLeft animated">水平居中</span></li>
                <li className={cls +(canAlign?"alignmiddle":"alignmiddle dis")} onClick={this.alignEdge.bind(this,"middle")}><span className="fadeInLeft animated">垂直居中</span>
                </li>
                <li className={cls +(canAjust?"hjustify":"hjustify dis")} onClick={this.alignEdge.bind(this,"hjustify")}><span className="fadeInLeft animated">水平分布</span></li>
                <li className={cls +(canAjust?"vjustify":"vjustify dis")} onClick={this.alignEdge.bind(this,"vjustify")}><span className="fadeInLeft animated">垂直分布</span></li>
                <li className={cls +(GlobalFunc.canClearStyle()?"clearStyle":"clearStyle dis")} onClick={this.clearStyle}>
                    <span className="fadeInLeft animated">消除样式</span>
                </li>
                <li className={cls +(GlobalFunc.canLayerUp()?"layerTop":"layerTop dis")} onClick={this.layerToTop}>
                    <span className="fadeInLeft animated">置顶</span>
                </li>
                <li className={cls +(GlobalFunc.canLayerUp()?"layerUp":"layerUp dis")} onClick={this.layerUp}>
                 <span className="fadeInLeft animated">上一层</span>
                 </li>
                 <li className={cls +(GlobalFunc.canLayerDown()?"layerDown":"layerDown dis")} onClick={this.layerDown}>
                 <span className="fadeInLeft animated">下一层</span>
                 </li>

                 <li className={cls +(GlobalFunc.canLayerDown()?"layerBottom":"layerBottom dis")} onClick={this.layerToBottom}>
                 <span className="fadeInLeft animated">置底</span>
                 </li>

                <li className={cls +(GlobalFunc.itemDeleteAble()?"device_remove":"device_remove dis")} onClick={this.itemDelete}>
                    <span className="fadeInLeft animated">删除</span>
                </li>

            </div>

        </ul>)
    }

});


module.exports = CommonTool;