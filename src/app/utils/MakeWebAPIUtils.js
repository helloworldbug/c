/**
 * @component MakeWebAPIUtils
 * @description Make(制作)模块 Web API Utils
 * @time 2015-08-27 10:30
 * @author StarZou
 **/
var UserUtil = require("./user")
var GroupInit = require("../components/Common/GroupInit");
var WorkDataUtil = require('../utils/WorkDataUtil');
var $ = require("jquery");
var serverurl = require("../config/serverurl.js")
var Base = require('./Base.js');
var log = require("loglevel");
var MakeWebAPIUtils = {
    /**
     * 删除多上数据后通知client
     * @param arr
     * @param cb
     */
    deleteMultiMaterial: function (arr, cb) { //arr=[id,id]
        function promiseDelMaterial(id) {
            var p = new Promise(function (resolve, reject) {
                UserUtil.delMaterialByUid(id, function (delobj) {
                    resolve(delobj)
                });
            })
            return p
        }

        var promeseArr = arr.map(promiseDelMaterial);
        Promise.all(promeseArr).then((rets) => {
            cb(rets);
        }).catch(reason => {
            console.log(reason);
        })


        //this.setState({deleteImgIds:[]})
    },

    /**
    * 查询作品id查询ME刊数据的所有group数据
    * @param tplid 作品id
    * @param cb_ok
    * @param cb_err
    * @returns {*}
    */
    getAllGroupDataByTplid: function (tplid, cb_ok, cb_err) {
        var query = new AV.Query("t_tpl_group");
        query.equalTo("f_belong_tpl", tplid);
        query.find({
            success: function (results) {
                cb_ok(results);
            }, error: function (results, error) {
                cb_err(error);
            }
        });
    },
    /**
     * 取组数据
     * @param tplid
     * @returns {Promise}
     */
    getAllGroupDataByTplidPromise: function (tplid) {
        return new Promise(function (resolve, reject) {
            MakeWebAPIUtils.getAllGroupDataByTplid(tplid, resolve, reject)
        })
    },
    /**
     * 取期刊作品的树型
     * @param tid
     * @param success
     * @param error
     */
    getMagazineTreeDataById: function (tid, success, error) {
        MakeWebAPIUtils.getMagazineTemplateDataById(tid, function (tpl, tplData) {
            success(tpl, WorkDataUtil.table2Tree(tplData, tid))
        }, error)
    },
    /**
     * 取期刊作品，有组
     * @param tid
     * @param success
     * @param error
     */
    getMagazineTemplateDataById: function (tid, success, err) {
        MakeWebAPIUtils.getAllGroupDataByTplidPromise(tid).then(function (groups) {
            MakeWebAPIUtils.getTemplateDataById(tid, function (templateObject, pagesObject) {
                WorkDataUtil.debugLog(templateObject, pagesObject, "open");
                pagesObject.unset("parent");
                if (groups.length == 0) {
                    ///老作品添加组
                    var group = GroupInit.createBlankGroup(pagesObject, "组");
                    group.set("f_parent", tid);
                    var group_id = group.get("f_object_id");
                    pagesObject.get("pages").forEach((page, index) => {
                        page.set("f_tpl_group_id", group_id);
                        page.set("f_order_num", index);
                    });
                    pagesObject.set("group", [group])
                } else {
                    pagesObject.set("group", groups)
                }
                if (success) success(templateObject, pagesObject);
            }, function (error) {
                // error
                if (err) err(error);
                console.log(error);
            });
        }).catch(function (e) {
            err(e)
        })
    },
    // 根据tid, 查询template作品数据, pages数据
    getTemplateDataById: function (tid, success, error) {
        var _this = this;
        fmacapi.tpl_get_tpl(tid, function (templateObject) {

            //fmacapi.tpl_get_data
            fmacapi.tpl_get_data(tid, function (pagesObject) {
                success(templateObject, pagesObject);
            }, function () {
                _this.cld_get_tpl_data_local(tid, function (pagesObject) {
                    success(templateObject, pagesObject);
                }, function (e) {
                    error(e);
                });
            });

        }, function (e) {
            error(e);
            console.log(e);
        });
    },
    // 根据tid, 查询template作品数据, pages数据
    getTPL: function (tid) {
        return new Promise(function (resolve, reject) {
            fmacapi.tpl_get_tpl(tid, function (templateObject) {
                resolve(templateObject)
            }, function (e) {
                error(e);
                reject(e);
            });
        })

    },

    cld_get_tpl_data_local: function (tplId, callback_ok, callback_err) {
        var stdout = { "log": "" };
        if (!tplId) {
            callback_err("作品id为空!");
            return;
        }
        try {
            function _execute_array_task(objArray, index, cb_task, cb_ok, cb_err) {
                if (objArray) {
                    cb_task(objArray[index], function () {
                        if (index < objArray.length - 1) {
                            _execute_array_task(objArray, index + 1, cb_task, cb_ok, cb_err);
                        } else {
                            cb_ok(objArray);
                        }
                    }, cb_err);
                } else {
                    console.log(tplId + " its pages data is destroyed ");
                    cb_err(tplId + " its pages data is destroyed!");
                }
            }

            function cb_ok(tpl_data) {
                stdout.data = tpl_data;
                callback_ok(tpl_data);
            }

            function cb_err(err) {
                callback_err(err.message);
            }

            function _fetch_object(objArray, index, cb_ok, cb_err) {
                _execute_array_task(objArray, index, function (obj, cb_task_ok, cb_task_err) {
                    obj.fetch().then(cb_task_ok, cb_task_err);
                }, function (obj) {
                    cb_ok(obj);
                }, cb_err);
            }

            var data_obj = AV.Object.extend("pages_data");
            var query = new AV.Query(data_obj);

            query.equalTo("key_id", tplId);
            query.descending("createdAt");
            query.find().then(function (dsObj) {

                if (dsObj.length > 0) {

                    var dObj = dsObj[0];
                    var pages = dObj.get("pages");

                    //获取每个页对象数据
                    _fetch_object(pages, 0, function (pages) {
                        _execute_array_task(pages, 0, function (page, cb_ok, cb_err) {
                            var items = page.get("item_object");
                            _fetch_object(items, 0, cb_ok, cb_err);
                        }, function () {
                            var page = dObj.get("pages")[0];
                            if (!!page.get("item_object")[0].get("item_id")) {
                                cb_ok(dObj);
                            } else {
                                cb_err(new AV.Error(3201, "元素数据可能已受到损坏。"));
                            }
                        }, cb_err);
                    }, cb_err);
                } else {
                    cb_err(new AV.Error(3202, "指定ID的数据不存在。"));
                }
            }, function (error) {
                cb_err(error);
            });
        } catch (e) {
            console.log("ME作品数据出错！" + e.message);
            callback_err(tplId + "作品数据出错！" + e.message);
        }
    },

    convertTplDataToJson: function (tplData) {
        var tjObj = tplData.toJSON();
        var pages = tplData.get("pages");
        var pagesJson = [];

        for (var i = 0; i < pages.length; i++) {
            var page = pages[i];
            var pageJson = page.toJSON();
            var items = page.get("item_object");
            var itemsJson = [];
            for (var j = 0; j < items.length; j++) {
                var item = items[j];
                itemsJson[j] = item.toJSON();
            }
            pageJson.item_object = itemsJson;
            pagesJson[i] = pageJson;
        }

        tjObj.pages = pagesJson;
        return tjObj;

    },
    /**
     * 取RESTful数据
     * @param opts ajax配置对象
     * {
     * url：RESTful 路径和参数,       (必填)
     * success：成功回调              (必填)
     * data：向服务器发送的数据       (选填) 如果contentType = "application/json"，data可以用Object或json string,其他类型data只能为string
     * error：失败回调                (选填)
     * type : 请求类型               （选填）
    * dataType ：返回类型，默认为"json"，支持ajax支持的类型 (选填)
    * @param urlType 表示启用的查询服务器的格式，表示true是启用转档服务
     * }
     */
    getRESTfulData: function (opts) {
        if (typeof opts.url != "string") {
            throw "url must provided";
        }

        if (typeof opts.success != "function") {
            throw "success must provided";
        }

        if (!opts.type) opts.type = "GET";

        MakeWebAPIUtils.exchangeRESTfulData(opts.url, opts.data, opts.success, opts.error, opts.type, opts.dataType, opts.contentType, opts.userID, opts.urlType || false)
    },
    /**
     * 提交RESTful数据
     * @param opts ajax配置对象
     * {
     * url：RESTful 路径和参数,       (必填)
     * data：向服务器发送的数据       (必填) 如果contentType = "application/json"，data可以用Object或json string,其他类型data只能为string
     * success：成功回调              (必填)
     * error：失败回调                (选填)
     * type : 请求类型               （选填）
     * urlType：RESTful 不同服务,    填写了表示用转档服务器   (选填)
    * dataType ：返回类型，默认为"json"，支持ajax支持的类型 (选填)
    * contentType:跟服务器约定的提交格式 默认为"application/json" (选填)
    * @param urlType 表示启用的查询服务器的格式，表示true是启用转档服务
     * }
     */
    postRESTfulData: function (opts) {
        if (typeof opts.url != "string") {
            throw "url must provided";
        }
        if (!opts.data) {
            throw "data must provided";
        }
        if (typeof opts.success != "function") {
            throw "success must provided";
        }
        MakeWebAPIUtils.exchangeRESTfulData(opts.url, opts.data, opts.success, opts.error, opts.type || "POST", opts.dataType, opts.contentType, opts.userID, opts.urlType || false)
    },

    /**
     * 获取和提交RESTful数据接口
     * @param url 接口地址
     * @param data  传输数据 如果contentType = "application/json"，data可以用Object或json string,其他类型data只能为string
     * @param success 成功回调
     * @param error  失败回调
     * @param type  取数据type = "GET"，提交数据type = "POST"
     * @param dataType 成功返回数据的格式dataType= "json"或dataType= "text"等ajax支持的格式
     * @param urlType 表示启用的查询服务器的格式，表示true是启用转档服务
     */
    exchangeRESTfulData: function (url, data, success, error, type = "POST", dataType = "json", contentType = "application/json", userID = "", urlType) {
        var server = urlType ? serverurl.convertApi : serverurl.api;
        var headers = { "X-Gli-Client-Id": "MEWebClient" }
        if (userID) {
            headers["X-Gli-User-Id"] = userID
        }
        $.ajax({
            headers: headers,
            type: type,
            url: server + url,
            contentType: contentType,
            data: contentType == "application/json" && typeof data == "object" ? JSON.stringify(data) : data,
            success: function (result) {
                success && success(result);
            },
            error: function (msg) {
                error && error(msg);
            },
            dataType: dataType
        });
    },
    /**
     * 更新缓存中的用户拥有特权信息
     * 
     */
    updateOwnGoods: function (goodInfoArr) {
        goodInfoArr = goodInfoArr.result;
        var cache = sessionStorage.getItem("owngoods");
        if (!!cache) {
            cache = JSON.parse(cache);
            var localGoods = cache.data.result;
            var len = localGoods.length;
            goodInfoArr.forEach(newInfo => {
                for (var i = 0; i < len; i++) {
                    var localItem = localGoods[i];
                    if (newInfo.item_description.item_id == localItem.item_description.item_id) {
                        localGoods[i] = newInfo;
                        break
                    }
                }
            });
            sessionStorage.setItem("owngoods", JSON.stringify(cache));
            return true;
        } else {
            return false
        }
    },
    clearOwnGoods: function () {
        sessionStorage.removeItem("owngoods")
    },
    /**
  * 加载用户购买的特权(商品)
  *@param userID 用户ID
  *@param refresh 是否强制向服务器请求最新特权，为true是请求，false时使用本地缓存
  *@return promise
  */
    loadOwnGoods: function (userID, refresh = false) {
        var needGet = true;
        if (!Base.getCurrentUser()) {
            return Promise.reject("没有登陆");
        }

        var id = userID || Base.getCurrentUser().id;
        if (!refresh) {
            var cache = sessionStorage.getItem("owngoods");
            if (!!cache) {
                cache = JSON.parse(cache);
                if (cache.user == id) {
                    needGet = false;
                }
            }
        }

        return new Promise(function (resolve, reject) {

            if (needGet) {
                MakeWebAPIUtils.getRESTfulData({
                    url: "/v1/useritem/own",
                    userID: id,
                    success: function (result) {
                        if (typeof result.err == 'undefined') {
                            sessionStorage.setItem("owngoods", JSON.stringify({ user: id, data: result }))
                        }
                        resolve(result)
                    },
                    error: function (msg) {
                        reject(msg)
                    }
                })
            } else {
                resolve(cache.data)
            }

        });

    },
    /**
     * 取服务器最近更新时间
     */
    getServerUpdateTime: function () {
        return new Promise(function (resolve, reject) {
            MakeWebAPIUtils.getRESTfulData({
                url: "/v1/pricing/goods/price/lastupdatedat",
                success: function (result) {
                    resolve(result.result.updated_at);
                },
                error: function (msg) {
                    log.info("getServerUpdateTime err")
                    resolve(msg.message)
                }
            })

        });
    },

    /**
 * 加载特权(商品)价格
 *@param refresh 是否强制向服务器请求最新价格，为true是请求，false时使用本地缓存
 *@return promise
 */
    loadPrices: function () {
        const EXPIRCETIME = 60 * 1000;
        return new Promise(function (resolve, reject) {
            var cache = localStorage.getItem("goodprices");
            if (!!cache) {
                cache = JSON.parse(cache);
                var expireTime = cache.expireAt;
                if (!!expireTime && expireTime > new Date()) {
                    //本地没expire，直接返回结果
                    return resolve(cache.ret)
                }
            }
            MakeWebAPIUtils.getServerUpdateTime().then(function (time) {
                if (!!time) {
                    //取服务端更新时间
                    if (!!cache) {
                        var localTime = cache.updateAt;
                        if (time == localTime) {
                            //本地的更新时间跟服务器一样，不需要更新
                            var now = new Date()
                            cache.expireAt = EXPIRCETIME + now.valueOf()
                            localStorage.setItem("goodprices", JSON.stringify(cache));
                            return resolve(cache.ret)
                        }
                    }
                }
                var serviceNames = ['service', "template", "component"];
                var servicePromise = serviceNames.map(name => {
                    return new Promise(function (resolve, reject) {
                        MakeWebAPIUtils.getRESTfulData({
                            url: `/v1/pricing/goods/${name}/onsale`,
                            success: function (result) {
                                if (typeof result.err == 'undefined') {
                                    resolve(result);
                                }
                            },
                            error: function (msg) {
                                reject(msg)
                            }
                        })
                    })

                })
                Promise.all(servicePromise).then(data => {
                    var now = new Date()
                    var obj = {
                        updateAt: time,
                        expireAt: EXPIRCETIME + now.valueOf(),
                        ret: { [serviceNames[0]]: data[0], [serviceNames[1]]: data[1], [serviceNames[2]]: data[2] }
                    }
                    localStorage.setItem("goodprices", JSON.stringify(obj));
                    resolve(obj.ret);
                }).catch((msg) => {
                    reject(msg)
                })


            }).catch(function (err) {
                log.info(err)
            })
        });
    },
    /**
     * 作品是否使用过customCode功能
     */
    ifWorkUsed: function (tplID, userID, customCode) {
        return MakeWebAPIUtils.getWorkUsedPrivilege(tplID, userID).then(data => {
            //data是已经收过费的功能
            if (data.result) {
                var chargedArr = data.result
                for (var i = 0, len = chargedArr.length; i < len; i++) {
                    let privilegeItem = chargedArr[i];
                    if (customCode == privilegeItem.external_item_id) {
                        return true
                    }
                }
                return false;
            } else {
                return false
            }
        }).catch(err => {
            log.info(err.message);
            return false
        })
    },
    /**
     * 根据使用tid获取付费特权记录
     */
    getWorkUsedPrivilege: function (tid, userID) {
        if (!tid) {
            return Promise.reject("tid为空")
        }
        return new Promise(function (resolve, reject) {
            MakeWebAPIUtils.getRESTfulData({
                url: `/v1/useritem/own/log/targets?target_type=works&target=${tid}`,
                userID: userID,
                success: function (result) {
                    resolve(result)

                },
                error: function (msg) {
                    reject(msg)
                }
            })
        });
    },
    /**
     * 按类型取商品价格
     *@param  type 获取类型 template：模板、component：组件、service：方案
     */
    getGoodPriceByType: function (type) {
        return new Promise(function (resolve, reject) {

            MakeWebAPIUtils.loadPrices().then((data) => {

                resolve(data[type].result)
            }).catch((err) => {
                reject(err);
            })

        })
    },
    /**
     * 直接从缓存取
     */
    getGoodLocalPrices: function () {
        return new Promise(function (resolve, reject) {
            var cache = localStorage.getItem("goodprices");
            cache = JSON.parse(cache);
            return resolve(cache.ret)
        })

    },
    /**
     * 获取codes对应的价格
     *@param codes ID数组
     *@param userLocal 直接使用缓存
     */
    getGoodPrice: function (codes, userLocal = false, type) {
        return new Promise(function (resolve, reject) {
            if (userLocal) {
                MakeWebAPIUtils.getGoodLocalPrices().then(filterPrices).catch((err) => {
                    reject(err);
                })
            } else {
                MakeWebAPIUtils.loadPrices().then(filterPrices).catch((err) => {
                    reject(err);
                })
            }

            function filterPrices(data) {
                var prices = data[type].result;
                var ret = [];
                // debugger;
                for (let j = 0, len = codes.length; j < len; j++) {
                    let code = codes[j];
                    // if (typeof prices[code] != "undefined") {
                    //     ret[j] = prices[code];
                    // }
                    for (let i = 0, pricesLen = prices.length; i < pricesLen; i++) {
                        var item = prices[i];
                        if (item.custom_code == code) {
                            ret[j] = item;
                        }
                    }
                }
                resolve(ret)
            }
        })

    },
    /**
     * 使用特权
     * @param useItems  要使用的功能id数组
     * @param targetType 作品：works |模板：templates
     * @param targetID 作品ID
     * @param userID
     */
    usePrivilege: function (useItems, targetID, targetType, userID) {
        return new Promise(function (resolve, reject) {
            if (typeof useItems == "undefined" || useItems.length == 0) {
                return reject("没有要使用的特权");
            }
            debugger
            MakeWebAPIUtils.postRESTfulData({
                url: `/v1/useritem/own`,
                userID: userID,
                data: {
                    target_type: targetType, target: targetID, items: useItems.map(id => {
                        return {
                            external_id: id, use_count: 1
                        }
                    })
                },
                success: function (result) {
                    resolve(result)

                },
                error: function (msg) {
                    reject(msg)
                }
            })
        })
    },
    /*
    * 如果老作品的json_URL字段为空,就通过id直接取出json数据
    * --konghuachao--20170511-start--*/
    getWorkJSON1:function(filename){
        var Base = require('./Base');
        var domain = "http://json.agoodme.com/";//存放静态json文件的二级域名
        return new Promise(function (resolve, reject) {
            //var fileUrlConf = "http://ac-syrskc2g.clouddn.com/";//测试服的jsonurl域名
            //if (fmawr === "999") {
            //    fileUrlConf = "http://ac-hf3jpeco.clouddn.com/";//正式服的jsonurl域名
            //}
            var url = domain + filename+".json?"+Date.now();
            debugger;
            //取生成的静态对象文件
            $.ajax({
                type: "GET",
                url: url,
                dataType: "json",
                success: function (data) {
                    try {
                        var str = JSON.stringify(data);
                        data = JSON.parse(str)
                    } catch (e) {
                        reject("data error")
                    }
                    resolve(data);
                },
                error: function (error) {
                    debugger;
                    console.log("ajax", error);
                    reject("ajax error")
                }
            });
        })
    },
    /* --konghuachao--20170511-end--*/
    getWorkJSON: function (fileName) {
        return new Promise(function (resolve, reject) {
            var fileUrlConf = "http://ac-syrskc2g.clouddn.com/";//测试服的jsonurl域名
            if (fmawr === "999") {
                fileUrlConf = "http://ac-hf3jpeco.clouddn.com/";//正式服的jsonurl域名
            }else if(fmawr=="10000"){
                fileUrlConf = "http://ac-m1mab2gt.clouddn.com/";
            }
            var url = fileUrlConf + fileName
            //取生成的静态对象文件
            $.ajax({
                type: "GET",
                url: url,
                dataType: "json",
                success: function (data) {
                    try {
                        var str = JSON.stringify(data);
                        data = JSON.parse(str)
                    } catch (e) {
                        reject("data error")
                    }
                    resolve(data);
                },
                error: function (error) {
                    console.log("ajax", error);
                    reject("ajax error")
                }
            });
        })

    }

};

module.exports = MakeWebAPIUtils;