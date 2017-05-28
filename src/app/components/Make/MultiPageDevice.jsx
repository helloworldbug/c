/**
 * @component Device
 * @description 设备组件: 展示当前页的元素, 并进行操作
 * @time 2015-08-31 18:01
 * @author StarZou
 **/

var React = require('react');
var GlobalFunc = require("../Common/GlobalFunc")

var MultiPageDevice = React.createClass({

    getInitialState  : function () {
        return this.getStateFormProps(this.props);

    },
    getStateFormProps: function (props) {;
        var MagazineStore = require("../../stores/MagazineStore");
        var workData = MagazineStore.getWorkData();
        var SelectStore = require("../../stores/SelectStore");
        var parentID = SelectStore.getSelectInfo().index;
        var pages = props.pages.map((page, index)=> {
            var ID = parentID + "|" + index;
            var type = "page";
            if (GlobalFunc.isGroup(GlobalFunc.getObjRef(workData, ID))) {
                type = "group"
                return <li key={index} onClick={this.props.pageClick.bind(null,ID,type)} className="multi-page-group">
                    <div className="wrapper"><img
                        src="http://ac-hf3jpeco.clouddn.com/153e57dc18d30354.png"/></div>
                    <span>{GlobalFunc.htmlDecode(page.get("f_name"))}</span>
                </li>
            }
            return <li key={index} onClick={this.props.pageClick.bind(null,ID,type)}><div className="wrapper"><img
                src={page.get("page_effect_img")||"http://ac-hf3jpeco.clouddn.com/wy7k70ifPffxR0VoCjcctqgAXRGsG4roiQNk1w3c.jpg"}/></div><span>{GlobalFunc.htmlDecode(page.get("f_name"))}</span>
            </li>
        });

        var loadings = [];

        for (var i = 0, length = props.pageAddClickCount; i < length; i++) {
            loadings.push(<li key={i} className="load-img"></li>)
        }

        return {pages: pages, loadings: loadings};
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState(this.getStateFormProps(nextProps))
    },

    render                   : function () {
        var pagesWidth = 224 * 3;
        //var pagesHeight = document.body.clientHeight - 54 - 40;
        var pagesHeight = document.body.clientHeight - 54;
        var clientWidth = document.body.clientWidth;
        if (clientWidth > 1366 && clientWidth <= 1600) {
            pagesWidth = 224 * 3
        } else if (clientWidth > 1600 && clientWidth <= 1804) {
            pagesWidth = 224 * 4
        } else if (clientWidth > 1804 && clientWidth <= 1920) {
            pagesWidth = 224 * 5
        } else if (clientWidth > 1920) {
            pagesWidth = 224 * 6
        }
        return <div className="multi-page-wrapper"
                    style={{width:document.body.clientWidth- 180-300,height:pagesHeight}}>
            <ul className="multi-page" style={{width:pagesWidth}}>
                {this.state.pages}
                {this.state.loadings}
            </ul>
        </div>
    },


});

module.exports = MultiPageDevice;