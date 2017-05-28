/**
 * @component HelperAction
 * @description 帮助中心 action
 * @time 2015-10-28
 * @author misterY
 **/

var HelperAction = {
    /** 查询帮助中心内容
    helptype,帮助中心类别
    **/
    getHelpCenter : function (helptype, cb_ok, cb_err) {
        var query = new fmacloud.Query("helpcenter");
        query.equalTo("approved", 1);
        query.ascending("ordernum");
        query.equalTo("helptype", helptype);
        query.find({
            success: cb_ok,
            error: cb_err
        });
    },

    /** 查询帮助中心，帮助类别(已去重)
    **/
    getHelpCenterType : function (cb_ok, cb_err) {
        var query = new fmacloud.Query("helpcenter");
        query.equalTo("approved", 1);
        query.ascending("helptypeorder");
        query.find({
            success: function (obj) {
                if (obj) {
                    var helpTypeArr = [];
                    helpTypeArr.push(obj[0]);
                    var loopbool = function (obj) {
                        var isExsit = false;
                        for (var j = 0; j < helpTypeArr.length; j++) {
                            var a = helpTypeArr[j].get("helptype") || "";
                            var b = obj.get("helptype") || "";
                            if (a == b) {
                                isExsit = true;
                                return isExsit;
                            }
                        }
                        return isExsit;
                    }
                    for (var i = 0; i < obj.length; i++) {
                        if (!loopbool(obj[i])) {
                            helpTypeArr.push(obj[i]);
                        }
                    }
                    cb_ok(helpTypeArr);
                } else {
                    cb_ok("");
                }
            },
            error: cb_err
        });
    }

}

module.exports = HelperAction;