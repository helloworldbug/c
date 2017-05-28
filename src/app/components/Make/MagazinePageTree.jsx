/**
 * @component PageList
 * @description 页列表组件
 * @time 2015-08-31 18:18
 * @author StarZou
 **/

var React = require('react');

var MagazinePage = require('./MagazinePage');
var DialogAction = require('../../actions/DialogActionCreator');
var MakeActionCreators = require('../../actions/MakeActionCreators');
var GlobalFunc = require("../Common/GlobalFunc");
var $ = require("jquery");
var moveAble = false;
var dragInfo = {};
var classNames = require('classnames');


var MagazinePageTree = React.createClass({
    getInitialState: function () {
        this.mounted=true
        return {
            show1Tips  : !GlobalFunc.getUserExtra("userAddPage"),
            pagelistTop: 0
        };
    },
    componentWillUnmount:function(){
        this.mounted=false;
    },
    groupClick     : function (ID, type, event) {
        MakeActionCreators.selectSome({ID: ID, type: type})
    },
    createChild    : function (ID, item, index) {
        if (GlobalFunc.isGroup(item)) {
            ///渲染成组
            return (<dd key={ID?(ID+"|"+index):index} >
                {this.createGroup(ID, item, index)}
            </dd>)
        } else {
            ///渲染成页
            return this.createPage(ID, item, index);
        }
    },
    copy           : function () {
        MakeActionCreators.copyNode();
    },

    removeNode: function () {

        if (GlobalFunc.nodeCanRemove(this.props.workData, this.props.selectedState)) {
            var text = this.props.selectedState.type == "page" ? "确定删除？" : "删除组及其内容？";
            DialogAction.show("tips", "", {
                contentText: text,
                onConfirm  : function () {
                    MakeActionCreators.removeNode();
                    DialogAction.hide();
                }
            });
            //MakeActionCreators.removeNode();
        }

    },
    rename    : function () {
        console.log(this.state.menuElement);
        var evt = document.createEvent('Event');
        evt.initEvent("dblclick", true, true);
        this.state.menuElement.dispatchEvent(evt);
    },

    createMenu : function (ID, type, event) {
        MakeActionCreators.selectSome({ID: ID, type: type});
        var common = [<li key="addGrp" onClick={this.addGroup.bind(this,ID)}>添&nbsp;&nbsp;加&nbsp;&nbsp;组</li>,
            <li key="copy" onClick={this.copy}>复&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;制</li>,
            <li key="remove" onClick={this.removeNode}>删&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;除</li>,
            <li key="rename" onClick={this.rename}>重&nbsp;&nbsp;命&nbsp;&nbsp;名</li>];
        if (GlobalFunc.canAddPage(ID)) {
            common.unshift(<li key="addPage" onClick={this.addPage}>添&nbsp;&nbsp;加&nbsp;&nbsp;页</li>)
        }
        if (type == "page") {
            common.push(<li key="replace" onClick={this.replacePage}>替换版式</li>);
        }
        var userObj = GlobalFunc.getUserObj();
        if (userObj.speFunctionCode) {
            if (userObj.speFunctionCode.indexOf("PICFRAME_ABLE") > -1) {
                //超级用户才显示合并
                common.push(<li key="merge" onClick={this.mergeMagazine}>作品合并</li>);
            }
        }
        event.preventDefault();
        event.stopPropagation();
        console.log(document.body.clientHeight - event.pageY);
        var menuStyle = {
            top: event.pageY,
            left: event.pageX,
            position: "fixed"
        }
        if (document.body.clientHeight - event.pageY < 200) {
            menuStyle = {
                top:"auto",
               bottom:document.body.clientHeight - event.pageY,
                left: event.pageX,
                position: "fixed"
            }
        }
        var menu = <ul className="pop-menu" style={menuStyle}>{common}</ul>
        this.setState({menu: menu, menuElement: event.currentTarget});
        document.addEventListener("click", this.hideMenu)
    },
    mergeMagazine:function(){
        DialogAction.show("mergemagazine");

    },
    hideMenu   : function () {
        if(this.mounted){
            this.setState({menu: null});
        }

        document.removeEventListener("click", this.hideMenu)
    },
    createGroup: function (ID, group, index) {
        var children;
        var nextID;
        if (typeof ID == "undefined") {
            nextID = index;
            ID = index;
        } else {
            nextID = ID + "|" + index;
        }
        ///
        if (group.attributes["items"]&&group.attributes["items"].length>0) {
            children = group.attributes["items"].map((child, childIndex)=> {
                return this.createChild(nextID, child, childIndex);
            })
        }

        var indexEm = <em>{index + 1}</em>;
        
        return (<dl data-id={nextID} data-type="node">
            <dt data-id={nextID} data-type="node" className={this.props.selectedState.index==nextID?"active":""} draggable="true">
                {indexEm}
                <span
                className={group.attributes["f_collapse"]?"arrow collapse":"arrow"}
                onClick={this.toggleGroup.bind(this,nextID)} draggable="false"></span>
                <div draggable="false" onDragStart={this.stop}
                     className="group-name"
                     onDoubleClick={this.editName.bind(this,nextID)}
                     onClick={this.groupClick.bind(this,nextID,"group")}
                     onContextMenu={this.createMenu.bind(this,nextID,"group")}>{GlobalFunc.htmlDecode(group.attributes["f_name"])}</div>
            </dt>
            <div key={nextID} className={group.attributes["f_collapse"]?"children collapse":"children"}>{children}</div>
        </dl>)
    },
    stop       : function (event) {
        event.preventDefault();
        event.stopPropagation();
    },
    editName   : function (nextID, event) {
        var target = event.target;
        target.setAttribute("draggable", true);
        var oldValue = GlobalFunc.htmlDecode(target.innerHTML)
        target.innerHTML = '<input id="in-place-input" type="text"  value="" maxlength="20"/>';
        $("#in-place-input").on("blur", (event)=> {
            var name = event.target.value;
            $("#in-place-input").remove();
            target.setAttribute("draggable", false)
            target.innerHTML = name
            MakeActionCreators.updateAttr(this.props.selectedState, {f_name: GlobalFunc.htmlEncode(name)});
        }).focus().on("keydown", function (event) {
            if (event.which == 13) {
                $(event.target).trigger("blur")
            }
        }).val(oldValue);
    },
    toggleGroup: function (ID) {
        MakeActionCreators.toggleNode(ID);
    },
    createPage : function (ID, leaf, index) {
        if (typeof ID == "undefined") {
            ID = index;
        } else {
            ID = ID + "|" + index;
        }
        return <MagazinePage key={ID} data={leaf} ID={ID} active={this.props.selectedState.index==ID}
                             workData={this.props.workData} pageMenu={this.createMenu}/>
    },
    nodeChange : function (type) {
        var ID = this.props.selectedState.index;
        var lastLayerIndex = GlobalFunc.getLastLayerIndex(ID);
        if (type == "up") {
            if (GlobalFunc.nodeCanUp(this.props.workData, this.props.selectedState)) {
                lastLayerIndex--
            } else {
                return
            }

        } else {
            if (GlobalFunc.nodeCanDown(this.props.workData, this.props.selectedState)) {
                lastLayerIndex = +lastLayerIndex + 2;
            } else {
                return
            }

        }
        ;
        var parentID = GlobalFunc.getParent(ID);

        var targerID = parentID == "" ? lastLayerIndex.toString() : parentID + "|" + lastLayerIndex;
        console.log(targerID);
        MakeActionCreators.dragNode({src: ID, dst: targerID})
    },
    render     : function () {
        //debugger;
        if (this.props.workData.attributes["items"]) {
            var tree = this.props.workData.attributes["items"].map(this.createChild.bind(this, undefined));
        }

        var height = document.body.clientHeight - 54 - 40 - 40;
        var hiddenStyle = {};
        if (!this.props.show) {
            hiddenStyle = {
                width: "0px"
            }
        }
        var show1Tips = "driftUpDown animated ";
        if (this.state.show1Tips && this.props.show) {
            show1Tips += "show";
        } else {
            show1Tips += "hide";
        }
        var upClass = classNames({
            up     : true,
            disable: !GlobalFunc.nodeCanUp(this.props.workData, this.props.selectedState)
        });
        var downClass = classNames({
            down   : true,
            disable: !GlobalFunc.nodeCanDown(this.props.workData, this.props.selectedState)
        });
        var menuClass = classNames({
            "node-menu-wrapper": true,
            hide               : !this.state.menu
        });
        var removeClass = classNames({
            "remove": true,
            disable : !GlobalFunc.nodeCanRemove(this.props.workData, this.props.selectedState)
        });
        return (
            <div className="pages-container" style={hiddenStyle}>
                <ul className="tree-tool">
                    <li className="add-page" onClick={this.addPage} title="添加页"></li>
                    <li className="add-group" onClick={this.addGroup} title="添加组"></li>
                    {/* <li className={upClass} onClick={this.nodeChange.bind(this,"up")} title="上移"></li>
                    <li className={downClass} onClick={this.nodeChange.bind(this,"down")} title="下移"></li>
                    <li className={removeClass} onClick={this.removeNode} title="删除"></li>*/}
                </ul>
                <div id="page-list" style={{height: height}} onDragStart={this.dragStart} onDragOver={this.dragOver}
                     onDragEnd={this.dragEnd}>
                    {tree}

                    <div id="drop-target"/>
                    <div className={menuClass}>{this.state.menu}</div>
                </div>

            </div>
        );
    },
    dragEnd    : function () {
        this.drop();
    },
    dragStart  : function (event) {
        if (event.target.id == "in-place-input") {
            return;
        }
        event.dataTransfer.effectAllowed = "move";
        dragInfo.srcID = event.target.dataset.id;
        this.setState({pagelistTop: $("#page-list").offset().top});
        //document.addEventListener("drop", this.drop);
    },
    dragOver   : function (event) {
        if (typeof dragInfo.srcID == "undefined") {
            return;
        }
        dragInfo.canDrop = false;
        var nodeDom = GlobalFunc.getNodeDom(event.target,"node");
        if (nodeDom == null) {
            return;
        }
        var tagName = nodeDom.tagName;
        var $node = $(nodeDom);
        //console.log("dragover:offset:",$node.offset());
        var targetID = nodeDom.dataset.id;
        console.log(targetID);
        if (targetID == dragInfo.srcID || targetID.indexOf(dragInfo.srcID) == 0) {
            $("#drop-target").hide();
            //event.dataTransfer.dropEffect = "none";
            return;
        }
        var dstInfo = GlobalFunc.getDstID(event.pageY, {
            top   : $node.offset().top,
            height: $node.height()
        }, nodeDom.dataset.id, this.props.workData, dragInfo.srcID, tagName);
        if (dstInfo.type == "disable") {
            $("#drop-target").hide();
            //event.dataTransfer.dropEffect = "none";
            return;
        }
        dragInfo.canDrop = true;
        dragInfo.targetID = dstInfo.targetID;
        console.log(dragInfo);
        var targetID = dstInfo.targetID;
        var layerDeepth = targetID.split("|").length - 1;
        var dropLeft = layerDeepth * 13;
        var scrollTop = $("#page-list")[0].scrollTop
        var pagelistTop = this.state.pagelistTop;
        if (dstInfo.type == "pre") {
            $("#drop-target").css({
                top    : $node.offset().top - pagelistTop + scrollTop,
                left   : dropLeft,
                height : 0,
                display: "block"
            });
        } else if (dstInfo.type == "next") {
            $("#drop-target").css({
                top    : $node.offset().top + $node.height() + 1 - pagelistTop + scrollTop,
                left   : dropLeft,
                height : 0,
                display: "block"
            });
        } else {
            $("#drop-target").css({
                top    : $node.offset().top - 1 - pagelistTop + scrollTop,
                left   : dropLeft,
                height : 22,
                display: "block"
            });
        }
        console.log("dragover: pageX:%d,pageY:%d", event.pageX, event.pageY);

        event.dataTransfer.dropEffect = "move";
        event.preventDefault();


    },
    drop       : function (event) {
        //document.removeEventListener("drop", this.drop);
        if (typeof dragInfo.srcID == "undefined") {
            return;
        }
        $("#drop-target").hide();
        if (dragInfo.canDrop) {
            MakeActionCreators.dragNode({src: dragInfo.srcID, dst: dragInfo.targetID})
        }
        dragInfo.srcID = undefined;
    },
    addGroup   : function (ID) {
        if (typeof ID == "string" || typeof ID == "number") {
            MakeActionCreators.addGroup(ID.toString());
        } else {
            MakeActionCreators.addGroup();
        }

    },

    spanMouseEnter: function (id) {
        moveAble = true;
        document.onmousemove = function (e) {
            if (moveAble) {
                $(id).children("span.addTips").css({display: "block", top: e.pageY + 10, left: e.pageX + 5});
            }
        };
    },

    spanMouseLeave: function (id) {
        moveAble = false;
        $(id).children("span.addTips").css({display: "none"});
    },

    addPage: function () {

        MakeActionCreators.addPage();
    },

    replacePage: function (ID) {
        this.props.showModule(true);
    },


});

module.exports = MagazinePageTree;