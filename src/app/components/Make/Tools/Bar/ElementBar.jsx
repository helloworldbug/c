/**
 * @component ElementBar
 * @description 元素栏组件
 * @time 2015-09-06 18:07
 * @author StarZou
 **/

var React = require('react');

var ElementButton = require('../Button/ElementButton');
var MenuItem = require('../Button/MenuItem.jsx');
var MakeAction = require('../../../../actions/MakeActionCreators');
var DialogAction = require("../../../../actions/DialogActionCreator");
var PageStore = require('../../../../stores/PageStore');
var MagazineStore = require('../../../../stores/MagazineStore');
var MeConstants = require('../../../../constants/MeConstants');
var ElementType = MeConstants.Elements;
var ItemInit = require("../../../Common/ItemInit");
var GlobalFunc = require("../../../Common/GlobalFunc");
var RedEnvelope = require("../../../Common/RedEnvelope");
var $ = require("jquery");

function showToolTipDialog(id) {
    var element = $("#" + id).parent();
    $(element).addClass("show");
    $(element).find(".menu").addClass("show");
    $(element).focus();
}
function hideToolTipDialog(id) {
    var element = $("#" + id).parent();
    $(element).removeClass("show");
    $(element).find(".menu").removeClass("show");
}
function textBtnClick() {
    MakeAction.addElement({type: 'text', obj: ItemInit.textInit()});
}
function scaleTextClick() {
    MakeAction.addElement({type: 'text', obj: ItemInit.textInit()});
}
function lineFeedTextClick() {
    MakeAction.addElement({type: 'text', obj: ItemInit.lineFeedTextInit()});
}
function verticalTextClick() {
    MakeAction.addElement({type: 'text', obj: ItemInit.verticalTextInit()});
}

function quickFormBtnClick() {
    MakeAction.addElement({type: 'form', obj: ItemInit.formInit()});
}
function inputBtnClick() {
    MakeAction.addElement({type: 'input', obj: ItemInit.inputInit()});
}
function buttonBtnClick() {
    MakeAction.addElement({type: 'button', obj: ItemInit.ButtonInit()});
}
function radioBtnClick() {
    var isRadioExist = false;
    var pages = PageStore.getPages();
    var selectPageIndex = PageStore.getSelectedPageIndex();
    var item;
    //for (var i = 0; i < pages.length; i++) {
    item = PageStore.getSelectedPage().attributes.item_object;
    for (var j = 0; j < item.length; j++) {
        if (item[j].attributes.item_type == ElementType.radio) {
            //DialogAction.show('tips', "", {contentText: "单选框已存在,请不要重复添加", hideCancel: true});
            GlobalFunc.addSmallTips("当前页已存在单选框,请不要重复添加", null, {clickCancel: true});
            isRadioExist = true;
            break;
        }
    }
    //}
    if (isRadioExist == false) {
        MakeAction.addElement({type: 'radio', obj: ItemInit.radioInit()});
    }
}

function fingerprintClick() {
    var exist = false;
    var page = PageStore.getSelectedPage();

    var item = page.get("item_object");
    for (var j = 0; j < item.length; j++) {
        if (item[j].attributes.item_type == 25) {
            GlobalFunc.addSmallTips("当前页已存在指纹,请不要重复添加", null, {clickCancel: true});
            //DialogAction.show('tips', "", {contentText: "当前页已存在指纹,请不要重复添加", hideCancel: true});
            exist = true;
            break;
        }
    }
    if (exist == false) {
        MakeAction.addElement({type: 'fingerprint', obj: ItemInit.fingerprintInit()});
    }
}
function shakeClick() {
    var exist = false;
    var pages = MagazineStore.getAllPagesRef();
    for (var i = 0; i < pages.length && exist == false; i++) {
        var page = pages[i];
        var item = page.get("item_object");
        for (var j = 0; j < item.length; j++) {
            if (item[j].attributes.item_type == 27) {
                GlobalFunc.addSmallTips("当前作品已存在摇一摇,请不要重复添加", null, {clickCancel: true});
                //DialogAction.show('tips', "", {contentText: "当前页已存在指纹,请不要重复添加", hideCancel: true});
                exist = true;
                break;
            }
        }
    }
    if (exist == false) {
        MakeAction.addElement({type: 'shake', obj: ItemInit.shakeInit()});
    }

}

function phoneClick() {
    MakeAction.addElement({type: 'phone', obj: ItemInit.phoneInit()});
}

function ARClick() {
    MakeAction.addElement({type: 'ar', obj: ItemInit.arInit()});
}

function VRClick() {
    MakeAction.addElement({type: 'vr', obj: ItemInit.vrInit()});
}

function panoramaClick() {
    DialogAction.show("multimaterial", "", {materialType: 5, itemType: "panorama", maxselect: 36});
}

