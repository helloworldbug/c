/**
 * Created by 95 on 2016/1/21.
 */
var PageStore = require("../../stores/PageStore")
var MeConstants=require("../../constants/MeConstants");
var ElementType=MeConstants.Elements;
var checkResult = {}
var RedEnvelope = {
    getSwitch          : function () {
        return new Promise(function check(resolve, reject) {
            fmacloud.Cloud.run('wxhb_check', {}, {
                success: function (res) {
                    if (res.result) {
                        checkResult = res;
                        resolve(res);
                    } else {
                        reject("暂时无法添加红包，请联系4008-868-110");
                    }
                },
                error  : function (error) {
                    reject(error.message);
                }
            })
        });
    },
    getCountSpan       : function (money) {
        return {
            min: Math.ceil(money / 200),
            max: money
        }
    },
    isValidRedEnvelope : function (money, count) {
        if (typeof money == "number" && typeof count == "number") {
            var averageMoney = money / count;
            if (averageMoney >= 1 && averageMoney <= 200) {
                return true;
            } else {
                return false;
            }
        } else {
            return  false
        }
    },
    getPayURL          : function (par) {
        //get qrcode url
        //var par = {
        //    total_fee: '0.01',// 金额
        //    trade_type:'2',//交易类型 2为微信支付
        //   hbid:"7199960b28", //红包ID
        //    uid:'5627199960b28045caf0a5b6',//支付用户id
        //    body:'微信支付'  // 描述
        //};
        return new Promise(function (resolve, reject) {
            fmacloud.Cloud.run('wechat_codeurl', par, {
                success: function (res) {
                    var res = JSON.parse(res);
                    resolve({url: res.codeurl, tradeno: res.tradeno})
                },
                error  : function (error) {
                    reject(error.message);
                }
            })
        })
    },
    getPayState        : function (trade_no) {
        //查询交易状态
        //var params = {
        //    trade_no: "ME201601191700386SLZEC"
        //};
        var params = {
            trade_no: trade_no
        }
        return new Promise(function (resolve, reject) {
            fmacloud.Cloud.run('trade_check', params, {
                success: function (res) {
                    resolve(res);
                },
                error  : function (error) {
                    reject(error.message);
                }
            });
        })

    },
    addRedEnvelope     : function (par) {
        //创建一个红包接口
        //var par = {
        //    userid: "54ddf406e4b04fce195eead2",
        //    tid: "22",
        //    name: "红包名称",
        //    wishing: "红包祝福语",
        //    amount:100.00,
        //    count:100,
        //    starttime:new Date("2016-01-21 14:22:00"),
        //    endtime:new Date("2016-01-22 14:22:00")
        //};
        return new Promise(function check(resolve, reject) {
            fmacloud.Cloud.run('wxhb_new', par, {
                success: function (res) {
                    resolve(res);
                },
                error  : function (error) {
                    reject(error.message);
                }
            });
        });
    },
    getValidMoney      : function (money) {
        ///return money in [moneymin, moneymax]
        if (typeof  checkResult.moneymax == "undefined") {
            throw "wxhb_check error";
        }
        if (typeof money != "number") {
            throw "money type error";
        }
        if (money > checkResult.moneymax) {
            return checkResult.moneymax;
        } else if (money < checkResult.moneymin) {
            return checkResult.moneymin;
        } else {
            return money;
        }
    },
    getTakeRecord      : function (redEnvelopeId) {
        ///
        return new Promise(function (resolve, reject) {
            var query = new fmacloud.Query("wxhb_take_record");
            query.descending("createdAt");//设置排序字段和排序方式 为降序
            query.equalTo("hbid", redEnvelopeId);//红包ID
            query.limit(1000);//取1000条记录
            query.find({
                success: function (results) {
                    resolve(results);
                },
                error  : function (err) {
                    reject(err.message);
                }
            });
        })
    },
    getRedEnvelopeCount: function (userId) {
        //查询用户红包个数
        //var params = {
        //    userid: "54ddf406e4b04fce195eead2",
        //
        //};
        var params = {
            userid: userId
        };
        return new Promise(function (resolve, reject) {
            fmacloud.Cloud.run('wxhb_count', params, {
                success: function (res) {
                    resolve(res);
                },
                error  : function (error) {
                    reject(error.message);
                }
            });
        });

    },
    getRedEnvelopeSum  : function (userId,redEnvelopeId) {
        //var params = {
        //    userid: "54ddf406e4b04fce195eead2",
        //};
        var params = {
            userid: userId,
        };
        if(typeof redEnvelopeId != 'undefined'){
            params.hbid=redEnvelopeId
        }
        return new Promise(function (resolve, reject) {
            fmacloud.Cloud.run('wxhb_query', params, {
                success: function (res) {
                    resolve(res);
                },
                error  : function (error) {
                    reject(error.message);
                }
            });
        });
    },
    refund:function(userID,redEnvelopeId){
        var params = {
            userid: userID,
            hbid:redEnvelopeId
        };
        return new Promise(function (resolve, reject) {
            fmacloud.Cloud.run('wxhb_tk', params, {
                success: function (res) {
                    if(res.result){
                        resolve(res);
                    }else{
                        reject(res.message);
                    }

                },
                error  : function (error) {
                    reject(error.message);
                }
            });
        });
    },

}
module.exports = RedEnvelope