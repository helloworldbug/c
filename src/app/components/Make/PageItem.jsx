/**
 * @component PageItem
 * @description
 * @time 2015-08-31 18:18
 * @author StarZou
 **/

var React = require('react');
var classNames = require('classnames');
var Count=require('../../utils/Count');
var MakeActionCreators = require('../../actions/MakeActionCreators');
var ElementContainer = require('./Elements/ElementContainer');
var DialogAction = require('../../actions/DialogActionCreator');
var ElementStore = require('../../stores/ElementStore');
var PageStore = require('../../stores/PageStore');
var ClientState = require('../../utils/ClientState');
var MeConstants = require('../../constants/MeConstants');
var ElementsType = MeConstants.Elements;
var _=require("lodash");
var moveAble = false;
var dragLayerEl={};
var pageMoveInfo = {
    isMouseDown   : false,
    isDragging    : false, /*是否拖动了缩略图页面*/
    dY            : 0,
    isFirstStep   : true,
    moveIndex     : -1,
    lastMousePageY: 0
};

function movePageItem(moveObj, targetObj, moveObjOffsetTop) {

    if (moveObjOffsetTop < moveObj.parentNode.offsetTop - 10) {
        return false;
    }
    if (moveObjOffsetTop + moveObj.offsetHeight > moveObj.parentNode.scrollHeight) {
        return false;
    }
    moveObj.style.top = moveObjOffsetTop + "px";

    if (!targetObj) return true;
    if (targetObj.offsetTop + targetObj.offsetHeight < moveObj.offsetTop) {
        if (!targetObj.nextElementSibling) {
            debugger;
        }
        if (!targetObj.nextElementSibling.nextElementSibling) {
            return true;
        }
        targetObj.parentNode.insertBefore(targetObj.nextElementSibling, targetObj);
        //下移
    } else if (moveObj.offsetTop + moveObj.offsetHeight < targetObj.offsetTop) {
        //上移
        targetObj.parentNode.insertBefore(targetObj, targetObj.previousElementSibling);
    }
    return true;
}

function SlideScroll() {
    if (!pageMoveInfo.isDragging) {
        //var pageList=document.getElementById("page-list");
        //pageList.removeEventListener("scroll",SlideScroll);
        $('#page-list').off('scroll', SlideScroll);
        debugger;
        return;
    }
    var positionTop = pageMoveInfo.lastMousePageY + pageMoveInfo.parent.scrollTop - pageMoveInfo.dY;
    movePageItem(pageMoveInfo.moveObj, pageMoveInfo.targetObj, positionTop);
}
function pageMouseMove(e) {

    if (pageMoveInfo.isMouseDown) {
        if (pageMoveInfo.isFirstStep) {
            $(".pages-slide-showCoverage").removeClass("show");
            $(".pageCoverage").hide();
            //var pageList=document.getElementById("page-list");
            //pageList.onScroll=this.SlideScroll;
            //pageList.addEventListener("scroll",SlideScroll);
            //$('#page-list').on('scroll', this.SlideScroll);
            $('#page-list').on('scroll', SlideScroll);

            //移动的第一次添加一个高度一样的空节点
            var itemObj = document.createElement("li");
            var itemHeight = pageMoveInfo.moveObj.offsetHeight;
            itemObj.setAttribute("style", "height:" + itemHeight + "px;");
            pageMoveInfo.targetObj = itemObj;
            $(itemObj).insertAfter(pageMoveInfo.moveObj);
            $(pageMoveInfo.moveObj).addClass('move');

            pageMoveInfo.moveObj.style.position = "absolute";
            pageMoveInfo.isFirstStep = false;
            console.log("add");
        }
        var positionTop = e.pageY + pageMoveInfo.parent.scrollTop - pageMoveInfo.dY;
        if (movePageItem(pageMoveInfo.moveObj, pageMoveInfo.targetObj, positionTop)) {
            pageMoveInfo.lastMousePageY = e.pageY;
        }
        pageMoveInfo.isDragging = true;
    }
}

