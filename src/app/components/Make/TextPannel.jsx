/**
 * @component Device
 * @description 设备组件: 展示当前页的元素, 并进行操作
 * @time 2015-08-31 18:01
 * @author StarZou
 **/

var React = require('react');
var {findDOMNode}=require('react-dom');
var MakeActionCreators = require('../../actions/MakeActionCreators');
var classnames = require('classnames');
var EditStateActions = require('../../actions/EditStateActions');
import Select, { Option } from 'rc-select';
import 'rc-select/assets/index.css';
var GlobalFunc = require("../Common/GlobalFunc");
var ColorPicker = require('../Common/ColorPicker');

var leftAlign = require('../../../assets/images/make/leftAlign.png'); //左对齐
var middleAlign = require('../../../assets/images/make/centerAlign.png'); //水平居中
var rightAlign = require('../../../assets/images/make/rightAlign.png'); //左对齐
var hjustifyAlign = require('../../../assets/images/make/levelAlign.png'); //两端对齐

var lineHeightScale = 0; //行间距比例
var letterSpacing = 0; //字间距比例

var TextPannel = React.createClass({
    getInitialState: function () {
        return {
            show : false,
            left : 0,
            top  : 0,
            attrs: {}
        }
    },
    toggleShow     : function (isShow, top, el, attrs) {

        if (!!attrs) {
            this.setState({
                attrs: attrs
            });
        }

        if (this.state.show != isShow) {
            var offset = $("#device").offset();
            var left = offset.left + 644 * this.props.deviceScale / 2;

            this.setState({show: isShow, left: left, top: top || 0})
        }
        if (!!isShow && el) {
            this.el = el
        } else {
            this.el = null;
        }
    },
  
    focus          : function () {
        if (!!this.blurTimer) {
            clearTimeout(this.blurTimer);
            this.blurTimer = null;
        }
        console.log("textpannel focusin");
    },
    pannelBlur     : function () {
        this.blurTimer = setTimeout(()=> {
            this.blurTimer = null;
            this.el.blur();
        }, 3);
        console.log("textpannel blur");
    },
    onColorHide    : function (color) {
        //console.log(color);
        this.pannelBlur()
        //findDOMNode(this.refs.color).blur();

    },
    onColorShow    : function () {
        findDOMNode(this.refs.color).blur();
        console.log("show color");
    },

    setTextOverState: function (state) {
        EditStateActions.changeTextPannelMouseOverState(state)

    },
    click           : function () {
        EditStateActions.changeTextPannelMouseOverState(true);
        console.log("textpannel click");
    },
    blur            : function (event) {
        console.log(event.relatedTarget);
        $('.text.element').blur();
        console.log("text-pannel blur");
    },
    render          : function () {

        var attrs = this.state.attrs;
        //字体
        var FontFamily = [
            {name: "微软雅黑", src: "微软雅黑", css: "default"},
            {name: "蔡云汉行书简", src: "蔡云汉行书简", css: "caiyunhanxingshujian"}, //云汉行书
            {name: "程行简", src: "程行简", css: "chengxingjian"}, //汉仪程行
            {name: "粗黑宋简", src: "粗黑宋简", css: "cuheisongjian"},
            {name: "冬青黑体", src: "冬青黑体", css: "dongqingheiti"},
            {name: "古隶简体", src: "古隶简体", css: "gulijianti"}, //方正古隶
            {name: "壕粗", src: "壕粗", css: "haocu"}, //超粗黑简
            {name: "华文细黑", src: "华文细黑", css: "huaweixihei"},
            {name: "劲黑", src: "劲黑", css: "jinghei"}, //工房劲黑
            {name: "嘉丽超粗圆简", src: "嘉丽超粗圆简", css: "jialichacuyuanjian"}, //嘉丽超粗
            {name: "简罗卜", src: "简罗卜", css: "jianluobo"}, //迷你萝卜
            {name: "剑体简体", src: "剑体简体", css: "jiantijianti"}, //方正剑体
            {name: "金砖黑繁", src: "金砖黑繁", css: "jinzuanheifan"},
            {name: "锦昌体简", src: "锦昌体简", css: "jinchangtijian"},
            {name: "康熙字典", src: "康熙字典", css: "kangxizidian"},
            {name: "兰亭超细黑简", src: "兰亭超细黑简", css: "lantingchaoxiheijian"}, //兰亭超细
            {name: "兰亭大黑", src: "兰亭大黑", css: "lantingdahei"},
            {name: "兰亭中黑", src: "兰亭中黑", css: "lantingzhonghei"},
            {name: "朗倩体", src: "朗倩体", css: "langqianti"}, //工房朗倩
            {name: "立黑", src: "立黑", css: "lihei"}, //迷你立黑
            {name: "力黑体简", src: "力黑体简", css: "liheitijian"},
            {name: "隶变简", src: "隶变简", css: "libianjian"}, //隶变简体
            {name: "菱心", src: "菱心", css: "lingxin"}, //迷你菱心
            {name: "流行体简", src: "流行体简", css: "liuxingtijian"},
            {name: "启繁", src: "启繁", css: "qifan"}, //方正启繁
            {name: "青柳衡山", src: "青柳衡山", css: "qingliuhengshan"},
            {name: "清楷体繁", src: "清楷体繁", css: "qingkaitifan"},
            {name: "趣圆体", src: "趣圆体", css: "quyuanti"}, //趣圆体简
            {name: "锐线", src: "锐线", css: "ruixian"}, //锐线体简
            {name: "双线体简", src: "双线体简", css: "shuangxiantijian"},
            {name: "苏新诗柳楷简", src: "苏新诗柳楷简", css: "shuxinshiliukaijian"}, //苏新诗柳
            {name: "特雅宋", src: "特雅宋", css: "teyasong"}, //特雅宋简
            {name: "小丸子", src: "小丸子", css: "xiaowanzi"}, //新蒂丸子
            {name: "细珊瑚简", src: "细珊瑚简", css: "xishanhujian"},
            {name: "下午茶基本", src: "下午茶基本", css: "xiawuchajiben"}, //下午茶基
            {name: "下午茶桃心", src: "下午茶桃心", css: "xiawuchataoxin"},//下午茶桃
            {name: "雪君体简", src: "雪君体简", css: "xuejuntijian"},
            {name: "雅宋体", src: "雅宋体", css: "yasongti"}, //雅宋简体
            {name: "颜楷繁", src: "颜楷繁", css: "yankaifan"}, //颜楷繁体
            {name: "姚体简", src: "姚体简", css: "yaotijian"}, //姚体简体
            {name: "毅黑体简", src: "毅黑体简", css: "yiheitijian"},
            {name: "硬笔行书", src: "硬笔行书", css: "yingbixingshu"},
            {name: "悦黑特细", src: "悦黑特细", css: "yueheitexi"},
            {name: "悦圆体简", src: "悦圆体简", css: "yueyuantijian"},
            {name: "韵动大黑简", src: "韵动大黑简", css: "yundongdaheijian"}, //韵动大黑
            {name: "曾正国楷", src: "曾正国楷", css: "zengzhengguokai"},
            {name: "张海山锐谐", src: "张海山锐谐", css: "zhanghaishanruikai"}, //锐楷体简
            {name: "正大黑简", src: "正大黑简", css: "zhengdaheijian"},
            {name: "正黑简", src: "正黑简", css: "zhengheijian"}, //正黑简体
            {name: "正纤黑简", src: "正纤黑简", css: "zhengqianheijian"},
            {name: "中山行书", src: "中山行书", css: "zhongshanxingshu"},
            {name: "篆娃", src: "篆娃", css: "zuanwa"}, //娃娃篆简
            {name: "方正粗雅宋简体", src: "方正粗雅宋简体", css: "chuyasong"}, //粗雅宋简
            {name: "方正启体简体", src: "方正启体简体", css: "qiti"}, //启体简体
            {name: "方正清刻本悦宋简体", src: "方正清刻本悦宋简体", css: "qikebenyuesong"}, //清刻本悦
            {name: "方正宋刻本秀楷简", src: "方正宋刻本秀楷简", css: "songkebenxiukai"}, //宋刻本秀
            {name: "幼线简", src: "幼线简", css: "youxian"}, //幼线简体
            {name: "fzhcjw", src: "fzhcjw", css: "fzhcjw"},//黄草简体
            {name: "fzltksk", src: "fzltksk", css: "fzltksk"},//兰亭刊宋
            {name: "hye2gjm", src: "hye2gjm", css: "hye2gjm"}, //细中圆简
            {name: "fzy1jw", src: "fzy1jw", css: "fzy1jw"}, //细圆简体
            {name: "hyk2gjmo", src: "hyk2gjmo", css: "hyk2gjmo"}, //菱心体简
            {name: "hyy1gjm", src: "hyy1gjm", css: "hyy1gjm"},//秀英体简
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
            {name: "times", src: "times", css: "timesnewroma"}, //Times New Roman
            {name: "pertibd", src: "pertibd", css: "pertibd"},
            {name: "vladmimir", src: "vladmimir", css: "vladmimir"}
        ].map((op, index)=> {
            return <Option value={op.name} key={index}>
                <div className={op.css}></div>
            </Option>
        });

        //字体大小
        var FontSize = [12, 14, 16, 18, 20, 24, 28, 30, 32, 34, 36, 48, 60, 72, 96].map((op, index)=> {
            return <Option value={""+op} key={index}>{op}px</Option>
        });
        var style = {
            display: this.state.show ? "block" : "none",
            left   : `${this.state.left}px`,
            top    : `${this.state.top}px`
        };

        var colorStyle = {
            borderBottomColor: attrs["item_color"]
        }
        var noOutLine = {
            outline: "none"
        }

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
        if (!!attrs['notfixed_font_dist']) {
            letterSpacing = parseInt(attrs["font_dist"]) / fontSize;
        } else {
            letterSpacing = parseInt(attrs["font_dist"]);
        }
        letterSpacing=isNaN(letterSpacing)?"0":""+letterSpacing
        return (
            <div className="text-pannel" ref="textPannel" style={style}
                 onMouseEnter={this.setTextOverState.bind(this,true)}
                 onMouseLeave={this.setTextOverState.bind(this,false)} onFocus={this.focus} onBlur={this.pannelBlur}
                 onClick={this.click}>

                <div className="type-face-box">
                    <Select showSearch={false} className="type-face-select" optionLabelProp="children"
                            dropdownClassName="fontfamily-down" onChange={this.onChangeFontFamilyHandler}
                            value={attrs["font_family"] || "微软雅黑"}>
                        {FontFamily}
                    </Select>
                    <div className="tips">字体</div>
                </div>
                <div className="line"></div>
                <div className="font-size-box">
                    <Select className="font-size-select" showSearch={false}
                            dropdownClassName="fontsize-down" onChange={this.onChangeFontSizeHandle}
                            value={parseInt(attrs["font_size"]).toString()}>
                        {FontSize}
                    </Select>
                    <div className="tips">字号</div>
                </div>

                <div className="change-color" tabIndex="-1" ref="color" style={noOutLine}>
                    <ColorPicker value={attrs["item_color"]} onSelect={this.selectColor}
                                 changeParameter={this.onChangeColorHandler}
                                 onHide={this.onColorHide} onShow={this.onColorShow}/>
                    <span style={colorStyle}>A</span>
                    <b></b>
                    <div className="tips">颜色</div>
                </div>
                <div className="line"></div>

                <div className="level-align-box">
                    <Select showSearch={false} className="level-align-select" dropdownClassName="level-align-down"
                            optionLabelProp="children" value={attrs["font_halign"]}
                            onChange={this.onChangeFontHalignHandler}>
                        <Option value="left">
                            <div><img src={leftAlign}/></div>
                        </Option>
                        <Option value="right">
                            <div><img src={rightAlign}/></div>
                        </Option>
                        <Option value="center">
                            <div><img src={middleAlign}/></div>
                        </Option>
                        <Option value="justify">
                            <div><img src={hjustifyAlign}/></div>
                        </Option>
                    </Select>
                    <div className="tips">对齐</div>
                </div>
                <div className="level-align-box">
                    <Select className="level-align-select align-down2" showSearch={false}
                            dropdownClassName="level-align-down" optionLabelProp="children"
                            onChange={this.onChangeLetterSpacingHandler} value={attrs["font_dist"]||"0"}>
                        <Option value="0">
                            <div>0%</div>
                        </Option>
                        <Option value="0.25">
                            <div>25%</div>
                        </Option>
                        <Option value="0.5">
                            <div>50%</div>
                        </Option>
                        <Option value="0.75">
                            <div>75%</div>
                        </Option>
                        <Option value="1">
                            <div>100%</div>
                        </Option>
                    </Select>
                    <div className="tips">字间距</div>
                </div>
                <div className="level-align-box">
                    <Select className="level-align-select align-down3" showSearch={false}
                            dropdownClassName="level-align-down" optionLabelProp="children"
                            onChange={this.onChangeLineHeightHandler} value={letterSpacing}>
                        <Option value="0.75">
                            <div>0.75</div>
                        </Option>
                        <Option value="1.0">
                            <div>1.0</div>
                        </Option>
                        <Option value="1.5">
                            <div>1.5</div>
                        </Option>
                        <Option value="1.75">
                            <div>1.75</div>
                        </Option>
                        <Option value="2.0">
                            <div>2.0</div>
                        </Option>
                    </Select>
                    <div className="tips">行间距</div>
                </div>

                <div className="line"></div>

                <div className={ attrs["font_weight"] == "bold" ? "font-bold active" : "font-bold" }
                     onClick={this._changeTextStyle.bind(this,"font_weight","bold")} tabIndex="-1"
                     style={noOutLine}>
                    <div className="tips">加粗</div>
                </div>
                <div className={ attrs["font_style"] == "italic" ? "font-italic active" : "font-italic" }
                     onClick={this._changeTextStyle.bind(this, "font_style", "italic")} tabIndex="-1"
                     style={noOutLine}>
                    <div className="tips">斜体</div>
                </div>

                {/*<div className="line"></div>
                 <div className={ attrs["writing_mode"] == "vertical-rl" ? "writing-mode active" : "writing-mode" }
                     onClick={this._changeTextStyle.bind(this, "writing_mode", "vertical-rl")} tabIndex="-1"
                     style={noOutLine}>
                    <div className="tips">竖排文字</div>
                </div>*/}
                <div className="css-clear" onClick={this.clearStyle} tabIndex="-1" style={noOutLine}>
                    <div className="tips">清除</div>
                </div>
            </div>
        )
    },

    componentDidMount  : function () {
        $(this.refs.textPannel).delegate(".rc-select-selection-selected-value", 'mouseover', this.removeTitleAttr);
    },
    componentWillUmount: function () {
        $(this.refs.textPannel).undelegate(".rc-select-selection-selected-value", 'mouseover', this.removeTitleAttr);
    },
    removeTitleAttr    : function (event) {
        //debugger;
        $(event.currentTarget).removeAttr('title');
    },

    /**
     * 改变字体
     * @param e
     */
    onChangeFontFamilyHandler: function (value) {
        MakeActionCreators.updateElement({font_family: `${value}`});
    },

    /**
     * 改变当前字号
     * @param val
     */
    onChangeFontSizeHandle: function (value) {
        var fixedLineHeight = this.state.attrs["fixed_line_height"],
            notFixedFontDist = this.state.attrs["notfixed_font_dist"],
            notFixedFontDist = this.state.attrs["notfixed_font_dist"],
            lineHeight = parseInt(lineHeightScale * parseInt(value));

        var obj = {font_size: `${value}px`}
        if (!fixedLineHeight&&!isNaN(lineHeight)) { //行间距为可变
            obj.line_height_nodefault = lineHeight
        }
        if (notFixedFontDist&&!isNaN(letterSpacing)) { //字间距为可变
            obj.font_dist = parseInt(letterSpacing * parseInt(value))
        }
        MakeActionCreators.updateElement(obj);

    },

    /**
     * 改变当前字样式
     */
    _changeTextStyle: function (key, value) {
        console.log(key, value);
        if (key == "font_halign") {
            MakeActionCreators.updateElement({[key]: value});
        } else {
            if (this.state.attrs[key] == value) value = null;
            MakeActionCreators.updateElement({[key]: value});
        }
    },

    /**
     * 改变对齐方式
     * @param val
     */
    onChangeFontHalignHandler: function (value) {
        MakeActionCreators.updateElement({font_halign: `${value}`});
    },

    /**
     * 清除样式
     */
    clearStyle: function (e) {
        GlobalFunc.clickAnimation(e);
        if (GlobalFunc.canClearStyle()) {
            GlobalFunc.clearStyle();
        }
    },

    selectColor         : function (color) {
        console.log("select Color");
        setTimeout(()=> {
            findDOMNode(this.refs.color).focus();
        }, 5)

    },
    /**
     * 改变颜色
     * @param val
     */
    onChangeColorHandler: function (color) {

        MakeActionCreators.updateElement({item_color: color});
    },

    /**
     * 改变行间距
     * @param value
     */
    onChangeLineHeightHandler: function (value) {
        var fontSize = parseInt(this.state.attrs["font_size"]); //字体大小
        var lineHeight = fontSize * value; //通过倍数算出行间距
        MakeActionCreators.updateElement({line_height_nodefault: lineHeight, fixed_line_height: false});
    },

    /**
     * 改变字间距
     * @param value
     */
    onChangeLetterSpacingHandler: function (value) {
        letterSpacing = value;
        var fontSize = parseInt(this.state.attrs["font_size"]); //字体大小
        var fontDist = fontSize * value;
        MakeActionCreators.updateElement({font_dist: fontDist, notfixed_font_dist: true});
    }


});

module.exports = TextPannel;