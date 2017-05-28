/*
 * Created by 95 on 2015/9/19.
 */

module.exports = {

    createGroupWithPage: function (parent,groupName,pageName) {
        fmaobj.tplgroup = {
            create: function (a) {
                var h = new (fmacloud.Object.extend("t_tpl_group"));
                return h
            }
        };

        //var group = fmaobj.tplgroup.create();
        //group.set("f_object_id",  fmacapi_create_uid(""));
        //group.set("f_name", groupName);
        //group.set("f_collapse", false);
        //group.set("parent",parent);
        //var PageInit = require("./PageInit");
        //var page_obj = PageInit.createBlankPageObj(pageName);
        //
        //page_obj.set("parent",group)
        //page_obj.set("edited", true);
        //group.set("f_type",2);
        //group.set("items", [page_obj]);

        var group = fmaobj.tplgroup.create();
        group.set("f_object_id",  fmacapi_create_uid(""));
        group.set("f_name", groupName);
        group.set("f_collapse", false);
        group.set("show_page_num", true);
        group.set("parent",parent);
        var ElementInit = require("./ItemInit");
        var item_obj = ElementInit.createBlankItemObj();
        item_obj.set("f_name","背景1")
        var PageInit = require("./PageInit");
        var page_obj = PageInit.createBlankPageObj(pageName);
        page_obj.set("item_object", [item_obj]);
        page_obj.set("parent",group)
        page_obj.set("edited", true);
        group.set("f_type",2);
        group.set("items", [page_obj]);
        return group;
    },
    createBlankGroup: function (parent,groupName) {
        fmaobj.tplgroup = {
            create: function (a) {
                var h = new (fmacloud.Object.extend("t_tpl_group"));
                return h
            }
        };
        var group = fmaobj.tplgroup.create();
        group.set("f_object_id",  fmacapi_create_uid(""));
        group.set("f_name", groupName);
        group.set("f_collapse", false);
        group.set("show_page_num", true);
        group.set("parent",parent);
        group.set("f_type",2);
        group.set("items", []);
        return group;
    }
};