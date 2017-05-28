
// 描述：    申诉页

'use strict';

// require core module
var React = require('react');
var AppealHeader = require("../Common/AppealHeader");
var Footer = require("../Common/Footer")
require("../../../assets/css/appeal.css");
var Base = require('../../utils/Base');
var classnames = require('classnames');
var GlobalFunc = require("../Common/GlobalFunc")

// define Download component
var Appeal = React.createClass({
    getInitialState() {
        if (!Base.isLogin()) {
            var url = location.href
            var path = url.substr(url.indexOf("/", url.indexOf("://") + 3))
            localStorage.setItem("referer", path);
            Base.linkToPath("/login");
            return {}
        }
        var obj = {};
        try {

            obj = JSON.parse(localStorage.getItem("appealWorkStr"));
            // localStorage.removeItem("appealWorkStr")
        } catch (e) {

        }
        //todo 删除appealWorkStr
        return Object.assign({ email: "", reason: "" }, obj)
    },
    componentDidMount() {
        var user = Base.getCurrentUser();
        if (user) {
            this.setState({
                user_id: user.id,
                user_name: user.get("user_nick")
            })
        }
    },
    submit() {
        if (!this.isButtonDisable()) {
            var tid=this.state.tid
            var currentUser = Base.getCurrentUser();
            var userId = currentUser ? currentUser.id : "";
            var AppealObj = AV.Object.extend("appeal");  //申诉表名
            var appealObj = new AppealObj();
            var userName = currentUser ? currentUser.get("user_nick") : this.state.user_name
            appealObj.set("type", 1);        //事项
            appealObj.set("tpl_id", tid);        //作品ID
            appealObj.set("tpl_name", this.state.name);  //作品名称
            appealObj.set("user_name", userName);   //申诉人姓名
            appealObj.set("user_id", userId); //申诉来源
            appealObj.set("email", this.state.email);//申诉人email
            appealObj.set("reason", this.state.reason); //申诉内容
            appealObj.set("source", 3); //申诉来源
            appealObj.save(null, {
                success: function (data) {
                    var query = new AV.Query("tplobj");
                    query.equalTo("tpl_id", tid);
                    query.first({
                        success: function (results) {
                            //TODO 需要保存作品状态变迁履历表
                            var reviewStatus = results.get("review_status");
                            var ori = GlobalFunc.getReviewText(reviewStatus);

                            var changeStatus = ori + "-5申诉";
                            var RecordObj = AV.Object.extend("tpl_record");  //申诉表名
                            var recordObj = new RecordObj();
                            recordObj.set("tpl_id", tid);        //作品ID
                            recordObj.set("user_name", userName);   //申诉人姓名
                            recordObj.set("user_id", userId); //申诉人ID
                            recordObj.set("delete_status", 0);//删除状态
                            recordObj.set("action", 5); //申诉内容
                            recordObj.set("tpl_state", changeStatus); //申诉来源
                         
                            recordObj.save(null, {
                                success: function (data) {
                                    //修改作品的状态
                                    results.increment('appeal_int', 1);
                                    results.set("review_status", 5);    //改变tpl_state 状态，为申诉状态
                                    results.save(null, {
                                        success: function (msg) {

                                            Base.linkToPath("/appealsuccess")
                                            console.log("修改审核状态", msg);
                                        }
                                    });
                                    
                                },
                                error: function (error) {
                                    console.log(error);
                                }
                            });
                        

                        },
                        error: function (error) {
                            console.log(err.message);
                        }
                    });
                    console.log("申诉提交信息", data);
                },
                error: function (error) {
                    console.log(error);
                }
            });

        }
    },
    input(key, e) {
        this.setState({ [key]: e.target.value })

    },
    validEmail(val) {
        //邮箱正则表达式
        var myReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        var val;
        if (val.length === 0) {
            return { valid: false, text: "*邮箱不能为空" };
        }
        if (!myReg.test(val)) {
            return { valid: false, text: "*邮箱格式不正确" };
        }
        return { valid: true };

    },
    isButtonDisable() {
        var emailInfo = this.validEmail(this.state.email);
        return this.state.user_name == "" || this.state.reason == "" || emailInfo.valid === false || !this.state.tid
    },
    preventDefault(e) {
        e.preventDefault()
    },
    render() {
        var emailInfo = this.validEmail(this.state.email)
        var emailClass = classnames({
            tips: true,
            hide: emailInfo.valid === true
        })
        var userClass = classnames({
            tips: true,
            hide: this.state.user_name != ""
        })
        var reasonClass = classnames({
            tips: true,
            hide: this.state.reason != ""
        })
        var buttonClass = classnames({
            disabled: this.isButtonDisable()
        })
        return (
            <div className="appeal">
                <AppealHeader />
                <div className="content-wrapper">
                    <form onSubmit={this.preventDefault}>
                        <h1>联系ME审核团队</h1>
                        <div className="input-line">
                            <label>申请事项：</label>
                            <select onChange={this.changeDisplayState} defaultValue="1">
                                <option value="1">作品发布审核被拒申诉</option>
                            </select>
                        </div>
                        <legend>申请人信息</legend>
                        <div className="input-line">
                            <label>申请人：</label>
                            <input type="text" value={this.state.user_name} onChange={this.input.bind(this, "user_name")} />
                            <div className={userClass}>*申请人不能为空</div>
                        </div>
                        <div className="input-line">
                            <label>邮箱：</label>
                            <input type="text" value={this.state.email} placeholder="申诉进度将通过邮箱反馈给你" onChange={this.input.bind(this, "email")} />
                            <div className={emailClass}>{emailInfo.text}</div>
                        </div>
                        <legend>申请作品内容</legend>
                        <div className="input-line">
                            <label>作品名称：</label>
                            <input type="text" defaultValue={this.state.name} disabled />
                        </div>
                        <div className="input-line">
                            <label>创建时间：</label>
                            <input type="text" defaultValue={this.state.createdAt} disabled />
                        </div>
                        <legend>申请原因</legend>
                        <div className="reason">
                            <textarea value={this.state.reason} onChange={this.input.bind(this, "reason")}></textarea>
                            <div className={reasonClass}>*申请原因不能为空</div>
                        </div>

                        <button onClick={this.submit} className={buttonClass}>提交</button>
                    </form>
                </div>
                <Footer />
            </div>
        );
    }
});



module.exports = Appeal;