function picSlideClick() {
    DialogAction.show("multimaterial", "", {materialType: 5, itemType: "picslide", maxselect: 9});
}
function redEnvelopeClick() {
    RedEnvelope.getSwitch().then(function setupAdd(result) {
        var tpl = MagazineStore.getTpl().attributes;
        if (GlobalFunc.existInWork(MagazineStore.getAllPagesRef(), ElementType.redEnvelope)) {
            GlobalFunc.addSmallTips("一个作品只能添加一个红包", null, {clickCancel: true});
            return;
        }

        var tid = tpl["tpl_id"]
        DialogAction.show("redenvelope", "", {moneyMin: result.moneymin, moneyMax: result.moneymax, tid: tid});
    }).catch(function err(message) {
        GlobalFunc.addSmallTips(message, null, {clickCancel: true});
    })
    //DialogAction.show("multimaterial","",{materialType: 5, itemType: "picslide",maxselect:9});
}


function floatLayerClick() {
    var ItemInit = require("../../../Common/ItemInit.js");
    var DisplayFrameObj = ItemInit.makeDisplayFrame();
    let item_id = DisplayFrameObj.get("item_id");
    MakeAction.addElement({type: 'displayFrame', obj: DisplayFrameObj})
}
function labelClick() {
    MakeAction.addElement({type: 'label', obj: ItemInit.labelInit()});
}

function rewardClick() {
    GlobalFunc.addSmallTips("该组件只在微信中可见", 2, {delBackGround: true});
    MakeAction.addElement({type: 'reward', obj: ItemInit.rewardInit()});
}


function mapClick() {
    MakeAction.addElement({type: 'map', obj: ItemInit.mapInit()});
}

function checkBtnClick() {
    var isCheckboxExist = false;
    var pages = PageStore.getPages();
    var selectPageIndex = PageStore.getSelectedPageIndex();
    var item;
    item = PageStore.getSelectedPage().attributes.item_object;
    for (var j = 0; j < item.length; j++) {
        if (item[j].attributes.item_type == ElementType.checkbox) {
            //DialogAction.show('tips', "", {contentText: "多选框已存在,请不要重复添加", hideCancel: true});
            GlobalFunc.addSmallTips("当前页已存在多选框,请不要重复添加", null, {clickCancel: true});
            isCheckboxExist = true;
            break;
        }
    }
    if (isCheckboxExist == false) {
        MakeAction.addElement({type: 'checkbox', obj: ItemInit.checkboxInit()});
    }

}
function voteBtnClick() {
    MakeAction.addElement({type: 'vote', obj: ItemInit.voteInit()});
}
function videoButtonClick() {
    MakeAction.addElement({type: 'video', obj: ItemInit.videoInit()});
}

function scribbleClick() {
    var ElementStore = require('../../../../stores/ElementStore');
    if (!!ElementStore.getDisplayFrame()) {
        GlobalFunc.addSmallTips("当前页面不支持该功能", 2, {delBackGround: true});
        return;
    }
    //判断页面是否存在
    DialogAction.show("scribble");
}

function svgClick() {
    MakeAction.addElement({type: 'svg', obj: ItemInit.svgInit()});
}

function bgMusicClick() {
    DialogAction.show("music", "", {materialType: 10});
}

function singerMusicClick() {
    DialogAction.show("music", "", {materialType: 10, isSingerMusic: true});
}


//var imgMenu = <div className="menu" id="img-menu">
//    <MenuItem text='图&nbsp;&nbsp;&nbsp;片' iconClass='element-menu-img' description='点击添加图片' onClick={function(){
//        DialogAction.show("img");
//    }}></MenuItem>
//    <MenuItem text='背&nbsp;&nbsp;&nbsp;景' iconClass='element-menu-background' description='点击添加背景' onClick={function(){
//        DialogAction.show("backimg");
//    }}></MenuItem>
//</div>;

function imageMenu() {
    var imageItem = <MenuItem text='图　片' iconClass='element-menu-img' onClick={function(){
        DialogAction.show("material","",{materialType: 5, itemType: "img"});
    }}/>;
    var backImgItem = <MenuItem text='背　景' iconClass='element-menu-background' description='点击添加背景'
                                onClick={function(){
                                  var ElementStore=require('../../../../stores/ElementStore');
                if(!!ElementStore.getDisplayFrame()){
                  GlobalFunc.addSmallTips("当前页面不支持该功能", 2, {delBackGround: true});
                return;
                }
        DialogAction.show("material", "", {materialType: 4, itemType: "backImg"});
    }}/>;
    var picFrameItem, userObj = GlobalFunc.getUserObj();
    if (userObj.speFunctionCode) {
        if (userObj.speFunctionCode.indexOf("PICFRAME_ABLE") > -1) {
            picFrameItem =
                <MenuItem text='画&nbsp;&nbsp;&nbsp;框' iconClass='element-menu-img' description='点击添加画框' onClick={function(){
                var ElementStore=require('../../../../stores/ElementStore');
                if(!!ElementStore.getDisplayFrame()){
                  GlobalFunc.addSmallTips("当前页面不支持该功能", 2, {delBackGround: true});
                return;
                }
        DialogAction.show("material","",{materialType: 5, itemType: "picFrame"});
    }}/>
        }
    }
    return <div className="menu" id="img-menu">
        {imageItem}
        {backImgItem}
        {picFrameItem}
    </div>
}


