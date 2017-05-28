/**
 * @name 微信登录组件
 * @author Nick
 * @datetime 2015-10-15
 */
var React = require('react');
var Base = require('../../utils/Base');

var Login = React.createClass({

    componentDidMount: function () {
        //新微信登录接口 add by Mr xu 2017/5/11
        let _self = this;
        let _appID= 'wxaa846f77ece37b87',_scope = 'snsapi_login',_state='pc';
        let code = this._GetRequest()["code"];
        if (!code){
            window.location.href = "http://www.agoodme.com/api/get-weixin-code.html?appid="+_appID+
                "&scope="+_scope+"&state="+_state+
                "&redirect="+encodeURIComponent(window.location.href);
            return;
        }
        $.post("http://www.agoodme.com/api/index.php?act=weixin_login", {
            code: code
        }, function (obj) {
            if(typeof obj.openid !== 'undefined'){
                var unionid = obj.unionid;
                var nickname = obj.nickname;
                var sexual = obj.sex;
                var headimgurl = obj.headimgurl;
                //检查用户账号是否被冻结
                _self._userCheck(unionid,function () {
                    debugger;
                    //检索对象
                    var User = fmacloud.Object.extend("_User");
                    var query = new fmacloud.Query(User);
                    query.equalTo("username", unionid);
                    query.find({
                    success: function (user) {
                        if (user.length > 0) {
                            //用户存在则登陆绑定
                            fmacloud.User.logIn(unionid, "6a063e705a16e625", {
                                success: function (_user) {
                                    console.log("wxLogin success!");
                                    Base.linkToPath("/user");
                                },
                                error: function (_user, error) {
                                    console.log(error.message);
                                }
                            })
                        } else {
                            //用户不存在则注册
                            var user = new fmacloud.User();
                            user.set("username", unionid);
                            user.set("password", "6a063e705a16e625"); //me第三方登录
                            user.set('user_nick', nickname);
                            user.set("user_pic", headimgurl);
                            user.set("register_third", 2);
                            user.set("sex", sexual);
                            user.set("regist_source", 1);
                            user.signUp(null, {
                                success: function (user) {
                                    //注册成功则登陆
                                    fmacloud.User.logIn(unionid, "6a063e705a16e625", {
                                        success: function () {
                                            console.log("wxLogin success!");
                                            Base.linkToPath("/user");
                                        },
                                        error: function (user, error) {
                                            console.log(error.message);
                                        }
                                    })
                                },
                                error: function (user, error) {
                                    console.log(error.message);
                                }
                            })
                        }
                    },
                    error: function (error) {
                        console.log(error.message);
                        alert("登录失败！");
                        Base.linkToPath("/login");
                    }
                    });
                })
            }
        }, "json");
        //旧的登录接口
        // fmacloud.Cloud.run('getOauthDataWX', { code: GetRequest().code }, {
        //     success: function (data) {
        //         debugger;
        //         if (data.data != "") {
        //             data.data =JSON.parse(data.data);
        //
        //             //alert("微信登录成功！");
        //             var unionid = data.data.unionid;
        //             var nickname = data.data.nickname;
        //             var sexual = data.data.sex;
        //             var headimgurl = data.data.headimgurl;
        //             //检索对象
        //             var User = fmacloud.Object.extend("_User");
        //             var query = new fmacloud.Query(User);
        //             query.equalTo("username", unionid);
        //             query.find({
        //                 success: function (user) {
        //                     if (user.length > 0) {
        //                         //用户存在则登陆绑定
        //                         fmacloud.User.logIn(unionid, "6a063e705a16e625", {
        //                             success: function (_user) {
        //                                 console.log("wxLogin success!");
        //                                 Base.linkToPath("/user");
        //                             },
        //                             error: function (_user, error) {
        //                                 console.log(error.message);
        //                             }
        //                         })
        //                     } else {
        //                         //用户不存在则注册
        //                         var user = new fmacloud.User();
        //                         user.set("username", unionid);
        //                         user.set("password", "6a063e705a16e625"); //me第三方登录
        //                         user.set('user_nick', nickname);
        //                         user.set("user_pic", headimgurl);
        //                         user.set("register_third", 2);
        //                         user.set("sex", sexual);
        //                         user.set("regist_source", 1);
        //                         user.signUp(null, {
        //                             success: function (user) {
        //                                 //注册成功则登陆
        //                                 fmacloud.User.logIn(unionid, "6a063e705a16e625", {
        //                                     success: function () {
        //                                         console.log("wxLogin success!");
        //                                         Base.linkToPath("/user");
        //                                     },
        //                                     error: function (user, error) {
        //                                         console.log(error.message);
        //                                     }
        //                                 })
        //                             },
        //                             error: function (user, error) {
        //                                 console.log(error.message);
        //                             }
        //                         })
        //                     }
        //                 },
        //                 error: function (error) {
        //                     console.log(error.message);
        //                 }
        //             });
        //         }
        //
        //             console.log(data.data);
        //         // document.getElementById("info").innerHTML = data.data;
        //         //var platform = getParam(location.href, 'platform');
        //         //loginuser(afreshPackageData(obj, platform));
        //     },
        //     error: function (err) {
        //        alert("登录失败！");
        //         Base.linkToPath("/login");
        //         console.log(err.message);
        //     }
        // });

        // $.ajax({
        //     type: "POST",
        //     url: 'mepcviews/weixin_true.php?act=user_info',
        //     cache: false,
        //     dataType: 'json',
        //     success: function (data) {
        //         if (data.status != null) {
        //             //alert("微信登录成功！");
        //             var unionid = data.data.unionid;
        //             var nickname = data.data.nickname;
        //             var sexual = data.data.sex;
        //             var headimgurl = data.data.headimgurl;
        //             //检索对象
        //             var User = fmacloud.Object.extend("_User");
        //             var query = new fmacloud.Query(User);
        //             query.equalTo("username", unionid);
        //             query.find({
        //                 success: function (user) {
        //                     if (user.length > 0) {
        //                         //用户存在则登陆绑定
        //                         fmacloud.User.logIn(unionid, "6a063e705a16e625", {
        //                             success: function (_user) {
        //                                 console.log("wxLogin success!");
        //                                 Base.linkToPath("/user");
        //                             },
        //                             error: function (_user, error) {
        //                                 console.log(error.message);
        //                             }
        //                         })
        //                     } else {
        //                         //用户不存在则注册
        //                         var user = new fmacloud.User();
        //                         user.set("username", unionid);
        //                         user.set("password", "6a063e705a16e625"); //me第三方登录
        //                         user.set('user_nick', nickname);
        //                         user.set("user_pic", headimgurl);
        //                         user.set("register_third", 2);
        //                         user.set("sex", sexual);
        //                         user.set("regist_source", 1);
        //                         user.signUp(null, {
        //                             success: function (user) {
        //                                 //注册成功则登陆
        //                                 fmacloud.User.logIn(unionid, "6a063e705a16e625", {
        //                                     success: function () {
        //                                         console.log("wxLogin success!");
        //                                         Base.linkToPath("/user");
        //                                     },
        //                                     error: function (user, error) {
        //                                         console.log(error.message);
        //                                     }
        //                                 })
        //                             },
        //                             error: function (user, error) {
        //                                 console.log(error.message);
        //                             }
        //                         })
        //                     }
        //                 },
        //                 error: function (error) {
        //                     console.log(error.message);
        //                 }
        //             });

        //         }
        //     },
        //     error: function (e) {
        //         alert("登录失败！");
        //         Base.linkToPath("/login");
        //         console.log(e);
        //     }
        // });

    },
    _GetRequest : function () {
        let url = location.search,theRequest = {}; //获取url中"?"符后的字串
        if (url.indexOf("?") != -1) {  //从"?"开始获取字符串不等于-1
            let str = url.substr(1);    //获取"?"号从1的位置开始后面的字符串赋值给str
            let arr = str.split("&");  //把获取到的字符串进行数组分割每一个"&"之后都成为一个数组赋值给arr
            for (let i = 0; i < arr.length; i++) {     //循环数组长度
                theRequest[arr[i].split("=")[0]] = unescape(arr[i].split("=")[1]);    //解码字符串arr[i]从中分割“=”的第一个数组赋值给theRequest变量
            }
        }
        return theRequest;//getData
    },
    _userCheck : function (unionid,callback) {
        //调用接口判断用户信息
        fmacloud.Cloud.run('userCheck',{'val':unionid,'type':'login'},{
            success:function(data){
                debugger;
                if(data.status){
                    let str;
                    if(data.end){
                        let time=Base.formattime(data.end,"yyyy-MM-dd HH:mm:ss");
                        str="该账户已被冻结，冻结截止时间:"+time+"。"
                            +"\n如有问题请联系客服。";
                    }else{
                        str="该账号已被永久冻结。";
                    }
                    alert(str);
                    window.location.href = 'http://www.agoodme.com/login';
                    return;
                }
                callback.call(this);
            },
            error:function(err){
                console.error(err.message);
                return;
            }
        });
    },

    render: function () {

        return (
            <div></div>
        )

    }
});

// define Login component
module.exports = Login;
