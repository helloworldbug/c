/**
 * @component DesignerSeachCard
 * @description 设计师申请作品选择组件
 * @time 2015-10-21
 * @author misterY
 **/

'use strict';
var React = require('react');
var Router = require('react-router');

require('../../../assets/css/template-card.css');
require('../../../assets/css/mistery-base.css');
require('../../../assets/css/designer.css');

var DesignerAction = require('../../actions/DesignerAction');

var Dialog = require('./Dialog');

var DesignerSeachCard = React.createClass({

    getInitialState: function () {
        return {
            seachIndex: false
        };
    },

    render: function () {
        var attributes = this.props.template.attributes;
        var cl = (!!this.state.seachIndex)?"card-box active":"card-box";
        return (
            <div className="works-card template-card designer-seach-card">
                <Dialog ref="dialog" sureFn={this.hideDialog} title={"只能选择"+DesignerAction.maxLength+"个作品"} />
                <div className={cl} onClick={this.reached.bind(this,attributes.tpl_id)}>
                    <div className="card-image">
                        <img src={attributes.tpl_share_img} width="188" height="188" />
                    </div>
                    <div className="card-mask">
                        <div className="radius_h">
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    /* 点击 */
    reached: function(){
        if( !!this.state.seachIndex ){
            this.del(arguments[0]);
        }
        if( !this.state.seachIndex ){
            this.add(arguments[0]);
        }
    },
    del: function(){
        DesignerAction.delTpl(arguments[0]) && (
            this.setState({ seachIndex: false}), function(){ return true; }
        )
    },
    add: function(){
        var tid = arguments[0], e = arguments[1];
        ( DesignerAction.addTpl(tid) && (
            this.setState({ seachIndex: true }), function(){ return true; }
        ) ) || (
            this.showDialog()
        )
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
    }
});

module.exports = DesignerSeachCard;