/**
 * @component LogoButton
 * @description ME图标按钮组件
 * @time 2015-09-06 17:59
 * @author StarZou
 **/

var React = require('react');
var DialogAction=require("../../../../actions/DialogActionCreator");
var indexTooler=require("../indexTooler");

var LogoButton = React.createClass({
    quit:function(){
        DialogAction.show("tips","",{contentText:"确定退出",onConfirm:function(){window.location.href="/"}});
    },
    render: function () {

        return (
            <div className="logo-button" onClick={this.quit}></div>
        );
    }

});

module.exports = LogoButton;