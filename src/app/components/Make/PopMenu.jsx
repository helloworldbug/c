var React = require('react');
var PopMenuStore = require("../../stores/PopMenuStore");
var PopMenuActionCreator = require('../../actions/PopMenuActionCreator');
var DialogActionCreator = require('../../actions/DialogActionCreator');
var MakeActionCreators = require('../../actions/MakeActionCreators');
var DialogAction = require("../../actions/DialogActionCreator");
var ElementStore = require("../../stores/ElementStore");
var PageStore = require("../../stores/PageStore");
var MeConstants = require('../../constants/MeConstants');
var Elements = MeConstants.Elements;
var ClipboardUtil = require('../../utils/Clipboard.util');

var $ = require("jquery");
var layerOpreation = (
    <div  key="layerOP" className="right-menu-zindex">
        <li className="right-menu-zindex-up" onClick={layerUp}>
            <span className="fadeInLeft animated">上一层</span>
        </li>
        <li className="right-menu-zindex-down" onClick={layerDown}>
            <span className="fadeInLeft animated">下一层</span>
        </li>
        <li className="right-menu-zindex-top" onClick={layerTop}>
            <span className="fadeInLeft animated">置顶</span>
        </li>
        <li className="right-menu-zindex-bottom" onClick={layerBottom}>
            <span className="fadeInLeft animated">置底</span>
        </li>
    </div>
);

var defaultMenu = [<li key="copy" onClick={copy}>复&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;制</li>,
    <li key="paste" onClick={paste}>粘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;贴</li>,
    <li key="remove" onClick={deleteElement}>删&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;除</li>, layerOpreation];

var popMenus = {
    [Elements.background]: [<li key="replace" onClick={replacePic.bind(null,"material", "", {materialType: 4, itemType: "backImg", replace:true})}>替&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;换</li>,
        <li key="paste" onClick={paste}>粘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;贴</li>,
        <li key="clear" onClick={clearStyle}>清除样式</li>],

    [Elements.text]: [<li key="edit" onClick={edit}>编&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;辑</li>,
        <li key="copy" onClick={copy}>复&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;制</li>,
        <li key="paste" onClick={paste}>粘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;贴</li>,
        <li key="remove" onClick={deleteElement}>删&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;除</li>,
        <li key="clear" onClick={clearStyle}>清除样式</li>, layerOpreation],
    [Elements.watermark]: [<li key="replace" onClick={replaceWatermarkOrShape}>
        替&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;换</li>,
        <li key="copy" onClick={copy}>复&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;制</li>,
        <li key="crop" onClick={crop}>裁&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;切</li>,
        <li key="paste" onClick={paste}>粘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;贴</li>,
        <li key="remove" onClick={deleteElement}>删&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;除</li>,
        <li key="clear" onClick={clearStyle}>清除样式</li>, layerOpreation],
    [Elements.video]: [<li key="copy" onClick={copy}>复&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;制</li>,
        <li key="paste" onClick={paste}>粘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;贴</li>,
        <li key="remove" onClick={deleteElement}>删&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;除</li>, layerOpreation],
    [Elements.borderFrame]: [<li key="replace" onClick={replacePic.bind(null,"material", "", {materialType: 2, itemType: "frame", replace:true})}>替&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;换</li>,
        <li key="paste" onClick={paste}>粘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;贴</li>,
        <li key="remove" onClick={deleteElement}>删&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;除</li>,
        <li key="clear" onClick={clearStyle}>清除样式</li>, layerOpreation],
    [Elements.link]: [],
    [Elements.phone]: [
        <li key="copy" onClick={copy}>复&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;制</li>,
        <li key="paste" onClick={paste}>粘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;贴</li>,
        <li key="remove" onClick={deleteElement}>删&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;除</li>,
        layerOpreation
    ],
    [Elements.map]: [
        <li key="copy" onClick={copy}>复&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;制</li>,
        <li key="paste" onClick={paste}>粘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;贴</li>,
        <li key="remove" onClick={deleteElement}>删&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;除</li>,
        layerOpreation
    ],
    [Elements.inputText]: defaultMenu,
    [Elements.pictureFrame]: defaultMenu,
    [Elements.image]: [<li key="repalce" onClick={replacePic.bind(null,"material","",{materialType: 5, itemType: "img", replace:true})}>替&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        换</li>,
        <li key="copy" onClick={copy}>复&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;制</li>,
        <li key="paste" onClick={paste}>粘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;贴</li>,
        <li key="crop" onClick={crop}>裁&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;切</li>,
        <li key="remove" onClick={deleteElement}>删&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;除</li>,
        <li key="clear" onClick={clearStyle}>清除样式</li>, layerOpreation],
    [Elements.button]: defaultMenu,
    [Elements.vote]: defaultMenu,
    [Elements.radio]: defaultMenu,
    [Elements.checkbox]: defaultMenu,
    [Elements.fingerprint]: defaultMenu,
    [Elements.shake]: defaultMenu,
    [Elements.ar]: defaultMenu,
    [Elements.vr]: defaultMenu,
    [Elements.embedded]: [
        <li key="copy" onClick={copy}>复&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;制</li>,
        <li key="paste" onClick={paste}>粘&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;贴</li>,
        <li key="remove" onClick={deleteElement}>删&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;除</li>,
        layerOpreation
    ],
    [Elements.reward]:[defaultMenu],
    [Elements.picslide]:[defaultMenu],
    [Elements.panorama]:[defaultMenu],
    [Elements.displayFrame]: [
        <li key="remove" onClick={deleteElement}>删&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;除</li>
    ],
    [Elements.redEnvelope]: [<li key="replace" onClick={replacePic.bind(null,"material","",{materialType: 5, itemType: "redEnvelope", replace:true})}>替&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        换</li>, <li key="crop" onClick={crop}>裁&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;切</li>, <li key="remove" onClick={deleteElement}>删&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;除</li>,layerOpreation],
    [Elements.svg]: defaultMenu,
    [Elements.label]: defaultMenu

};

