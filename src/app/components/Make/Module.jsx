/**
 * @component Header
 * @description 头部组件
 * @time 2015-08-31 18:16
 * @author StarZou
 **/

var React = require('react');
var mui = require('material-ui');
import baseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
var GlobalFunc = require("../Common/GlobalFunc");
var MakeActionCreators = require('../../actions/MakeActionCreators');
var PageStore = require('../../stores/PageStore');
var Tpl = require("../../utils/tpl");
var MakeWebAPIUtils = require("../../utils/MakeWebAPIUtils");
var Tabs = mui.Tabs;
var Tab = mui.Tab;
var Tags = require("../Common/Tags.jsx");
var Tag = require("../Common/Tag.jsx");
require("../../../assets/css/tags.css");
var $ = require("jquery");
var _ = require('lodash');

var DialogAction = require('../../actions/DialogActionCreator');


var CommonUtils = require('../../utils/CommonUtils');

var exsit = {
    "basic_form"   : false,
    "company_form" : false,
    "personal_form": false
};


var tabData = new Array(3);
tabData[0] = [];
tabData[1] = [];
tabData[2] = [];
var Module = React.createClass({

    getInitialState  : function () {
        return {
            pageAddClickCount: this.props.pageAddClickCount,
            tabIndex         : 1
        }
    },
    childContextTypes: {
        muiTheme: React.PropTypes.object
    },
    getChildContext() {
        return {muiTheme: getMuiTheme(baseTheme)};
    },


    componentDidMount: function () {
        this._getData(["企业"], [2, 1]);
        this._getData(["个人"], [3, 1]);
        this._testExsit(["企业"], [2, 5], "company_form");
        this._testExsit(["个人"], [3, 5], "personal_form");
        //document.getElementById("device").addEventListener("drop", this.addPageWithModule);
        //document.getElementById("device").addEventListener("dragover", this.preventDefaultMethod);
    },

    componentWillUnmount: function () {
        //document.getElementById("device").removeEventListener("drop", this.addPageWithModule);
        //document.getElementById("device").removeEventListener("dragover", this.preventDefaultMethod);
    },

    setModule: function (tid, selectedIndex, selectedTagArr) {
        this.setState({selectTid: tid, selectedIndex: selectedIndex, indexArr: selectedTagArr})
    },

    imgDoubleClick: function (tid, selectedIndex, selectedTagArr) {
        this.setState({selectTid: tid, selectedIndex: selectedIndex, indexArr: selectedTagArr});
        if (this.props.replacePage) {
            this.replacePage(tid);
        } else {
            this.addPageWithModule(tid);
            this.props.pageClickAdd();
        }
        //this.cancel();
    },

    onDragStartHandler: function (e) {
        /*拖拽开始(被拖拽元素) ondragstart 不可以写preventDefault事件*/
        var tid = e.target.getAttribute("data-tid");
        e.dataTransfer.setData("templateId", tid);//存储拖拽元素的id*/
    },

    _renderServerData: function (data, tagIndex) {

        var modules = data.map(function (module, i) {
            var module_src = module.get("effect_img") ? (module.get("effect_img").substr(3) + "?imageView/2/w/80/h/130/format/jpeg") : "";
            var tid = module.get('tpl_id');
            return (
                <li key={i}
                    className={_.isEqual(this.state.indexArr,tagIndex)&&this.state.selectedIndex===i?"active":""}
                    title="点击添加版式">
                    <a>
                        <img data-tid={tid} src={module_src} onClick={this.imgDoubleClick.bind(this, tid, i, tagIndex)}
                             onDoubleClick={this.imgDoubleClick.bind(this, tid, i, tagIndex)} draggable="true"
                             onDragStart={this.onDragStartHandler}/>
                    </a>

                </li>
            )
        }.bind(this));
        return (<ul className="module-container">
            {modules}
        </ul>)
    },

    getContent: function (tabIndex, subTabIndex) {
        var data = tabData[tabIndex - 1][subTabIndex - 1];
        if (data) {
            return this._renderServerData(data, [tabIndex, subTabIndex]);
        }
        return undefined;
    },

    _testExsit: function (label, modulePanelMenu, testField) {
        var tagArr = ["全部", "封面", "图文", "封底", "表单"];
        var skip = 0,
            limit = 100,
            userId = "",
            tplType = "12";
        label = label ? label : [];
        var firstIndex = modulePanelMenu[0], secondIndex = modulePanelMenu[1];
        if (secondIndex > 1) {
            label.push(tagArr[secondIndex - 1])
        }
        var _this = this;
        Tpl.get(function (data) {
            //var firstIndex = modulePanelMenu[0], secondIndex = modulePanelMenu[1];
            var tmpdata = data.data;
            if (tmpdata.length > 0) {
                //标签下有内容
                exsit[testField] = true;
                _this.setState({});
                tabData[firstIndex - 1][secondIndex - 1] = tmpdata;
            }
        }.bind(this), skip, limit, "editor_recno", "desc", "", "", tplType, label, {
            author   : userId,
            data_site: "1",
            approved : "1"
        });
    },

    _getData: function (label, modulePanelMenu) {
        var tagArr = ["全部", "封面", "图文", "封底", "表单"];
        var skip = 0,
            limit = 100,
            userId = "",
            tplType = "12";
        label = label ? label : [];
        var firstIndex = modulePanelMenu[0], secondIndex = modulePanelMenu[1];
        if (secondIndex > 1) {
            label.push(tagArr[secondIndex - 1])
        }
        Tpl.get(function (data) {
            //var firstIndex = modulePanelMenu[0], secondIndex = modulePanelMenu[1];
            var tmpdata = data.data;
            tabData[firstIndex - 1][secondIndex - 1] = tmpdata;
            //tabData[firstIndex - 1][secondIndex - 1] = data.data;
            this.setState({});
        }.bind(this), skip, limit, "editor_recno", "desc", "", "", tplType, label, {
            author   : userId,
            data_site: "1",
            approved : "1"
        });
    },

    changeModuleList: function (label, modulePanelMenu, e) {
        this._getData(label, modulePanelMenu);
        GlobalFunc.clickAnimation(e);
    },

    replacePage: function (id) {
        var _this = this;
        var tid = id || this.state.selectTid;
        if (!tid) {
            this.cancel();
            return;
        }

        //获取当前选中的页信息
        var page = PageStore.getSelectedPage();
        //判断当前页元素个数是否大于1
        if (page.attributes.item_object.length > 1) {
            DialogAction.show("tips", "", {     //提示是否替换
                contentText: "确定替换版式吗？",
                onConfirm  : function () {
                    CommonUtils.replaceTemplateById(tid, function () {
                        _this.props.pageClickReduce();
                    });
                    _this.props.pageClickAdd();
                }
            });
        } else {
            //不存在版式直接替换版式
            CommonUtils.replaceTemplateById(tid, function () {
                _this.props.pageClickReduce();
            });
            _this.props.pageClickAdd();
        }
    },

    onTabClickHandler: function (e) {
        var target = e.target;
        var index = target.getAttribute("data-id");
        if (index) {
            this.setState({tabIndex: parseInt(index)});
        }
    },

    addPageWithModule: function (id) {
        var _this = this;
        var tid = id || this.state.selectTid;
        if (!tid) {
            this.cancel();
            return;
        }
        //设置TPL的渲染器版本号
        fmacapi.tpl_get_tpl(tid, function (data) {
            var version = data.get("render_version");
            //tplData pages数据
            MakeWebAPIUtils.cld_get_tpl_data_local(tid, function (data) {
                _this.props.pageClickReduce();
                //console.log("添加成功！~");
                var pages = data.get("pages");

                //增加元素名称
                var itemObject = pages[0].attributes.item_object;
                itemObject.forEach((item) => {
                    if (!item.get("f_name")) {
                        item.set("f_name", GlobalFunc.genElementName(itemObject, item));
                    }
                });

                MakeActionCreators.addPage({
                    pageObj          : pages,
                    pageRenderVersion: version
                });
                //_this.cancel();
            }.bind(this), function () {
                GlobalFunc.addSmallTips("服务器连接失败，请稍后再试。", null, {delBackGround: true, clickCancel: true});
                console.log("作品不存在");
            });
        }, function (err) {
            GlobalFunc.addSmallTips("服务器连接失败，请稍后再试。", null, {delBackGround: true, clickCancel: true});
            console.log(err, "作品不存在");
        });
    },

    addBlankPage: function () {
        MakeActionCreators.addPage();
        this.cancel();
    },

    preventDefaultMethod: function (event) {
        event.preventDefault();
    },

    dragToAddStart: function (tid, index, tagIndex) {
        this.setState({selectTid: tid, selectedIndex: index, indexArr: tagIndex});
    },

    componentWillReceiveProps: function (nextProps) {
        this.setState({pageAddClickCount: nextProps.pageAddClickCount});
    },

    render: function () {
        //var footer = undefined;
        //if (this.props.replacePage) {
        //    footer = <ul id="module-footer">
        //        <li onClick={this.replacePage}>确定</li>
        //        <li onClick={this.cancel}>取消</li>
        //    </ul>
        //} else {
        //    footer = <ul id="module-footer">
        //        <li onClick={this.addPageWithModule}>确定</li>
        //        <li onClick={this.addBlankPage}>添加空白页</li>
        //    </ul>
        //}


        var hiddenStyle = {height: document.body.clientHeight - 54};
        if (!this.props.show) {
            hiddenStyle["width"] = 0
        }
        var tagPanelStyle = {height: document.body.clientHeight - 54 - 92}
        return (
            <div id="module-panel" style={hiddenStyle}>
                <div className="module-panel-tab">
                    <div className={this.state.tabIndex == 1 ? "module-tab-1 active" : "module-tab-1"} data-id="1"
                         onClick={this.onTabClickHandler}>行业版式
                    </div>
                    <div className={this.state.tabIndex == 2 ? "module-tab-2 active" : "module-tab-2"} data-id="2"
                         onClick={this.onTabClickHandler}>个人版式
                    </div>
                </div>
                <div style={{display : this.state.tabIndex == 1 ? "block" : "none"}}>
                    <Tags tagPanelStyle={tagPanelStyle}>
                        <Tag label="全部"
                             onClick={this.changeModuleList.bind(this,["企业"],[2,1])}> {this.getContent(2, 1)}</Tag>
                        <Tag label="封面"
                             onClick={this.changeModuleList.bind(this,["企业"],[2,2])}> {this.getContent(2, 2)}</Tag>
                        <Tag label="图文"
                             onClick={this.changeModuleList.bind(this,["企业"],[2,3])}> {this.getContent(2, 3)}</Tag>
                        <Tag label="封底"
                             onClick={this.changeModuleList.bind(this,["企业"],[2,4])}> {this.getContent(2, 4)}</Tag>
                        {exsit.company_form ? <Tag label="表单"
                                                   onClick={this.changeModuleList.bind(this,["企业"],[2,5])}> {this.getContent(2, 5)}</Tag> : null}
                    </Tags>
                </div>
                <div style={{display : this.state.tabIndex == 2 ? "block" : "none"}}>
                    <Tags tagPanelStyle={tagPanelStyle}>
                        <Tag label="全部"
                             onClick={this.changeModuleList.bind(this,["个人"],[3,1])}> {this.getContent(3, 1)}</Tag>
                        <Tag label="封面"
                             onClick={this.changeModuleList.bind(this,["个人"],[3,2])}> {this.getContent(3, 2)}</Tag>
                        <Tag label="图文"
                             onClick={this.changeModuleList.bind(this,["个人"],[3,3])}> {this.getContent(3, 3)}</Tag>
                        <Tag label="封底"
                             onClick={this.changeModuleList.bind(this,["个人"],[3,4])}> {this.getContent(3, 4)}</Tag>
                        <Tag label="基础"
                             onClick={this.changeModuleList.bind(this,["基础"],[1,1])}> {this.getContent(1, 1)}</Tag>
                        {exsit.personal_form ? <Tag label="表单"
                                                    onClick={this.changeModuleList.bind(this,["个人"],[3,5])}> {this.getContent(3, 5)}</Tag> : null}
                    </Tags>
                </div>
            </div>
        );
    }

});

module.exports = Module;