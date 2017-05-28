"use strict";
var env = require("../config/env.js");
module.exports.update = function (user, callback) {
    var user_obj = fmacloud.User.current();
    user_obj.set("user_nick", user.user_nick);
    user_obj.save();

    callback();
//    $.post(env.api + "?act=edit_my", {
//        user: user
//    }, function (data) {
//        callback(data);
//    }, "json")
}

/*
 * version 2.0
 * 上传用户头像
 */
module.exports.upload_userPhoto = function (file, cb_ok, cb_err) {
    var user_obj = fmacloud.User.current();
    var filetype = file.type;
    var file = file;

    var name = user_obj.user_nick + file.name + "";

    var avFile = new fmacloud.File(name, file);

    avFile.save().then(function (obj) {
        cb_ok(obj);
    }, function (error) {
        cb_err(error.message);
    });

}

module.exports.isLogin = function (callback) {
    $.get(env.api + "?act=user_login_is", function (data) {
        callback(data);
    }, "json");
}

/**用户上传素材
 callback,
 uids,  用户id
 material_owner,0系统，1用户
 materialType,元素类型（1.贴纸，2.边框，3.形状，4.背景，5.图片）
 fileobj， file对象
 **/
module.exports.uploadMaterial = function (callback, uids, materialType, material_owner, fBinFile) {
    //save
    if (fBinFile == null || uids.length == 0) return;
    var filename = fBinFile.name.substring(0, fBinFile.name.indexOf("."));
    var jsonobj;

    if (fBinFile.size >= 10 * 1024 * 1024) {
        jsonobj = {results: false, data: "", error: "上传文件只能小于10MB！"};
        callback(jsonobj);
        return;
    }

    // get upload token
    var xmlhttp = {};
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("POST", "https://cn.avoscloud.com/1/qiniu");
    xmlhttp.setRequestHeader("X-AVOSCloud-Application-Id", fmacloud.applicationId);//应用数据实例，以保存到数据实例表 640 1004 图片宽高
    xmlhttp.setRequestHeader("X-AVOSCloud-Application-Key", fmacloud.applicationKey);
    xmlhttp.setRequestHeader("Accept", "application/json");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    var currentTS = fmacapi_create_uid("") + fBinFile.name.substring(fBinFile.name.indexOf("."), fBinFile.name.length);//(new Date()).valueOf().toString();
    var xhrParams = {};
    xhrParams["key"] = currentTS;
    // xhrParams["key"] = currentTS;
    xhrParams["name"] = filename;
    xhrParams["__type"] = "File";
    xhrParams["mime_type"] = fBinFile.type;
    xhrParams["metaData"] = {"size": fBinFile.size, "owner": uids};
    xmlhttp.send(JSON.stringify(xhrParams));
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == xmlhttp.DONE) {
            var jsonRes = JSON.parse(xmlhttp.responseText);
            var bucket = jsonRes.bucket;
            var upToken = jsonRes.token;
            var fileBucket = new qiniu.bucket(bucket, {putToken: upToken});
            fileBucket.putFile(currentTS, fBinFile).then(function (reply) {
                var Materialobj = fmacloud.Object.extend("pc_material");
                var materialobj = new Materialobj();
                if( parseInt(materialType) == 10 || fBinFile.type == "image/gif" ){ //音乐和GIF图片不追加格式化
                    materialobj.set("material_src", jsonRes.url);
                }else{
                    materialobj.set("material_src", jsonRes.url + "?imageView2/2/w/640/h/1008");//?imageView2/2/format/jpg/q/80
                }
                materialobj.set("material_name", filename);
                materialobj.set("material_owner", material_owner);//0系统，1用户 pc端给用户默认值
                materialobj.set("material_type", parseInt(materialType));
                materialobj.set("user_id", uids);
                materialobj.save(null, {
                    success: function (obj) {
                        jsonobj = {result: true, data: obj, error: ""};
                        callback(jsonobj);
                    },
                    error  : function (obj, error) {
                        jsonobj = {result: false, data: "", error: error.message};
                        callback(jsonobj);
                    }
                });
            }, function (err) {
                jsonobj = {result: false, data: "", error: err.message};
                callback(jsonobj);
            });
        }
    };
    xmlhttp.addEventListener("error", function (e) {
        console.log("Error: " + e);
    }, false);
}

/**用户上传素材
 callback,
 uids,  用户id
 material_owner,0系统，1用户
 materialType,元素类型（1.贴纸，2.边框，3.形状，4.背景，5.图片）
 fileobj， file对象
 **/
