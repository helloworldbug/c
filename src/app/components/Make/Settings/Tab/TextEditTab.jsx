/**
 * @component TextEditTab
 * @description 文本元素编辑设置
 * @time 2015-09-07 15:29
 * @author StarZou
 **/

var React = require('react');
var MakeActionCreators = require('../../../../actions/MakeActionCreators');
var Constans = require("../../../../constants/MeConstants")
var LinkEdit = require('./LinkEdit');

var PositionAndSize = require("./SettingComponents/PositionAndSize");
var Range = require("./SettingComponents/Range");
var Color = require("./SettingComponents/Color");
var DisplayStateEdit = require("./DisplayStateEdit");
var InputSelect = require('../../../Common/InputSelect');
var InputColorPicker = require('../../../Common/InputColorPicker');
var GlobalFunc=require("../../../Common/GlobalFunc")
var fix_attr = {};

/**
 * 文字字体定义
 * name：显示的名称
 * src: 对应字体服务器的字体名
 */
const FontFamily = [
    {name: "微软雅黑", src: "微软雅黑", css: "default"},
    {name: "蔡云汉行书简", src: "蔡云汉行书简", css: "caiyunhanxingshujian"},
    {name: "程行简", src: "程行简", css: "chengxingjian"},
    {name: "粗黑宋简", src: "粗黑宋简", css: "cuheisongjian"},
    {name: "冬青黑体", src: "冬青黑体", css: "dongqingheiti"},
    {name: "古隶简体", src: "古隶简体", css: "gulijianti"},
    {name: "壕粗", src: "壕粗", css: "haocu"},
    {name: "华文细黑", src: "华文细黑", css: "huaweixihei"},
    {name: "劲黑", src: "劲黑", css: "jinghei"},
    {name: "嘉丽超粗圆简", src: "嘉丽超粗圆简", css: "jialichacuyuanjian"},
    {name: "简罗卜", src: "简罗卜", css: "jianluobo"},
    {name: "剑体简体", src: "剑体简体", css: "jiantijianti"},
    {name: "金砖黑繁", src: "金砖黑繁", css: "jinzuanheifan"},
    {name: "锦昌体简", src: "锦昌体简", css: "jinchangtijian"},
    {name: "康熙字典", src: "康熙字典", css: "kangxizidian"},
    {name: "兰亭超细黑简", src: "兰亭超细黑简", css: "lantingchaoxiheijian"},
    {name: "兰亭大黑", src: "兰亭大黑", css: "lantingdahei"},
    {name: "兰亭中黑", src: "兰亭中黑", css: "lantingzhonghei"},
    {name: "朗倩体", src: "朗倩体", css: "langqianti"},
    {name: "立黑", src: "立黑", css: "lihei"},
    {name: "力黑体简", src: "力黑体简", css: "liheitijian"},
    {name: "隶变简", src: "隶变简", css: "libianjian"},
    {name: "菱心", src: "菱心", css: "lingxin"},
    {name: "流行体简", src: "流行体简", css: "liuxingtijian"},
    {name: "启繁", src: "启繁", css: "qifan"},
    {name: "青柳衡山", src: "青柳衡山", css: "qingliuhengshan"},
    {name: "清楷体繁", src: "清楷体繁", css: "qingkaitifan"},
    {name: "趣圆体", src: "趣圆体", css: "quyuanti"},
    {name: "锐线", src: "锐线", css: "ruixian"},
    {name: "双线体简", src: "双线体简", css: "shuangxiantijian"},
    {name: "苏新诗柳楷简", src: "苏新诗柳楷简", css: "shuxinshiliukaijian"},
    {name: "特雅宋", src: "特雅宋", css: "teyasong"},
    {name: "小丸子", src: "小丸子", css: "xiaowanzi"},
    {name: "细珊瑚简", src: "细珊瑚简", css: "xishanhujian"},
    {name: "下午茶基本", src: "下午茶基本", css: "xiawuchajiben"},
    {name: "下午茶桃心", src: "下午茶桃心", css: "xiawuchataoxin"},
    {name: "雪君体简", src: "雪君体简", css: "xuejuntijian"},
    {name: "雅宋体", src: "雅宋体", css: "yasongti"},
    {name: "颜楷繁", src: "颜楷繁", css: "yankaifan"},
    {name: "姚体简", src: "姚体简", css: "yaotijian"},
    {name: "毅黑体简", src: "毅黑体简", css: "yiheitijian"},
    {name: "硬笔行书", src: "硬笔行书", css: "yingbixingshu"},
    {name: "悦黑特细", src: "悦黑特细", css: "yueheitexi"},
    {name: "悦圆体简", src: "悦圆体简", css: "yueyuantijian"},
    {name: "韵动大黑简", src: "韵动大黑简", css: "yundongdaheijian"},
    {name: "曾正国楷", src: "曾正国楷", css: "zengzhengguokai"},
    {name: "张海山锐谐", src: "张海山锐谐", css: "zhanghaishanruikai"},
    {name: "正大黑简", src: "正大黑简", css: "zhengdaheijian"},
    {name: "正黑简", src: "正黑简", css: "zhengheijian"},
    {name: "正纤黑简", src: "正纤黑简", css: "zhengqianheijian"},
    {name: "中山行书", src: "中山行书", css: "zhongshanxingshu"},
    {name: "篆娃", src: "篆娃", css: "zuanwa"},
    {name: "方正粗雅宋简体", src: "方正粗雅宋简体", css: "chuyasong"},
    {name: "方正启体简体", src: "方正启体简体", css: "qiti"},
    {name: "方正清刻本悦宋简体", src: "方正清刻本悦宋简体", css: "qikebenyuesong"},
    {name: "方正宋刻本秀楷简", src: "方正宋刻本秀楷简", css: "songkebenxiukai"},
    {name: "幼线简", src: "幼线简", css: "youxian"},
    {name: "fzhcjw", src: "fzhcjw", css: "fzhcjw"},
    {name: "fzltksk", src: "fzltksk", css: "fzltksk"},
    {name: "hye2gjm", src: "hye2gjm", css: "hye2gjm"},
    {name: "fzy1jw", src: "fzy1jw", css: "fzy1jw"},
    {name: "hyk2gjmo", src: "hyk2gjmo", css: "hyk2gjmo"},
    {name: "hyy1gjm", src: "hyy1gjm", css: "hyy1gjm"},
    {name: "ARIALUNI", src: "ARIALUNI", css: "arialuni"},
    {name: "BrushScriptStd", src: "BrushScriptStd", css: "brushscriptstd"},
    {name: "CODE Light", src: "CODE Light", css: "codelight"},
    {name: "SHOWG", src: "SHOWG", css: "showg"},
    {name: "StencilStd", src: "StencilStd", css: "stencilstd"},
    {name: "TTM", src: "TTM", css: "ttm"},
    {name: "arialn", src: "arialn", css: "arialn"},
    {name: "arialuni_1", src: "arialuni_1", css: "arialuni_1"},
    {name: "arial", src: "arial", css: "arial"},
    {name: "brlnsr", src: "brlnsr", css: "brlnsr"},
    {name: "didot-htf-m64-medium-ital", src: "didot-htf-m64-medium-ital", css: "didot"},
    {name: "arlrdbd", src: "arlrdbd", css: "arlrdbd"},
    {name: "erasdemi", src: "erasdemi", css: "erasdemi"},
    {name: "eraslght", src: "eraslght", css: "eraslght"},
    {name: "erasbd", src: "erasbd", css: "erasbd"},
    {name: "gothic", src: "gothic", css: "gothic"},
    {name: "impact", src: "impact", css: "impact"},
    {name: "erasmd", src: "erasmd", css: "erasmd"},
    {name: "pertili", src: "pertili", css: "pertili"},
    {name: "times", src: "times", css: "timesnewroma"},
    {name: "pertibd", src: "pertibd", css: "pertibd"},
    {name: "vladmimir", src: "vladmimir", css: "vladmimir"}
];
/**
 * 字号定义
 * @type {number[]}
 */