function pageMouseUp() {

    pageMoveInfo.isMouseDown = false;
    document.removeEventListener('mouseup', pageMouseUp);
    document.removeEventListener('mousemove', pageMouseMove);
    //var pageList=document.getElementById("page-list");
    //pageList.onScroll=null;
    //pageList.removeEventListener("scroll",SlideScroll);
    $('#page-list').off('scroll', SlideScroll);
    console.log("dragging:" + pageMoveInfo.isDragging);
    if (pageMoveInfo.moveObj && pageMoveInfo.isDragging) {
        pageMoveInfo.moveObj.style.top = "0";
        pageMoveInfo.moveObj.style.position = "relative";
        var allSiblings = pageMoveInfo.moveObj.parentNode.children;
        var targetIndex = -1;
        for (var i = 0; i < allSiblings.length - 1; i++) {
            if (allSiblings[i] == pageMoveInfo.moveObj)continue;
            targetIndex++;
            if (allSiblings[i] == pageMoveInfo.targetObj) {
                pageMoveInfo.moveObj.parentNode.removeChild(pageMoveInfo.targetObj);
                break;
            }
        }
        allSiblings = pageMoveInfo.moveObj.parentNode.children;
        for (var i = 0; i < allSiblings.length; i++) {
            if (allSiblings[i] == pageMoveInfo.moveObj)break;
        }
        $(pageMoveInfo.moveObj).removeClass('move');
        if (targetIndex !== pageMoveInfo.moveIndex) {
            MakeActionCreators.movePage(pageMoveInfo.moveIndex, targetIndex);
        }
    }
    setTimeout(function () {
        pageMoveInfo.isDragging = false;
    }, 50);
}

