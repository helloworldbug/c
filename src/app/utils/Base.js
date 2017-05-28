/**
 * @name 常用方法库
 * @author 曾文彬
 * @datetime 2015-9-7
 */

'use strict';

import {browserHistory} from 'react-router'
module.exports = {

    /**
     * 首字母大写
     *
     * @params dirName {string} 字符串
     * @return {string}
     */
    upperFirst(string) {
        return string.charAt(0) + string.slice(1);
    },

    /**
     * 函数延迟执行
     *
     * @params fn {function} 执行的函数
     * @params timeline {number} 延迟毫秒
     * @return no
     */
    delayExec(fn, timeline) {
        var args = Array.prototype.slice.call(arguments, 2),
            time = setTimeout(() => {
                clearTimeout(time);
                fn.apply(null, args);
            }, timeline);
    },

    /**
     * 1分钟倒计时
     *
     * @params fning {function} 记时中处理
     * @params fned {function} 记时完成处理
     * @return no
     */
    countDowning(fning, fned) {
        var second = 60,
            timer = setInterval(() => {
                if (second === 1) {
                    clearInterval(timer);
                    fned();
                    return;
                }

                --second;
                fning(second);
            }, 1000);

        return timer;
    },

    /**
     * 函数执行多少次结束
     *
     * @params count {number} 执行总次数
     * @params stopCallback {function} 执行完成回调函数
     * @return {function}
     */
    callerStopByCount(count, stopCallback) {
        var i = 0;

        return () => {
            (i++) >= count && stopCallback();
        };
    },

    /**
     * query string 转换成 query object
     *
     * @params querystring {string} 查询字符串
     * @return {string}
     */
    getQueryObject(querystring) {
        var ret = {},
            querys = querystring.split('&'), splitters;

        querys.forEach((_query) => {
            splitters = _query.split('=');
            splitters.length > 1 && (ret[splitters[0]] = splitters[1]);
        });

        return ret;
    },

    /**
     * 获取url参数值
     *
     * @params url {string} url
     * @params name {string} 参数名
     * @return {string}
     */
    getParam(url, name) {
        var feature = `${name}=`
        var index = url.indexOf(feature);
        if (index > -1) {
            var candidate = url.substring(index + feature.length);
            var match = candidate.match(/[^/&?]*/);
            if (match) {
                return match[0]
            } else {
                return ""
            }

        }
        return ""

    },

    /**
     * 加载svg动画
     *
     * @params selector {string} 选择器
     * @return no
     */
    loadSVGAnimation(selector) {
        var refreshDuration = 10000;
        var refreshTimeout;
        var numPointsX;
        var numPointsY;
        var unitWidth;
        var unitHeight;
        var points;

        function init() {
            load();

            window.onresize = function () {
                resize();
            }
        }

        function load() {
            var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', window.innerWidth);
            svg.setAttribute('height', window.innerHeight);
            document.querySelector(selector).appendChild(svg);
            var unitSize = (window.innerWidth + window.innerHeight) / 20;
            numPointsX = Math.ceil(window.innerWidth / unitSize) + 1;
            numPointsY = Math.ceil(window.innerHeight / unitSize) + 1;
            unitWidth = Math.ceil(window.innerWidth / (numPointsX - 1));
            unitHeight = Math.ceil(window.innerHeight / (numPointsY - 1));
            points = [];

            for (var y = 0; y < numPointsY; y++) {
                for (var x = 0; x < numPointsX; x++) {
                    points.push({
                        x: unitWidth * x,
                        y: unitHeight * y,
                        originX: unitWidth * x,
                        originY: unitHeight * y
                    });
                }
            }

            randomize();

            for (var i = 0; i < points.length; i++) {
                if (points[i].originX != unitWidth * (numPointsX - 1) && points[i].originY != unitHeight * (numPointsY - 1)) {
                    var topLeftX = points[i].x;
                    var topLeftY = points[i].y;
                    var topRightX = points[i + 1].x;
                    var topRightY = points[i + 1].y;
                    var bottomLeftX = points[i + numPointsX].x;
                    var bottomLeftY = points[i + numPointsX].y;
                    var bottomRightX = points[i + numPointsX + 1].x;
                    var bottomRightY = points[i + numPointsX + 1].y;

                    var rando = Math.floor(Math.random() * 2);

                    for (var n = 0; n < 2; n++) {
                        var polygon1 = document.createElementNS(svg.namespaceURI, 'polygon');
                        if (rando == 0) {
                            if (n == 0) {
                                polygon1.point1 = i;
                                polygon1.point2 = i + numPointsX;
                                polygon1.point3 = i + numPointsX + 1;
                                polygon1.setAttribute('points', topLeftX + ',' + topLeftY + ' ' + bottomLeftX + ',' + bottomLeftY + ' ' + bottomRightX + ',' + bottomRightY);
                            } else if (n == 1) {
                                polygon1.point1 = i;
                                polygon1.point2 = i + 1;
                                polygon1.point3 = i + numPointsX + 1;
                                polygon1.setAttribute('points', topLeftX + ',' + topLeftY + ' ' + topRightX + ',' + topRightY + ' ' + bottomRightX + ',' + bottomRightY);
                            }
                        } else if (rando == 1) {
                            if (n == 0) {
                                polygon1.point1 = i;
                                polygon1.point2 = i + numPointsX;
                                polygon1.point3 = i + 1;
                                polygon1.setAttribute('points', topLeftX + ',' + topLeftY + ' ' + bottomLeftX + ',' + bottomLeftY + ' ' + topRightX + ',' + topRightY);
                            } else if (n == 1) {
                                polygon1.point1 = i + numPointsX;
                                polygon1.point2 = i + 1;
                                polygon1.point3 = i + numPointsX + 1;
                                polygon1.setAttribute('points', bottomLeftX + ',' + bottomLeftY + ' ' + topRightX + ',' + topRightY + ' ' + bottomRightX + ',' + bottomRightY);
                            }
                        }

                        polygon1.setAttribute('fill', 'rgba(0,0,0,' + (Math.random() / 3) + ')');
                        var animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
                        animate.setAttribute('fill', 'freeze');
                        animate.setAttribute('attributeName', 'points');
                        animate.setAttribute('dur', refreshDuration + 'ms');
                        animate.setAttribute('calcMode', 'linear');
                        polygon1.appendChild(animate);
                        svg.appendChild(polygon1);
                    }
                }
            }

            refresh();
        }

        function randomize() {
            for (var i = 0; i < points.length; i++) {
                if (points[i].originX != 0 && points[i].originX != unitWidth * (numPointsX - 1)) {
                    points[i].x = points[i].originX + Math.random() * unitWidth - unitWidth / 2;
                }
                if (points[i].originY != 0 && points[i].originY != unitHeight * (numPointsY - 1)) {
                    points[i].y = points[i].originY + Math.random() * unitHeight - unitHeight / 2;
                }
            }
        }

        function refresh() {
            randomize();

            for (var i = 0; i < document.querySelector('' + selector + ' svg').childNodes.length; i++) {
                var polygon1 = document.querySelector('' + selector + ' svg').childNodes[i];
                var animate = polygon1.childNodes[0];
                if (animate.getAttribute('to')) {
                    animate.setAttribute('from', animate.getAttribute('to'));
                }
                animate.setAttribute('to', points[polygon1.point1].x + ',' + points[polygon1.point1].y + ' ' + points[polygon1.point2].x + ',' + points[polygon1.point2].y + ' ' + points[polygon1.point3].x + ',' + points[polygon1.point3].y);
                animate.beginElement();
            }
            refreshTimeout = setTimeout(function () {
                refresh();
            }, refreshDuration);
        }

        function resize() {
            document.querySelector('' + selector + ' svg').remove();
            clearTimeout(refreshTimeout);

            setTimeout(function () {
                load();
            }, 800);
        }

        init();
    },

    /**
     * 函数promise异步处理
     *
     * @params callback {function} promise处理函数
     * @return {PromiseObject}
     */
    asyncByPromise(callback) {
        var context = this;

        return new Promise(function (resolve, reject) {
            callback.call(context,
                () => {
                    resolve.apply(context, arguments);
                },
                () => {
                    resolve.apply(context, arguments);
                }
            );
        });
    },
    replacePath(path) {
        browserHistory.replace(path)
    },
    /**
     * 跳转到新页面
     *
     * @params hash {string} hash路径
     * @return no
     */
    linkToPath(path) {
        debugger;
        if(path.indexOf(".html") > -1){ //客户端的路由
            location.href = path;
        }else{
            browserHistory.push(path);
        }
        // location.href = path;
    },

    /**
     * 操作本地存储
     *
     * @params name {string} 存储键
     * @params value {string} 存储值
     * @params sign {boolean} 是否是删除操作
     * @return no
     */
    localStorageAction(name, value, sign) {
        if (!localStorage) return;

        if (sign) {
            return localStorage.removeItem(name);
        }

        if (!value) {
            return localStorage.getItem(name);
        }

        localStorage.setItem(name, typeof value === 'object' ? JSON.stringify(value) : value);
    },

    /**
     * 修改本地存储名称的值
     *
     * @params name {string} 键
     * @params value {string} 值
     * @return no
     */
    updateLocalStorage(name, value) {
        var user = this.getLocalStorageUser();
        user[name] = value;

        this.localStorageAction('user', JSON.stringify(user));
    },

    /**
     * 获取当前本地存储用户对象
     *
     * @return {object}
     */
    getLocalStorageUser() {
        return JSON.parse(this.localStorageAction('user'));
    },

    /**
     * 获取当前用户对象
     *
     * @return {object}
     */
    getCurrentUser() {
        return fmacloud.User.current();
    },
    /**
     * 取用户的最新信息
     * @param uid
     */
    getLatestUserInfo(uid) {

        return new Promise(function (resolve, reject) {
            getUserObject(uid, resolve, reject)
        })
        function getUserObject(user_id, cb_ok, cb_err) {
            if (!user_id) {
                cb_err("用户id为空");
                return;
            }
            var init_User = AV.Object.extend("_User");
            var query = new AV.Query(init_User);
            query.equalTo("objectId", user_id);
            query.first({
                success: cb_ok,
                error: cb_err
            });
        }
    },
    /**
     * 是否登录
     *
     * @return {boolean}
     */
    isLogin() {
        return !!this.getCurrentUser();
    },

    /**
     * get用户信息
     *
     * @params key {string} 用户项
     * @return {string}
     */
    getUserInfo(key) {
        return this.controlUserInfo('get', key);
    },

    /**
     * set用户信息
     *
     * @params key {string} 用户项
     * @params value {string} 用户值
     * @return {boolean}
     */
    setUserInfo(key, value) {
        return this.controlUserInfo('set', key, value);
    },

    /**
     * 用户信息操作
     *
     * @params type {string} get|set
     * @params key {string} 用户项
     * @params value {string} 用户值
     * @return {boolean}
     */
    controlUserInfo(type, key, value) {
        var user = this.getCurrentUser();

        var attrs, attr;

        if (type === 'get') return (!!user) ? user.attributes[key] : null;

        if (typeof key === 'object') attrs = key;
        else (attrs = {})[key] = value;

        for (attr in attrs) {
            user.set(attr, attrs[attr]);
        }

        try {
            user.save();
            return true;
        } catch (e) {
            return false;
        }
    },

    /**
     * 根据字段查询表数据
     *
     * @params tableName {string} 表名
     * @params fieldName {string} 字段名
     * @params fieldValue {string} 字段值
     * @params successCallback {function} 查询成功回调函数
     * @params errorCallback {function} 查询失败回调函数
     */
    tableDataSelect(tableName, fieldName, fieldValue, successCallback, errorCallback) {
        if (!tableName) return;

        var table = new AV.Query(tableName);

        table.equalTo(fieldName, fieldValue);
        table.find({
            success: successCallback,
            error: errorCallback
        });
    },

    /**
     * 修改收藏数
     *
     * @params wid {string} 作品id
     * @params action {number} 收藏操作 ---0.add，1.delete
     * @params successCallback {function} 修改成功回调函数
     * @params errorCallback {function} 修改失败回调函数
     * @return no
     */
    collectsModifier(wid, action, successCallback, errorCallback) {
        // get 作品收藏数据对象
        var works = new fmacloud.Query("tplobj"), count;
        works.equalTo('tpl_id', wid);

        works.first({
            success(_data) {
                count = _data.get('store_count');
                _data.set('store_count', !action ? count + 1 : ((--count < 0) ? 0 : count));
                _data.save(null, {
                    success: successCallback,
                    error: errorCallback
                });
            },
            error(_error) {
                errorCallback('作品操作失败', _error.message);
            }
        });
    },

    /**
     * 查询收藏数
     *
     * @params uid {string} 用户id
     * @params wid {string} 作品id
     * @params successCallback {function} 成功回调函数
     * @return no
     */
    collectsSelect(uid, wid, successCallback, errorCallback) {
        // get作品收藏数据对象
        var work = new fmacloud.Query("me_favorites");

        // 输入查询条件
        work.equalTo("user_id", uid);
        work.equalTo("fav_id", wid);

        work.find(
            (_data) => {
                successCallback(_data);
            },
            (_obj, _error) => {
                errorCallback.apply(null, arguments)
            }
        );
    },

    /**
     * 收藏
     *
     * @params type {string} 收藏类型 ---1.微杂志，2.其它定义, 3. XXXX
     * @params uid {string} 用户id
     * @params wid {string} 作品id
     * @params deal {boolean} 判断收藏还是取消收藏 ---0.add，1.delete
     * @params successCallback {function} 成功回调函数
     * @params errorCallback {function} 失败回调函数
     * @params remark {string} 作品备注
     * @return 未登录返回false
     */
    collect(type, wid, deal, successCallback, errorCallback, remark) {
        var user = fmacloud.User.current(),
            uid = user.id;

        if (!user) return false;

        var context = this, deal;

        // find favorites
        context.collectsSelect(uid, wid,
            (_data) => {
                var result = deal ? !!_data.length : !_data.length;

                if (!result) {
                    errorCallback(deal ? '不存在该作品' : '该作品已收藏');
                    return;
                }

                // initial new object and operator
                var newWork = new fmacloud.Object.extend("me_favorites");
                newWork.set('fav_type', type);
                newWork.set("fav_id", wid);
                newWork.set("user_id", uid);
                newWork.set("data_site", 1);

                // save to interface
                newWork.save(null, {
                    success(_succ) {
                        context.collectsModifier(wid, deal, successCallback, errorCallback);
                    },
                    error(_obj, _error) {
                        errorCallback('收藏错误', 2);
                    }
                });
            },
            (_obj, _error) => {
                // find error
                errorCallback(_error.message, 0);
            }
        );
    },

    /**
     * 上传用户头像
     *
     * @params file {fileobject} 表单文件对象
     * @params successCallback {function} 成功回调函数
     * @params errorCallback {function} 失败回调函数
     */
    uploadUserPhoto(file, successCallback, errorCallback) {
        var user = fmacloud.User.current();

        var fileType = file.type,
            fileName = user.user_nick + file.name;

        var avosFile = new fmacloud.File(fileName, file);

        avosFile.save().then(
            (_file) => {
                successCallback(_file);
            },
            (_error) => {
                errorCallback(_error.message);
            }
        )
    },
    /**
     * 时间格式化
     *
     * @params time {Date} 时间对象
     * @params format {string} 格式化字符
     * @return {string}
     */
    formattime(time, format) {
        var t = new Date(time);

        var tf = function (i) {
            return (i < 10 ? '0' : '') + i
        };

        return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
            switch (a) {
                case 'yyyy':
                    return tf(t.getFullYear());
                    break;
                case 'MM':
                    return tf(t.getMonth() + 1);
                    break;
                case 'mm':
                    return tf(t.getMinutes());
                    break;
                case 'dd':
                    return tf(t.getDate());
                    break;
                case 'HH':
                    return tf(t.getHours());
                    break;
                case 'ss':
                    return tf(t.getSeconds());
                    break;
            }
        });
    },

    /**
     * 字符串映射对象
     */
    formatString(templateStr, matchs) {
        matchs = !(matchs instanceof Array) ? [matchs] : matchs;

        return templateStr.replace(/{(\d+)}/g, function (match, number) {
            return typeof matchs[number] != 'undefined' ? matchs[number] : match;
        });
    },
    /*
     * 修改次数和套餐事件区别 add by 2017/5/8
     * */
    change_end_at : function (custom_code) {
        if(custom_code === 'Svc_Mouth'){
            return '月'
        }
        if(custom_code === 'Svc_Year'){
            return '年'
        }
        return '永久';
    },

    /**
     * 用户默认头像
     */
    buildDefaultUserLogo(userModule) {
        var userPic = this.getCurrentUser().attributes.user_pic, userLogo;

        if (!userPic) return userModule;

        userLogo = userPic.indexOf('http:') >= 0 ? userPic : userModule;

        return userLogo;
    },

    /**
     * 生成二维码url
     */
    generateQRCodeUrl(tid) {
        return `${location.origin}/${tid}/shareme.html?tid=${tid}&dataFrom=pc2-0`;
        // if (fmawr == 0) {  // 测试服
        //     return `http://test.agoodme.com/${tid}/shareme.html?tid=${tid}&dataFrom=pc2-0`;
        // } else {
        //     return `http://www.agoodme.com/${tid}/shareme.html?tid=${tid}&dataFrom=pc2-0`;
        // }
        //return 'http://'+ test +'.agoodme.com/views/mobile.html?tid=' + tid + '&dataFrom=pc2-0';
    },
    /*
     *  得到save时,生成的tpl_domain 4/24/2017 Mr xu
    * */
    setTplDomain(tpl_domain){
        this.tpl_domain = tpl_domain;
    },

    /*
     * 返回tpl_domian 4/24/2017 Mr xu
    * */
    getTplDomain(){
        return this.tpl_domain;
    },

    /**
     * 回到顶部
     *
     */
    backToTop($, time) {
        $('html, body').animate({ 'scrollTop': 0 }, time);
    },

    /**
     * 网络请求
     */
    async: function (url, type, data, dataType) {
        if (!url) return;

        type = type || 'GET';
        data = data || {};
        dataType = dataType || 'json';

        return new Promise(function (resolveFunc, rejectFunc) {
            $.ajax({
                'url': url,
                'type': type,
                'data': data,
                'dataType': dataType,
                'success': resolveFunc,
                'error': rejectFunc
            });
        });
    }

};
