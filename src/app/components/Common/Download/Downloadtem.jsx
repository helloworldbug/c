/**
 * @description 一键出版的下载内容通用页面
 * @time 2016-11-10
 * @author tony
 **/
'use strict';

// require core module
var React = require('react');

// require style
require('./Download.css');
/**
 * 一键出版上传文件条目页面
 */
export default class DownloadItem extends React.Component{
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
    }
    /**
     *渲染界面
     */
    render() {
        const {item} = this.props;
        var chargeStr = item.isPremium ? "￥"+item.charge : "免费";
        var _hideStyle = item.isOpen ? {} : {visibility: "hidden"} ;      //不开开放的输入框隐藏
        chargeStr = item.isOpen ?  chargeStr : "即将上线";   //不开放的时候
        var _style = item.isOpen ? {} : {color: "#999"} ;
        return (
            <li className="download-publication-item">
                <div className="download-publication-item-type">
                    <input type="checkbox" onChange={this.updateItem.bind(this)} checked={item.isSelect} style={_hideStyle} />
                    <span className="download-publication-item-logo" style={{"backgroundImage":`url('${item.logo}')`}} ></span>
                    <span style={_style}>{item.name}</span>
                </div>
                <div className="download-publication-item-charge">{chargeStr}</div>
            </li>
        );
    }
    /**
     *将要接收属性的时候
     */
    componentWillReceiveProps(nextProps) {
    }
    /**
     *装载组件的时候
     */
    componentDidMount () {

    }

    /**
     *卸载组件的时候
     */
    componentWillUnmount() {

    }
    /**
     *更新类别选中状态
     */
    updateItem(){
        this.props.updateItem(this.props.itemIndex);
    }

}