var PageItem = React.createClass({

    render: function () {

        var classes = classNames({
            'page-item': true,
            'active'   : this.props.active
        });

        var i = this.props.index;
        var delete_page_style = this.props.showDelete ? "show" : "hide";

        var coverageList = this.coverage();

        return (
            <li className={classes} onClick={this.selectPage} onMouseDown={this.liMouseDown.bind(this,i)}>
                <div className="img">
                    <div className="cover"></div>
                    <div className="compositionChart">
                        <ElementContainer
                            elements={ElementStore.getBaseElements(this.props.page.attributes.item_object)}
                            showOnly={true}/>
                    </div>
                </div>
                <label className={"pages-slide-pageIndex"}>{i + 1}</label>

                <div id="pages-slide-delete"
                     className={"pages-slide-delete " + delete_page_style}
                     onClick={this.removePage.bind(this,i)}
                     onMouseEnter={this.spanMouseEnter.bind(this,".pages-slide-delete")}
                     onMouseLeave={this.spanMouseLeave.bind(this,".pages-slide-delete")}>
                    <span className="tips fadeInLeft animated">删除</span>
                </div>
                <div className={"pages-slide-copy"} onClick={this.pagesCopy.bind(this,i)}
                     onMouseEnter={this.spanMouseEnter.bind(this,".pages-slide-copy")}
                     onMouseLeave={this.spanMouseLeave.bind(this,".pages-slide-copy")}>
                    <span className="tips fadeInLeft animated">复制</span>
                </div>
                <div className={"pages-slide-reChange"} onClick={this.replacePage}
                     onMouseEnter={this.spanMouseEnter.bind(this,".pages-slide-reChange")}
                     onMouseLeave={this.spanMouseLeave.bind(this,".pages-slide-reChange")}>
                    <span className="tips fadeInLeft animated">替换</span>
                </div>
                <div className={"pages-slide-showCoverage"} onClick={this.showCoverage}
                     onMouseEnter={this.spanMouseEnter.bind(this,".pages-slide-showCoverage")}
                     onMouseLeave={this.spanMouseLeave.bind(this,".pages-slide-showCoverage")}>
                    <span className="tips fadeInLeft animated">显示当前页图层</span>
                </div>
                <ul className="pageCoverage" onMouseDown={this.prohibitionDrag}>
                    {coverageList}
                </ul>
            </li>
        );

    },

    removePage: function (index) {
        var items =  this.props.page.attributes.item_object
        var GlobalFunc = require('../Common/GlobalFunc');
        if(GlobalFunc.existType(items,ElementsType.redEnvelope)){
            //MakeActionCreators.removeElement();
            DialogAction.show("tips", "", {
                contentText: "删除后，充值金额将在\n红包过期后退还到账户中", onConfirm: function () {
                    MakeActionCreators.removePage(index);
                }
            });
        }else{
            DialogAction.show("tips", "", {
                contentText: "确定删除该页作品？",
                onConfirm  : function () {
                    MakeActionCreators.removePage(index);
                }
            });
        }

    },

    spanMouseEnter: function (id) {
        moveAble = true;
        document.onmousemove = function (e) {
            if (moveAble) {
                $(id).children("span").css({display: "block", top: e.pageY + 10, left: e.pageX + 5});
            }
        };
    },

    liMouseDown: function (index, e) {
        if (pageMoveInfo.isMouseDown == true) {
            return;
        }

        pageMoveInfo.moveIndex = index;
        pageMoveInfo.isFirstStep = true;
        pageMoveInfo.isMouseDown = true;
        pageMoveInfo.parent = e.currentTarget.parentNode;
        pageMoveInfo.moveObj = e.currentTarget;
        pageMoveInfo.dY = e.pageY + pageMoveInfo.parent.scrollTop - e.currentTarget.offsetTop;

        document.addEventListener("mouseup", pageMouseUp);

        setTimeout(function () {
            document.addEventListener("mousemove", pageMouseMove);
        }, 20);

    },

    pageMouseMove: function (e) {

        if (pageMoveInfo.isMouseDown) {
            if (pageMoveInfo.isFirstStep) {
                //var pageList=document.getElementById("page-list");
                //pageList.onScroll=this.SlideScroll;
                //pageList.addEventListener("scroll",SlideScroll);
                //$('#page-list').on('scroll', this.SlideScroll);
                $('#page-list').on('scroll', SlideScroll);

                //移动的第一次添加一个高度一样的空节点
                var itemObj = document.createElement("li");
                var itemHeight = pageMoveInfo.moveObj.offsetHeight;
                itemObj.setAttribute("style", "height:" + itemHeight + "px;");
                itemObj.className = "target";
                pageMoveInfo.targetObj = itemObj;
                $(itemObj).insertAfter(pageMoveInfo.moveObj);
                $(pageMoveInfo.moveObj).addClass('move');

                pageMoveInfo.moveObj.style.position = "absolute";
                pageMoveInfo.isFirstStep = false;
                console.log("add");
            }
            var positionTop = e.pageY + pageMoveInfo.parent.scrollTop - pageMoveInfo.dY;
            if (movePageItem(pageMoveInfo.moveObj, pageMoveInfo.targetObj, positionTop)) {
                pageMoveInfo.lastMousePageY = e.pageY;
            }
            pageMoveInfo.isDragging = true;
        }
    },

    pageMouseUp: function (e) {

        pageMoveInfo.isMouseDown = false;
        document.removeEventListener('mouseup', this.pageMouseUp);
        document.removeEventListener('mousemove', this.pageMouseMove);
        //var pageList=document.getElementById("page-list");
        //pageList.onScroll=null;
        //pageList.removeEventListener("scroll",SlideScroll);
        $('#page-list').off('scroll', SlideScroll);

        if (pageMoveInfo.moveObj && pageMoveInfo.isDragging) {
            pageMoveInfo.moveObj.style.top = "0";
            pageMoveInfo.moveObj.style.position = "relative";
            var allSiblings = pageMoveInfo.moveObj.parentNode.children;
            var targetIndex = -1;
            for (var i = 0; i < allSiblings.length - 1; i++) {
                if (allSiblings[i] == pageMoveInfo.moveObj)continue;
                targetIndex++;
                if (allSiblings[i] == pageMoveInfo.targetObj) {
                    pageMoveInfo.moveObj.parentNode.removeChild(pageMoveInfo.targetObj);
                    break;
                }
            }
            allSiblings = pageMoveInfo.moveObj.parentNode.children;
            for (var i = 0; i < allSiblings.length; i++) {
                if (allSiblings[i] == pageMoveInfo.moveObj)break;
            }
            $(pageMoveInfo.moveObj).removeClass('move');
            if (targetIndex !== pageMoveInfo.moveIndex) {
                MakeActionCreators.movePage(pageMoveInfo.moveIndex, targetIndex);
            }
        }
        setTimeout(function () {
            pageMoveInfo.isDragging = false;
        }, 50);
    },

    SlideScroll: function () {
        if (!pageMoveInfo.isDragging) {
            //var pageList=document.getElementById("page-list");
            //pageList.removeEventListener("scroll",SlideScroll);
            $('#page-list').off('scroll', SlideScroll);
            console.log("un remove scroll");
            debugger;
            return;
        }
        var positionTop = pageMoveInfo.lastMousePageY + pageMoveInfo.parent.scrollTop - pageMoveInfo.dY;
        movePageItem(pageMoveInfo.moveObj, pageMoveInfo.targetObj, positionTop);
    },

    spanMouseLeave: function (id) {
        moveAble = false;
        $(id).children("span").css({display: "none"});
    },

    replacePage: function () {
        this.props.replacePage();
    },

    pagesCopy: function (index) {
        MakeActionCreators.copyPage(index);
    },

    selectPage: function () {
        if (pageMoveInfo.isDragging)return;
        var selectedIndex = PageStore.getSelectedPageIndex();
        if (selectedIndex == this.props.index) return;
        $(".pages-slide-showCoverage").removeClass("show");
        $(".pageCoverage").slideUp();
        MakeActionCreators.selectPage(this.props.index);
    },

    showCoverage: function (event) {
        $(event.target).toggleClass("show");
        $(event.target).next().slideToggle();
    },

    coverage       : function () {
        var GlobalFunc = require("../Common/GlobalFunc");
        var items = this.props.page.get('item_object');

        var baseItem = GlobalFunc.getBaseFrame(items);
        var frames = GlobalFunc.getAllDisplayFrame(items);
        var layerFrame = baseItem.concat(frames);
        var _this = this;
        var selectEls = ElementStore.getDisplayFrameSelectedElement();
        var selectUUids=selectEls.map((item)=>{
            if(item==-1) return "music";
           else return item.get("item_uuid");
        })
        layerFrame.sort(GlobalFunc.itemSort("item_layer"));
        var itemCount=new Count();
        return layerFrame.map(function (item, index) {

            if (item.get('item_type') == 17) return;

            var itemType = item.get('item_type'), itemVal = item.get('item_val'),
                itemId = item.get('item_id'),uuid=item.get('item_uuid'),
                coverageName = "未知元素: " + itemType, coverageIcon,
                coverageEffect = false, itemState = item.get('item_state'),
                bgStyle = {
                    backgroundImage: "url(" + itemVal + ")",
                    border         : "1px solid #575757",
                    boxSizing      : "border-box",
                    backgroundColor: "#999",
                    backgroundSize : "cover"
                }, isActive, isGroup = ClientState.isElementGrouped(item, _this.props.page.get('page_uid')),
                isLocked = ClientState.isLocked(item.get('item_uuid'), _this.props.page.get('page_uid'));
            var baseFrameIndex;
            for(let baseI=0;baseI<baseItem.length;baseI++){
                let tempItem=baseItem[baseI];
                if(uuid==tempItem.get('item_uuid')){
                    baseFrameIndex=baseI;
                }
            }
            if(_.indexOf(selectUUids,uuid)>-1) {
                isActive=true;
            }

            var coverageGroup = <span className="coverage-group"/>;
            var coverageLock = <span className="coverage-lock"/>;

            switch (itemType) {
                case ElementsType.background:
                    if (!!item.get("group_id")) {
                        coverageName = "图片";
                    } else {
                        coverageName = "背景";
                    }
                    coverageEffect = true;
                    break;
                case ElementsType.text:
                    coverageName = itemVal;
                    coverageName = "文字";
                    coverageIcon = "text";
                    break;
                case ElementsType.watermark:
                    if (item.get('frame_style') == 1) {
                        coverageName = "水印";
                        coverageEffect = true;
                    } else if (item.get('frame_style') == 3) {
                        coverageName = "图形";
                        coverageEffect = true;
                    }else{
                        coverageName = "水印";
                        coverageEffect = true;
                    }
                    break;
                case ElementsType.video:
                    coverageName = "视频";
                    coverageIcon = "video";
                    break;
                case ElementsType.borderFrame:
                    coverageName = "边框";
                    coverageEffect = true;
                    break;
                case ElementsType.phone:
                    coverageName = "一键拨号";
                    coverageIcon = "phone";
                    break;
                case ElementsType.inputText:
                    coverageName = "输入框";
                    coverageIcon = "inputText";
                    break;
                case ElementsType.map:
                    coverageName = "地图";
                    coverageIcon = "map";
                    break;
                case ElementsType.pictureFrame:
                    coverageName = "画框";
                    coverageIcon = "picFrame";
                    break;
                case ElementsType.image:
                    coverageName = "图片";
                    coverageEffect = true;
                    break;
                case ElementsType.button:
                    coverageName = "按钮";
                    coverageIcon = "button";
                    break;
                case ElementsType.radio:
                    coverageName = "单选按钮";
                    coverageIcon = "radio";
                    break;
                case ElementsType.checkbox:
                    coverageName = "多选按钮";
                    coverageIcon = "checkbox";
                    break;
                case ElementsType.vote:
                    coverageName = "投票";
                    coverageIcon = "vote";
                    break;
                case ElementsType.scribble:
                    coverageName = "涂抹";
                    coverageIcon = "scribble";
                    break;
                case ElementsType.fingerprint:
                    coverageName = "指纹长按";
                    coverageIcon = "fingerPrint";
                    break;
                case ElementsType.shake:
                    coverageName = "摇一摇";
                    coverageIcon = "sharkItOff";
                    break;
                case ElementsType.displayFrame:
                    coverageName = "浮层";
                    coverageIcon = "floatlayer";
                    break
                case ElementsType.embedded:
                    coverageName = "嵌入网页";
                    coverageIcon = "embedded";
                    break;
                case ElementsType.reward:
                    coverageName = "打赏";
                    coverageIcon = "reward";
                    break;
                case ElementsType.label:
                    coverageName = "标签";
                    coverageIcon = "label";
                    break;
                case ElementsType.svg:
                    coverageName = "svg";
                    coverageIcon = "svg";
                    break;
                case ElementsType.picslide:
                    coverageName = "图集";
                    coverageIcon = "picslice";
                    break;
                case ElementsType.panorama:
                    coverageName = "全景";
                    coverageIcon = "panorama";
                    break;
                case ElementsType.redEnvelope:
                    coverageName = "红包";
                    coverageIcon = "redenvelope";
                    break;
            }

            coverageName=coverageName+itemCount.get(itemType);

            var drag = !(index == 0);
            var showButton=<span className={"coverage-stage " + (itemState == "hide" ? "itemHide" : "")}
                                 onClick={_this.coverageIsShow.bind(_this, baseFrameIndex, itemState)}/>;
            return (
                <li className={isActive ? "active" : ""}  onClick={_this.selectElement.bind(_this, item)}
                    draggable={drag}
                    onDragEnter={_this.layerDragEnter.bind(_this, index)} onDragLeave={_this.layerDragLeave}
                    onDragStart={_this.layerDragStart.bind(_this, index)} onDragEnd={_this.layerDragEnd}
                    onDrop={_this.layerDrop.bind(_this, index)}
                    onDragOver={_this.layerDragOver}>
                    <div className="left">
                        {showButton}
                        <span className={"coverage-icon " + (coverageIcon || "")}
                              style={coverageEffect ? bgStyle : null}/>
                        <span className="coverage-name">{coverageName}</span>
                    </div>
                    <div className="right">
                        { isGroup ? coverageGroup : null}
                        { isLocked ? coverageLock : null}
                    </div>
                </li>
            )
        });
    },
    layerDrop      : function (index, e) {
        //e.currentTarget.classList.remove('over');
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        if(index==0){
            index=1
        }
        if (dragLayerEl.startIndex!=index) {
            var items = this.props.page.get('item_object');
            var GlobalFunc = require("../Common/GlobalFunc");
            var baseItem = GlobalFunc.getBaseFrame(items);
            var frames = GlobalFunc.getAllDisplayFrame(items);
            var layerFrame = baseItem.concat(frames);
            layerFrame.sort(GlobalFunc.itemSort("item_layer"));
            MakeActionCreators.changeLayer("move",{startIndex:dragLayerEl.startIndex,endIndex:index,objs:layerFrame})
        }
        return false;
    },
    layerDragStart : function (index, e) {
        dragLayerEl.obj = e.currentTarget;
        dragLayerEl.startIndex=index;
        dragLayerEl.obj.style.opacity = '0.5';

    },
    layerDragEnd   : function (e) {
        dragLayerEl.obj.style.opacity = '1';
    },
    layerDragEnter: function (index,e) {
        var el=e.currentTarget;

        //if(dragLayerEl.startIndex>index){
        //    $(el).before(dragLayerEl.obj);
        //}else if(dragLayerEl.startIndex<index){
        //    $(el).after(dragLayerEl.obj);
        //}

        //console.log("over");
        el.classList.add('over');
    },
    layerDragLeave : function (e) {
        var el=e.currentTarget;
        el.classList.remove('over');
        //console.log("leave",dragLayerEl.enterTime);

    },
    layerDragOver  : function (e) {
        e.preventDefault();
        //e.nativeEvent.dataTransfer.dropEffect = 'move';
    },
    coverageIsShow : function (index, itemState, event) {
        event.stopPropagation();
        var frame=ElementStore.getDisplayFrame();
        if(!!frame){
            return console.log("float layer can not hide");
        }
        if (itemState == "hide") {
            MakeActionCreators.updateElement({item_state: ""}, [index]);
        } else {
            MakeActionCreators.updateElement({item_state: "hide"}, [index]);
        }
    },
    floatLayerIsShow : function (uuid, itemState, event) {
        event.stopPropagation();
        var frame=ElementStore.getDisplayFrame();
        if (itemState == 1) {
            MakeActionCreators.updateElement({item_display_status: 0}, undefined,undefined,uuid);
        } else {
            MakeActionCreators.updateElement({item_display_status: 1}, undefined,undefined,uuid);
        }
    },

    prohibitionDrag: function (event) {
        event.stopPropagation();
    },

    selectElement: function (item, event) {
        event.stopPropagation();
        MakeActionCreators.selectElement(item.get("item_uuid"), {type:"select_layer"});
    }

});

module.exports = PageItem;