"use strict";
(function (module) {
    /**
     search 作品或者作者
     pc端值显示PC端制造的微杂志
     **/
    module.get = function (callback, pageNumber, pageSize, sortfield, isdesc, tplClass, search, tplType, tplLabel, option) {
        var limit = pageSize;
        var options = option || {};
        var skip = 0;
        //比如要看第 10 页，每页 10 条   就应该是 skip 90 ，limit 10
        if (pageNumber != 0) {
            skip = pageSize * pageNumber - pageSize;
        } else {
            skip = pageNumber;
        }
        var strCQL = " select count(*),* from tplobj where tpl_state!=1 "; // 上架并且是pc端的微杂志 data_site=1
        if (search.length > 0) {
            strCQL += " and name like '%" + search + "%' or author_name like '%" + search + "%' ";
        }
        if (!!options) {
            if (!!options.author) {
                strCQL = " select count(*),* from tplobj where author='" + options.author + "'";
                if (search.length > 0) {
                    strCQL += " and name like '%" + search + "%' or author_name like '%" + search + "%' ";
                }
            }
            if (!!options.tpl_state) {
                strCQL += " and tpl_state = " + options.tpl_state;
            }
            if (!!options.data_site) {
                strCQL += " and data_site = '" + options.data_site + "'";
            }
            if (!!options.approved) {
                strCQL += " and approved = " + options.approved ;
            }
        }
        if (tplClass.length > 0) {
            strCQL += " and tpl_class=" + parseInt(tplClass);
        }
        if (tplType.length > 0) {
            strCQL += " and tpl_type=" + parseInt(tplType);
        }
        if (( !!tplLabel) && (tplLabel != "undefined") && (tplLabel.length > 0)) {
            var _tplLabel = "'" + tplLabel[0] + "'";
            for (var i = 1; i < tplLabel.length; i++) {
                _tplLabel += ",'" + tplLabel[i] + "'";
            }
            strCQL += " and label all (" + _tplLabel + ")";
        }
        if (skip >= 0 && limit > 0) {
            strCQL += " limit " + skip + "," + limit;
        }
        if (sortfield.length > 0 && isdesc != undefined) {
            strCQL += " order by " + sortfield + " " + isdesc;
        }
        // console.log(strCQL);
        fmacloud.Query.doCloudQuery(strCQL, {
            success: function (result) {
                var obj = {
                    "data" : result.results,
                    "count": result.count
                };
                callback(obj);
            },
            error  : function (error) {
                console.log(error.message);
            }
        });
    };
    module.getByUid = function (callback, uids) {
        var query = new fmacloud.Query("tplobj");
        query.equalTo("author", uids);
        query.find({
            success: function (tpls) {
                callback(tpls);
            },
            error  : function (error) {
                console.log(error.message);
            }
        });
    };
    module.getUserTpl = function (callback, userId, pageNumber, pageSize, sortfield, isdesc, search, tplType, option) {
        //$.post(env.api + "?act=user_tpl", {
        //	audit: audit ? audit : "yes",
        //	page: page,
        //	size: size,
        //	order: order,
        //	asc: asc,
        //	search: search !== undefined ? search : "1=1"
        //}, function (data) {
        //	if (data.error) {
        //		alert(data.error);  
        //		return;
        //	}
        //	callback(data);
        //}, "json");  
        //	    var currentUser = fmacloud.User.current(); //获取当前登录用户信息
        //	    if (!(currentUser)) {
        //	        return;
        //	    }
        var userObjectId = userId;
        var options = option || {};

        var limit = pageSize;
        var skip = 0;
        //比如要看第 10 页，每页 10 条   就应该是 skip 90 ，limit 10
        if (pageNumber != 0) {
            skip = pageSize * pageNumber - pageSize;
        } else {
            skip = pageNumber;
        }
        var strCQL = " select count(*),* from tplobj where tpl_delete=0 and author='" + userObjectId + "' "; //and data_site=1 // 上架并且是pc端的微杂志 data_site=1
        if (search.length > 0) {
            strCQL += " and name like '%" + search + "%'  ";
        }
        if (tplType) {
            strCQL += " and tpl_type=" + parseInt(tplType);
        }
        if (options.tplState) {
            strCQL += " and tpl_state=" + parseInt(options.tplState);
        }
        if (options.exceptTid) {
            strCQL += " and tpl_id!='" + options.exceptTid + "'";
        }
        if (skip >= 0 && limit > 0) {
            strCQL += " limit " + skip + "," + limit;
        }
        if (sortfield.length > 0 && isdesc.length > 0) {
            strCQL += " order by " + sortfield + " " + isdesc;
        }
        fmacloud.Query.doCloudQuery(strCQL, {
            success: function (result) {
                var obj = {
                    "data" : result.results,
                    "count": result.count
                };
                callback(obj);
            },
            error  : function (error) {
                console.log(error.message);
            }
        });
    };

    //获取用户收藏数据
    module.getStoreByUserID = function (callback, userId, pageNumber, pageSize, orderby, isdesc, search) {
        //	    var currentUser = fmacloud.User.current(); //获取当前登录用户信息
        //	    if (!currentUser) {
        //	        return;
        //	    }
        //	    var userObjectId = currentUser.id;
        var userObjectId = userId;
        var limit = pageSize;
        var skip = 0;
        //比如要看第 10 页，每页 10 条   就应该是 skip 90 ，limit 10
        if (pageNumber != 0) {
            skip = pageSize * pageNumber - pageSize;
        } else {
            skip = pageNumber;
        }

        var strCQL = " select * from tplobj where tpl_id in (select fav_id from me_favorites where user_id='" + userObjectId + "' ) ";
        if (search.length > 0) {
            strCQL += " and name like '%" + search + "%'  ";
        }
        //翻页
        if (skip >= 0 && limit > 0) {
            strCQL += " limit " + skip + "," + limit;
        }
        if (orderby.length > 0 && isdesc.length > 0) {
            strCQL += " order by " + orderby + " " + isdesc;
        }

        // console.log( strCQL );
        fmacloud.Query.doCloudQuery(strCQL, {
            success: function (result) {
                var obj = {
                    "data" : result.results,
                    "count": result.count
                };
                callback(obj);
            },
            error  : function (error) {
                console.log(error.message);
            }
        });
    };

    module.getByTid = function (callback, tid) {
        //此处是pc1.0读取数据
        //		$.post(env.api + "?act=view_tpl", {
        //			tpl_id: tid,
        //			show: show ? show : "read"
        //		}, function (data) {
        //			if (data.error) {
        //				alert(data.error);
        //			} else {
        //				callback(data);
        //			}
        //	    }, "json")
        //以下是PC2.0读取数据
        var query = new fmacloud.Query("tplobj");
        query.equalTo("tpl_id", tid);
        query.find({
            success: function (tpls) {
                callback(tpls);
            },
            error  : function (error) {
                console.log(error.message);
            }
        });
    };

    module.delete = function (tid, tplobj, cb_ok, cb_err) {
        fmacloud.erase_tpl_works(tid, tplobj, function (obj) {
            cb_ok(obj);
        }, function (obj, err) {
            cb_err(err, obj);
        });
    };

    //		$.post(env.api + "?act=del_tpl", {
    //			tpl_id: tid
    //		}, function (data) {
    //			callback(data);
    //		}, "json")
    /*****
     多条件参数查询作品数据
     callback,
     startdate,开始时间
     enddate, 结束时间
     filterfield,条件字段
     filterval, 条件值
     filtersort,排序字段
     isdesc,是否降序
     pageNumber,页码
     pageSize，每页显示条数
     ******/
    module.getCloudQueryTpl = function (callback, options) { // startdate, enddate, filterfield, filterval, filtersort, isdesc, pageNumber, pageSize
        //var startdate = options.startdate,
        //    enddate = options.enddate,
        //    filterfield = options.filterfields,//为数组
        //    sortfield = options.sortfield || "createdAt",
        //    isdesc = options.isdesc || true,
        //    skip = options.skip || 0,
        //    limit = options.limit || 8;


        ////{
        ////    "name": "kenny",
        ////    "group": [
        ////        {
        ////            "name": "ME泥巴的微杂志"
        ////        },
        ////        {
        ////            "cloumn2": "tplname"
        ////        }
        ////    ],
        ////    "orderby": "editor_no"
        ////}

        //// var limit = pageSize;
        //// var skip = 0;
        //// //比如要看第 10 页，每页 10 条   就应该是 skip 90 ，limit 10
        //// if (pageNumber != 0) {
        ////     skip = pageSize * pageNumber - pageSize;
        //// } else {
        ////     skip = pageNumber;
        //// }

        //var strCQL = " select count(*),* from tplobj ";

        ////时间


        ////翻页
        //if (skip >= 0 && length > 0) {
        //    strCQL += " limit " + skip + "," + length;
        //}
        //if (sortfield.length > 0) {
        //    if (isdesc) {
        //        strCQL += " order by " + sortfield + "  desc ";
        //    } else {
        //        strCQL += " order by " + sortfield + " asc ";
        //    };
        //}

        //fmacloud.Query.doCloudQuery(strCQL, {
        //    success: function (result) {
        //        var obj = { "data": result.results, "count": result.count };
        //        callback(obj);
        //    },
        //    error: function (error) {
        //        console.log(error.message);
        //    }
        //});

        ////////////
        var startdate = options.startdate,
            enddate = options.enddate,
            filterfield = options.filterfield || "",
            filterval = options.filterval || "",
            //sortfield = options.sortfield || "createdAt",
            isdesc = options.isdesc || true,
            skip = options.skip || 0,
            limit = options.limit || 8;

        var query = new fmacloud.Query("tplobj");
        query.limit(limit);
        query.skip(skip);
        if (filterfield.length != 0) {
            query.equalTo(filterfield, filterval);
        }
        if (startdate.length != 0 && enddate.length != 0) {
            startdate = new Date(startdate);
            enddate = new Date(enddate);
            query.greaterThan("createdAt", startdate); //greaterThan方法createdAt大于查询返回的时间
            query.lessThan("createdAt", enddate); //lessThan方法createdAt小于查询返回的时间
        }
        if (filtersort.length != 0) {
            if (isdesc) {
                query.descending(filtersort);
            } else {
                query.ascending(filtersort);
            }
        }
        query.find({
            success: function (tpls) {
                callback(tpls);
            },
            error  : function (error) {
                console.log(error.message);
            }
        });
    };

    /***
     多条件参数查询作品数据
     callback,
     label,标签
     sortfield,排序字段
     isdesc,是否降序
     skip,页码
     limit，每页显示条数
     ***/
    module.getModel = function (callback, options) {
        var label = options.label || "",
            tpl_type = options.tpl_type || "12",
            sortfield = options.sortfield || "createdAt",
            isdesc = options.isdesc || true,
            skip = options.skip || 0,
            limit = options.limit || 8,
            userId = options.userId || "";

        var query = new fmacloud.Query("tplobj");
        query.limit(limit);
        query.skip(skip);

        query.equalTo("approved", 1);

        if (label.length != 0) {
            query.containsAll("label", label);
        }
        if (!!userId) {
            query.equalTo("author", userId);
        }
        if (tpl_type.length != 0) {
            query.equalTo("tpl_type", parseInt(tpl_type));
        }
        if (sortfield.length != 0) {
            if (isdesc) {
                query.descending(sortfield);
            } else {
                query.ascending(sortfield);
            }
        }
        query.find({
            success: function (tpls) {
                callback(tpls);
            },
            error  : function (error) {
                console.log(error.message);
            }
        });
    };

    /***
     查询元素对象resobj
     callback,
     label,标签
     sortfield,排序字段
     isdesc,是否降序
     skip,页码
     limit，每页显示条数
     ***/
    module.getResModel = function (callback, options) {

        var category = options.category || "",
            res_subtype = options.res_subtype || "",
            sortfield = options.sortfield || "createdAt",
            isdesc = options.isdesc || true,
            skip = options.skip || 0,
            limit = options.limit || 8;

        var strCQL = " select count(*),* from resobj where res_approved=2 "; //素材都是已经上架的数据  2为PC上架 3为APP PC同时上架
        //var strCQL = " select count(*),* from resobj where item_val!='' "; //素材都是已经上架的数据

        if(res_subtype){
            strCQL += " and res_subtype='" + res_subtype + "' ";
        }

        if (category.length != 0) {
            strCQL += " and category=" + parseInt(category) + " ";
        }

        //翻页
        if (skip >= 0 && limit > 0) {
            strCQL += " limit " + skip + "," + limit;
        }
        //排序
        if (sortfield.length > 0) {
            if (isdesc) {
                strCQL += " order by " + sortfield + "  desc ";
            } else {
                strCQL += " order by " + sortfield + " asc ";
            }
        }
        fmacloud.Query.doCloudQuery(strCQL, {
            success: function (result) {
                var obj = {
                    "data" : result.results,
                    "count": result.count
                };
                callback(obj);
            },
            error  : function (error) {
                console.log(error.message);
            }
        });
    };

    module.getMusic = function (callback, options) {
        var music_span = options.music_span || "",//音乐类型
            sortfield = options.sortfield || "createdAt",
            isdesc = options.isdesc || true,
            skip = options.skip || 0,
            limit = options.limit || 8;
        var strCQL = " select count(*),* from me_music where music_usefor in ('pcspecoial','general') ";

        if (music_span.length > 0) {
            strCQL += " and music_span='" + music_span + "' ";
        }
        //翻页
        if (skip >= 0 && limit >= 0) {
            strCQL += " limit " + skip + "," + limit;
        }
        if (sortfield.length > 0) {
            if (isdesc) {
                strCQL += " order by " + sortfield + "  desc ";
            } else {
                strCQL += " order by " + sortfield + " asc ";
            }
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
    };

    module.searchTpl = function (callback, pageNumber, pageSize, sortfield, isdesc, tplClass, search, tplType, tplLabel, option) {
        var limit = pageSize;
        var options = option || {};
        var skip = 0;
        //比如要看第 10 页，每页 10 条   就应该是 skip 90 ，limit 10
        if (pageNumber != 0) {
            skip = pageSize * pageNumber - pageSize;
        } else {
            skip = pageNumber;
        }
        var strCQL; // 上架并且是pc端的微杂志 data_site=1
        if(tplType=="10"){
            strCQL = " select * from tplobj where approved in (2,3) and tpl_privacy='public' and tpl_state!=1 ";
        }else{
            strCQL = " select * from tplobj where approved =1 and tpl_privacy='public' and tpl_state!=1 ";
        }
        if (tplType.length > 0) {
            strCQL += " and tpl_type=" + parseInt(tplType);
        }
        if (search.length > 0) {
            strCQL += " and (name like '%" + search + "%' )";
        }
        if (!!options) {
            if (!!options.author) {
                strCQL = " select * from tplobj where author='" + options.author + "'";
                if (search.length > 0) {
                    strCQL += " and name like '%" + search + "%' or author_name like '%" + search + "%' ";
                }
            }
            if (!!options.tpl_state) {
                strCQL += " and tpl_state = " + options.tpl_state;
            }
            if (!!options.data_site) {
                strCQL += " and data_site = '" + options.data_site + "'";
            }
        }
        if (tplClass.length > 0) {
            strCQL += " and tpl_class=" + parseInt(tplClass);
        }

        if (( !!tplLabel) && (tplLabel != "undefined") && (tplLabel.length > 0)) {
            var _tplLabel = "'" + tplLabel[0] + "'";
            for (var i = 1; i < tplLabel.length; i++) {
                _tplLabel += ",'" + tplLabel[i] + "'";
            }
            strCQL += " and label all (" + _tplLabel + ")";
        }
        if (skip >= 0 && limit > 0) {
            strCQL += " limit " + skip + "," + limit;
        }
        if (sortfield.length > 0 && isdesc != undefined) {
            strCQL += " order by " + sortfield + " " + isdesc;
        }
        // console.log(strCQL);
        fmacloud.Query.doCloudQuery(strCQL, {
            success: function (result) {
                var obj = {
                    "data": result.results
                };
                callback(obj);
            },
            error  : function (error) {
                console.log(error.message);
            }
        });
    };

    module.searchWorkCount = function (callback, search) {
        var strCQL = " select count(*) from tplobj where approved=1 and tpl_privacy='public' and tpl_state!=1 and tpl_type=11";
        if (search.length > 0) {
            strCQL += " and (name like '%" + search + "%' )";
        }

        fmacloud.Query.doCloudQuery(strCQL, {
            success: function (result) {
                var obj = {
                    "count": result.count
                };
                callback(obj);
            },
            error  : function (error) {
                console.log(error.message);
            }
        });
    };

    module.searchModeCount = function (callback, search) {
        var strCQL = " select count(*) from tplobj where approved in (2,3) and tpl_privacy='public' and tpl_state!=1 and tpl_type=10";
        if (search.length > 0) {
            strCQL += " and (name like '%" + search + "%' )";
        }

        fmacloud.Query.doCloudQuery(strCQL, {
            success: function (result) {
                var obj = {
                    "count": result.count
                };
                callback(obj);
            },
            error  : function (error) {
                console.log(error.message);
            }
        });
    }

    module.searchUserCount = function (text) {
        var strCQL = 'select count(*) from _User where user_nick="'+text+'"';
        var promise = new Promise(function (resolve,reject) {
            fmacloud.Query.doCloudQuery(strCQL,{
                success : function (result) {
                    resolve(result.count);
                },
                error : function (err) {
                    reject(err);
                }
            });
        });
        return promise;
    }



    module.testData = function(){
        var strCQL = 'select * from appconf';
        var promise = new Promise(function(resolve, reject){
            fmacloud.Query.doCloudQuery(strCQL,{
                success: function (result){
                    resolve(result);
                },
                error: function (error){
                    reject(error);
                }
            });
        });
        return promise;
    }

    module.getActivityByTid = function (tid) {
        var strCQL = "select * from me_activity ";
        strCQL += "where objectId='"+tid+"'";
        var promise = new Promise(function(resolve, reject){
            fmacloud.Query.doCloudQuery(strCQL,{
                success: function (result){
                    resolve(result);
                },
                error: function (error){
                    reject(error);
                }
            });
        });
        return promise;
    },

    module.getInputData = function(tid,page,pageSize){
        var strCQL = 'select * from me_customerdata where cd_input!=null and cd_tplid="' + tid + '"';
        if (typeof(page) != "undefined") {
            strCQL += ' limit '+ page + ',' + pageSize;
        }
        var promise = new Promise(function(resolve, reject){
            fmacloud.Query.doCloudQuery(strCQL,{
                success: function (result){
                    resolve(result);
                },
                error: function (error){
                    reject(error);
                }
            });
        });
        return promise;
    },

    module.getInputCount = function(tid){
        var strCQL = 'select count(*) from me_customerdata where cd_input!=null and cd_tplid="' + tid + '"';
        var promise = new Promise(function(resolve, reject){
            fmacloud.Query.doCloudQuery(strCQL,{
                success: function (result){
                    resolve(result);
                },
                error: function (error){
                    reject(error);
                }
            });
        });
        return promise;
    },

    module.quertChartDataCount = function(id,tid){
        var strCQL = 'select count(*) from me_customerdata where cd_tplid="' + tid + '" and ((cd_radio="'+id+'" ) or (cd_checkbox="'+id+'"))';
        var promise = new Promise(function(resolve, reject){
            fmacloud.Query.doCloudQuery(strCQL,{
                success: function (result){
                    resolve(result.count);
                },
                error: function (error){
                    reject(error);
                }
            });
        });
        return promise;
    },

    module.quertChartData = function(id,tid,page,pageSize){
        var strCQL = 'select * from me_customerdata where cd_tplid="' + tid + '" and ((cd_radio="'+id+'" ) or (cd_checkbox="'+id+'"))';
        if (typeof(page) != "undefined") {
            strCQL += ' limit '+ page + ',' + pageSize;
        }
        var promise = new Promise(function(resolve, reject){
            fmacloud.Query.doCloudQuery(strCQL,{
                success: function (result){
                    resolve(result);
                },
                error: function (error){
                    reject(error);
                }
            });
        });
        return promise;
    }

    module.searchUser = function (text,pageNumber,pageSize) {
        var _this = this;
        var promise = new Promise(function (resolve,reject) {
            var strCQL = 'select * from _User where user_nick="'+text+'"';
            var skip = 0;
            var limit = pageSize;
            //比如要看第 10 页，每页 10 条   就应该是 skip 90 ，limit 10
            if (pageNumber != 0) {
                skip = pageSize * pageNumber - pageSize;
            } else {
                skip = pageNumber;
            }
            if (skip >= 0 && limit > 0) {
                strCQL += " limit " + skip + "," + limit;
            }
            fmacloud.Query.doCloudQuery(strCQL,{
                success : function (result) {
                    var user = [];
                    for(var item in result.results) {
                        var id = result.results[item].id;
                        var userArr = result.results[item].attributes;
                        userArr.uid = id; 
                        user.push(result.results[item].attributes);
                    }
                    var promiseArr = user.map(function(item){
                        return _this.searchUserWork(item.uid)
                    });
                    Promise.all(promiseArr).then(function (r) {
                        for (var i=0;i<user.length;i++) {
                            $.extend(user[i],r[i]);
                        }
                        resolve(user);
                    });
                    
                },
                error : function (err) {
                    reject(err);
                }
            });
        });
        return promise;
    }

    module.searchUserWork=function(uid){
        var promise = new Promise(function (resolve,reject) {
            var strCQL = "select * from tplobj where author='" + uid + "' and tpl_type=11 and tpl_state=2 and tpl_privacy='public'";
            fmacloud.Query.doCloudQuery(strCQL,{
                success : function (result) {
                    var r = result.results;
                    var obj = {};
                    var pv = 0;
                    var store_count = 0;
                    var work = [];
                    for(var i=0; i < r.length; i++) {
                        if (i<3) {
                            work.push(r[i]);
                        }
                        pv += r[i].attributes['read_pv']||0;
                        store_count += r[i].attributes['store_count']||0;
                    }
                    obj.pv = pv;
                    obj.store_count = store_count;
                    obj.work = work;
                    resolve(obj);
                },
                error : function (err) {
                    reject(err);
                }
            });
        });
        return promise;
    }

    module.searchRecommendUser = function () {
        var promise = new Promise(function (resolve,reject) {
            var strCQL = 'select * from _User where approved_status=2 and user_type=1 and recno>10';
            fmacloud.Query.doCloudQuery(strCQL,{
                success : function (result) {
                    var random = function (min,max) {
                        var gap = max-min+1;
                        return Math.floor(Math.random()*gap+min);
                    }
                    var arr= [];
                    while (arr.length < 5 && arr.length != result.results.length) {
                        arr.push(result.results.splice(random(0,result.results.length-1),1)[0]);
                    }
                    resolve(arr);
                },
                error : function (err) {
                    reject(err);
                }
            });
        });
        return promise;
    }

}(exports));

