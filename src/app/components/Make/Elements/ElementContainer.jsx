/**
 * @component ElementContainer
 * @description 元素容器
 * @time 2015-09-06 10:25
 * @author StarZou
 **/

var React = require('react');
var ElementFactory = require('./ElementFactory');

var ElementContainer = React.createClass({

    mixins: [ElementFactory],


    render: function () {

        var elementsList,// 元素组件列表
            elements = this.props.elements;// 元素数组
        if (elements.length>0) {
            elementsList = elements.map(this.generateElement);
        }
        var pageStyle={};
        if(this.props.showBgImg&&this.props.page){
            //显示页的背景图和背景色 用于纹理
            var pageAttrs=this.props.page.attributes;
            if(pageAttrs.color_off){
                pageStyle.backgroundColor=pageAttrs["color_code"];
            }
            if(pageAttrs.img_off){
                if(pageAttrs["bg_code"] == ""){
                    pageStyle.backgroundImage ="url("+pageAttrs["color_code"]+")";
                }else{
                    pageStyle.backgroundImage ="url("+pageAttrs["bg_code"]+")";
                }
            }
        }
        return (
            <div className="element-container" style={pageStyle}>
                {elementsList}

            </div>
        );
    }

});

module.exports = ElementContainer;