module.exports.uploadMaterialByBase64 = function (callback, uids, materialType, material_owner, base64info, filename) {

    if (uids.length == 0) return;
    var jsonobj;
    if (base64info) {
        var file = new fmacloud.File(filename + ".png", {base64: base64info});
        file.save().then(function (imgobj) {
            var Materialobj = fmacloud.Object.extend("pc_material");
            var materialobj = new Materialobj();
            materialobj.set("material_src", imgobj.get("url") + "?imageView2/2/w/640/h/1008");//?imageView2/2/format/jpg/q/80
            materialobj.set("material_name", filename);
            materialobj.set("material_owner", material_owner);//0系统，1用户 pc端给用户默认值
            materialobj.set("material_type", parseInt(materialType));
            materialobj.set("user_id", uids);
            materialobj.save(null, {
                success: function (obj) {
                    jsonobj = {result: true, data: obj, error: ""};
                    callback(jsonobj);
                },
                error  : function (obj, error) {
                    jsonobj = {result: false, data: "", error: error.message};
                    callback(jsonobj);
                }
            });
        }, function (error) {
            jsonobj = {result: false, data: "", error: error.message};
            callback(jsonobj);
        });
    }
}

/****获取PC端微杂志素材
 多条件参数查询作品数据
 uids， 用户id

 【optionsjson】 为json格式
 filterfield,条件字段
 filterval, 条件值
 material_type,元素类型，可选（1-图片,2-文本,3-水印,4-动画,5-路径,6-填充区域,7-音频,8-视频,9-前景图,10-画框,11-链接,12-电话,13-邮件,14-输入,15-地图,16-报名）
 material_owner,所属 0系统，1用户
 sortfield, 排序字段
 isdesc, 是否降序
 pageNumber, 页码
 pageSize，每页显示条数

 ******/
module.exports.getMaterial = function (callback, options) {//filterfield, filterval, material_type,material_owner,sortfield, isdesc, pageNumber, pageSize

    var filterfield = options.filterfield || "",
        filterval = options.filterval || "",
        material_type = options.material_type || 1,
        material_owner = options.material_owner || 0,
        sortfield = options.sortfield || "createdAt",
        isdesc = options.isdesc || true,
        skip = options.skip || 0,
        limit = options.limit || 8,
        user_id = options.uid;

    // var limit = pageSize;
    // var skip = 0;
    // //比如要看第 10 页，每页 10 条   就应该是 skip 90 ，limit 10
    // if (pageNumber != 0) {
    //     skip = pageSize * pageNumber - pageSize;
    // } else {
    //     skip = pageNumber;
    // }

    var strCQL = " select count(*),* from pc_material ";
    if (user_id) {
        strCQL += " where user_id='" + user_id + "' ";
    } else {
        strCQL += " where material_owner=" + material_owner;
    }

    if (filterfield.length > 0) {
        strCQL += " and " + filterfield + " like'" + filterval + "' ";
    }
    if (material_type.length != 0) {
        strCQL += " and material_type=" + parseInt(material_type);
    }
    //翻页
    if (skip >= 0 && limit > 0) {
        strCQL += " limit " + skip + "," + limit;
    }
    if (sortfield.length > 0) {
        if (isdesc) {
            strCQL += " order by " + sortfield + "  desc ";
        } else {
            strCQL += " order by " + sortfield + " asc ";
        }
        ;
    }
    fmacloud.Query.doCloudQuery(strCQL, {
        success: function (result) {
            var obj = {"data": result.results, "count": result.count};
            callback(obj);
        },
        error  : function (error) {
            console.log(error.message);
        }
    });
}

/**
 用户删除自己的资源数据
 mid, 资源id (单个资源删除)
 **/
module.exports.delMaterialByUid = function (mids, callback) {//mid, 资源id
    if (mids.length == 0) return;
    var query = new fmacloud.Query("pc_material");
    query.equalTo("objectId", mids);
    query.first({
        success: function (tpl) {
            if (tpl) {
                tpl.destroy({
                    success: function (delobj) {
                        callback && callback.call(this, delobj);
                    },
                    error  : function (delobj, error) {
                        console.log("删除失败！失败原因：" + error.message);
                    }
                });
            }
        },
        error  : function (error) {
            console.log("删除失败：" + error.message);
        }
    });
}


/*根据用户id匹配作品数据,然后修改用户信息
 cloumn :字段,
 val：  值
 */
