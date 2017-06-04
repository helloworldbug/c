import React, { Component } from 'react';
import classnames from 'classnames'
import Upload from './Upload';
import GlobalFunc from './GlobalFunc';

const QUESTIONS = [
    "转档时间过长",
    "文件转档出错",
    "其他问题"
]


export default class Feedback extends Component {
    constructor(props) {
        super(props);
        this.state = { selectedRadio: 0, imgs: [] }
        this.addImg = this.addImg.bind(this);
        this.canUploadFile = this.canUploadFile.bind(this);
        this.deleteImg = this.deleteImg.bind(this)
        this.postReason = this.postReason.bind(this)
    }

    selectRadio(type) {
        this.setState({ selectedRadio: type })
    }
    postReason() {
        var _this = this;
        var context = QUESTIONS[this.state.selectedRadio];
        var customReason = this.refs.otherReason.value;
        var f_screenshots = this.state.imgs.map(item => item.url).join("|")
        var feedbackobj = fmacloud.Object.extend("feedback_obj");
        var feedback = new feedbackobj();
        feedback.set("fb_type", parseInt(6)); //,类别：0-反馈信息，其他为举报信息：1-appH5微场景，2-众创，3-pcH5微场景，4-页举报，5-评论举报,6-mebook反馈
        feedback.set("fb_fromuser", fmacloud.User.current().id);
        feedback.set("fb_user_pointer", fmacloud.User.current());
        feedback.set("f_username", fmacloud.User.current().get("username"));
        feedback.set("f_software_version", "mebook");
        feedback.set("f_model", "PC");
        feedback.set("f_sys_version", "PC");
        feedback.set("f_screenshots", f_screenshots);
        feedback.set("context", context);
        feedback.set("custom_reason", customReason);

        feedback.save(null, {
            success: cb_ok,
            error: cb_err
        });
        function cb_ok() {
            GlobalFunc.addSmallTips("反馈成功", null, { clickCancel: true,cb_confirm:function(){
                _this.props.onClose()
            } }
            );
        }
        function cb_err(e) {
              GlobalFunc.addSmallTips("提交失败,请重新提交", null, { clickCancel: true});
            // console.error()
        }
    }
    deleteImg(index) {
        var oldImgs = this.state.imgs;
        var newImg = [...oldImgs.slice(0, index), ...oldImgs.slice(index + 1)]
        this.setState({ imgs: newImg });
    }
    addImg(e) {
        var _this = this;
        var file = e.target.files[0];
        var fileName = file.name;
        var newFile = new fmacloud.File(file.name, file);
        newFile.save().then((object) => {
            var _url = object.get("url");
            var oldImgs = _this.state.imgs;
            var imgs = { url: _url, name: fileName };
            _this.setState({ imgs: oldImgs.concat(imgs) })
        }, function (error) {
            console.log(error);
        })
    }
    canUploadFile(e) {
        if (this.state.imgs.length >= 3) {
            GlobalFunc.addSmallTips("最多能上传3张图片", null, { clickCancel: true });
            return false
        }
        return true;
    }
    render() {
        let imgs = this.state.imgs.map((item, index) => {
            return <span className="img-info" key={index}><span className="img-name" title={item.name}>{item.name}</span><span className="delete" onClick={this.deleteImg.bind(this, index)}>删除</span></span>
        })
        return (
            <div className="feedback modal-dialog">
                <div className="content center-dialog" >
                    <h1>意见反馈<span className="tips">me问题反馈群: 450828388</span><span className="close" onClick={this.props.onClose}></span></h1>
                    <div className="main">
                        <div className="select" >
                            <div className="line">
                                <span onClick={this.selectRadio.bind(this, 0)} className="label" ><input type="radio" readOnly checked={this.state.selectedRadio == 0} value="1" /><span>{QUESTIONS[0]}</span></span>
                                <span onClick={this.selectRadio.bind(this, 1)} className="label" ><input type="radio" readOnly checked={this.state.selectedRadio == 1} value="1" /><span>{QUESTIONS[1]}</span></span>
                                <span onClick={this.selectRadio.bind(this, 2)} className="label" ><input type="radio" readOnly checked={this.state.selectedRadio == 2} value="1" /><span>{QUESTIONS[2]}</span></span>
                            </div>
                            <textarea className="other-reason" placeholder="简要说明发生的问题以及哪些步骤让我们重现这个问题，谢谢！" ref="otherReason" maxLength="300"></textarea>
                        </div>
                        <div className="img-operator">
                            <span className="label">图片上传：</span><Upload accept="image/jpeg,image/jpg,image/png,image/gif" onChange={this.addImg} onClick={this.canUploadFile}><button className="upload">上传</button></Upload>
                            {imgs}
                        </div>
                    </div>


                    <button onClick={this.postReason} className="submit">提交</button>
                </div>
            </div>
        )
    }
}