function getPopMenuState() {
    return {
        popMenuShow: PopMenuStore.getPopMenuState(),
        popMenuPos : PopMenuStore.getPopMenuPos()
    }
}
var PopMenu = React.createClass({

    getInitialState: function () {
        return getPopMenuState();
    },

    onChange: function () {
        this.setState(getPopMenuState());
    },

    componentDidMount: function () {
        PopMenuStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function () {
        PopMenuStore.removeChangeListener(this.onChange);
    },

    render: function () {
        var els = ElementStore.getDisplayFrameSelectedElement();
        if (els.length!==1) {
            return null;
        }
        var el=els[0];
        if(!el||el==-1){
            return null
        }
        var type = el.get("item_type");
        if (type == 1 && !!el.get("group_id")) {
            type = Elements.image;
        }
        var menu = popMenus[type];
        var showStyle = {
            display: "none"
        };
        if (this.state.popMenuShow) {
            showStyle.display = "block";
            var pos = this.state.popMenuPos;
            showStyle.left = pos.left + "px";
            showStyle.top = pos.top + "px";
        }
        return (<ul className="pop-menu" style={showStyle}>{menu}</ul>)
    }
});

function replaceWatermarkOrShape() {
    var el = ElementStore.getSelectedElement()[0];
    if (el.get("frame_style") == 3) {
        replacePic("material", "", {materialType: 3, itemType: "shape", replace:true})
    } else {
        replacePic("material", "", {materialType: 1, itemType: "watermark", replace:true});
    }
}
function replacePic(dialogType, initData, props) {
    DialogActionCreator.show(dialogType, initData, props);
}
function paste() {
    var GlobalFunc = require('../../components/Common/GlobalFunc');
    if(GlobalFunc.canPaste()) {
        MakeActionCreators.pasteElement();
    }
}
function copy() {
    var pageuid = PageStore.getPageUid();
    ClipboardUtil.copy(pageuid);
}
function crop() {
    DialogActionCreator.show("crop");
}
function clearStyle() {
    var GlobalFunc = require('../../components/Common/GlobalFunc');
    GlobalFunc.clearStyle();
}
function deleteElement() {
    var items = ElementStore.getSelectedElement();
    var GlobalFunc = require('../../components/Common/GlobalFunc');
    if(GlobalFunc.existType(items,Elements.redEnvelope)){
        //MakeActionCreators.removeElement();
        DialogAction.show("tips", "", {
            contentText: "删除后，充值金额将在\n红包过期后退还到账户中", onConfirm: function () {
                MakeActionCreators.removeElement();
            }
        });
    }else{
        MakeActionCreators.removeElement();
    }

}
function layerUp() {
    MakeActionCreators.changeLayer("up");
}
function layerDown() {
    MakeActionCreators.changeLayer("down");
}
function layerTop() {
    MakeActionCreators.changeLayer("toTop");
}
function layerBottom() {
    MakeActionCreators.changeLayer("toBottom");
}

function edit(event) {
    var _text = PopMenuStore.getElPopMenu();
    if(_text){
        var evt = document.createEvent('Event');
        evt.initEvent("dblclick",true,true);
        _text.dispatchEvent(evt);
    }

}

module.exports = PopMenu;