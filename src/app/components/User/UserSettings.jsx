/**
 * @description 个人中心设置
 * @time 2015-10-21
 * @author 刘华
*/

'use strict';

// require core module
var React = require('react'),
    ReactDOM = require("react-dom"),
    MePC = require('../../lib/MePC_Public');

var ImageModules = require('../Mixins/ImageModules');
var Base = require('../../utils/Base');
var Images = require('../Common/Image');
var Dialog = require('../Common/Dialog');

var DesignerTribeLabel = require('../DesignerTribe/DesignerTribeLabel'),
    UserLabels = require('../User/UserLabels'),
    DesignerWork = require('../Designer/DesignerWork');

var $ = require('jquery');

require('../../lib/distpicker.data.js');
require('../../lib/distpicker.js');

// require common mixins
var ImageModules = require('../Mixins/ImageModules');
var GlobalFunc = require('../Common/GlobalFunc');

var setting = React.createClass({

    mixins: [ImageModules],

    getInitialState() {
        return {
            status: true,
            user_pic: Base.isLogin() && this.operaUserPhoto(),
            userNick: Base.getUserInfo('user_nick'),
            userNickState: Base.getUserInfo('user_nick'),
            userSignState: Base.getUserInfo('user_sign'),
            userQq: Base.getUserInfo('qq'),
            userTel: Base.getUserInfo('vipphone'),
            userEmail: Base.getUserInfo('email'),
            sex: Base.getUserInfo('sex') === '' ? 1 : Base.getUserInfo('sex'),
            enterpriseMobile: Base.getUserInfo('enterprise_mobile') || '',
            enterpriseEmail: Base.getUserInfo("enterprise_email") || '',        //Department position  //work start time  work end time
            enterpriseName: Base.getUserInfo('enterprise_name') || '',
            province: Base.getUserInfo('province'),
            city: Base.getUserInfo('city'),
            industry: Base.getUserInfo('industry'),
            user_zone_bgimg: Base.getUserInfo('user_zone_bgimg'),
            departmentPosition: Base.getUserInfo('department_position'),    //部门职位
            workStartTime: Base.getUserInfo('work_start_time'),     //工作起始时间
            workEndTime: Base.getUserInfo('work_end_time'),         //工作结束时间
            isRename: false,
            isVisibleMsgEdit: false,
            isVisibleContactEdit: false,
            isVisibleChooseLabel: false,
            verifycodeDisabled: false,
            verifyText: '获取验证码',
            tips: '',
            showTips: false,
            editUserInfo: false,  //编辑资料
            editPwd: false,  //修改密码
            editDesigner: false, //修改设计师信息
            showCity: false,
            cannotEdit: true,
            editUserCareer: false  //编辑职业信息
        }
    },

    getDefaultProps() {
        return {
            requiredError: '昵称的长度在1-10个字符'
        }
    },

    defineInfo() {
        return {
            originalWidth: 300,
            originalHeight: 300,
            qqExp: /^\d.*?$/,
            telExp: /^1[1-9]\d{9}$/,
            verifyExp: /^.+$/,
            emailExp: /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/
        }
    },

    //修改头像
    handleUploadProfilePhoto() {
        $(ReactDOM.findDOMNode(this.refs.file)).trigger('click');
    },

    handleChangePhoto(e) {
        Base.uploadUserPhoto(e.target.files[0],
            (_userPhoto => {
                var photoPath;
                //判断上传的图片是否为gif
                if (GlobalFunc.isGif(_userPhoto.get('url'))) {
                    photoPath = _userPhoto.get('url');
                } else {
                    photoPath = _userPhoto.thumbnailURL(this.defineInfo().originalWidth, this.defineInfo().originalHeight);
                }
                // 保存
                this.operaUserPhoto(photoPath);
            }).bind(this),

            (_error => {
                alert('上传失败');
            }).bind(this)
        );
    },

    operaUserPhoto(photoPath) {
        if (!photoPath) return Base.getUserInfo('user_pic') || Base.buildDefaultUserLogo(this.defineImageModules().defaultUserLogo);

        // change state user_pic
        this.setState({
            user_pic: photoPath
        });

        $(".header-ri .end-sign img:nth-child(1)").attr("src", photoPath);

        // upload user photo
        Base.asyncByPromise.call(this, (resolve, reject) => {
            Base.tableDataSelect('_User', 'objectId', Base.getCurrentUser().id,
                () => {
                    // 保存用户头像
                    Base.setUserInfo('user_pic', photoPath);
                    resolve();
                }
            );
        }).then(
            () => {
                Base.asyncByPromise.call(null, (resolve, reject) => {
                    Base.tableDataSelect('tplobj', 'author', Base.getCurrentUser().id, resolve, reject);
                });
            }
            ).then(
            _tpls => {
                (_tpls && _tpls.length > 0) && _tpls.forEach(_tpl => {
                    _tpl.set('author_img', photoPath);
                    _tpl.save(null, Base.callerStopByCount(_tpls.length,
                        () => {
                            alert('上传头像成功');
                        }
                    ));
                });
            },
            () => {
                alert('上传失败');
            }
            );
    },

    //修改设计师主页背景图片
    handleUploadPageBgPhoto() {
        $(ReactDOM.findDOMNode(this.refs.pageBg)).trigger('click');
    },

    handlePageBgChangePhoto(e) {
        Base.uploadUserPhoto(e.target.files[0],
            (_userPhoto => {
                var photoPath = _userPhoto.thumbnailURL(1408, 318);

                // 保存
                this.operaUserPageBgPhoto(photoPath);
            }).bind(this),

            (_error => {
                alert('上传失败');
            }).bind(this)
        );
    },

    /**
     * 默认设计师中心背景
    */
    buildDefaultPageBg(userModule) {
        var pageBgPic = this.getCurrentUser().attributes.user_zone_bgimg, bgPic;

        if (!pageBgPic) return userModule;

        bgPic = pageBgPic.indexOf('http:') >= 0 ? pageBgPic : userModule;

        return bgPic;
    },

    operaUserPageBgPhoto(photoPath) {
        if (!photoPath) return Base.getUserInfo('user_zone_bgimg') || Base.buildDefaultPageBg(this.defineImageModules().defaultPageBgPic);

        // change state user_pic
        this.setState({
            user_zone_bgimg: photoPath
        });

        $(".designer-page-bg img").attr("src", photoPath);

        // upload user photo
        Base.asyncByPromise.call(this, (resolve, reject) => {
            Base.tableDataSelect('_User', 'objectId', Base.getCurrentUser().id,
                () => {
                    // 保存用户头像
                    Base.setUserInfo('user_zone_bgimg', photoPath);
                    resolve();
                }
            );
        });
    },

    //修改昵称
    handleFinish() {
        if (this.checkInputNull()) {
            this.showDialog({
                title: '昵称的长度在1-15个字符',
                appearanceState: true,
                sureIsHide: true
            });

            return;
        }

        this.update();
    },

    checkInputNull() {
        var value = ReactDOM.findDOMNode(this.refs.username).value;

        return value == '' || value.length <= 0 || value.length > 15;
    },

    //校验昵称
    checkNickName: function () {
        var userNick = ReactDOM.findDOMNode(this.refs.username);
        var value = userNick.value;
        if (value == '' || value.length <= 0 || value.length > 15) {
            userNick.value = value.substring(0, 15);
            $(userNick).next(".err").html("*昵称的长度在1-15个字符");
            return;
        } else {
            $(userNick).next(".err").html("");
        }
    },

    //校验签名
    checkUserSign: function () {
        var userSign = ReactDOM.findDOMNode(this.refs.token);
        var value = userSign.value;
        if (value.length > 20) {
            userSign.value = value.substring(0, 20);
            $(userSign).next(".err").html("*签名的长度在1-20个字符");
            return;
        } else {
            $(userSign).next(".err").html("");
        }
    },

    //校验企业名称
    checkEnterpriseName: function () {
        var enterpriseName = ReactDOM.findDOMNode(this.refs.enterpriseName);
        var value = enterpriseName.value;
        if (value.length > 30) {
            enterpriseName.value = value.substring(0, 30);
            $(enterpriseName).next(".err").html("*企业名称不超出30字符");
            return;
        } else {
            $(enterpriseName).next(".err").html("");
        }
    },

    //校验手机号码
    checkTel: function () {
        var tel = ReactDOM.findDOMNode(this.refs.enterpriseMobile);
        var value = tel.value;

        if (this.defineInfo().telExp.test(value) || value === '') {
            $(tel).next(".err").html("");
        } else {
            $(tel).next(".err").html("*手机格式不正确");
            return;
        }
    },

    noError: function (e) {
        $(e.target).next('.err').html('');
    },

    //校验Email
    checkEmail: function () {
        var email = ReactDOM.findDOMNode(this.refs.enterpriseEmail);
        var value = email.value;
        if (this.defineInfo().emailExp.test(value) || value === '') {
            $(email).next(".err").html("");
        } else {
            $(email).next(".err").html("*邮箱格式不正确");
            return;
        }
    },

    checkSignNull() {
        var value = ReactDOM.findDOMNode(this.refs.token).value;
        return value.length > 20;
    },

    showDialog(states) {
        this.refs.dialog.setState(states);
    },

    update() {
        var success = Base.setUserInfo('user_nick', ReactDOM.findDOMNode(this.refs.nickValue).value);

        if (success) {
            var _this = this;
            $(ReactDOM.findDOMNode(this.refs.successMess)).fadeIn("slow");
            setTimeout(function () {
                $(ReactDOM.findDOMNode(_this.refs.successMess)).fadeOut("slow");
            }, 3000);
            this.setState({
                isRename: false
            });
            return;
        }

        if (!success) {
            this.showDialog({
                title: '修改昵称失败，请重新修改',
                appearanceState: true,
                sureIsHide: true
            });
        }
    },

    changeNick() {
        this.setState({
            userNick: ReactDOM.findDOMNode(this.refs.nickValue).value
        });
    },

    buildDialog(options) {
        return <Dialog ref="dialog" {...options} hash="/login" />
    },

    triggerSubmit(event) {
        if (event.which == 13) {
            $(".SettingSubmit").trigger("click");
            $(ReactDOM.findDOMNode(this.refs.nickValue)).blur();
        }
    },

    showRename() {
        this.setState({
            isRename: true
        }, function () {
            ReactDOM.findDOMNode(this.refs.nickValue).focus();
            ReactDOM.findDOMNode(this.refs.nickValue).value = this.state.userNick;
        });
    },

    setElementValue(ref, key, value) {
        var element = ReactDOM.findDOMNode(this.refs[ref]),
            value = value || '';

        if (MePC.isType(ref, 'object')) {
            MePC.each(ref, (function (_value, _ref) {
                this.setElementValue(_ref.split(' ')[0], _ref.split(' ')[1], _value);
            }).bind(this));
        } else {
            element[key] = value;
        }
    },

    handleEdit(key, signs) {
        var context = this;

        return function (e) {

            context.setState({
                [key]: !context.state[key]
            });

            if (MePC.isType(signs, 'string')) {
                context.setState({
                    userNickState: Base.getUserInfo('user_nick'),
                    userSignState: Base.getUserInfo('user_sign')
                }, function () {
                    context.setElementValue({
                        [signs.split(' ')[0] + 'value']: context.state.userSign,
                        [signs.split(' ')[1] + 'value']: context.state.userNick
                    });
                });
            } else if (MePC.isType(signs, 'array')) {
                context.setState({
                    userQq: Base.getUserInfo('qq'),
                    userTel: Base.getUserInfo('vipphone'),
                    userEmail: Base.getUserInfo('email')
                });
                MePC.each(signs, function (_value, _index, _array) {
                    context.setState({
                        [_value + 'State']: void 0
                    });

                    if (_index === _array.length - 1) {

                        context.setState({
                            verifyText: '获取验证码',
                            [_value]: false
                        });

                        clearInterval(context.timer);
                    } else {

                        if (_value === 'verify') {
                            context.setElementValue(_value, 'value');
                        } else {
                            context.setElementValue(_value, 'value', context.state['user' + Base.upperFirst(_value)]);
                        }
                    }
                });
            }
        }
    },

    handleMsgSubmit() {
        var sex, usersign, username, enterpriseMobile;
        var _this = this;

        var tel = ReactDOM.findDOMNode(this.refs.enterpriseMobile);

        usersign = ReactDOM.findDOMNode(this.refs.token).value;
        username = ReactDOM.findDOMNode(this.refs.username).value;
        enterpriseMobile = tel.value;

        if (this.defineInfo().telExp.test(enterpriseMobile) || enterpriseMobile === '') {
            $(tel).next(".err").html("");
        } else {
            $(tel).next(".err").html("*手机格式不正确");
            return;
        }

        //保存信息
        var addSuccess = Base.setUserInfo({
            sex: parseInt(_this.state.sex),
            user_nick: username,
            user_sign: usersign,
            enterprise_mobile: enterpriseMobile,
            province: _this.state.province,
            city: _this.state.city
        });

        if (addSuccess) {
            _this.setState({
                showTips: true,
                tips: "保存资料成功",
                cannotEdit: false //编辑保存按钮不可用
            });

            Base.delayExec(() => {
                _this.setState({ tips: '', showTips: false });
            }, 2000);

            //GlobalFunc.addSmallTips("保存成功", 2, null);
        } else {
            _this.setState({
                showTips: true,
                tips: "保存资料失败"
            });

            Base.delayExec(() => {
                _this.setState({ tips: '', showTips: false });
            }, 2000);
        }
    },
    /**
     * 提交职业信息 add by tony 2016-11-30
     */
    handleCareerSubmit() {
        var  enterpriseName, enterpriseEmail;
        var _this = this;
        var email = ReactDOM.findDOMNode(this.refs.enterpriseEmail);
        enterpriseName = ReactDOM.findDOMNode(this.refs.enterpriseName).value;
        enterpriseEmail = email.value;

        if (this.defineInfo().emailExp.test(enterpriseEmail) || enterpriseEmail === '') {
            $(email).next(".err").html("");
        } else {
            $(email).next(".err").html("*邮箱格式不正确");
            return;
        }

        //保存信息
        var addSuccess = Base.setUserInfo({
            enterprise_name: enterpriseName,
            enterprise_email: enterpriseEmail,
            industry: _this.state.industry,
            department_position: _this.state.departmentPosition,
            work_start_time: _this.state.workStartTime,
            work_end_time: _this.state.workEndTime
        });

        if (addSuccess) {
            _this.setState({
                showTips: true,
                tips: "保存资料成功",
                cannotEdit: false //编辑保存按钮不可用
            });

            Base.delayExec(() => {
                _this.setState({ tips: '', showTips: false });
            }, 2000);

            //GlobalFunc.addSmallTips("保存成功", 2, null);
        } else {
            _this.setState({
                showTips: true,
                tips: "保存资料失败"
            });

            Base.delayExec(() => {
                _this.setState({ tips: '', showTips: false });
            }, 2000);
        }
    },
    /**
     * 校验部门职位 
     */
    checkDepartmentPosition() {
        var departmentPosition = ReactDOM.findDOMNode(this.refs.departmentPosition);
        var value = departmentPosition.value;
        if (value.length > 30) {
            departmentPosition.value = value.substring(0, 30);
            $(departmentPosition).next(".err").html("*企业名称不超出30字符");
            return;
        } else {
            $(departmentPosition).next(".err").html("");
        }
    },

    /**
     * 校验部门职位 
     */
    checkWorkStartTime() {
        var currentDate = new Date();
        var workStartTime = ReactDOM.findDOMNode(this.refs.workStartTime);
        var value = workStartTime.value;
        var startDate = new Date(value);
        if (startDate.getFullYear() > currentDate.getFullYear() || 
        (startDate.getFullYear() ==  currentDate.getFullYear() && startDate.getMonth() > currentDate.getMonth()) ) {
            workStartTime.value = currentDate.getFullYear() + "-"+ (currentDate.getMonth() + 1);
            $(workStartTime).siblings(".err")[0].innerHTML = "*工作起始时间不能大于当前的时间";
            return;
        } else {
            $(workStartTime).siblings(".err")[0].innerHTML = "";
        }
    },

    /**
     * 校验部门职位 
     */
    checkWorkEndTime() {
        var currentDate = new Date();
        var workStartTime = ReactDOM.findDOMNode(this.refs.workStartTime);
        var workEndTime = ReactDOM.findDOMNode(this.refs.workEndTime);
        var startValue = workStartTime.value;
        var startDate = new Date(startValue);
        var endValue = workEndTime.value;
        var endDate = new Date(endValue);
        if (endDate.getFullYear() > currentDate.getFullYear() || 
        (endDate.getFullYear() ==  currentDate.getFullYear() && endDate.getMonth() > currentDate.getMonth()) ) {
            workEndTime.value = currentDate.getFullYear() + "-"+ (currentDate.getMonth() + 1);
            $(workEndTime).siblings(".err")[0].innerHTML = "*工作结束时间不能大于当前的时间";
            return;
        }else if (startDate.getFullYear() > endDate.getFullYear() || 
        (endDate.getFullYear() ==  startDate.getFullYear() && startDate.getMonth() > endDate.getMonth()) ) {
            workEndTime.value = currentDate.getFullYear() + "-"+ (currentDate.getMonth() + 1);
            $(workEndTime).siblings(".err")[0].innerHTML = "*工作结束时间不能小于起始时间";
            return;
        } else {
            $(workEndTime).siblings(".err")[0].innerHTML = "";
        }
    },

    changeState(state, e) {
        //ReactDOM.findDOMNode(this.refs.enterpriseEmail);
        var province = ReactDOM.findDOMNode(this.refs.province),
            city = ReactDOM.findDOMNode(this.refs.city);

        switch (state) {
            case "userNickState":
                this.checkNickName();
                break;
            case "userSignState":
                this.checkUserSign();
                break;
            case "enterpriseName":
                this.checkEnterpriseName();
                break;
            case "province":
                if (province.value != "保密") {
                    this.setState({
                        showCity: true
                    })
                } else {
                    this.setState({
                        showCity: false
                    })
                }
                break;
            case "departmentPosition":      //检测部门职位
                this.checkDepartmentPosition();
                break;
            case "workStartTime":
                this.checkWorkStartTime();
                break;
            case "workEndTime":
                this.checkWorkEndTime();
                break;

        }

        var obj = {};
        obj.cannotEdit = true;
        var _val = e.target.value;
        
        if(state == "workEndTime"){
           _val =  _val == "" ? "至今" : _val; 
        }
        obj[state] = _val;
        this.setState(obj);
    },

    changeCanEdit: function () {
        this.setState({
            cannotEdit: true
        })
    },

    // 生成基本信息
    generateUserMsg() {
        var userNick = Base.getUserInfo('user_nick');
        var userSign = Base.getUserInfo('user_sign') || '设计师太害羞，什么都没写';

        var btnEdit = (<li className="edit" ><a onClick={this.editBtn.bind(this, "userinfo") } href="javascript:;">编辑</a></li>);

        if (this.state.editUserInfo) {
            btnEdit = this.state.cannotEdit ? (<li><a href="javascript:;" onClick={ this.handleMsgSubmit } >修改</a><a onClick={this.editBtnCancel.bind(this, "editUserInfo") } href="javascript:;">取消</a></li>) : (<li><span>修改</span><span>取消</span></li>);
        }

        var useInfoEdit = this.state.editUserInfo ? (<div className="setup-info clearfix">
            <ul>
                <li className="frist">
                    <label className="title">头像：</label>
                    <span className="user-pic" onClick={ this.handleUploadProfilePhoto } title="点击修改头像"><input type="file" onChange={ this.handleChangePhoto } accept="image/jpeg|image/png" ref="file" /><img src={ this.state.user_pic } width="80" height="80" /></span>
                    <label className="title">性别：</label>
                    <label><input type="radio" ref="sex" value="1" checked={this.state.sex == 1} onChange={this.changeState.bind(this, 'sex') } /> 男</label>
                    <label><input type="radio" ref="sex" value="0" checked={this.state.sex == 0} onChange={this.changeState.bind(this, 'sex') } /> 女</label>
                </li>
                <li>
                    <label className="title">昵称：</label>
                    <input type="text" ref="username" value={ this.state.userNickState } onBlur= {this.checkNickName} onChange={this.changeState.bind(this, 'userNickState') } />
                    <span className="err"></span>
                </li>
                <li>
                    <label className="title">个性签名：</label>
                    <input type="text" placeholder='设计师太害羞，什么都没写' ref="token" onBlur={this.checkUserSign} value={ this.state.userSignState } onChange={this.changeState.bind(this, 'userSignState') } />
                    <span className="err"></span>
                </li>
                <li>
                    <label className="title">电话号码：</label>
                    <input type="text" value={ this.state.enterpriseMobile }  ref="enterpriseMobile" onFocus ={this.noError} onBlur= {this.checkTel} onChange={this.changeState.bind(this, 'enterpriseMobile') }/>
                    <span className="err"></span>
                </li>
                <li>
                    <label className="title">现居：</label>

                    <label id="cityselect" className="cityselect">
                        <select data-province={this.state.province} ref="province" name={this.state.province} onChange={this.changeState.bind(this, 'province') }></select>
                        <select data-city={this.state.city} ref="city" className={this.state.showCity ? '' : 'hide' }  name={this.state.city} onChange={this.changeState.bind(this, 'city') }></select>
                    </label>
                </li>
            </ul>
        </div>) : null;

        return (
            <div className="user-setup">
                <h3 className="title user-setup-title">
                    基本信息
                    <div className="title-btn">
                        <ul>
                            { btnEdit }
                        </ul>
                    </div>
                </h3>

                { useInfoEdit }

                <div className="setup-container clearfix">

                    {/* <div className="setup-info clearfix">
                        <dl>
                            <dt onClick={ this.handleUploadProfilePhoto } title="点击修改头像"><input type="file" onChange={ this.handleChangePhoto } accept="image/jpeg|image/png" ref="file" /><img src={ this.state.user_pic } width="80" height="80" /></dt>
                            <dd>
                                { visibleMsg }

                                { visibleMsgEdit }
                            </dd>
                        </dl></div>
                        */}

                </div>
            </div>
        );
    },


    // 生成职业信息
    generateCareerMsg() {
        var currentDate = new Date();      //获取当前的时间
        var _endTime = this.state.workEndTime == "至今" ? "" : this.state.workEndTime;    //不填时间表示工作到至今
        var _startTime = this.state.workStartTime ? this.state.workStartTime : currentDate.getFullYear() + "-" + (currentDate.getMonth() +1);
        var btnEdit = (<li className="edit" ><a onClick={this.editBtn.bind(this, "userCareer") } href="javascript:;">编辑</a></li>);

        if (this.state.editUserCareer) {
            btnEdit = this.state.cannotEdit ? (<li><a href="javascript:;" onClick={ this.handleCareerSubmit } >修改</a><a onClick={this.editBtnCancel.bind(this, "editUserCareer") } href="javascript:;">取消</a></li>) : (<li><span>修改</span><span>取消</span></li>);
        }

        var useCareerEdit = this.state.editUserCareer ? (<div className="setup-info clearfix">
            <ul>
                <li>
                    <label className="title">企业名称：</label>
                    <input type="text" value={this.state.enterpriseName} ref="enterpriseName"  placeholder="请填写完整的公司名称" 
                    onBlur={this.checkEnterpriseName} onChange={this.changeState.bind(this, 'enterpriseName') } />
                    <span className="err"></span>
                </li>
                <li>
                    <label className="title">部门职位：</label>
                    <input type="text" value={this.state.departmentPosition} ref="departmentPosition"  placeholder="请填写部门或职位"  
                    onBlur={this.checkDepartmentPosition} onChange={this.changeState.bind(this, 'departmentPosition') } />
                    <span className="err"></span>
                </li>
                <li>
                    <label className="title">企业邮箱：</label>
                    <input type="text" value={this.state.enterpriseEmail} ref="enterpriseEmail" onChange={this.changeState.bind(this, 'enterpriseEmail') } onBlur= {this.checkEmail} />
                    <span className="err"></span>
                </li>
                <li>
                    <label className="title">从事行业：</label>
                    <select ref="industry" value={this.state.industry} onChange={this.changeState.bind(this, 'industry') } >
                        <option value="保密">保密</option>
                        <option value="科技">科技</option>
                        <option value="互联网">互联网</option>
                        <option value="自媒体">自媒体</option>
                        <option value="金融">金融</option>
                        <option value="快消品">快消品</option>
                        <option value="电子商务">电子商务</option>
                        <option value="家居家具">家居家具</option>
                        <option value="生活服务">生活服务</option>
                        <option value="汽车">汽车</option>
                        <option value="旅游">旅游</option>
                        <option value="食品">食品</option>
                        <option value="培训">培训</option>
                        <option value="房地产">房地产</option>
                        <option value="非盈利机构">非盈利机构</option>
                        <option value="校园/个人">校园/个人</option>
                        <option value="机械制造">机械制造</option>
                        <option value="其他">其他</option>
                    </select>
                </li>
                <li>
                    <label className="title">工作时间：</label>
                    <input type="month" className="first-date" ref="workStartTime" value={ _startTime } 
                    onBlur= {this.checkWorkStartTime} onChange={this.changeState.bind(this, 'workStartTime') } />
                    <span> ~ </span>
                    <input type="month" ref="workEndTime" value={_endTime}  
                    onBlur= {this.checkWorkEndTime} onChange={this.changeState.bind(this, 'workEndTime') } />
                    <span className="err"></span>
                </li>
            </ul>
        </div>) : null;

        return (
            <div className="user-setup">
                <h3 className="title user-setup-title">
                    职业信息
                    <div className="title-btn">
                        <ul>
                            { btnEdit }
                        </ul>
                    </div>
                </h3>
                { useCareerEdit }
                <div className="setup-container clearfix"></div>
            </div>
        );
    },

    initCitySelect: function () {
        var province = this.state.province,
            city = this.state.city;
        $("#cityselect").distpicker({
            province: province,
            city: city
        });
    },

    //生成修改密码
    generateForget() {
        var phone = Base.getUserInfo('username')
        if (!this.defineInfo().telExp.test(phone)) {
            return null
        }
        var editBtn = <li className="edit"><a onClick={this.editBtn.bind(this, "editPwd") }  href="javascript:;">编辑</a></li>,
            editPwd = '';

        if (this.state.editPwd) {
            editBtn = this.state.cannotEdit ? <li><a href="javascript:;" onClick={ this.handleRepwd } >修改</a><a onClick={this.editBtnCancel.bind(this, "editPwd") } href="javascript:;">取消</a></li> : <li><span>修改</span><span>取消</span></li>;
            editPwd = (<div className="setup-info clearfix">
                <ul>
                    <li>
                        <label className="title">原密码：</label>
                        <input type="password" ref="oldpassword" onChange={this.changeCanEdit} onBlur={this.validOldPassword}  />
                        <span className="err"></span>
                    </li>
                    <li>
                        <label className="title">新密码：</label>
                        <input type="password" ref="password" onChange={this.changeCanEdit} onBlur={this.validPassword} />
                        <span className="err"></span>
                    </li>
                    <li>
                        <label className="title">确认密码：</label>
                        <input type="password" ref="rePassword" onChange={this.changeCanEdit} onBlur={this.valiRePassword}  />
                        <span className="err"></span>
                    </li>
                </ul>
            </div>);
        }

        return (
            <div className="user-setup">
                <h3 className="title user-setup-title">
                    修改密码
                    <div className="title-btn">
                        <ul>
                            { editBtn }
                        </ul>
                    </div>
                </h3>
                { editPwd }
            </div>
        )
    },

    //校验旧密码
    validOldPassword() {
        var phone = Base.getUserInfo('username'),
            pwd = ReactDOM.findDOMNode(this.refs.oldpassword);

        if (pwd.value == '') {
            $(pwd).next(".err").html("*请输入原密码");
            return;
        } else {
            AV.User.logIn(phone, pwd.value).then(function (loginedUser) {
                //console.log(loginedUser);
                $(pwd).next(".err").html("");
            }, (function (error) {
                $(pwd).next(".err").html("*原密码错误");
            }));
        }
    },

    //校验密码格式
    validPassword: function () {
        var password = ReactDOM.findDOMNode(this.refs.password);
        var value = password.value;
        if (value == '' || value.length <= 5 || value.length > 16) {
            $(password).next(".err").html("*请输入6-16个字符");
            return;
        } else {
            $(password).next(".err").html("");
        }
    },

    //确认密码
    valiRePassword: function () {
        var password = ReactDOM.findDOMNode(this.refs.password),
            rePassword = ReactDOM.findDOMNode(this.refs.rePassword),
            value = rePassword.value;
        if (value == '' || value.length <= 5 || value.length > 16) {
            $(rePassword).next(".err").html("*请输入6-16个字符");
            return;
        } else {
            $(rePassword).next(".err").html("");
        }

        if (value != password.value) {
            $(rePassword).next(".err").html("*两次密码不相同");
            return;
        }
    },

    //提交修改密码
    handleRepwd: function () {
        var phone = Base.getUserInfo('username'),
            pwd = ReactDOM.findDOMNode(this.refs.oldpassword), //旧密码
            password = ReactDOM.findDOMNode(this.refs.password),
            value = password.value, //新密码
            rePassword = ReactDOM.findDOMNode(this.refs.rePassword),
            rePasswordValue = rePassword.value, //重复输入密码
            _this = this;

        if (pwd.value == '') {
            $(pwd).next(".err").html("*请输入原密码");
            return;
        } else {
            AV.User.logIn(phone, pwd.value).then(function (loginedUser) {
                //console.log(loginedUser);
                $(pwd).next(".err").html("");
            }, (function (error) {
                $(pwd).next(".err").html("*原密码错误");
                return;
            }));
        }

        if (value == '' || value.length <= 5 || value.length > 20) {
            $(password).next(".err").html("*请输入6-20个字符");
            return;
        } else {
            $(password).next(".err").html("");
        }

        if (rePasswordValue == '' || rePasswordValue.length <= 5 || rePasswordValue.length > 20) {
            $(rePassword).next(".err").html("*请输入6-20个字符");
            return;
        } else {
            $(rePassword).next(".err").html("");
        }

        if (rePasswordValue != password.value) {
            $(rePassword).next(".err").html("*两次密码不相同");
            return;
        }

        var addSuccess = Base.setUserInfo('password', rePasswordValue); //保存修改

        if (addSuccess) {
            //清空表单信息
            ReactDOM.findDOMNode(this.refs.oldpassword).value = '';
            ReactDOM.findDOMNode(this.refs.password).value = '';
            ReactDOM.findDOMNode(this.refs.rePassword).value = '';

            _this.setState({
                showTips: true,
                tips: "修改密码成功",
                cannotEdit: false //编辑保存按钮不可用
            });

            Base.delayExec(() => {
                _this.setState({ tips: '', showTips: false });
            }, 2000);

        } else {
            _this.setState({
                showTips: true,
                tips: "修改密码失败"
            });

            Base.delayExec(() => {
                _this.setState({ tips: '', showTips: false });
            }, 2000);
        }
    },

    // 生成联系方式
    generateUserContact() {
        var userQq = Base.getUserInfo('qq');
        var userTel = Base.getUserInfo('vipphone');
        var userEmail = Base.getUserInfo('email');
        var visibleQQState = this.state.qqState === 'success' ?
            (
                <span className="success"></span>
            ) : this.state.qqState === 'error' ?
                (
                    <span className="error">*QQ格式不正确</span>
                ) : null;

        var visibleTelState = this.state.telState === 'success' ?
            (
                <span className="success"></span>
            ) : this.state.telState === 'error' ?
                (
                    <span className="error">*手机格式不正确</span>
                ) : null;

        var visibleVerifyState = this.state.verifyState === 'success' ?
            (
                <span className="success"></span>
            ) : this.state.verifyState === 'error' ?
                (
                    <span className="error">*验证码格式不正确</span>
                ) : null;

        var visibleEmailState = this.state.emailState === 'success' ?
            (
                <span className="success"></span>
            ) : this.state.emailState === 'error' ?
                (
                    <span className="error">*邮箱格式不正确</span>
                ) : null;


        var visibleContactEdit =
            (
                <div className="edit">
                    <p>
                        <label>QQ：</label>
                        <input type="text" value={ this.state.userQq } ref="qq" className="edit-txt" onChange={this.changeState.bind(this, 'userQq') } onFocus={ this.validFocusInput('qq') } onBlur={ this.validBlurInput('qq') } />
                        { visibleQQState }
                    </p>
                    <p>
                        <label>手机：</label>
                        <input type="text" value={ this.state.userTel } ref="tel" className="edit-txt" onChange={this.changeState.bind(this, 'userTel') } onFocus={ this.validFocusInput('tel') } onBlur={ this.validBlurInput('tel') } />
                        { visibleTelState }
                    </p>

                    <p>
                        <label>邮箱：</label>
                        <input type="text" value={ this.state.userEmail } ref="email" className="edit-txt" onChange={this.changeState.bind(this, 'userEmail') } onFocus={ this.validFocusInput('email') } onBlur={ this.validBlurInput('email') } />
                        { visibleEmailState }
                    </p>
                </div>
            );


        var btnEdit = (<li className="edit" ><a onClick={this.editBtn.bind(this, "designer") } href="javascript:;">编辑</a></li>);
        var style;
        if (this.state.editDesigner) {
            btnEdit = (<li><a href="javascript:;" onClick={ this.handleContactSubmit } >修改</a><a onClick={this.editBtnCancel.bind(this, "editDesigner") } href="javascript:;">取消</a></li>);
        } else {
            style = {
                display: "none"
            }
        }

        var visibleDesignerContact = Base.getCurrentUser().attributes.approved_status == 2 ?
            (
                <div className="user-setup">
                    <h3 className="title user-setup-title">
                        <span>设计师管理</span>
                        <div className="title-btn">
                            <ul>
                                { btnEdit }
                            </ul>
                        </div>
                    </h3>
                    <div className="setup-container clearfix" style={style}>
                        <div className="setup-contact clearfix">


                            { visibleContactEdit }

                            { this.generateUserManagement() }
                        </div>
                    </div>
                </div>
            ) : null;

        return visibleDesignerContact;
    },

    validFocusInput: function (key) {
        var context = this;

        return function () {
            context.setState({
                [key + 'State']: void 0
            });
        }
    },

    validBlurInput: function (key) {
        var context = this,
            exp = this.defineInfo()[key + 'Exp'], value;

        return function (e) {
            value = e.target.value;
            context.setState({
                [key + 'State']: exp.test(value) ? 'success' : 'error'
            });
            context.state[key + 'State']
        }
    },

    validGlobalInput: function () {
        var isValidSuccess = false,
            states = ['qqState', 'telState', 'emailState'],
            getElementExp = /^(\w+)state/i, state, i, length;

        for (i = 0, length = states.length; i < length; i++) {

            if (this.state[states[i]] !== 'success' && ReactDOM.findDOMNode(this.refs[getElementExp.exec(states[i])[1]]).value == '') {
                isValidSuccess = false;
                state = states[i];
                break;
            }

            isValidSuccess = true;
        }

        return [isValidSuccess, state];
    },

    // 保存联系方式
    handleContactSubmit: function () {
        var globalValids = this.validGlobalInput(), addSuccess, qq, tel, email, verify;
        var _this = this;

        if (!globalValids[0]) {
            this.setState({
                [globalValids[1]]: 'error'
            })

            return;
        }

        qq = ReactDOM.findDOMNode(this.refs.qq).value;
        tel = ReactDOM.findDOMNode(this.refs.tel).value;
        email = ReactDOM.findDOMNode(this.refs.email).value;
        // 保存设计师联系方式
        addSuccess = Base.setUserInfo({
            qq: qq,
            vipphone: tel,
            email: email
        });

        if (addSuccess) {
            this.setState({
                userQQ: qq,
                userTel: tel,
                userEmail: email
            });

            _this.setState({
                showTips: true,
                tips: "修改成功"
            });

            Base.delayExec(() => {
                _this.setState({ tips: '', showTips: false });
            }, 2000);

            //this.handleEdit('isVisibleContactEdit')();

        } else {

            _this.setState({
                showTips: true,
                tips: "修改失败"
            });

            Base.delayExec(() => {
                _this.setState({ tips: '', showTips: false });
            }, 2000);

        }
    },

    setLids: function (lid) {
        !this.labels && (this.labels = []);
        this.labels.push(tid);
    },

    getLids: function () {
        return this.labels;
    },

    emulateDOM: function () {
        var currentUserLabels = this.refs.chooseUserLabel.isCurrentUserLabel();

        $('.chooseTribeLabel a').removeClass('active');

        MePC.each(MePC.makeArray($('.chooseTribeLabel a')), function (_element) {
            if (MePC.inArray(currentUserLabels, _element.innerHTML)) {
                _element.classList.add('active');
            }
        });
    },

    emulateState: function () {
        var labels = [];

        MePC.each(this.refs.chooseUserLabel.isCurrentUserLabel(), function (_labelName) {
            labels.push(_labelName);
        });

        labels = labels.map(function (_labelName) {
            return {
                attributes: {
                    name: _labelName
                }
            }
        });

        this.refs.visibleUserLabel.setState({
            labels: labels
        });
    },

    popupLabelLyer: function (isCancel) {
        var context = this,
            labels = [];

        return function () {
            context.setState({
                isVisibleChooseLabel: !context.state.isVisibleChooseLabel
            });

            if (isCancel) {

                if (context.refs.chooseUserLabel.isCurrentUserLabel()) {
                    context.emulateState();
                    context.emulateDOM();
                } else {
                    $('.chooseTribeLabel a').removeClass('active');
                    $('.chooseTribeLabel a').eq(0).addClass('active');
                    $('.chooseTribeLabel a').eq(1).addClass('active');

                    MePC.each(MePC.makeArray($('.setup-work-type li')), function (_element) {
                        labels.push({
                            attributes: {
                                name: $(_element).find('a').html()
                            }
                        });
                    });

                    context.refs.visibleUserLabel.setState({
                        labels: labels.slice(0, 2)
                    });
                }
                // var currentUserLabel = context.refs.chooseUserLabel.isCurrentUserLabel(),
                //     attrs = [];

                // MePC.isType(currentUserLabel, 'array') && MePC.each(currentUserLabel, function (_labelName) {
                //     attrs.push({
                //         attributes: {
                //             name: _labelName
                //         }
                //     })
                // });

                // context.refs.chooseUserLabel.setState({
                //     labels: attrs
                // });
                //console.log(context.refs.chooseUserLabel.isCurrentUserLabel(), 'hha');
                // context.refs.visibleUserLabel.setState({
                //     labels: context.refs.visibleUserLabel.state.labels
                // });
            }

            // if (isCancel) {

            //     MePC.each(MePC.makeArray(context.refs.chooseUserLabel.getCurrentChooseClass()), function (_element) {
            //         labels.push(_element.innerHTML);
            //     });

            //     labels = labels.map(function (label) {
            //         return {
            //             attributes: {
            //                 name: label
            //             }
            //         }
            //     });

            //     context.refs.visibleUserLabel.setState({
            //         labels: labels
            //     });
            // }
        }
    },

    chooseLabel: function () {
        var labels = [];

        MePC.each(this.refs.chooseUserLabel.getCurrentChooseClass(), function (_element) {
            labels.push(_element.innerHTML);
        });

        labels = labels.map(function (label) {
            return {
                attributes: {
                    name: label
                }
            }
        });

        this.refs.visibleUserLabel.setState({
            labels: labels
        });

        //console.log(this.refs.chooseUserLabel.getCurrentChooseClass(), '哇哈哈');
    },

    saveLabels: function () {
        var labels = [],
            context = this;

        MePC.each(this.refs.chooseUserLabel.getCurrentChooseClass(), function (_element) {
            labels.push(_element.innerHTML);
        });

        if (!Base.setUserInfo('user_labels', labels)) {
            this.showDialog({
                title: '保存失败',
                appearanceState: true,
                sureIsHide: true,
                sureFn: function () {
                    context.refs.dialog.setState({ appearanceState: false })
                }
            });
        } else {
            this.popupLabelLyer()();
        }

    },

    // 生成设计师展示管理
    generateUserManagement() {
        var visibleDesignerManagement =
            (
                <div>
                    {/*<h3 className="title">设计部落展示管理</h3>*/}
                    <div className="setup-container clearfix">
                        <div className="setup-work clearfix">
                            <div className="setup-work-type clearfix">

                                <label>聚焦领域：</label>
                                <div className="work-type-list">

                                    <UserLabels ref="visibleUserLabel" popupLabelLyer={ this.popupLabelLyer() } />

                                </div>
                            </div>

                            <div className="chooseTribeLabel" style={{ display: this.state.isVisibleChooseLabel ? 'block' : 'none' }}>
                                <div className="tribeLabelLists">

                                    <UserLabels ref="chooseUserLabel" isSlice={ true } chooseLabel={ this.chooseLabel } />

                                    <div className="labelListDown">
                                        <div className="fl">最多可以选择3个聚焦领域</div>
                                        <div className="fr">
                                            <input className="btn" onClick={ this.popupLabelLyer(true) } type="button" value="取    消" />
                                            <input className="btn" onClick={ this.saveLabels } type="button" value="保    存" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="title">编辑在设计部落展示的作品：</p>

                            <div className="clearfix">
                                <DesignerWork uid={ Base.getCurrentUser().id } />
                            </div>

                            { /*替换设计师主页背景*/ }
                            <div className="setup-contact clearfix">
                                <p className="title">替换设计师主页背景：</p>
                                <div className="designer-page-bg" onClick={ this.handleUploadPageBgPhoto } >
                                    { !!this.state.user_zone_bgimg ? (<img title="点击设计师主页背景图片" src={ this.state.user_zone_bgimg } />) : <Images title="点击设计师主页背景图片" src={this.defineImageModules()['defaultPageBgPic']}  /> }

                                    <div>
                                        点击替换设计师主页背景
                                        <p>（图片最佳尺寸为1408*318px）</p>
                                    </div>
                                    <input type="file" onChange={ this.handlePageBgChangePhoto } accept="image/jpeg|image/png" ref="pageBg" />
                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            );

        return visibleDesignerManagement;
    },

    componentDidMount: function () {
        this.chooseWorks();
    },

    componentDidUpdate: function () {
        //省市选择框初始化
        this.initCitySelect();
    },

    //编辑
    editBtn: function (type) {
        var _this = this;

        _this.setState({
            cannotEdit: true
        });

        switch (type) {
            case "userinfo":
                //如果居住地为保密，则城市不显示
                var province = _this.state.province;
                if (province == '' || province == undefined || province == '保密') {
                    _this.setState({
                        editUserInfo: true,
                        editPwd: false,
                        editDesigner: false,
                        editUserCareer: false,
                        showCity: false
                    });
                } else {
                    _this.setState({
                        editUserInfo: true,
                        editPwd: false,
                        editUserCareer: false,
                        editDesigner: false,
                        showCity: true
                    });
                }
                break;
            case "userCareer":
                _this.setState({
                    editUserInfo: false,
                    editPwd: false,
                    editDesigner: false,
                    editUserCareer: true
                });
                break;
            case "editPwd":
                _this.setState({
                    editUserInfo: false,
                    editPwd: true,
                    editUserCareer: false,
                    editDesigner: false
                });
                break;
            case "designer":
                _this.setState({
                    editUserInfo: false,
                    editUserCareer: false,
                    editPwd: false,
                    editDesigner: true
                });
                break;
            default:
                _this.setState({
                    editUserInfo: false,
                    editUserCareer: false,
                    editPwd: false
                });
                break;
        }
    },

    //取消编辑
    editBtnCancel: function (type) {
        if (type == "editUserInfo") {
            this.setState({
                [type]: false,
                userNick: Base.getUserInfo('user_nick'),
                userNickState: Base.getUserInfo('user_nick'),
                userSignState: Base.getUserInfo('user_sign'),
                sex: Base.getUserInfo('sex') === '' ? 1 : Base.getUserInfo('sex'),
                enterpriseMobile: Base.getUserInfo('enterprise_mobile') || '',
                province: Base.getUserInfo('province'),
                city: Base.getUserInfo('city')
            })
        } else if(type == "editUserCareer"){
            this.setState({
                [type]: false,
                enterpriseEmail: Base.getUserInfo("enterprise_email") || '',
                enterpriseName: Base.getUserInfo('enterprise_name') || '',
                industry: Base.getUserInfo('industry')
            })
        } else {
            this.setState({
                [type]: false
            })
        }
    },

    chooseWorks: function () {
        var workLists = ReactDOM.findDOMNode(this.refs.workLists),
            context = this;

        $(workLists).find("li").click(function () {
            var liActive = $(workLists).find("li").filter(".active");
            var activeNum = liActive.length;

            if ($(this).hasClass('active')) {

                var curText = $(this).removeClass('active').find("i").text();
                // 
                liActive.each(function (index, ele) {
                    if (parseInt($(ele).find('i').text()) > curText) {
                        $(ele).find('i').text(parseInt($(ele).find('i').text()) - 1)
                    }
                });

                $(this).removeClass('active').find("i").text('');


            } else {

                if (activeNum >= 7) {

                    context.showDialog({
                        title: '最多只能选择7个作品！',
                        appearanceState: true,
                        sureIsHide: true
                    });

                    return false;
                }

                $(this).addClass('active').find('i').text(activeNum + 1);

            }

        });

    },

    render: function () {
        var context = this;
        var isTitleHide = this.state.tabIndex == 5 ? { display: "none" } : {};
        //console.log(Base.getCurrentUser(), 'dd');
        if (!Base.isLogin()) {
            return (
                <div className="inner">
                    {
                        this.buildDialog(
                            {
                                appearanceState: true,
                                title: '您还未登录，请登录',
                                sureIsHide: true,
                                cancelFn() {
                                    Base.linkToPath('/');
                                }
                            }
                        )
                    }
                </div>
            );
        }

        var tips = this.state.showTips ? <div className="revise-tips">{this.state.tips}</div> : '';


        return (
            <div className="user-settings">
                {
                    context.buildDialog({
                        appearanceState: false,
                        sureFn: function () {
                            context.showDialog({
                                appearanceState: false
                            });
                        }
                    })
                }

                {tips}

                {/*个人资料修改*/}
                { this.generateUserMsg() }

                {/*职业资料修改*/}
                { this.generateCareerMsg() }

                {/*修改密码*/}
                {this.generateForget() }

                { this.generateUserContact() }


            </div>
        )
    }
});

module.exports = setting;