module.exports.update_tplobj_Userinfo = function (cloumn, val) {
    var resultCount = 0;
    var cb = function (len) {
        resultCount++;
        if (resultCount >= len) {
            //console.log("修改成功");
        }
    }
    var query = new AV.Query("tplobj");
    query.equalTo("author", fmacloud.User.current().id);
    query.find({
        success: function (tpl) {
            var tpl_obj
            for (var i = 0; i < tpl.length; i++) {
                tpl_obj = tpl[i];
                tpl_obj.set(cloumn, val);
                tpl_obj.save(null, {
                    success: function (tplobj) {
                        cb(tpl.length);
                    },
                    error  : function (tplobj, error) {
                        console.log(error);
                    }
                });
            }
        },
        error  : function (tpl, error) {
            console.log(error);
        }
    });
}

/** 用户收藏
 fav_type: 收藏类型(1.微杂志，2.其它定义, 3. XXXX)，
 fav_id  ：收藏作品id，
 fav_exp ：收藏的备注，不能超过200个字，
 user_id ：用户id，
 cb_ok   : 成功回调，
 cb_err  ：失败回调
 执行功能：1.对me_favorites收藏表新增数据。 2.对tplobj表对应的作品收藏数 +1
 **/
module.exports.userTplCollection = function (fav_type, fav_id, fav_exp, user_id, cb_ok, cb_err) {
    //如果存在该收藏作品则不进行收藏操作
    var _this = this;
    var currentUser = fmacloud.User.current(); //获取当前登录用户信息
    var query = new fmacloud.Query("me_favorites");
    query.equalTo("user_id", currentUser.id);
    query.equalTo("fav_id", fav_id);
    query.find(
        function (obj) {
            // console.log(obj);
            if (obj.length > 0) {
                //console.log(" 作品已经被收藏 ");
                cb_err && cb_err();
                return;
            } else {
                var favobj = fmacloud.Object.extend("me_favorites");
                var obj = new favobj();
                obj.set("fav_type", fav_type);
                obj.set("fav_id", fav_id);
                obj.set("user_id", user_id);
                obj.set("data_site", 1);
                obj.save(null, {
                    success: function (obj) {
                        // console.log(" save_ok -> " , obj);
                        _this.updateTplStore(fav_id, "add", cb_ok, cb_err); //作品收藏数+1
                    },
                    error  : function (obj, eeror) {
                        console.log("收藏出错:" + error.message);
                    }
                });
            }
        },
        function (obj, error) {
            console.log("匹配作品出错:" + error.message);
        });
};

/*对作品表收藏加1 或减1
 fav_id:作品ID
 storetype： 操作类型 add 为收藏数加1 minus 为收藏数减1
 */
module.exports.updateTplStore = function (fav_id, storetype, cb_ok, cb_err) {
    var query = new fmacloud.Query("tplobj"); //查询取消收藏的数据匹配记录
    query.equalTo("tpl_id", fav_id); //作品id
    query.first({
        success: function (tplobj) {
//				console.log(tplobj);
            var stroe_count = tplobj.get("store_count");
            if (storetype == "add") {
                tplobj.set("store_count", stroe_count + 1);
            } else {
                if (stroe_count > 0) {
                    tplobj.set("store_count", stroe_count - 1);
                }
            }
            tplobj.save(null, {
                success: cb_ok,
                error  : cb_err
            });
        },
        error  : function (error) {
            console.log("操作出错:" + error.message);
        }
    });
};

/*
 * 作品假删
 */
module.exports.fakeDeleteStore = function (tid, type, cb_ok, cb_err ) {
    var _tid = tid,
        _type = type;
    var query = new fmacloud.Query("tplobj");
    query.equalTo("tpl_id", _tid);
    query.descending("createdAt");
    query.first({
        success: function (tplObj) {
            if (tplObj) {
                tplObj.set("tpl_delete", _type);
                tplObj.set("tpl_delete_date", new Date());
                tplObj.save(null, {
                    success: cb_ok,
                    error: cb_err
                });
            }
        }, error: function () {
        }
    });
}
/*
 * 删除用户收藏的作品
 */
