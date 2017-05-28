/*
 * Created by 95 on 2015/9/19.
 */
var uuid = require('uuid');
module.exports = {

    createBlankPageObj: function (pageName) {
        var page_obj = fmaobj.page.create();
        page_obj.set("page_uid", uuid.v4());
        page_obj.set("page_width", 640);
        page_obj.set("page_height", 1008);
        page_obj.set("page_no", 1);
        page_obj.set("size_type", 2);
        page_obj.set("item_int", 1);
        page_obj.set("move_type", "top");
        page_obj.set("item_object", []);
        page_obj.set("item_filter", "none");
        page_obj.set("line_off", false);
        page_obj.set("color_transp", 0);
        page_obj.set("img_off", false);
        page_obj.set("line_width", 0);
        page_obj.set("img_reshow", false);
        page_obj.set("color_off", false);
        page_obj.set("line_color", "0");
        page_obj.set("item_filter_val", "none");
        page_obj.set("line_radius", "none");
        page_obj.set("color_code", "0");
        page_obj.set("edited",true);
        page_obj.set("page_effect_img","http://ac-hf3jpeco.clouddn.com/wy7k70ifPffxR0VoCjcctqgAXRGsG4roiQNk1w3c.jpg");

        page_obj.set("f_type",1);
        // page_obj.set("createdAt", (new Date().toString));
        if(pageName){
            page_obj.set("f_name",pageName)
        }else {
            page_obj.set("f_name","页")
        }
        return page_obj;
    }

};