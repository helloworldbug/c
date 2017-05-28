/**
 * @description 授权管理
 * @time 2016-06-28
 * @author yangjian
 */

'use strict';

// require core module
var React = require('react'),
    ContextUtils = require('../../../utils/ContextUtils'),
    MakeWebAPIUtils = require('../../../utils/MakeWebAPIUtils'),
    serverurl = require('../../../../app/config/serverurl');

var AuthSuccess = React.createClass({

    /**
     * 初始化状态
    */
    getInitialState: function () {
        return {
            isSucess: false, //还未成功
            type: '', //分类
            isFail: false, //授权失败（新浪）
            wbAuthUrl: '' //微博授权地址， 失败时使用
        }
    },

    render: function () {
        var box = this.state.isFail ? (
            <div className="box">
                <h3>授权失败</h3>
                <div className="con">
                    <i className="fail"></i>
                    <p>{!!this.state.wbAuthUrl ? <a href={this.state.wbAuthUrl}>重新授权</a> : null } </p>
                </div>
            </div>
        ) : (this.state.isSucess ? (
            <div className="box">
            <h3>授权成功</h3>
            <div className="con">
                <i></i>
                <p>你的{this.state.type}授权成功</p>
                <p>关闭该窗口后即可新建图文信息</p>
            </div>
        </div>
        ) : (
            <div className="box">
                <h3>数据加载中</h3>
                <div className="con">
                    <i className="load"></i>
                    <p>你的{this.state.type}数据加载中</p>
                    <p>现在关闭窗口后或导致授权失败</p>
                </div>
            </div>
        ));
        return (
            <div className="auth-success">
                <div className="title">
                    <div className="logo"></div>
                </div>
                {box}
            </div>
        )
    },

    componentDidMount: function() {
        this.getAuthCode();
    },

    /**
     * 获取auth_code
     */
    getAuthCode: function() {
        var _this = this;
        var authCode = this.getQueryString('auth_code'); //获取url中auth_code数据 微信
        var code = this.getQueryString('code'); //获取url中auth_code数据 微博
        var type = this.getQueryString('type'); //
        var errorCode = this.getQueryString("error_code"); //微博授权取消时返回

        var data;
        switch (type){
            case "wx":
                data = '{"AuthorizationCode":"'+authCode+'"}';
                _this.setState({
                    type: "微信公众号"
                });
                break;
            case "wb":
                data = '{"AuthorizationCode":"'+code+'","RedirectUri":"' + location.origin + '"}';
                _this.setState({
                    type: "新浪微博帐号"
                });
                if(!!errorCode){ //判断是否存在 error_code， 存在则授权失败
                    _this.setState({
                        isFail: true
                    });
                    var url = serverurl.push + "/wb/oauthurl";
                    $.get(url, function (result) {
                        var callback;
                        callback = result + location.origin+"/push/" + type + "callback.html";
                        //通过fmawr的值决定回调地址
                        // if(window.fmawr === "0"){
                        //     callback = result + "http://test.agoodme.com/push/" + type + "callback.html";
                        // }else {
                        //     callback = result + "http://www.agoodme.com/push/" + type + "callback.html";
                        // }

                        _this.setState({
                            wbAuthUrl: callback
                        });

                    })
                }

                break;
        }

        if(authCode || code){
            var url = serverurl.push + "/" + type + "/queryauth";
            $.ajax({
                type: 'POST',
                url: url,
                data: data,
                success: function(result){
                    var authInfo = {};
                    switch (type) {
                        case "wx" :
                            var authorizationInfo = result["authorization_info"],
                                funcInfo = authorizationInfo["func_info"] || {},
                                scopes = [];

                            for(var i = 0, l = funcInfo.length; i < l; i++) {
                                var funcscopeCategory = funcInfo[i]["funcscope_category"];
                                scopes.push(funcscopeCategory.id);
                            }

                            authInfo.openid = authorizationInfo.authorizer_appid;
                            authInfo.plantfom = "weixin";
                            authInfo.expires = authorizationInfo.expires_in;
                            authInfo.access_token = authorizationInfo.authorizer_access_token;
                            authInfo.refresh_token = authorizationInfo.authorizer_refresh_token;
                            authInfo.scopes = scopes.toString();
                            break;

                        case "wb" :
                            authInfo.plantfom = "weibo";
                            authInfo.openid = result.uid;
                            authInfo.expires = result.expires_in;
                            authInfo.access_token = result.access_token;
                            break;
                    }

                    if(!authInfo.access_token) {
                        console.log('access_token error..');
                        return;
                    }

                    //授权新帐号
                    var userid = ContextUtils.getCurrentUser().id;
                    _this.wxAuthorizer(userid, authInfo);
                },
                dataType: 'json'
            });

        }
    },

    /**
     * 授权新账号
     */
    wxAuthorizer: function(userid, authInfo) {
        var _this = this;
        var url = "/v1/sm/user/"+ userid +"/account?access_token=";
        var RESTfulData = {
            type: 'POST',
            url: url,
            data: JSON.stringify(authInfo),
            success: function(result){
                console.log(result);
                console.log("success");
                _this.setState({
                    isSucess: true
                });
            },
            'contentType': 'application/json'
        };

        MakeWebAPIUtils.getRESTfulData(RESTfulData);
    },

    /**
     * 获取url参数值
     */
    getQueryString: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var urlParam = location.search.split('?')[1];
        if(!urlParam) { return; }
        var r = urlParam.match(reg);
        if (r){
            return unescape(r[2]);
        }else {
            return null;
        }
    },


});

module.exports = AuthSuccess;