module.exports.deleteUserStore = function (fav_id, cb_ok, cb_err) {
    var _this = this;
    var currentUser = fmacloud.User.current(); //获取当前登录用户信息
    var userObjectId = currentUser.id;
    var query = new fmacloud.Query("me_favorites"); //查询取消收藏的数据匹配记录
    query.equalTo("user_id", currentUser.id);
    query.equalTo("fav_id", fav_id);
    query.find(
        function (obj) {
            var favobj = obj[0];
            if (favobj == null) return;
            favobj.destroy({ //删除表数据，同时对作品收藏数-1
                success: function (obj) {
                    _this.updateTplStore(fav_id, "minus", cb_ok, cb_err); //作品收藏数-1
                },
                error  : function (obj, eeror) {
                    console.log("操作出错:" + error.message);
                }
            });
        },
        function (obj, error) {
            console.log("操作出错:" + error.message);
        }
    );
};

/*
 * PC端表单属性查询，PC端的快捷菜单默认的表单组件可和右下方的表单供选择列表统一用这个查询方法
 */
module.exports.QueryFormProperty = function (cb_ok, cb_err) {
    var query = new fmacloud.Query("pc_formproperty");
    query.equalTo("field_approved", 1);  //已上架数据
    query.descending("field_recommend"); //先按快捷菜单排序，都为1，所以设置为快捷菜单的先查询出来。
    query.addDescending("field_order");  //再按排序字段降序排序。
    query.find(
        function (obj) {
            cb_ok(obj);
        },
        function (obj, error) {
            cb_err(error.message);
        }
    );
};
/*
 * PC端查询用户的作品反馈信息
 tpl_id:作品id
 userid:用户id
 field： 字段名 如 "cd_phone" 根据手机号查询
 fieldval 字段值 如手机号的值为 13122965852
 orderby 排序字段  如 "createdAt" 创建时间
 isdesc  是否为降序 true/false
 skip 从第几条开始查询
 limit 每页显示条数
 recently_day 最近一日时间 string
 */
module.exports.QueryFormDataByTpl = function (op, cb_ok, cb_err) {
    // if (cd_tplid) return;
    var options = {
        tpl_id      : "",
        userid      : "",
        field       : "",
        fieldval    : "",
        orderby     : "",
        isdesc      : "",
        pageSize    : "",
        pageNumber  : "",
        recently_day: ""
    };
    for (var prop in op) {
        options[prop] = op[prop];
    }
    var tpl_id = options.tpl_id,
        userid = options.userid,
        field = options.field,
        fieldval = options.fieldval,
        orderby = options.orderby,
        isdesc = options.isdesc,
        pageSize = options.pageSize,
        pageNumber = options.pageNumber,
        recently_day = options.recently_day;

    var skip = 0;
    var limit = pageNumber;
    //比如要看第 10 页，每页 10 条   就应该是 skip 90 ，limit 10
    if (pageSize != 0) {
        skip = pageSize * pageNumber;
    }
    var query = new fmacloud.Query("me_customerdata");
    query.equalTo("cd_tplid", tpl_id);
    query.equalTo("cd_userid", userid);

    //自定义字段查询
    if (field.length > 0) {
        query.equalTo(field, fieldval);
    }
    //最近一日
    if (recently_day.length > 0) {
        var date_a_day = new Date(recently_day); //用Date方法格式化时间
        query.lessThan("createdAt", date_a_day);
    }

    //翻页
    if (skip >= 0 && limit > 0) {
        query.limit(limit);
        query.skip(skip);
    }
    //指定字段排序
    if (orderby.length > 0) {
        if (isdesc) {
            query.descending(orderby);
        } else {
            query.ascending(orderby);
        }
        ;
    }
    query.find(
        function (obj) {
            cb_ok(obj);
        },
        function (obj, error) {
            cb_err(error.message);
        }
    );
};
/**
 PC端查询用户的作品反馈信息,获取总长度
 **/
module.exports.QueryFormCountByTpl = function (tpl_id, userid, field, fieldval, cb_ok) {
    // if (cd_tplid) return;
    var query = new fmacloud.Query("me_customerdata");
    query.equalTo("cd_tplid", tpl_id);
    query.equalTo("cd_userid", userid);

    //自定义字段查询
    if (field.length > 0) {
        query.equalTo(field, fieldval);
    }
    query.count(
        function (obj) {
            cb_ok(obj);
        },
        function (obj, error) {
            cb_err(error.message);
        }
    );

};