var FormMenu = <div className="menu" id="form-menu">
    <MenuItem text='快捷表单' iconClass='element-menu-form' description='点击添加快捷表单' onClick={quickFormBtnClick}/>
    <MenuItem text='输入框' iconClass='element-menu-input' description='点击添加输入框' onClick={inputBtnClick}/>
    <MenuItem text='单　选' iconClass='element-menu-radio' description='点击添加单选框' onClick={radioBtnClick}/>
    <MenuItem text='多　选' iconClass='element-menu-check' description='点击添加多选框' onClick={checkBtnClick}/>
    <MenuItem text='提交按钮' iconClass='element-menu-button' description='点击添加按钮' onClick={buttonBtnClick}/>

</div>;


function genEffectMenu() {
    var userObj = GlobalFunc.getUserObj();
    if (userObj.speFunctionCode) {
        if (userObj.speFunctionCode.indexOf("PICFRAME_ABLE") > -1) {
            return <div className="menu" id="effect-menu">
                <MenuItem text='涂　抹' iconClass='element-menu-scribble' description='点击添加涂抹' onClick={scribbleClick}/>
                <MenuItem text='指　纹' iconClass='element-menu-fingerprint' description='点击添加指纹'
                          onClick={fingerprintClick}/>
                <MenuItem text='地　图' iconClass='element-menu-map' description='点击添加地图' onClick={mapClick}/>
                <MenuItem text='摇一摇' iconClass='element-menu-shake' description='点击添加摇一摇' onClick={shakeClick}/>
                <MenuItem text='一键拨号' iconClass='element-menu-dial' description='点击添加一键拨号' onClick={phoneClick}/>
                <MenuItem text='打　赏' iconClass='element-menu-reward' description='点击添加打赏' onClick={rewardClick}/>
                <MenuItem text='浮　层' iconClass='element-menu-floatlayer' description='点击添加浮层'
                          onClick={floatLayerClick}/>
                <MenuItem text='标　签' iconClass='element-menu-label' description='点击添加标签' onClick={labelClick}/>
                <MenuItem text='投　票' iconClass='element-menu-vote' description='点击添加投票' onClick={voteBtnClick}/>
                <MenuItem text='图　集' iconClass='element-menu-picSlide' description='点击添加图集' onClick={picSlideClick}/>
                <MenuItem text='红　包' iconClass='element-menu-redenvelope' description='点击添加红包'
                          onClick={redEnvelopeClick}/>
                <MenuItem text='SVG' iconClass='element-menu-svg' description='点击添加SVG' onClick={svgClick}/>
                <MenuItem text='虚拟全景' iconClass='element-menu-panorama' description='点击添加虚拟全景'
                          onClick={panoramaClick}/>
                <MenuItem text='增强现实' iconClass='element-menu-ar' description='点击添加增强现实' onClick={ARClick}/>
                <MenuItem text='虚拟现实' iconClass='element-menu-vr' description='点击添加虚拟现实' onClick={VRClick}/>
            </div>;
        }
    }

    return <div className="menu" id="effect-menu">
        <MenuItem text='涂　抹' iconClass='element-menu-scribble' description='点击添加涂抹' onClick={scribbleClick}/>
        <MenuItem text='指　纹' iconClass='element-menu-fingerprint' description='点击添加指纹' onClick={fingerprintClick}/>
        <MenuItem text='地　图' iconClass='element-menu-map' description='点击添加地图' onClick={mapClick}/>
        <MenuItem text='摇一摇' iconClass='element-menu-shake' description='点击添加摇一摇' onClick={shakeClick}/>
        <MenuItem text='一键拨号' iconClass='element-menu-dial' description='点击添加一键拨号' onClick={phoneClick}/>
        <MenuItem text='浮　层' iconClass='element-menu-floatlayer' description='点击添加浮层' onClick={floatLayerClick}/>
        <MenuItem text='标　签' iconClass='element-menu-label' description='点击添加标签' onClick={labelClick}/>
        <MenuItem text='投　票' iconClass='element-menu-vote' description='点击添加投票' onClick={voteBtnClick}/>
        <MenuItem text='增强现实' iconClass='element-menu-ar' description='点击添加增强现实' onClick={ARClick}/>
        <MenuItem text='虚拟现实' iconClass='element-menu-vr' description='点击添加虚拟现实' onClick={VRClick}/>
    </div>;


}

