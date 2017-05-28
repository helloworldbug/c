/**
 * @description 上架设置页面
 * @time 2016-12-6
 * @author fisnYu
 */

'use strict';

//require core module
var React = require('react');
import {Link} from 'react-router'
var Base = require('../../../utils/Base');
var Range = require('../../Common/Range');
var GlobalFunc = require("../../Common/GlobalFunc");

//require style
require('./shelveSetting.css');

//默认封面图片
var recordDefault = require('../../../../assets/images/user/record-default.png'); 
/**
 * 通用对话页面
 */
const FIRST = 1;  //1：表示信息编辑
const SECOND = 2; //2：上架设置 
const THREE = 3;   //3: 表单选

export default class ShelveSetting extends React.Component{
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
        this.state = {
            isShow : this.props.isShow,     //是否显示
            tabIndex : this.props.tabIndex || FIRST,   //tab 栏
            corverImg: this.props.record.record.cover_img || recordDefault,  //封面图片
            readPercent : 1,  //试度百分比  
            bookName : "",       //书名
            bookAuthor : "",       //书作者
            bookBrief : "",       //书简介
            bookPrograma: "def", //默认栏目
            bookLabels: this.props.tags,     //书本的标签
            bookMoney: 0        //书本价格
        };
        this.xmlhttp = null;
    }
    /**
     *渲染内容选项
     */
    renderContentSection(){
        const {record, tags, labels, programas} = this.props;
        var corverImg = record.record.cover_img || recordDefault;
        var _hideStyle = this.state.bookLabels.length >= 3 ? {display : "none"} : {};
        var _contentDom = null;
        switch (this.state.tabIndex) {
            case FIRST:
                _contentDom = (
                    <div className="info-setting-wrap">
                        <div className="info-setting-content">
                            <div className="info-setting-left">
                                <div className="info-setting-common-div"><span>书名</span><input type="text" /></div>
                                <div className="info-setting-common-div"><span>作者</span><input type="text" /></div>
                                <div className="info-setting-common-div" id="info-setting-cover">
                                <span>封面</span><div className="upload-cover" onClick={this.onUploadCoverHandler.bind(this)}>上传封面</div><div>支持格式：.jpg .png</div></div>
                                <div className="info-setting-common-div" id="info-setting-brief"><span>简介</span><textarea></textarea></div>
                            </div>
                            <div className="info-setting-right" style={{"backgroundImage": `url('${this.state.corverImg}')`}}></div>
                        </div>
                        <div className="info-setting-bottom">
                            <span className="button-next button-hover" onClick={this.onClickNextHandler.bind(this, SECOND)}>下一步</span>
                            <span className="button-hover" onClick={this.onClickCancelHandler.bind(this, {index: FIRST, isUpdate: false})}>取消</span>
                        </div>
                    </div>);
                break;
            case SECOND:
                _contentDom = (
                    <div className="info-setting-wrap">
                        <div className="info-setting-content">
                            <div className="info-setting-left">
                                <div className="shelve-setting-common-div" id="shelve-programa">上架栏目
                                    <select onChange={this.onChangeSlectedHandler.bind(this)}>
                                        {programas.map((item, index) => {   
                                            var _val = index == 0 ? "def" : item;
                                            return (<option value={_val} key={programas.length - index}>{item}</option>);
                                        })}
                                    </select>
                                </div>
                                <div className="shelve-setting-common-div">
                                    标签作品
                                    <div className="shelve-label-wrap" ref="shelveLabelsWrap">
                                        {this.state.bookLabels.map((item, index) => <span key={this.state.bookLabels.length - index}>{item}</span>)}
                                    </div>
                                    <div className="add-label" style={_hideStyle} onClick={this.onAddLabelHandler.bind(this)}>+</div>
                                </div>
                                <div className="recommend-labels">
                                    {labels.map((item, index) => {
                                        var _classname = this.state.bookLabels.indexOf(item) > -1 ? "shelve-label-selected" : "";

                                        return (<span key={labels.length-index} onClick={this.onAppendLabelHandler.bind(this)} className={_classname}>{item}</span>);
                                    })}
                                </div>
                                <div className="shelve-setting-common-div" style={{"display" : "none"}}>试读设置
                                    <div className="shelve-setting-range">
                                        <Range max={100} min={1} width={128} step={1}
                                        change={this.onChangRangeHandler.bind(this)}  value={this.state.readPercent} onMouseUp={this.endRecord}/>
                                    </div>
                                    <span className="shelve-setting-percent">{`${this.state.readPercent}`}</span>
                               </div>
                                <div className="shelve-setting-common-div" style={{"display" : "none"}}>订阅价格<input className="shelve-setting-money" type="text"/><span>元</span></div>
                            </div>
                            <div className="info-setting-right" style={{"backgroundImage": `url('${this.state.corverImg}')`}}></div>
                        </div>
                        <div className="info-setting-bottom">
                            <span className="button-next button-hover" onClick={this.onClickNextHandler.bind(this, THREE)}>提交</span>
                            <span className="button-hover" onClick={this.onClickCancelHandler.bind(this, {index: FIRST, isUpdate: true})}>退出并保存</span>
                        </div>
                    </div>);
                break;
            case THREE :
                _contentDom = (
                    <div className="info-setting-wrap">
                            <div className="publish-setting-content">
                                <div className="publish-setting-titel">作品已上架！</div>
                                <div className="publish-setting-brief">
                                    上架后的作品将显示在个人主页的电子书版块，<br/>本功能使用了 ME Book 免费在线阅读云服务，欢迎用户试用体验！
                                </div>
                            </div>
                            <div className="publish-setting-button button-hover" onClick={this.onClickCancelHandler.bind(this, {index: FIRST, isUpdate: true})}>我知道了</div>
                    </div>);
                break;
        }
        return (_contentDom);
    }
    /**
     *渲染界面
     */
    render() {
        var _class1 = this.state.tabIndex == FIRST ? "shelve-setting-current-tab" : "";
        var _class2 = this.state.tabIndex == SECOND ? "shelve-setting-current-tab" : "";
        var _class3 = this.state.tabIndex == THREE ? "shelve-setting-current-tab" : "";
        return this.state.isShow ? (
            <div className="shelve-setting-dialog-container">
                <div className="shelve-setting-dialog-wrap">
                    <div className="shelve-setting-dialog-title">
                        <span className={_class1}>1.信息编辑</span> ——— <span className={_class2}>2.上架设置</span> ——— <span className={_class3}>3.发布完成</span>
                        <div className="shelve-setting-dialog-close button-hover" onClick={this.onClickCancelHandler.bind(this, {index: FIRST, isUpdate: false})}></div>
                    </div>
                    <div className="shelve-setting-dialog-content">
                        {this.renderContentSection()}
                    </div>
                </div>
            </div>
        ) : null;
    }
    componentDidMount(){
    }
    /**
     * 点击下一步的操作
     * @param data 需要传递的信息
     */
    onClickNextHandler(data, evt){
        evt.preventDefault();
        evt.stopPropagation();
        this.setState({tabIndex : data});
    }
    /**
     * 点击取消的操作
     * @param data 需要传递的信息
     */
    onClickCancelHandler (data, evt) {
        evt.stopPropagation();
        evt.preventDefault();
        this.setState({
            tabIndex : data.index,
            isShow : false
        });
        //根据 data.isUpdate 返回值来判断是否需要重新请求数据
        //TODO回调
        this.props.callback(data.isUpdate);
    }
    /**
     * 上传封面处理函数
     */
    onUploadCoverHandler(evt){
        evt.preventDefault();
        evt.stopPropagation();
        var self = this;
        const {record} = this.props;
        var fileHash = record.record.hashcode;
        //确定回调
        $("#croped-img-url").unbind("finished").on("finished", function (event, data) {
            //可能需要去显示替换封面
            var fileBase64 = data.cropedUrl;
            //TODO 去上传文件
            self.send_request(fileBase64, self.upLoadCallback.bind(self));
        });
        $("#publish-info-uploadFile").find("input").trigger("click", ["isConvertCover"]);
    }
    /**
     * 上传文件完成回调
     */
    upLoadCallback (){
        var self = this;
        if(self.xmlhttp.readyState == 4 && self.xmlhttp.status == 200){
            //纯文本数据的接受方法   
            var text = self.xmlhttp.responseText; 
            console.log(text, "上传成功");
            //设置图片
            //TODO 去更新数据 
        }
    } 
    /**
     * 上传到OSS文件服务
     */
    send_request(data, callback){
        var self = this;
        if (window.XMLHttpRequest){
            self.xmlhttp=new XMLHttpRequest();
        }else if (window.ActiveXObject){
            self.xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        var sendData = {};
        sendData.callback = {};
        sendData.callback.callbackUrl = "http://agoodme.6655.la:8088/v1/transfer/authors/usercover";
        sendData.callback.callbackBody = data;
        sendData.callback.callbackBodyType = "application/x-www-form-urlencoded";
        sendData.host = "http://agoodme-test1.oss-cn-hangzhou.aliyuncs.com";
        sendData = JSON.stringify(sendData)
        if (self.xmlhttp!=null){
            var serverUrl = 'http://192.168.6.191:9088/v1/auth/oss/policy'  // *********地址
            self.xmlhttp.open( "POST", serverUrl, false );
            self.xmlhttp.setRequestHeader("Content-Type", "application/json");
            self.xmlhttp.setRequestHeader("X-Gli-User-Id", "MEPC");
            self.xmlhttp.setRequestHeader("X-Gli-Client-Id", self.props.userId);
            self.xmlhttp.onreadystatechange = callback;
            self.xmlhttp.send(sendData);
        }else{
            alert("Your browser does not support XMLHTTP.");
        }
    }
    /**
     * 添加标签处理函数
     */
    onAddLabelHandler(evt){
        evt.stopPropagation();
        evt.preventDefault();
        this.props.addLabelHandler(this.state.bookLabels, evt);
    }
    /**
     * 滑动条滚动事件
     */
    onChangRangeHandler(value){
        this.setState({
            readPercent : value
        });
    }
    /**
     * 追加标签事件
     */
    onAppendLabelHandler(evt){
        evt.stopPropagation();
        evt.preventDefault();
        var _oldLabels = this.state.bookLabels;
        var $target = $(evt.target);
        var _val = $target.text();
        var _index = _oldLabels.indexOf(_val);
        if(_index > -1 ){   //再次点击的时候删除
            _oldLabels.splice(_index, 1);
            this.setState({
                bookLabels : _oldLabels
            });
        }else{
            if (_oldLabels.length >= 3 ) {
                GlobalFunc.addSmallTips("书本标签最多只能添加3个", null, { clickCancel: true });
                return;
            }else{
                evt.target.className = "shelve-label-selected";
                _oldLabels.push(_val);
                this.setState({
                    bookLabels : _oldLabels
                });
            }
        }
        
    }
    /**
     * 选择栏目事件
     */
    onChangeSlectedHandler(evt){
        evt.stopPropagation();
        evt.preventDefault();
        var _val = evt.target.value;
        this.setState({bookPrograma : _val});
    }
};