//导出excel
module.exports.exportExcel = function (tableid) {
    var idTmr;

    function getExplorer() {
        var explorer = window.navigator.userAgent;
        //ie
        if (explorer.indexOf("MSIE") >= 0) {
            return 'ie';
        }
        //firefox
        else if (explorer.indexOf("Firefox") >= 0) {
            return 'Firefox';
        }
        //Chrome
        else if (explorer.indexOf("Chrome") >= 0) {
            return 'Chrome';
        }
        //Opera
        else if (explorer.indexOf("Opera") >= 0) {
            return 'Opera';
        }
        //Safari
        else if (explorer.indexOf("Safari") >= 0) {
            return 'Safari';
        }
    }

    //导出excel方法
    function methodexcel(tableid) {
        if (getExplorer() == 'ie') {
            alert(tableid);
            var curTbl = document.getElementById(tableid);
            var oXL = new ActiveXObject("Excel.Application");
            //创建AX对象excel
            var oWB = oXL.Workbooks.Add();
            //获取workbook对象
            var xlsheet = oWB.Worksheets(1);
            //激活当前sheet
            var sel = document.body.createTextRange();
            sel.moveToElementText(curTbl);
            //把表格中的内容移到TextRange中
            sel.selectValue();
            //全选TextRange中内容
            sel.execCommand("Copy");
            //复制TextRange中内容
            xlsheet.Paste();
            //粘贴到活动的EXCEL中
            oXL.Visible = true;
            //设置excel可见属性
            try {
                var fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
            } catch (e) {
                print("Nested catch caught " + e);
            } finally {
                oWB.SaveAs(fname);

                oWB.Close();
                //xls.visible = false;
                oXL.Quit();
                oXL = null;
                idTmr = window.setInterval("Cleanup();", 1);
            }
        }
        else {
            tableToExcel(tableid)
        }
    }

    //导出excel
    function Cleanup() {
        window.clearInterval(idTmr);
        CollectGarbage();
    }

    var tableToExcel = (function () {
        var uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html  xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><meta http-equiv="Content-Type" content="text/html; charset=utf-8"/><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
            base64 = function (s) {
                return window.btoa(unescape(encodeURIComponent(s)))
            },
            format = function (s, c) {
                return s.replace(/{(\w+)}/g,
                    function (m, p) {
                        return c[p];
                    })
            }
        return function (table, name) {
            //console.log(table);
            if (!table.nodeType) table = document.getElementById(table)
            var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
            window.location.href = uri + base64(format(template, ctx));
        }
    })()
    methodexcel(tableid);
};
/**
 根据输入的邀请码判断邀请码的使用状况

 **/
module.exports.getInviteCodeStatus = function (invite_code, cb_ok, cb_err) {
    if ("" == invite_code || undefined == invite_code) return;

    var query = new fmacloud.Query("pc_invitecode");
    query.equalTo("invite_code", invite_code);
    query.first({
        success: function (obj) {
            if (!!obj) {
                var status = obj.get("code_status");
                var sucessjson = "";
                if (status == 0) {
                    sucessjson = {"success": true, "error_code": status, "message": "邀请码可使用！"};
                } else if (status == 1) {
                    sucessjson = {"success": false, "error_code": status, "message": "邀请码已经被使用！"};
                } else if (status == 2) {
                    sucessjson = {"success": false, "error_code": status, "message": "邀请码已经被禁用！"};
                }
                cb_ok(sucessjson);
            } else {
                cb_err();
            }
        },
        error  : cb_err
    });
};

/**
 提交设计师的用户信息

 **/

module.exports.designerSubmitInfo = function (options, cb_ok, cb_err) {
    var real_name = options.real_name || "",
        job = options.job || "",
        vipphone = options.vipphone || "",
        invite_code = options.invite_code || "";
    var currentUser = fmacloud.User.current(); //获取当前登录用户信息
    if (currentUser) {
        currentUser.set("user_type", 1);//用户类别设置为 1设计师类别
        currentUser.set("job", job);
        currentUser.set("approved_status", 2); //使用验证码的时候直接设置为 通过
        currentUser.set("vipphone", vipphone);
        currentUser.set("real_name", real_name);
        currentUser.save(null, {
            success : function (obj) {
                if (obj) {
                    //修改邀请码为已使用
                    var query = new fmacloud.Query("pc_invitecode");
                    query.equalTo("invite_code", invite_code);
                    query.first({
                        success: function (obj_code) {
                            if (obj_code) {
                                obj_code.set("code_status", 1);//设置邀请码为已使用1
                                obj_code.save(null, {
                                    success: function () {
                                        cb_ok(obj);
                                    },
                                    error  : cb_err
                                });
                            } else {
                                cb_ok(obj);
                            }
                        },
                        error  : cb_err
                    });
                }
            }, error: function (error) {

            }
        });
    }
};
