/**
 * @description 举报组件
 * @time 2015-9-14
 * @author 曾文彬
*/

'use strict';

// require core module
var React = require('react'),
    ReactDOM=require("react-dom"),
    Base = require('../../utils/Base.js');

// require css module
var ReportCSS = require('../../../assets/css/report');

// define Report component
var Report = React.createClass({

    defineInfo() {
        return {
            success: '举报已提交，我们会尽快处理您的信息！',
            error: '举报失败，请重新提交！'
        }
    },

    handleSubmit() {
        var state = this.state,
            props = this.props;

        var isRequired = state.isRequired,
            isMaxlengthed = state.isMaxlengthed;

        if (!isRequired || !isMaxlengthed) {
            props.showDialogFn && props.showDialogFn(!isRequired ? props.requiredError : props.maxlengthedError);
            return;
        } 

        this.submit(this.content());
    },

    handleCancel() {
        this.setState({
            status: false
        });

        this.props.cancelFn && this.props.cancelFn();
    },

    handleChange(event) {
        var regular = this.validator(event.target.value);

        this.setState({
            isRequired: regular.isRequired,
            isMaxlengthed: regular.isMaxlengthed
        });
    },

    handleExit() {
        this.setState({
            status: false,
            resultReportState: false
        });

        this.props.cancelFn && this.props.cancelFn();
        this.content('');
    },

    content(value) {
        var node = ReactDOM.findDOMNode(this.refs.content);

        return value === void 0 ? node.value : (node.value = value);
    },

    submit(feedbackContent) {
        var context = this;

        var feedback = fmaobj.feedback.create();
        feedback.set("fbtype", 1);
        feedback.set("context", '举报了ID为：' + Base.getParam(location.pathname, 'tid') + ',的模版; 举报内容为:' + feedbackContent);
        feedback.save(null, {
            success(_data) {
                context.setState({
                    resultReportState: true,
                    reportResult: 'success'
                });
            },
            error(_data, _error) {
                context.setState({
                    resultReportState: true,
                    reportResult: 'error'
                });  
            }
        });
    },

    validator(value) {
        var requiredRegular = this.props.required,
            maxlengthedRegular = this.props.maxlengthed;

        return {
            isRequired: requiredRegular.test(value),
            isMaxlengthed: maxlengthedRegular.test(value) 
        };
    },

    getDefaultProps() {
        return {
            required: /^.+$/,
            requiredError: '请输入举报理由',
            maxlengthed: /^.{1,50}$/,
            maxlengthedError: '输入的内容不要超过50个字'
        }
    },

    getInitialState() {
        return {
            isRequired: false,
            status: false,
            resultReportState: false,
            reportResult: 'success'
        }
    },

    render() {
        return (
            <div className="report" data-animation={this.state.status ? "ed" : ""}>
                {/* 举报完成弹出层 */}
                <div className="report-result" style={{display: this.state.resultReportState ? 'block' : 'none'}}>
                    <i>{this.defineInfo()[this.state.reportResult]}</i>
                    <a href="javascript:;" onClick={this.handleExit} className="btn">好&nbsp;的</a>
                </div>

                <h3>举报事由</h3>
                <textarea ref="content" placeholder="请输入举报理由" onChange={this.handleChange}></textarea>
                <a href="javascript:;" onClick={this.handleCancel} className="btn">取&nbsp;消</a>
                <a href="javascript:;" onClick={this.handleSubmit} className="btn btn-send">提&nbsp;交</a>
            </div>
        );
    }
});

// export Report component
module.exports = Report;