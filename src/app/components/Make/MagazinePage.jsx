/**
 * @component PageItem
 * @description
 * @time 2015-08-31 18:18
 * @author StarZou
 **/

var React = require('react');
var classNames = require('classnames');

var MakeActionCreators = require('../../actions/MakeActionCreators');
var ElementContainer = require('./Elements/ElementContainer');
var DialogAction = require('../../actions/DialogActionCreator');
var ElementStore = require('../../stores/ElementStore');
var PageStore = require('../../stores/PageStore');
var ClientState = require('../../utils/ClientState');
var MeConstants = require('../../constants/MeConstants');
var ElementsType = MeConstants.Elements;
var GlobalFunc = require("../Common/GlobalFunc");
var _ = require("lodash");
var moveAble = false;
var dragInfo = {}
function getStateFormProps(props) {
    var pageObj = GlobalFunc.getObjRef(props.workData, props.ID)
    var pageName =  GlobalFunc.htmlDecode(pageObj.attributes.f_name);
    //var layers;
    //if(!props.active){
    //    layers=null
    //}
    return { pageName: pageName, pageObj: pageObj.attributes }
}

var MagazinePage = React.createClass({
    getInitialState: function () {
        return getStateFormProps(this.props);
    },
    componentWillReceiveProps: function (nextProps) {
        this.setState(getStateFormProps(nextProps))
        if (!nextProps.active) {
            this.setState({ showLayers: false })
        }
    },
    render: function () {

        var classes = classNames({
            'page-item': true,
            'tree-page': true,
            'active': this.props.active
        });
        //console.log("showLayers",this.state.showLayers);
        var arrowClass = classNames({
            "hide": !this.props.active,
            'layer-arrow': true,
            'expand': this.state.showLayers,

        });
        var layers;
        if (this.state.showLayers) {
            layers = this.coverage(this.props.ID)
        }

        var index = parseInt(this.props.ID.split('|').pop()) + 1;

        return (
            <dd className={classes} data-id={this.props.ID} data-type="node" draggable="true"
                onContextMenu={this.props.pageMenu.bind(null, this.props.ID, "page") }
                onDoubleClick={this.editName.bind(this, this.props.ID) }>
                <div className="page-wrapper" draggable="false"
                    onClick={this.selectPage.bind(this, this.props.ID, "page") }>
                    <span className="pageIndex">{ index }</span>
                    <div className="bg-wrapper"><img  src={!!(this.state.pageObj["page_effect_img"]) ? (this.state.pageObj["page_effect_img"] + "?imageView2/2/w/64/") : "http://ac-hf3jpeco.clouddn.com/wy7k70ifPffxR0VoCjcctqgAXRGsG4roiQNk1w3c.jpg"}
                        draggable="false"></img></div>

                    <span className={arrowClass} onClick={this.showCoverage.bind(this, this.props.ID) }
                        draggable="false"></span>
                    <span className="page-name" draggable="true" onDragStart={this.stop}>{this.state.pageName}</span>
                </div>
                <ul className="pageCoverage" onDragStart={this.dragStart} onDragOver={this.dragOver}
                    onDragEnd={this.dragEnd} onContextMenu={this.stop}>
                    {layers}
                    <li id="layer-drop"></li>
                </ul>
            </dd>
        );

    },
    dragEnd: function () {
        this.drop();
    },
    dragStart: function (event) {
        if (event.target.className.indexOf("coverage-name") != -1 || event.target.id == "in-place-input") {
            event.preventDefault();
            return;
        }
        event.dataTransfer.effectAllowed = "move";
        event.stopPropagation();
        event.dataTransfer.effectAllowed = "move";
        dragInfo.srcID = event.target.dataset.id;
        dragInfo.parentTop = $(event.currentTarget).offset().top;
        //document.addEventListener("drop", this.drop);
    },
    dragOver: function (event) {
        if (typeof dragInfo.srcID == "undefined") {
            return;
        }
        dragInfo.canDrop = false;
        event.stopPropagation();
        var nodeDom = GlobalFunc.getNodeDom(event.target, "layer");
        if (nodeDom == null) {
            //$("#drop-target").hide();
            //event.dataTransfer.dropEffect = "none";
            return;
        }

        var $node = $(nodeDom);
        var middle = $node.offset().top + ($node.height() / 2);
        var dstInfo = {};
        var targetID = nodeDom.dataset.id;
        if (event.pageY > middle) {
            dstInfo.targetID = +targetID + 1;
            dstInfo.type = "next"
        } else {
            dstInfo.targetID = targetID;
            dstInfo.type = "pre"
        }

        //console.log("dragover:offset:",$node.offset());
        //console.log("id",dstInfo.targetID, dragInfo.srcID,targetID);
        //console.log(targetID);
        if ((dstInfo.targetID == dragInfo.srcID) || (dragInfo.srcID == targetID)) {
            $("#layer-drop").hide();
            return;
        }
        if ((targetID > dragInfo.srcID && dstInfo.targetID == +dragInfo.srcID + 1)) {
            $("#layer-drop").hide();
            return;
        }
        if (dstInfo.type == "pre") {
            $("#layer-drop").css({
                top: $node.offset().top - dragInfo.parentTop,
                height: 0,
                display: "block"
            });
        } else if (dstInfo.type == "next") {
            $("#layer-drop").css({
                top: $node.offset().top - dragInfo.parentTop + $node.height() + 10,
                height: 0,
                display: "block"
            });
        }
        dragInfo.targetID = dstInfo.targetID;
        dragInfo.canDrop = true;
        event.dataTransfer.dropEffect = "move";
        event.preventDefault();

    },
    drop: function (event) {
        if (typeof dragInfo.srcID == "undefined") {
            return;
        }
        //document.removeEventListener("drop", this.drop);
        $("#layer-drop").hide();
        var items = ElementStore.getElements();
        var GlobalFunc = require("../Common/GlobalFunc");
        var baseItem = GlobalFunc.getBaseFrame(items);
        var frames = GlobalFunc.getAllDisplayFrame(items);
        var layerFrame = baseItem.concat(frames);
        layerFrame.sort(GlobalFunc.itemSort("item_layer"));
        if (dragInfo.canDrop) {
            MakeActionCreators.changeLayer("move", {
                startIndex: dragInfo.srcID,
                endIndex: dragInfo.targetID,
                objs: layerFrame
            })
        }
        dragInfo.srcID = undefined;
    },
    stop: function (event) {
        event.preventDefault();
        event.stopPropagation();
    },
    editElementName: function (index, event) {
        event.stopPropagation();
        var target = $(".coverage-name", event.currentTarget)[0];
        var oldValue = GlobalFunc.htmlDecode(target.innerHTML)
        target.setAttribute("draggable", true);
        target.innerHTML = '<input id="in-place-input" type="text" draggable="true" value="" maxlength="20"/>';
        $("#in-place-input").on("blur", (event) => {
            var name =  event.target.value;
            target.setAttribute("draggable", false);
            $("#in-place-input").remove();
            target.innerHTML = name;
            MakeActionCreators.updateElement({ f_name: GlobalFunc.htmlEncode(name) }, [index]);
        }).focus().on("keydown", function (event) {
            if (event.which == 13) {
                $(event.target).trigger("blur")
            }
        }).val(oldValue);
    },
    editName: function (nextID, event) {
        var target = $(".page-name", event.currentTarget)[0];
        var oldValue = GlobalFunc.htmlDecode(target.innerHTML)
        target.innerHTML = '<input id="in-place-input" type="text" value="" maxlength="20"/>';
        $("#in-place-input").on("blur", (event) => {
            var name = event.target.value;
            $("#in-place-input").remove();
            target.innerHTML = name;
            MakeActionCreators.updateAttr({ index: nextID, type: "page" }, { f_name:  GlobalFunc.htmlEncode(name) });

        }).focus().on("keydown", function (event) {
            if (event.which == 13) {
                $(event.target).trigger("blur")
            }
        }).val(oldValue);
    },
    pageClick: function (ID, type, event) {
        MakeActionCreators.selectSome({ ID: ID, type: type })
    },
    removePage: function (index) {
        var items = this.props.page.attributes.item_object
        var GlobalFunc = require('../Common/GlobalFunc');
        if (GlobalFunc.existType(items, ElementsType.redEnvelope)) {
            //MakeActionCreators.removeElement();
            DialogAction.show("tips", "", {
                contentText: "删除后，充值金额将在\n红包过期后退还到账户中", onConfirm: function () {
                    MakeActionCreators.removePage(index);
                }
            });
        } else {
            DialogAction.show("tips", "", {
                contentText: "确定删除该页作品？",
                onConfirm: function () {
                    MakeActionCreators.removePage(index);
                }
            });
        }

    },

    spanMouseLeave: function (id) {
        moveAble = false;
        $(id).children("span").css({ display: "none" });
    },

    replacePage: function () {
        this.props.replacePage();
    },

    pagesCopy: function (index) {
        MakeActionCreators.copyPage(index);
    },

    selectPage: function (ID, type, event) {
        MakeActionCreators.selectSome({ ID: ID, type: type })
        //if (pageMoveInfo.isDragging)return;
        //var selectedIndex = PageStore.getSelectedPageIndex();
        //if (selectedIndex == this.props.index) return;
        //$(".pages-slide-showCoverage").removeClass("show");
        //$(".pageCoverage").slideUp();
        //MakeActionCreators.selectPage(this.props.index);
    },

    showCoverage: function (ID, event) {
        if (!this.state.showLayers) {
            this.setState({ showLayers: true });
        } else {
            this.setState({ showLayers: false });
        }

    },

    coverage: function (ID) {
        var MagazineStore = require('../../stores/MagazineStore');
        var pageObj = MagazineStore.getDatas(ID);
        var GlobalFunc = require("../Common/GlobalFunc");
        var items = ElementStore.getElements();

        var baseItem = GlobalFunc.getBaseFrame(items);
        var frames = GlobalFunc.getAllDisplayFrame(items);
        var layerFrame = baseItem.concat(frames);
        var _this = this;
        var selectEls = ElementStore.getDisplayFrameSelectedElement();
        var selectUUids = selectEls.map((item) => {
            if (item == -1) {
                return "music";
            }
            else {
                return item.get("item_uuid");
            }
        })

        layerFrame.sort(GlobalFunc.itemSort("item_layer"));
        var ascFrame = layerFrame.map(function (item, index) {
            // if (item.get('item_type') == 17) return;

            var itemType = item.get('item_type'), itemVal = item.get('item_val'),
                itemId = item.get('item_id'), uuid = item.get('item_uuid'),
                coverageIcon,
                coverageEffect = false, itemState = item.get('item_state'),
                bgStyle = {
                    backgroundImage: "url(" + itemVal + ")",
                    border: "1px solid #575757",
                    boxSizing: "border-box",
                    backgroundColor: "#999",
                    backgroundSize: "cover"
                }, isActive, isGroup = ClientState.isElementGrouped(item, pageObj.get('page_uid')),
                isLocked = ClientState.isLocked(item.get('item_uuid'), pageObj.get('page_uid'));
            var baseFrameIndex;
            for (let baseI = 0; baseI < baseItem.length; baseI++) {
                let tempItem = baseItem[baseI];
                if (uuid == tempItem.get('item_uuid')) {
                    baseFrameIndex = baseI;
                }
            }
            if (_.indexOf(selectUUids, uuid) > -1) {
                isActive = true;
            }

            var coverageGroup = <span className="coverage-group" draggable="false"/>;
            var coverageLock = <span className="coverage-lock" draggable="false"/>;
            var coverageName;
            switch (itemType) {
                case ElementsType.background:

                    coverageEffect = true;
                    break;
                case ElementsType.text:
                    coverageIcon = "text";
                    break;
                case ElementsType.watermark:
                    if (item.get('frame_style') == 1) {
                        coverageName = "水印";
                        coverageEffect = true;
                    } else if (item.get('frame_style') == 3) {
                        coverageName = "图形";
                        coverageEffect = true;
                    } else {
                        coverageName = "水印";
                        coverageEffect = true;
                    }
                    break;
                case ElementsType.video:
                    coverageIcon = "video";
                    break;
                case ElementsType.borderFrame:
                    coverageEffect = true;
                    break;
                case ElementsType.phone:
                    coverageIcon = "phone";
                    break;
                case ElementsType.inputText:
                    coverageIcon = "inputText";
                    break;
                case ElementsType.map:
                    coverageIcon = "map";
                    break;
                case ElementsType.pictureFrame:
                    coverageIcon = "picFrame";
                    break;
                case ElementsType.image:
                    coverageEffect = true;
                    break;
                case ElementsType.button:
                    coverageIcon = "button";
                    break;
                case ElementsType.radio:
                    coverageIcon = "radio";
                    break;
                case ElementsType.checkbox:
                    coverageIcon = "checkbox";
                    break;
                case ElementsType.vote:
                    coverageIcon = "vote";
                    break;
                case ElementsType.scribble:
                    coverageIcon = "scribble";
                    break;
                case ElementsType.fingerprint:
                    coverageName = "指纹长按";
                    coverageIcon = "fingerPrint";
                    break;
                case ElementsType.shake:
                    coverageIcon = "sharkItOff";
                    break;
                case ElementsType.displayFrame:
                    coverageIcon = "floatlayer";
                    break
                case ElementsType.embedded:
                    coverageIcon = "embedded";
                    break;
                case ElementsType.reward:
                    coverageIcon = "reward";
                    break;
                case ElementsType.label:
                    coverageIcon = "label";
                    break;
                case ElementsType.svg:
                    coverageIcon = "svg";
                    break;
                case ElementsType.picslide:
                    coverageIcon = "picslice";
                    break;
                case ElementsType.panorama:
                    coverageIcon = "panorama";
                    break;
                case ElementsType.redEnvelope:
                    coverageIcon = "redenvelope";
                    break;
                case ElementsType.ar:
                    coverageIcon = "ar";
                    break;
                case ElementsType.vr:
                    coverageIcon = "vr";
                    break;
            }

            coverageName =  GlobalFunc.htmlDecode(item.get("f_name"));

            var showButton = <span className={"coverage-stage " + (itemState == "hide" ? "itemHide" : "") }
                onClick={_this.coverageIsShow.bind(_this, baseFrameIndex, itemState) }
                draggable="false"/>;
            var show = {};

            var groupID = item.get('group_id');
            var layerIndex = index;//画框里的元素层级以画框为准
            if (groupID && itemType != ElementsType.pictureFrame) {
                if (GlobalFunc.ifPicFrame(groupID, baseItem)) {
                    for (let i = 0, len = layerFrame.length; i < len; i++) {
                        let item = layerFrame[i];
                        if (item.get('group_id') == groupID && item.get('item_type') == ElementsType.pictureFrame) {
                            layerIndex = i;
                            break
                        }
                    }
                }
            }
            if (GlobalFunc.isBackground(item.attributes) && item.get("item_state") == "none" || itemType == ElementsType.pictureFrame) {
                show.display = "none"
            }
            // if (GlobalFunc.isBackground(item.attributes) && item.get("item_state") == "none") {
            //     show.display = "none"
            // }
            return (
                <li key={index} className={isActive ? "active" : ""} style={show} onClick={_this.selectElement.bind(_this, item) }
                    draggable="true" data-id={layerIndex} data-type="layer" onDoubleClick={_this.editElementName.bind(_this, index) }
                    >
                    <div className="left" draggable="false">
                        {showButton}
                        <span className={"coverage-icon " + (coverageIcon || "") }
                            style={coverageEffect ? bgStyle : null} draggable="false"/>
                        <span className="coverage-name" draggable="false" >{coverageName}</span>
                    </div>
                    <div className="right" draggable="false">
                        { isGroup ? coverageGroup : null}
                        { isLocked ? coverageLock : null}
                    </div>
                </li>
            )
        });
        return ascFrame;
    },

    coverageIsShow: function (index, itemState, event) {
        event.stopPropagation();
        var frame = ElementStore.getDisplayFrame();
        if (!!frame) {
            return console.log("float layer can not hide");
        }
        if (itemState == "hide") {
            MakeActionCreators.updateElement({ item_state: "" }, [index]);
        } else {
            MakeActionCreators.updateElement({ item_state: "hide" }, [index]);
        }
    },
    floatLayerIsShow: function (uuid, itemState, event) {
        event.stopPropagation();
        var frame = ElementStore.getDisplayFrame();
        if (itemState == 1) {
            MakeActionCreators.updateElement({ item_display_status: 0 }, undefined, undefined, uuid);
        } else {
            MakeActionCreators.updateElement({ item_display_status: 1 }, undefined, undefined, uuid);
        }
    },

    selectElement: function (item, event) {
        event.stopPropagation();
        MakeActionCreators.selectElement(item.get("item_uuid"), { type: "select_layer" });
    }

});

module.exports = MagazinePage;