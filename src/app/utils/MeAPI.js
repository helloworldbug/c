/**
 * @component MeAPI
 * @description Me接口
 * @time 2015-09-09 15:07
 * @author StarZou
 **/

var keyMirror = require('keymirror');

var ContextUtils = require('./ContextUtils');
var CommonUtils = require('./CommonUtils');
var UserService = require('./user');
var MeConstants = require('../constants/MeConstants');
var MakeWebAPIUtils = require('./MakeWebAPIUtils');
var uuid = require("uuid");
var ClassesMap = MeConstants.ClassesMap;
var MsgTabName = MeConstants.MsgTabName;

var MeAPI = {

    /**
     * 根据条件查询作品
     */
    queryTemplatesByCondition: function (option) {
        option.className = ClassesMap.template;
        return this.queryByCondition(option);
    },


    /**
     * 根据条件查询数据
     * @param option
     * @return promise
     */
    queryByCondition: function (option) {
        return fmacloud.Query.doCloudQuery(CommonUtils.getSelectSQL(option));
    },


    /**
     * 生成模板
     * @param template
     * @return {Promise}
     */
    createTemplate: function (template) {

        return new Promise((resolve, reject) => {
            var tpl_obj = template, tid = tpl_obj.get("tpl_id");
            MakeWebAPIUtils.getMagazineTreeDataById(tid, function (templateObject, pagesObject) {
                var tpl = templateObject;
                var tplData = pagesObject;
                var WorkDataUtil = require("./WorkDataUtil");
                var GlobalFunc = require("../components/Common/GlobalFunc");
                //用模板打开，复制数据
                tpl = WorkDataUtil.cloneTpl(tpl);// 设置模板对象 tpl
                tpl.set("tpl_id", WorkDataUtil.createTplId());
                tpl.set("tpl_type", 10);
                tpl.set("inherit_from", tid);
                tpl.set("approved", 0);
                ///clone tree
                var objCopy = WorkDataUtil.cloneNode(tplData);
                GlobalFunc.traversalTree(objCopy, true, GlobalFunc.copyPageEvents);
                //重置ID
                var pageUids = {}; //新旧页UID
                GlobalFunc.traversalTree(objCopy, false, function (node) {
                    if (GlobalFunc.isGroup(node)) {
                        node.set("f_object_id", fmacapi_create_uid(""))
                    } else {
                        var newPageUid = uuid.v4();
                        pageUids[node.get("page_uid")] = newPageUid;
                        node.set("page_uid", newPageUid);
                    }
                })
                GlobalFunc.traversalTree(objCopy, false, function (node) {
                    if (!GlobalFunc.isGroup(node)) {
                        GlobalFunc.copyPageToEvents(node, pageUids);
                    }
                })
                GlobalFunc.traversalTree(objCopy, true, function (page) {
                    var items = page.get("item_object");
                    items.forEach((item) => {
                        if (item.get("item_type") == 2 && typeof item.get("line_height_nodefault") != "undefined") {
                            //老版本App不识别新的行高，所以生成模板时去掉新的字段
                            item.set("line_height", item.get("line_height_nodefault"));
                            if (item.get("line_height") == 0) {
                                //新行高的0是真正的0，老的0是默认行高，所以使用1最接近模板效果
                                item.set("line_height", 1);
                            }
                            item.unset("line_height_nodefault");
                        }
                    })
                })
                objCopy.set("key_id", tpl.get("tpl_id"));
                var tplDataTable = WorkDataUtil.tree2TableTplData(tpl.get("tpl_id"), objCopy, tpl.get("tpl_id"));
                var groups = tplDataTable.get("group").slice(0);
                fmacloud.saveMEBook(tpl, tplDataTable, null, function (data) {
                    //返回data{tpldata：...,tplobj:...,group:...},tpldata里包含pages
                    var tplTableData = data.tpldata;
                    tplTableData.set("group", data.group);
                    var tpl = data.tplobj, tplid = tpl.get('tpl_id');
                    var tplData = WorkDataUtil.table2Tree(tplTableData, tplid);
                    WorkDataUtil.uploadJsonFile(tpl, WorkDataUtil.cloneNode(tplData, undefined, true), function (file) {
                        var temp = file.url().split("/");
                        var fileId = temp[temp.length - 1].split(".")[0];
                        var result = {};
                        result.url_type = "leancloud";
                        result.postfix = ".json";
                        result.key = fileId;
                        var jsonUrl = JSON.stringify(result);
                        fmacapi.update_tplobj(tplid, { json_url: jsonUrl }, function (tplobj) {
                            resolve(tplobj);
                        }, function (error) {
                            reject(error);
                        })
                    }, function (error) {
                        reject(error);
                    })


                }, function (error) {
                    reject(error);
                });
            }, function (error) {
                reject(error);
            })
            //MakeWebAPIUtils.cld_get_tpl_data_local(tid, function (data) {
            //    var tplData = (data);
            //    var _tplObj = tpl_obj.clone(),
            //        _tplData = tplData.clone(),
            //        _tplDataPages;
            //    var newTid = fmacapi_create_uid("");
            //    _tplObj.set("tpl_id", newTid);
            //    _tplObj.set("tpl_type", 10);
            //    _tplData.set("key_id", newTid);
            //    _tplDataPages = _tplData.get("pages");
            //    var i = 0, plen = _tplDataPages.length, _pages = new Array(plen);
            //    for (; i < plen; i++) {
            //        _pages[i] = _tplDataPages[i].clone();
            //        var j = 0,
            //            _privateItemObj = _pages[i].get("item_object"),
            //            jlen = _privateItemObj.length,
            //            _itemObj = new Array(jlen);
            //        for (; j < jlen; j++) {
            //            _itemObj[j] = _privateItemObj[j].clone();
            //        }
            //        _pages[i].set("item_object", _itemObj);
            //    }
            //    _tplData.set("pages", _pages);
            //
            //
            //    fmacapi.tpl_save_all(_tplObj, _tplData, null, function (data) {
            //        resolve(data);
            //    }, function (error) {
            //        reject(error)
            //    });
            //
            //}, function () {
            //    reject()
            //});
        });

    },

    /**
     * 删除作品
     * @param template
     * @return {Promise}
     */
    deleteWorks: function (template) {
        return new Promise((resolve, reject) => {
            fmacloud.erase_tpl_works(template.get('tpl_id'), template, function (data) {
                resolve(data);
            }, function (obj, err) {
                reject(err, obj);
            });
        });
    },

    /**
     * 作品假删
     **/
    fakeDelete: function (template, type) {
        return new Promise((resolve, reject) => {
            UserService.fakeDeleteStore(template.attributes.tpl_id, type, function (data) {
                resolve(data);
            }, function (error) {
                reject(error);
            });
        });
    },

    /**
     * 删除收藏
     * @param tid
     * @return {Promise}
     */
    deleteFavorites: function (tid) {
        return new Promise((resolve, reject) => {
            UserService.deleteUserStore(tid, function (data) {
                resolve(data);
            }, function (error) {
                reject(error);
            });
        });
    },


    /**
     * 添加收藏
     * @param tid
     * @param favType
     * @return {Promise}
     */
    addFavorite: function (tid, favType) {
        var Favorite = fmacloud.Object.extend(ClassesMap.favorite);
        var user = ContextUtils.getCurrentUser(); //获取当前登录用户信息
        var favorite = new Favorite();

        favType = favType || '1';
        favorite.set('fav_type', favType);
        favorite.set('fav_id', tid);
        favorite.set('user_id', user.id);
        favorite.set('data_site', 1);

        return favorite.save();
    },

    /**
     * 进行收藏,
     * 已收藏, add 报错
     *        del 成功
     *
     * 未收藏, add 成功
     *        del 报错
     * @param tid
     * @param type add|del
     */
    doFavorite: function (tid, type = 'add') {
        var me = this;

        return new Promise((resolve, reject) => {
            try {
                // 查询收藏记录成功
                me.getFavoriteById(tid).then(function (favorite) {

                    // 有数据, 已经收藏
                    if (favorite) {

                        if (type === 'add') {
                            reject({ message: '已经收藏!' });
                        } else if (type === 'del') {
                            favorite.destroy().then(function () {

                                me.updateStoreCountForWorksById(tid, type).then(function (works) {
                                    resolve({ favorite: favorite, works: works, message: '取消收藏成功!' });
                                }).catch(function (error) {
                                    reject({ data: error, message: '取消收藏失败!' });
                                });

                            });
                        }

                    } else {

                        if (type === 'add') {
                            me.addFavorite(tid).then(function (favorite) {

                                me.updateStoreCountForWorksById(tid, type).then(function (works) {
                                    resolve({ favorite: favorite, works: works, message: '收藏成功!' });
                                }).catch(function (error) {
                                    reject({ data: error, message: '收藏失败!' });
                                });

                            });
                        } else if (type === 'del') {
                            reject({ message: '取消收藏失败!' });
                        }

                    }

                });
            } catch (error) {
                // 查询收藏记录失败
                reject({ data: error, message: '请先登陆!' });
            }
        });
    },

    /**
     * 根据tid查询, 收藏记录
     * @param tid
     * @return {Promise}
     */
    getFavoriteById: function (tid) {
        var user = ContextUtils.getCurrentUser(); //获取当前登录用户信息
        if (!user) {
            return null;
        }

        var query = new fmacloud.Query(ClassesMap.favorite);
        query.equalTo('user_id', user.id);
        query.equalTo('fav_id', tid);
        return query.first();
    },

    /**
     * 查询用户所有收藏
     * @return {Promise}
     */
    queryFavorites: function () {
        var user = ContextUtils.getCurrentUser(); //获取当前登录用户信息
        if (!user) {
            return null;
        }
        var query = new fmacloud.Query(ClassesMap.favorite);
        query.equalTo('user_id', user.id);
        return query.find();
    },

    /**
     * 根据tid查询作品
     * @param tid
     * @return {Promise}
     */
    getWorksById: function (tid) {
        var query = new fmacloud.Query(ClassesMap.template);
        query.equalTo('tpl_id', tid);
        return query.first();
    },

    /**
     * 更新作品收藏数
     * @param tid
     * @param type
     */
    updateStoreCountForWorksById: function (tid, type) {
        var me = this;

        return new Promise((resolve, reject) => {
            me.getWorksById(tid).then(function (works) {
                var storeCount = works.get('store_count');

                if (type == 'add') {
                    works.set('store_count', storeCount + 1);
                } else if (type === 'del') {
                    if (storeCount > 0) {
                        works.set('store_count', storeCount - 1);
                    }
                }

                works.save().then(function (data) {
                    resolve(data);
                }).catch(function (error) {
                    reject(error);
                });
            });
        });

    },

    /**
     * 查询数据数getDataCount
     * @param tid
     * @param uid
     * @return {Promise}
     */
    getDataCount: function (tid, uid) {
        var query = new fmacloud.Query(ClassesMap.customerData);

        if (tid) {
            query.equalTo('cd_tplid', tid);
        }

        query.equalTo('cd_userid', uid || ContextUtils.getCurrentUser().id);

        return query.count();
    },

    /**
     * 根据消息类型查找消息
     * @param opt
     *        opt.type 消息tabName
     *        opt.currentPage 当前页
     * @param cb_ok
     * @param cb_err
     */
    queryMessageManagerByTabName: function (opt, type, cb_ok, cb_err) {
        var url = "/v1/sm/user/{userid}/pushing/list?status={status}&skip={skip}&limit={limit}";
        var userId = opt.whereCondition.author;
        var status = opt.whereCondition.type;
        var skip = (opt.currentPage - 1) * opt.whereCondition.pageSize;
        var limit = opt.whereCondition.pageSize;
        url = url.replace("{userid}", userId).replace("{status}", status).replace("{skip}", skip).replace("{limit}", limit);
        var option = {};
        option.url = url;
        option.success = function (data) {
            if (data.err) {
                cb_err(data.err);
            } else {
                var result = {};
                result.count = data.pagination.max_cnt || 0;
                result.groups = data.groups || [];
                cb_ok(result);
            }
        };
        option.error = function (err) {
            cb_err(err);
        };
        MakeWebAPIUtils.getRESTfulData(option);
    },

    /**
     * 更新消息状态
     * @param opt
     * @param opt.userId
     * @param opt.messageId
     * @param cb_ok
     * @param cb_err
     */
    updateMessageStatus: function (opt, cb_ok, cb_err) {
        var url = "/v1/sm/user/{userid}/pushing/group/{group_id}";
        var userId = opt.userId;
        var group_id = opt.messageId;
        var data = {};
        data.status = opt.status;
        url = url.replace("{userid}", userId).replace("{group_id}", group_id);
        var option = {};
        option.url = url;
        option.data = data;
        option.type = "PUT";
        option.success = function (data) {
            if (data.err) {
                cb_err(data.err);
            } else {
                cb_ok(data);
            }
        };
        option.error = function (err) {
            cb_err(err);
        };
        MakeWebAPIUtils.getRESTfulData(option);
    },
    /**
     * 删除消息
     * @param opt
     * @param cb_ok
     * @param cb_err
     */
    deleteMessage : function(opt, cb_ok, cb_err){
        var url = "/v1/sm/user/{userid}/pushing/group/{group_id}";
        var userId = opt.userId;
        var group_id = opt.messageId;
        url = url.replace("{userid}", userId).replace("{group_id}", group_id);
        var option = {};
        option.url = url;
        option.type = "DELETE";
        option.success = function (data) {
            if (data.err) {
                cb_err(data.err);
            } else {
                cb_ok(data);
            }
        };
        option.error = function (err) {
            cb_err(err);
        };
        MakeWebAPIUtils.getRESTfulData(option);
    },
    /**
     * 推送消息
     * @param opt
     * @param cb_ok
     * @param cb_err
     */
    pushMessage : function(opt, cb_ok, cb_err){
        var url = "/v1/sm/user/{userid}/pushing/group/{group_id}/sending";
        var userId = opt.userId;
        var group_id = opt.messageId;
        url = url.replace("{userid}", userId).replace("{group_id}", group_id);
        var option = {};
        option.url = url;
        option.type = "POST";
        var data = {},
            group = {};
        data.accounts = opt.accounts;
        group.long_page_image = opt.long_page_image;
        group.long_page_mode = opt.longPageMode;
        group.id = group_id;
        data.group = group;
        option.data = data;
        option.success = function (data) {
            if (data.err) {
                if (opt.cb_err) {
                    opt.cb_err();
                }
                cb_err(data.err);
            } else {
                var errNameList = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].status != "3") {
                        errNameList.push(data[i].name);
                        break;
                    }
                }
                if (errNameList.length > 0) {
                    var errMsg = "<span style='color: #459ae9'>" + errNameList.join("、") + "</span> 同步信息失败!";
                    if (opt.cb_err) {
                        opt.cb_err(errMsg);
                    }
                    cb_err(data.err);
                } else {
                    if (opt.cb_ok) {
                        opt.cb_ok();
                    }
                    cb_ok(data);
                }
            }
        };
        option.error = function (err) {
            if (opt.cb_err) {
                opt.cb_err();
            }
            cb_err(err);
        };
        MakeWebAPIUtils.getRESTfulData(option);
    },
    /**
     * 恢复推送消息
     * @param opt
     * @param cb_ok
     * @param cb_err
     */
    restoreMessage : function(opt, cb_ok, cb_err){
        var url = "/v1/sm/user/{userid}/pushing/group/{group_id}/restore";
        var userId = opt.userId;
        var group_id = opt.messageId;
        url = url.replace("{userid}", userId).replace("{group_id}", group_id);
        var option = {};
        option.url = url;
        option.type = "PUT";
        option.success = function (data) {
            if (data.err) {
                cb_err(data.err);
            } else {
                cb_ok(data);
            }
        };
        option.error = function (err) {
            cb_err(err);
        };
        MakeWebAPIUtils.getRESTfulData(option);
    },

    /**
     * 新增反馈数据
     * @ options
     *      fb_type,类别：0-反馈信息，其他为举报信息：1-app微杂志，2-众创，3-pc微杂志，4-页举报，5-评论举报
     *      fb_objid ,举报对象id
     *      context，反馈或举报内容
     *      f_username, 用户昵称
     * @ cb_ok
     * @ cb_err
    */
    addFeedback: function (options, cb_ok, cb_err) {
        var currentUser = ContextUtils.getCurrentUser(); //获取当前登录用户信息
        var userId = "";
        if (!currentUser) {
            cb_err("请先登录!");
            return;
        } else {
            userId = currentUser.id;
        }
        var fb_type = options.fb_type || 3;
        var fb_objid = options.fb_objid || "";
        var context = options.context || "";
        var f_username = options.f_username || "";

        var feedbackobj = fmacloud.Object.extend("feedback_obj");
        var feedback = new feedbackobj();
        feedback.set("fb_objid", fb_objid);
        feedback.set("fb_type", parseInt(fb_type));
        feedback.set("fb_fromuser", userId);
        feedback.set("context", context);

        feedback.set("f_username", f_username);

        feedback.save(null, {
            success: cb_ok,
            error: cb_err
        });
    },

    /**
     * 获取会员特权
     * @param opt
     * @param cb_ok
     * @param cb_err
     */
    queryMembershipPrivileges : function(opt, cb_ok, cb_err){
        var url = "/v1/pricing/goods/service/onsale";
        var option = {};
        option.url = url;
        option.type = "GET";
        option.success = function(data){
            if(data.err){
                cb_err(data.err);
            }else{
                cb_ok(data.result);
            }
        };
        option.error = function(err){
            cb_err(err);
        };
        MakeWebAPIUtils.getRESTfulData(option);
    },

    /**
     * 获取我的特权接口
     * @param opt
     * @param cb_ok
     * @param cb_err
     */
    queryMyPrivilegeData : function(opt, cb_ok, cb_err){
        if(!opt.userID) return;

        var url = "/v1/useritem/own";
        var option = {};
        option.url = url;
        option.type = "GET";
        option.userID = opt.userID;
        option.success = function(data){
            if(data.err){
                cb_err(data.err);
            }else{
                cb_ok(data.result);
            }
        };
        option.error = function(err){
            cb_err(err);
        };
        MakeWebAPIUtils.getRESTfulData(option);
    },

    /**
     * 获取我的订单
     * @param opt
     * @param cb_ok
     * @param cb_err
     */
    queryMyOrderData : function(opt, cb_ok, cb_err){
        var fromDate = opt.fromDate || Date.now(), toDate = opt.toDate || Date.now();

        var url = "/v1/orders/own?from={fromDate}&to={toDate}";
        url = url.replace("{fromDate}", fromDate).replace("{toDate}", toDate);
        if(opt.hasOwnProperty("status")){
            url += "&status=" + opt.status;
        }
        var option = {};
        option.url = url;
        option.type = "GET";
        option.userID = opt.userID;
        option.success = function(data){
            if(data.err){
                cb_err(data.err);
            }else{
                cb_ok(data.result);
            }
        };
        option.error = function(err){
            cb_err(err);
        };
        MakeWebAPIUtils.getRESTfulData(option);
    },

    /***
     * 取消当前订单
     * @param opt
     * @param cb_ok
     * @param cb_err
     */
    cancelMyOrder: function(opt, cb_ok, cb_err){
        var url = "/v1/orders/own/{order_id}/cancel";
        url = url.replace("{order_id}", opt.order_id);
        var option = {};
        option.url = url;
        option.type = "PUT";
        option.userID = opt.userID;
        option.success = function(data){
            if(data.err){
                cb_err(data.err);
            }else{
                cb_ok(data.result);
            }
        };
        option.error = function(err){
            cb_err(err);
        };
        MakeWebAPIUtils.getRESTfulData(option);
    },

    /**
     * 支付我的订单
     * @param opt
     * @param cb_ok
     * @param cb_err
     */
    payMyOrder : function(opt, cb_ok, cb_err){
        var url = "/v1/orders/own/{order_id}/payment";
        url = url.replace("{order_id}", opt.order_id);
        var option = {};
        option.url = url;
        option.type = "PUT";
        option.userID = opt.userID;
        option.success = function(data){
            if(data.err){
                cb_err(data.err);
            }else{
                cb_ok(data);
            }
        };
        option.error = function(err){
            cb_err(err);
        };
        MakeWebAPIUtils.getRESTfulData(option);
    },

    /**
     * 充值支付
     */
    recharge : function(opt, cb_ok, cb_err){
        var url = "/v1/trading/recharge";
        var option = {};
        option.url = url;
        option.type = "POST";
        option.data = opt.data;
        option.userID = opt.userID;
        option.success = function(data){
            if(data.err){
                cb_err(data.err);
            }else{
                cb_ok(data.result);
            }
        };
        option.error = function(err){
            cb_err(err);
        };
        MakeWebAPIUtils.getRESTfulData(option);
    },

    /**
     * 获取交易状态
     */
    getTradeStatus : function(opt, cb_ok, cb_err){
        var url = "/v1/trading/trade/status?trade_no={trade_no}";
        url = url.replace("{trade_no}", opt.trade_no);
        var option = {};
        option.url = url;
        option.type = "GET";
        option.data = opt.data;
        option.userID = opt.userID;
        option.success = function(data){
            if(data.err){
                cb_err(data.err);
            }else{
                cb_ok(data.result);
            }
        };
        option.error = function(err){
            cb_err(err);
        };
        MakeWebAPIUtils.getRESTfulData(option);
    }
};

module.exports = MeAPI;