/**
 * Created by 95 on 2016/8/1.
 */
var ReactDOM = require("react-dom");
var MakeActionCreators = require('../../../actions/MakeActionCreators');
var GlobalFunc = require('../../Common/GlobalFunc');
var ElementStore= require('../../../stores/ElementStore');
var $ = require("jquery");
var DIFFTEXTPANNEL=20;
var TextMixin = {
    componentWillUnmount:function(){
        this.mounted=false;
    },
    afterNewadd: function () {
        if(this.mounted){
            if (this.props.attributes['new']) {
                this.setState({isMoving:false})
                this.rangeSelect();
                var selection = $(ReactDOM.findDOMNode(this)).find('.element-selection');
                selection.css('pointer-events', 'none');
                MakeActionCreators.updateElement({new: false}, [this.props.index]);
            }
        }

    },
    onFocus:function(){
        this.clickFocus=true;
        setTimeout(()=>{
            this.clickFocus=false;
            console.log("clickFocus false");
        },300)
    },
    /**
     * 双击后默认全选文本
     */
    rangeSelect: function () {
        var attrs=this.props.attributes;
        var scale=GlobalFunc.getDeviceScale();
        var top=attrs['item_top']*scale-DIFFTEXTPANNEL;
        if(top<0){
           var selectEl= ElementStore.getDisplayFrameSelectedElement()
            var dim=GlobalFunc.getItemWidthAndHeight(selectEl&&selectEl[0]);
            console.log(dim.height);
            top=(this.props.attributes['item_top']+dim.height)*scale+50;
        }
       //var el=ReactDOM.findDOMNode(this.refs.text)
        this.props.textPannelToggleShow(true,top,this, attrs);
        if (this.props.showOnly) return;
        var editor = ReactDOM.findDOMNode(this).getElementsByClassName("elementDom")[0];
        editor.focus();
        window.setTimeout(function () {
            var sel, range;
            if (window.getSelection && document.createRange) {
                range = document.createRange();
                range.selectNodeContents(editor);
                range.collapse(true);
                range.setStart(editor, 0);
                range.setEnd(editor, editor.childNodes.length);
                sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (document.body.createTextRange) {
                range = document.body.createTextRange();
                range.moveToElementText(editor);
                range.collapse(true);
                range.selectValue();
            }
            //editor.scrollTop = editor.scrollHeight;
        }, 1);

    },
}

module.exports = TextMixin;