var textMenu = <div className="menu" id="text-menu">
    <MenuItem text='标　题' iconClass='element-menu-scaletext' description='点击添加标题' onClick={scaleTextClick}/>
    <MenuItem text='正　文' iconClass='element-menu-linefeedtext' description='点击添加正文' onClick={lineFeedTextClick}/>
</div>;
//<MenuItem text='竖排文本' iconClass='element-menu-verticaltext' description='点击添加竖排文本' onClick={verticalTextClick} />

var musicMenu = <div className="menu" id='music-menu'>
    <MenuItem text='背景音乐' iconClass='element-menu-bgMusic' description='点击添加背景音乐' onClick={bgMusicClick}/>
    <MenuItem text='音频' iconClass='element-menu-singerMusic' description='点击添加音频' onClick={singerMusicClick}/>
</div>

function getButtons() {
    var elementButtons = [
        {
            text        : '图片',
            iconClass   : 'glyphicon element-button-picture',
            tabindex    : -1,
            children    : imageMenu(),
            onMouseEnter: function () {
                showToolTipDialog("img-menu")
            },
            onMouseLeave: function () {
                hideToolTipDialog("img-menu")
            }
        },
        {
            text        : '文本',
            iconClass   : 'glyphicon element-button-text',
            tabindex    : -1,
            children    : textMenu,
            onMouseEnter: function () {
                showToolTipDialog("text-menu")
            },
            onMouseLeave: function () {
                hideToolTipDialog("text-menu")
            }
        },
        {
            text     : '边框',
            iconClass: 'glyphicon element-button-frame',
            onClick  : function () {
                if (PageStore.getSelectedPage().get("page_height") > 1008) {
                    GlobalFunc.addSmallTips("当前页面不支持该功能", 2, {delBackGround: true});
                    return;
                }
                var ElementStore = require('../../../../stores/ElementStore');
                if (!!ElementStore.getDisplayFrame()) {
                    GlobalFunc.addSmallTips("当前页面不支持该功能", 2, {delBackGround: true});
                    return;
                }
                DialogAction.show("material", "", {materialType: 2, itemType: "frame"});
            }

        },
        {
            text: '水印',

            iconClass: 'glyphicon element-button-watermark',
            onClick  : function () {
                DialogAction.show("material", "", {materialType: 1, itemType: "watermark"});
            }
        },
        {
            text: '图形',

            iconClass: 'glyphicon element-button-shape',
            onClick  : function () {
                DialogAction.show("material", "", {materialType: 3, itemType: "shape"});
            }
        },
        // {
        //     text       : '音乐',
        //     description: '点击添加音乐',
        //     iconClass  : 'glyphicon element-button-music',
        //     onClick    : function () {
        //         DialogAction.show("music", "", {materialType: 10});
        //     }
        // },
        {
            text        : '音乐',
            iconClass   : 'glyphicon element-button-music',
            tabindex    : -1,
            children    : musicMenu,
            onMouseEnter: function () {
                showToolTipDialog("music-menu")
            },
            onMouseLeave: function () {
                hideToolTipDialog("music-menu")
            }


        },
        {
            text: '视频',

            iconClass: 'glyphicon element-button-video',
            onClick  : videoButtonClick
        },
        {
            text        : '表单',
            iconClass   : 'glyphicon element-button-form',
            tabindex    : -1,
            children    : FormMenu,
            onMouseEnter: function () {
                showToolTipDialog("form-menu")
            },
            onMouseLeave: function () {
                hideToolTipDialog("form-menu")
            }
        },
        //{
        //    text        : '组件',
        //    iconClass   : 'glyphicon element-button-effect',
        //    tabindex    : -1,
        //    children    : genEffectMenu(),
        //    onMouseEnter: function () {
        //        showToolTipDialog("effect-menu")
        //    },
        //    onMouseLeave: function () {
        //        hideToolTipDialog("effect-menu")
        //    }
        //}
    ];
    return {elementButtons: elementButtons}
}


var ElementBar = React.createClass({
    getInitialState: function () {
        console.log("init");
        return getButtons()
    },
    render         : function () {

        var elementButtonComponents = this.state.elementButtons.map(function (item, index) {
            //console.error(item)
            return (
                <ElementButton key={index} {...item} >{item.children}</ElementButton>
            );
        }.bind(this));

        return (
            <div className="element-bar">
                {elementButtonComponents}
            </div>
        );
    }

});

module.exports = ElementBar;