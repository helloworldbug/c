/*
 * Created by 95 on 2015/8/3.
 */

var React = require('react');
var ElementStore = require('../../../stores/ElementStore');
var GlobalFunc = require("../../Common/GlobalFunc");
var MakeActionCreators = require('../../../actions/MakeActionCreators');
var UndoStore = require('../../../stores/UndoStore');
var UndoAction = require('../../../actions/UndoAction');
var ClipBoard = require('../../../utils/Clipboard.util');

var CommonTool = React.createClass({
    elChange         : function () {
        this.forceUpdate();
    },
    componentDidMount: function () {
        ElementStore.addChangeListener(this.elChange)
    },

    componentDidUpdate: function () {

    },

    componentWillUnmount: function () {
        ElementStore.removeChangeListener(this.elChange)
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
    render              : function () {

        var canAlign=GlobalFunc.canAlign();
       var canAjust=GlobalFunc.canAjust();
        var cls = "toolBtn ";
        return (<ul className="toolPanel align-tool">
            <div className="left">
                <li className={cls +(GlobalFunc.canLock()?"lock":"lock_dis")} onClick={this.lock}><span
                    className="fadeInRight animated">锁定</span></li>
                <li className={cls +(GlobalFunc.canUnLock()?"unlock":"unlock_dis")} onClick={this.unLock}><span
                    className="fadeInRight animated">解锁</span></li>
                <li className={cls +(GlobalFunc.canCompose()?"group":"group_dis")} onClick={this.compose}><span className="fadeInRight animated">组合</span>
                </li>
                <li className={cls +(GlobalFunc.canUnCompose()?"ungroup":"ungroup_dis")} onClick={this.unCompose}><span className="fadeInRight animated">取消组合</span></li>
                <li className={cls +(canAlign?"alignleft":"alignleft_dis")} onClick={this.alignEdge.bind(this,"left")}><span
                    className="fadeInRight animated">左对齐</span>
                </li>
                < li className={cls +(canAlign?"alignright":"alignright_dis")} onClick={this.alignEdge.bind(this,"right")}><span
                    className="fadeInRight animated">右对齐</span></li>
            </div>
            <div className="right">
                <li className={cls +(canAlign?"aligntop":"aligntop_dis")} onClick={this.alignEdge.bind(this,"top")}><span
                    className="fadeInRight animated">上对齐</span></li>
                <li className={cls +(canAlign?"alignbottom":"alignbottom_dis")} onClick={this.alignEdge.bind(this,"bottom")}><span
                    className="fadeInRight animated">下对齐</span></li>
                <li className={cls +(canAlign?"aligncenter":"aligncenter_dis")} onClick={this.alignEdge.bind(this,"center")}><span
                    className="fadeInRight animated">水平居中</span></li>
                <li className={cls +(canAlign?"alignmiddle":"alignmiddle_dis")} onClick={this.alignEdge.bind(this,"middle")}><span
                    className="fadeInRight animated">垂直居中</span>
                </li>
                <li className={cls +(canAjust?"hjustify":"hjustify_dis")} onClick={this.alignEdge.bind(this,"hjustify")}><span
                    className="fadeInRight animated">水平分布</span></li>
                <li className={cls +(canAjust?"vjustify":"vjustify_dis")} onClick={this.alignEdge.bind(this,"vjustify")}><span
                    className="fadeInRight animated">垂直分布</span></li>

            </div>
        </ul>)
    }
});


module.exports = CommonTool;