const FontSize = [12, 14, 16, 18, 20, 24, 28, 30, 32, 34, 36, 48, 60, 72, 96];
const FontSpacing = ["6", "8", "9", "10", "11", "12", "14", "16", "18", "24", "30", "36", "48", "60", "72"].map((value)=> {
    return {value: value, label: value + "像素"}
}); //间距
const FontSizeMax = 200;
const FontSizeMin = 12;


var TextEditTab = React.createClass({
    changeName    : function (event) {
        var value = event.target.value;
        MakeActionCreators.updateElement({f_name: GlobalFunc.htmlEncode(value)});
    },
    _changeTextDim: function (oldValue, scaleName, event) {
        if (event.target.value == 0 || isNaN(event.target.value)) return;
        if (parseInt(event.target.value) > Constans.Defaults.MAXINPUT||parseInt(event.target.value)<1) {
            return;
        }
        var oriDim = oldValue / this.props.attributes[scaleName];
        var newScale = event.target.value / oriDim;
        MakeActionCreators.updateElement({[scaleName]: newScale});
    },

    _changePosition: function (key, event) {
        if (isNaN(event.target.value))return;
        if (parseInt(event.target.value) > Constans.Defaults.MAXINPUT||parseInt(event.target.value)<Constans.Defaults.MININPUT) {
            return;
        }
        MakeActionCreators.updateElement({[key]: Math.round(event.target.value)});
    },

    componentWillReceiveProps: function (nextProps) {

        var attributes = nextProps.attributes;

        var borderRadiusMax;
        if (attributes['fix_attr']) {
            fix_attr = JSON.parse(attributes['fix_attr']);
            borderRadiusMax = fix_attr.itemWidth < fix_attr.itemHeight ? fix_attr.itemWidth / 2 + (attributes["item_border"] || 0) * 2 : fix_attr.itemHeight / 2 + (attributes["item_border"] || 0) * 2;
        } else {
            borderRadiusMax = attributes["item_width"] < attributes["item_height"] ? attributes["item_width"] / 2 : attributes["item_height"] / 2;
        }

        if (attributes['bd_radius'] > borderRadiusMax) {
            MakeActionCreators.updateElement({bd_radius: parseInt(borderRadiusMax) + ""});
        }

    },

    render: function () {
        var attributes = this.props.attributes;
        var height = document.body.clientHeight - 54 - 40;
        var borderRadiusMax;

        if (attributes['fix_attr']) {
            fix_attr = JSON.parse(attributes['fix_attr']);
            borderRadiusMax = fix_attr.itemWidth < fix_attr.itemHeight ? fix_attr.itemWidth / 2 + (attributes["item_border"] || 0) * 2 : fix_attr.itemHeight / 2 + (attributes["item_border"] || 0) * 2;
        } else {
            borderRadiusMax = attributes["item_width"] < attributes["item_height"] ? attributes["item_width"] / 2 : attributes["item_height"] / 2;
        }

        var changeSize;
        if (attributes['is_wrap'] == true) {
            changeSize = <PositionAndSize attributes={attributes}/>
        } else {
            let fa = attributes['fix_attr'];
            let elWidth;
            let elHeight;
            if (fa) {
                var dimobj = JSON.parse(fa);
                elWidth = dimobj.itemWidth;
                elHeight = dimobj.itemHeight;
            } else {
                elWidth = 0;
                elHeight = 0;
            }
            elWidth = parseInt(elWidth * attributes['x_scale']);
            elHeight = parseInt(elHeight * attributes['y_scale']);
            let fixLeft = parseInt(attributes['item_left']);
            let fixTop = parseInt(attributes['item_top']);
            changeSize = <div>
                <div className="setting-number">
                    <h1>尺寸</h1>
                    <div>
                        <span>W</span>
                        <input type="text"
                               value={elWidth}
                               onChange={this._changeTextDim.bind(this,elWidth,"x_scale")}/>
                    </div>
                    <div className="fr right">
                        <span>H</span>
                        <input type="text"
                               value={elHeight}
                               onChange={this._changeTextDim.bind(this,elHeight,"y_scale")}/>
                    </div>
                </div>
                <div className="setting-number">
                    <h1>位置</h1>
                    <div>
                        <span>X</span>
                        <input type="text" value={fixLeft}
                               onChange={this._changePosition.bind(this,"item_left")}/>
                    </div>
                    <div className="fr right">
                        <span>Y</span>
                        <input type="text" value={fixTop}
                               onChange={this._changePosition.bind(this,"item_top")}/>
                    </div>
                </div>
            </div>
        }

        if (this.props.isTimelineFrame === true) {
            return <div className="setting-container" style={{height:height}}>
                <div id="setting-text-edit">
                    <span className="clearTop"/>
                    {changeSize}
                </div>
            </div>
        }

        var fontFamilyOptions = FontFamily.map(function (obj, index) {
            return (<option key={index} value={obj.src}>{obj.name}</option>);
        });

        var lineHeight;
        if (typeof attributes["line_height_nodefault"] != "undefined") {
            lineHeight = attributes["line_height_nodefault"];
        } else {
            if (attributes["line_height"] == 0) {
                var fontSize = parseInt(attributes["font_size"]);
                lineHeight = ( fontSize * 0.7 ).toFixed(1);
            } else {
                lineHeight = attributes["line_height"];
            }
        }

        return (
            <div className="setting-container" style={{height:height}}>
                <div id="setting-text-edit">
                    <span className="clearTop"/>
                    <div className="setting-input-text">
                        <h1>元素名称</h1>
                        <input type="text" value={GlobalFunc.htmlDecode(attributes.f_name)} onChange={this.changeName} maxLength="20"/>
                    </div>
                    <header onClick={this._headerClick.bind(this, "base-style", "setting-base-style")}><span>基础样式</span><b
                        id="base-style"/></header>
                    <div id="setting-base-style">
                        <span className="clearTop"/>
                        {changeSize}
                        <DisplayStateEdit attributes={attributes}/>
                        <Range title="不透明度" parameter="item_opacity" value={attributes["item_opacity"]}
                               defaultValue={0} max={100} min={0} step={1} isNumber={true}/>

                        <Range title="旋转角度" parameter="rotate_angle" value={attributes["rotate_angle"]}
                               defaultValue={0} max={360} min={0} step={1} isNumber={true}/>
                        <Color title="背景颜色" parameter="bg_color" value={attributes['bg_color']}/>
                    </div>

                    <header onClick={this._headerClick.bind(this, "font-style", "setting-font-style")}><span>文字</span><b
                        id="font-style"/></header>


                    <div id="setting-font-style">
                        <span className="clearTop"/>

                        <div className="fontFamily-select">
                            <h1>字体</h1>
                            <select value={attributes["font_family"]} onChange={this.onChangeFontFamilyHandler}>
                                {fontFamilyOptions}
                            </select>
                        </div>

                        <div className="fontSize-select">
                            <h1>字号</h1>
                            <InputSelect type="number"  selectProps={{className:"font-size"}}
                                         value={parseInt(attributes["font_size"].slice(0, -2)).toString()} options={FontSize}
                                         onChange={this.onChangeFontSizeHandle} onBlur={this.onFontSizeBlurHandle}/>

                            <div className="font-style-div">
                                <li id="func-text-font-bold"
                                    className={attributes["font_weight"]=="bold"?"active":""}
                                    onClick={this._changeTextStyle.bind(this,"font_weight","bold")}>
                                </li>
                                <li id="func-text-font-italic"
                                    className={attributes["font_style"]=="italic"?"active":""}
                                    onClick={this._changeTextStyle.bind(this, "font_style", "italic")}>
                                </li>
                                <li id="func-text-font-underscore"
                                    className={attributes["text_decoration"]=="underline"?"active":""}
                                    onClick={this._changeTextStyle.bind(this,"text_decoration","underline")}>
                                </li>
                                <li id="func-text-font-through"
                                    className={attributes["text_decoration"]=="line-through"?"active":""}
                                    onClick={this._changeTextStyle.bind(this, "text_decoration", "line-through")}>
                                </li>
                            </div>
                        </div>

                        <div className="fontColor-select">
                            <h1>字体颜色</h1>
                            <InputColorPicker type="text" className="make-fontColor-select"
                                              value={attributes['item_color']}
                                              onChange={this.onFontColorChangeHandle}/>
                        </div>

                        <div className="setting-text-style">
                            <h1>段落</h1>
                            <ul>
                                <li id="func-text-align-left"
                                    className={attributes["font_halign"]=="left"?"active":""}
                                    onClick={this._changeTextStyle.bind(this,"font_halign","left")}>
                                </li>
                                <li id="func-text-align-right"
                                    className={attributes["font_halign"]=="right"?"active":""}
                                    onClick={this._changeTextStyle.bind(this,"font_halign","right")}>
                                </li>
                                <li id="func-text-align-justify"
                                    className={attributes["font_halign"]=="justify"?"active":""}
                                    onClick={this._changeTextStyle.bind(this, "font_halign", "justify")}>
                                </li>
                                <li id="func-text-align-center"
                                    className={attributes["font_halign"]=="center"?"active":""}
                                    onClick={this._changeTextStyle.bind(this, "font_halign", "center")}>
                                </li>
                            </ul>
                        </div>

                        {/*<Range title="字间距" parameter="font_dist" value={attributes["font_dist"]}
                         defaultValue={0} max={100} min={-20} step={1} isNumber={true}/>
                         <Range title="行间距" parameter="line_height" value={attributes["line_height"]}
                         defaultValue={0} max={100} min={-20} step={1} isNumber={true}/>*/}

                        <div className="fontFamily-select font-spaceing">
                            <h1>间距</h1>
                            <div className="line">
                                <span>行</span><InputSelect type="text"  selectProps={{className:"font-space"}}
                                                           value={''+(parseInt(lineHeight) || 0) } options={FontSpacing}
                                                           onSelect={this.onChangeLineHeightHandler} onBlur={this.validAttr.bind(this,"line_height_nodefault")}/>
                            </div>
                            <div className="font">
                                <span>字</span><InputSelect type="text" selectProps={{className:"font-space"}}
                                                           value={''+attributes["font_dist"]} options={FontSpacing}
                                                           onSelect={this.onChangeLetterSpaceingHandler} onBlur={this.validAttr.bind(this,"font_dist")}/>
                            </div>
                        </div>

                    </div>
                </div>

                <header onClick={this._headerClick.bind(this, "border-style", "setting-border-style")}><span>边框样式</span><b
                    id="border-style" className="hide"/>
                </header>
                <div id="setting-border-style" style={{display: "none"}}>

                    <span className="clearTop"/>
                    <Range title="边框尺寸" parameter="item_border" value={attributes["item_border"]}
                           defaultValue={0} max={20} min={0} step={1} isNumber={true}/>

                    <Range title="边框弧度" parameter="bd_radius" value={attributes["bd_radius"]}
                           defaultValue={0} max={borderRadiusMax} min={0} step={1}/>

                    <div className="setting-select">
                        <h1>边框样式</h1>
                        <select value={attributes["bd_style"]||"solid"}
                                onChange={this._changeBorderStyle}>
                            <option value="solid">直线</option>
                            <option value="dashed">破折线</option>
                            <option value="dotted">点状线</option>
                            <option value="double">双划线</option>
                        </select>
                    </div>

                    <Color title="边框颜色" parameter="bd_color" value={attributes['bd_color']}/>

                </div>

            </div>
        );
    },

    _headerClick: function (buttonID, contentID) {
        $("#" + contentID).slideToggle();
        $("#" + buttonID).toggleClass("hide").toggleClass("show");
    },

    _changeBorderStyle: function (event) {
        MakeActionCreators.updateElement({bd_style: event.target.value});
    },

    _changeTextStyle: function (key, value) {
        if (key == "font_halign") {
            MakeActionCreators.updateElement({[key]: value});
        } else {
            if (this.props.attributes[key] == value) value = null;
            MakeActionCreators.updateElement({[key]: value});
        }

    },

    /**
     * 改变字体
     * @param e
     */
    onChangeFontFamilyHandler: function (e) {
        MakeActionCreators.updateElement({font_family: e.target.value});
    },

    /**
     * 改变当前字号
     * @param val
     */
    onChangeFontSizeHandle: function (val) {
        if (val >= FontSizeMin && val <= FontSizeMax) {
            var lineHeightScale, letterSpacing;
            var attrs = this.props.attributes;
            var fontSize = parseInt(attrs["font_size"]);
            if (typeof attrs["line_height_nodefault"] != "undefined") {
                lineHeightScale = (attrs["line_height_nodefault"] / fontSize).toFixed(1);
            } else {
                var lineHeight = parseInt(attrs["line_height"]);
                if (lineHeight == 0) {
                    lineHeightScale = 0.7;
                } else {
                    lineHeightScale = (lineHeight / fontSize).toFixed(1);
                }
            }
            //letterSpacingScale
            if (!!attrs['notfixed_font_dist']) {
                letterSpacing = parseInt(attrs["font_dist"]) / fontSize;
            } else {
                letterSpacing = parseInt(attrs["font_dist"]);
            }
            letterSpacing = isNaN(letterSpacing) ? "0" : "" + letterSpacing
            var fixedLineHeight = attrs["fixed_line_height"],
                notFixedFontDist = attrs["notfixed_font_dist"],
                lineHeight = parseInt(lineHeightScale * parseInt(val));
            var obj = {font_size: `${val}px`}
            if (!fixedLineHeight&&!isNaN(lineHeight)) { //行间距为可变
                obj.line_height_nodefault = lineHeight
            }
            if (notFixedFontDist) { //字间距为可变
                obj.font_dist = parseInt(letterSpacing * parseInt(val))
            }
            MakeActionCreators.updateElement(obj);
        }
    },
    /**
     * InputSelect失去焦点时 判断输入合法性，不合法时刷新为实际值
     * @param e
     */
    validAttr             :function(key, value){
        var value = parseInt(value);
        if(isNaN(value)){
           this.forceUpdate()
        }
    },
    /**
     * InputSelect失去焦点时 判断字号
     * @param e
     */
    onFontSizeBlurHandle  : function (e) {
        var val = e.target.value;
        if (val < FontSizeMin) {
            this.onChangeFontSizeHandle(FontSizeMin);
        } else if (val > FontSizeMax) {
            this.onChangeFontSizeHandle(FontSizeMax);
        }
    },

    onFontColorChangeHandle: function (value) {
        MakeActionCreators.updateElement({item_color: value});
    },

    /**
     * 改变行间距
     */
    onChangeLineHeightHandler: function (value) {
        var oldLineHeight= parseInt(this.props.attributes["line_height_nodefault"])
        var lineHeight = parseInt(value);
        if(isNaN(lineHeight)){
            return
        }
        if(oldLineHeight==lineHeight){
            return;
        }
        MakeActionCreators.updateElement({line_height_nodefault: lineHeight, fixed_line_height: true});
    },

    /**
     * 改变字间距
     */
    onChangeLetterSpaceingHandler: function (value) {
        var oldFontDist= parseInt(this.props.attributes["font_dist"])
        var letterSpaceing = parseInt(value);
        if(isNaN(letterSpaceing)){
            return
        }
        if(oldFontDist==letterSpaceing){
            return;
        }
        MakeActionCreators.updateElement({font_dist: letterSpaceing, notfixed_font_dist: false});
    }

});

module.exports = TextEditTab;