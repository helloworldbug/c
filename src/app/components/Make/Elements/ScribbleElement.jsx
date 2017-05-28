/**
 * @component ButtonElement
 * @description 按钮元素
 * @time 2015-09-10 17:28
 * @author Nick
 **/

var React = require('react');
var DialogAction = require("../../../actions/DialogActionCreator");
var MakeAction=require("../../../actions/MakeActionCreators");
var ScribbleElement = React.createClass({
    deleteScribble(){
        MakeAction.removeElement({objType:"scribble"})
    },
    editScribble(){
        var attr = this.props.attributes;
        DialogAction.show("scribble","", {reEdit:true,imgUrl: attr["item_href"], opacity: attr["item_opacity"],clipPercent: attr["clip_percent"],tips: attr["item_val"]});
    },
    render: function () {
        if(this.props.showOnly)return null;
        var attr = this.props.attributes;
        var style = {
            zIndex: 999
        };

        return (
            <div className='scribble-element' style={style}>
                <a className="edit-scribble" title="编辑涂抹" onClick={this.editScribble} />
                <a className='delete-scribble' title="删除涂抹"  onClick={this.deleteScribble} />

            </div>
        );
    }

});

module.exports = ScribbleElement;