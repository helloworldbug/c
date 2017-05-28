/*
 * 新增元素基本属性
 */
var uuid = require('../../utils/numuid');
var MeConstants = require('../../constants/MeConstants');
var ElementType = MeConstants.Elements;
var ItemInit = {

    backImgInit: function (src) {
        var backImg = fmaobj.elem.create();
        backImg.set("item_val", src);
        backImg.set("item_width", 640);
        backImg.set("item_height", 1008);
        backImg.set("item_type", 1);
        backImg.set("item_top", 0);
        backImg.set("item_left", 0);
        backImg.set("item_opacity", 100);
        backImg.set("item_layer", 0);
        backImg.set("item_filter", "none");
        backImg.set("font_family", "宋体");
        backImg.set("item_angle", false);
        backImg.set("font_frame", false);
        backImg.set("frame_style", 1);
        backImg.set("mask_color", "0");
        backImg.set("lock_level", 0);
        backImg.set("mask_height", 0);
        backImg.set("item_uuid", uuid.generateUid());
        backImg.set("item_cntype", 2);
        backImg.set("mask_width", 0);
        backImg.set("font_valight", "top");
        backImg.set("font_halign", "left");
        backImg.set("frame_color", "#ffffff");
        backImg.set("item_color", "ffffff");
        backImg.set("item_mirror", "null");
        backImg.set("auto_play", false);
        backImg.set("frame_pixes", 0);
        backImg.set("use_mask", false);
        backImg.set("x_scale", 1);
        backImg.set("rotate_angle", 0);
        backImg.set("y_scale", 1);
        backImg.set("restart_play", false);
        backImg.set("line_height", 0);
        backImg.set("rotate_pos", "0.0");
        backImg.set("font_dist", 0);
        backImg.set("item_filter_val", "none");
        backImg.set("font_size", "12");
        backImg.set("item_animation", "none");
        // backImg.set("createdAt", (new Date().toString));
        backImg.set("can_scale", true);
        backImg.set("can_move", true);
        backImg.set("can_edit", true);
        backImg.set("can_rotate", true);
        backImg.set("item_id", uuid.generateUidNum());
        backImg.set("bd_side", "top,right,bottom,left");
        return backImg;
    },

    makeChildInit: function (group_id) {
        var group = fmaobj.elem.create();
        group.set("item_type", 17);
        group.set("item_val", "");
        group.set("item_top", 0);
        group.set("item_left", 0);
        group.set("item_width", 640);
        group.set("item_height", 1008);
        group.set("item_opacity", 100);
        group.set("x_scale", 1);
        group.set("y_scale", 1);
        group.set("item_id", uuid.generateUidNum());
        group.set("item_uuid", uuid.generateUid());
        group.set("group_id", group_id);
        return group;
    },

    getImageInitStyle: function () {
        return {
            "item_opacity": 100,
            "item_border" : 0,
            "bd_style"    : "solid",
            "bd_color"    : "#000",
            "bd_radius"   : "0"
        }
    },
    getLineFeedTextInitStyle: function () {
        var fontSize=28;
        return {
            "fixed_line_height":false,"notfixed_font_dist":true,
            "line_height_nodefault":parseInt(fontSize*0.7),
            // "fixed_size":'{"width":true,"height":true}',
            "font_size"      : `${fontSize}px`, "font_family": "微软雅黑",
            "item_angle"     : true, "font_frame": false,
            "frame_style"    : 1, "item_opacity": 100,
            "font_valight"   : "top", "font_halign": "justify",
            "frame_color"    : "", "item_color": "#909090",
            "frame_pixes"    : 0, "x_scale": 1,
            "y_scale"        : 1, "rotate_angle": 0,
            "line_height"    : 0, "font_dist": 0,
            "bg_color"       : "", "item_border": 0,
            "bd_radius"      : "0", "bd_style": "solid",
            "bd_color"       : "#000", "font_weight": "",
            "text_decoration": "", "font_style": ""
        }
    },
    getTextInitStyle: function () {
        var fontSize=36;
        return {
            // "fixed_size":'{"width":false,"height":false}',
            "line_height_nodefault":parseInt(fontSize*0.7),
            "fixed_line_height":false,"notfixed_font_dist":true,
            "font_size"      : `${fontSize}px`, "font_family": "",
            "item_angle"     : true, "font_frame": false,
            "frame_style"    : 1, "item_opacity": 100,
            "font_valight"   : "top", "font_halign": "left",
            "frame_color"    : "", "item_color": "#909090",
            "frame_pixes"    : 0, "x_scale": 1,
            "y_scale"        : 1, "rotate_angle": 0,
            "line_height"    : 0, "font_dist": 0,
            "bg_color"       : "", "item_border": 0,
            "bd_radius"      : "0", "bd_style": "solid",
            "bd_color"       : "#000", "font_weight": "",
            "text_decoration": "", "font_style": ""
        }
    },

    panoramaInit: function (srcInfo, width, height) {
        var img = fmaobj.elem.create();
        img.set("item_type", 40);
        img.set("item_val", srcInfo.src);
        img.set("item_val_sub", srcInfo.name);
        img.set("item_cntype", 2);
        img.set("item_opacity", 100);
        img.set("item_width", width);
        img.set("item_height", height);
        img.set("x_scale", 1);
        img.set("y_scale", 1);
        img.set("item_id", uuid.generateUidNum());
        img.set("item_animation", "fadeIn");
        img.set("item_animation_val", '{"delay":0,"duration":0.1,"type":"in","infinite":1}');
        img.set("item_top", (1008 - height) / 2);
        img.set("item_left", (640 - width) / 2);
        img.set("can_scale", true);
        img.set("can_move", true);
        img.set("can_edit", true);
        img.set("can_rotate", true);
        img.set("item_href", "");
        img.set("bd_side", "top,right,bottom,left");
        img.set("item_uuid", uuid.generateUid());
        return img;
    },

    picslideInit: function (srcInfo, width, height) {
        var img = fmaobj.elem.create();
        img.set("item_type", 37);
        img.set("item_val", srcInfo.src);
        img.set("item_val_sub", srcInfo.name);
        img.set("item_href", srcInfo.href);
        img.set("item_cntype", 2);
        img.set("item_opacity", 100);
        img.set("item_width", width);
        img.set("item_height", height);
        img.set("x_scale", 1);
        img.set("y_scale", 1);
        img.set("item_id", uuid.generateUidNum());
        img.set("item_animation", "fadeIn");
        img.set("item_animation_val", '{"delay":0,"duration":0.1,"type":"in","infinite":1}');
        img.set("item_top", (1008 - height) / 2);
        img.set("item_left", (640 - width) / 2);
        img.set("can_scale", true);
        img.set("can_move", true);
        img.set("can_edit", true);
        img.set("can_rotate", true);
        img.set("bd_side", "top,right,bottom,left");
        img.set("item_uuid", uuid.generateUid());
        return img;
    },
    imageItemInit: function (src, width, height, group_id ,imgInf) {
        var img = fmaobj.elem.create();
        if (imgInf) {
            img.set("item_top", (1008 - imgInf.srcImgData.height) / 2 + imgInf.imgInfo.top);
            img.set("item_left", (640 - imgInf.srcImgData.width) / 2 + imgInf.imgInfo.left);
        }else {
            //img.set("item_top", (1008 - height) / 2);
            if(height > 1008){
                img.set("item_top", 320); //添加图片定位
            } else {
                img.set("item_top", (1008 - height) / 2)
            }
            img.set("item_left", (640 - width) / 2);
        }
        img.set("item_type", 18);
        img.set("item_val", src);
        img.set("item_cntype", 2);
        img.set("item_opacity", 100);
        img.set("item_width", width);
        img.set("item_height", height);
        img.set("x_scale", 1);
        img.set("y_scale", 1);
        img.set("item_id", uuid.generateUidNum());
        img.set("item_animation", "fadeIn");
        img.set("item_animation_val", '{"delay":0,"duration":0.1,"type":"in","infinite":1}');
        if (group_id) img.set("group_id", group_id);
        img.set("can_scale", true);
        img.set("can_move", true);
        img.set("can_edit", true);
        img.set("can_rotate", true);
        img.set("item_href", "");
        img.set("bd_side", "top,right,bottom,left");
        img.set("item_uuid", uuid.generateUid());
        return img;
    },

    getFrameInitStyle: function () {
        return ItemInit.getImageInitStyle();
    },

    frameInit: function (src) {
        var frame = fmaobj.elem.create();
        frame.set("item_id", uuid.generateUidNum());
        frame.set("item_type", 10);
        frame.set("item_cntype", 2);
        frame.set("item_val", src);
        frame.set("item_top", 0);
        frame.set("item_left", 0);
        frame.set("item_opacity", 100);
        frame.set("item_width", 640);
        frame.set("item_height", 1008);
        frame.set("item_animation", "fadeIn");
        frame.set("item_animation_val", '{"delay":0,"duration":0.1,"type":"in","infinite":1}');
        frame.set("can_scale", false);
        frame.set("can_move", false);
        frame.set("can_edit", false);
        frame.set("can_rotate", false);
        frame.set("bd_side", "top,right,bottom,left");
        frame.set("item_uuid", uuid.generateUid());
        return frame;
    },

    getShapeInitStyle: function () {
        return ItemInit.getImageInitStyle();
    },

    shapeInit: function (src, width, height) {
        var shape = fmaobj.elem.create();
        shape.set("item_id", uuid.generateUidNum());
        shape.set("item_type", 3);
        shape.set("item_cntype", 2);
        shape.set("item_val", src);
        shape.set("item_top", (1008 - height) / 2);
        shape.set("item_left", (640 - width) / 2);
        shape.set("item_opacity", 100);
        shape.set("item_width", width);
        shape.set("item_height", height);
        shape.set("frame_style", 3);
        shape.set("item_animation", "fadeIn");
        shape.set("item_animation_val", '{"delay":0,"duration":0.1,"type":"in","infinite":1}');
        shape.set("can_scale", true);
        shape.set("can_move", true);
        shape.set("can_edit", true);
        shape.set("can_rotate", true);
        shape.set("item_href", "");
        shape.set("bd_side", "top,right,bottom,left");
        shape.set("item_uuid", uuid.generateUid());
        return shape;
    },

    getWatermarkInitStyle: function () {
        return ItemInit.getImageInitStyle();
    },

    watermarkInit: function (src, width, height) {
        var watermark = fmaobj.elem.create();
        watermark.set("item_id", uuid.generateUidNum());
        watermark.set("item_type", 3);
        watermark.set("item_cntype", 2);
        watermark.set("item_val", src);
        watermark.set("item_top", (1008 - height) / 2);
        watermark.set("item_left", (640 - width) / 2);
        watermark.set("item_opacity", 100);
        watermark.set("item_width", width);
        watermark.set("item_height", height);
        watermark.set("frame_style", 1);
        //watermark.set("item_layer", MakeStore.getItems().length);
        watermark.set("item_animation", "fadeIn");
        watermark.set("item_animation_val", '{"delay":0,"duration":0.1,"type":"in","infinite":1}');
        watermark.set("can_scale", true);
        watermark.set("can_move", true);
        watermark.set("can_edit", true);
        watermark.set("can_rotate", true);
        watermark.set("item_href", "");
        watermark.set("bd_side", "top,right,bottom,left");
        watermark.set("item_uuid", uuid.generateUid());
        return watermark;
    },

    scribbleInit: function (obj) {


        var scribble = fmaobj.elem.create();
        scribble.set("item_type", 24);
        scribble.set("item_top", 800);
        scribble.set("item_id", uuid.generateUidNum());
        scribble.set("item_opacity", obj.opacity);
        scribble.set("clip_percent", obj.clipPercent);
        scribble.set("item_width", 640);
        scribble.set("item_height", 1008);
        scribble.set("item_val", obj.tips);
        scribble.set("item_href", obj.src);
        scribble.set("font_size", "34px");
        scribble.set("font_family", "");
        scribble.set("item_color", "#FFF");
        scribble.set("item_left", (640 - this.getTextLength(obj.tips)) / 2);
        scribble.set("item_uuid", uuid.generateUid());
        return scribble;
    },

    lineFeedTextInit: function () {
        var text = fmaobj.elem.create();
        var fontSize=28;
        // text.set("fixed_size",'{"width":true,"height":true}');
        text.set("line_height_nodefault",parseInt(fontSize*0.7));
        text.set("font_size", `${fontSize}px`);
        text.set("fixed_line_height",false);
        text.set("notfixed_font_dist",true);
        //text.set("item_layer", MakeStore.getItems().length);
        text.set("is_wrap", true); //因为模板中的文字是缩放且没有can_scale属性，所以自动换行的文字用true表示
        text.set("can_scale", true);
        text.set("new", true);
        text.set("item_id", uuid.generateUidNum());
        text.set("item_val", "双击此处编辑");
        text.set("item_top", 388);//132
        text.set("item_left", 58);//164
        text.set("item_width", 528);
        text.set("item_height", 120);

        text.set("item_filter", "none");
        text.set("font_family", "微软雅黑");
        text.set("item_angle", true);
        text.set("font_frame", false);
        text.set("frame_style", 1);
        text.set("mask_color", "0");
        text.set("lock_level", 0);
        text.set("mask_height", 0);
        text.set("item_uuid", uuid.generateUid());
        text.set("item_opacity", 100);
        text.set("item_type", 2);
        text.set("item_cntype", 1);
        text.set("mask_width", 0);
        text.set("font_valight", "top");
        text.set("font_halign", "justify");
        text.set("frame_color", "");
        text.set("item_color", "#909090");
        text.set("item_mirror", "null");
        text.set("auto_play", false);
        text.set("frame_pixes", 0);
        text.set("use_mask", false);
        text.set("x_scale", 1);
        text.set("y_scale", 1);
        text.set("rotate_angle", 0);
        text.set("restart_play", false);
        text.set("line_height", 1);
        text.set("rotate_pos", "0.0");
        text.set("font_dist", 0);
        text.set("item_filter_val", "none");
        text.set("item_animation", "bounceIn");
        text.set("item_animation_val", '{"delay":0,"duration":0.1,"type":"in","infinite":1}');
        text.set("can_move", true);
        text.set("can_edit", true);
        text.set("can_rotate", false);
        text.set("item_href", "");
        text.set("bd_side", "top,right,bottom,left");
        return text;
    },

    verticalTextInit: function () {
        var text = fmaobj.elem.create();
        //text.set("item_layer", MakeStore.getItems().length);
        text.set("writing_mode", "vertical-lr");
        text.set("is_wrap", true); //因为模板中的文字是缩放且没有can_scale属性，所以自动换行的文字用true表示
        text.set("can_scale", true);
        text.set("item_id", uuid.generateUidNum());
        text.set("item_val", "双击此处编辑");
        text.set("item_top", 260);//132
        text.set("item_left", 170);//164
        text.set("item_width", 300);
        text.set("item_height", 220);
        text.set("font_size", "36px");
        text.set("item_filter", "none");
        text.set("font_family", "");
        text.set("item_angle", true);
        text.set("font_frame", false);
        text.set("frame_style", 1);
        text.set("mask_color", "0");
        text.set("lock_level", 0);
        text.set("mask_height", 0);
        text.set("item_uuid", uuid.generateUid());
        text.set("item_opacity", 100);
        text.set("item_type", 2);
        text.set("item_cntype", 1);
        text.set("mask_width", 0);
        text.set("font_valight", "top");
        text.set("font_halign", "justify");
        text.set("frame_color", "");
        text.set("item_color", "#909090");
        text.set("item_mirror", "null");
        text.set("auto_play", false);
        text.set("frame_pixes", 0);
        text.set("use_mask", false);
        text.set("x_scale", 1);
        text.set("y_scale", 1);
        text.set("rotate_angle", 0);
        text.set("restart_play", false);
        text.set("line_height", 1);
        text.set("rotate_pos", "0.0");
        text.set("font_dist", 0);
        text.set("item_filter_val", "none");
        text.set("item_animation", "bounceIn");
        text.set("item_animation_val", '{"delay":0,"duration":0.1,"type":"in","infinite":1}');
        text.set("can_move", true);
        text.set("can_edit", true);
        text.set("can_rotate", false);
        text.set("item_href", "");
        text.set("bd_side", "top,right,bottom,left");
        return text;
    },

    textInit: function () {
        var text = fmaobj.elem.create();
        //text.set("item_layer", MakeStore.getItems().length);
        text.set("item_id", uuid.generateUidNum());
        // text.set("fixed_size",'{"width":false,"height":false}');
        var fontSize=36;
        text.set("line_height_nodefault",parseInt(fontSize*0.7));
        text.set("font_size", `${fontSize}px`);
        text.set("fixed_line_height",false);
        text.set("notfixed_font_dist",true);
        text.set("new", true);//132
        text.set("item_val", "双击此处编辑");
        text.set("item_top", 132);//132
        text.set("item_left", 164);//164
        text.set("item_width", 0);
        text.set("item_height", 0);
        text.set("item_filter", "none");
        text.set("font_family", "微软雅黑");
        text.set("item_angle", true);
        text.set("font_frame", false);
        text.set("frame_style", 1);
        text.set("mask_color", "0");
        text.set("lock_level", 0);
        text.set("mask_height", 0);
        text.set("item_uuid", uuid.generateUid());
        text.set("item_opacity", 100);
        text.set("item_type", 2);
        text.set("item_cntype", 1);
        text.set("mask_width", 0);
        text.set("font_valight", "top");
        text.set("font_halign", "left");
        text.set("frame_color", "");
        text.set("item_color", "#909090");
        text.set("item_mirror", "null");
        text.set("auto_play", false);
        text.set("frame_pixes", 0);
        text.set("use_mask", false);
        text.set("x_scale", 1);
        text.set("y_scale", 1);
        text.set("rotate_angle", 0);
        text.set("restart_play", false);
        text.set("line_height", 1);
        text.set("rotate_pos", "0.0");
        text.set("font_dist", 0);
        text.set("item_filter_val", "none");
        text.set("item_animation", "bounceIn");
        text.set("item_animation_val", '{"duration":0.1,"delay":0,"infinite":1}');
        text.set("fix_attr", "");
        text.set("can_scale", true);
        text.set("can_move", true);
        text.set("can_edit", true);
        text.set("can_rotate", false);
        text.set("item_href", "");
        text.set("bd_side", "top,right,bottom,left");
        return text;
    },

    formInit: function () {

        var name = ItemInit.inputInit();
        var phone = ItemInit.inputInit();
        var email = ItemInit.inputInit();
        var button = ItemInit.ButtonInit();
        name.set("item_val", "姓名");
        name.set("item_top", 180);
        name.set("fb_field", "cd_username");
        phone.set("item_val", "手机");
        phone.set("item_top", 287);
        phone.set("fb_field", "cd_phone");
        //phone.set("item_layer",MakeStore.getPage().get("item_object").length+1);
        email.set("item_val", "邮箱");
        email.set("item_top", 394);
        email.set("fb_field", "cd_email");
        //email.set("item_layer",MakeStore.getPage().get("item_object").length+2);
        button.set("item_top", 529);
        //button.set("item_layer",MakeStore.getPage().get("item_object").length+3);
        return [name, phone, email, button];

    },

    videoInit: function () {
        var video = fmaobj.elem.create();
        video.set("item_id", uuid.generateUidNum());
        video.set("item_type", 8);
        //video.set("item_layer", MakeStore.getPage().get("item_object").length);
        //video.set("item_top", 132);
        //video.set("item_left", 164);
        //video.set("item_width", 320);
        //video.set("item_height", 170);
        //video.set("item_opacity", 100);
        //video.set("item_href", "");
        //video.set("item_val", "");
        //video.set("item_animation_val", '{"delay":0.3,"duration":1,"infinite":1}');
        video.set("item_top", 373);
        video.set("item_left", 87);
        video.set("item_width", 466);
        video.set("item_height", 262);
        video.set("item_opacity", 100);
        video.set("item_href", "");
        video.set("item_val", "http://ac-hf3jpeco.clouddn.com/15161d41f98f1ee5.png?imageView2/2/w/640/h/1008");
        video.set("item_animation", "fadeIn");
        video.set("item_animation_val", '{"delay":0,"duration":0.1,"type":"in","infinite":1}');
        video.set("item_uuid", uuid.generateUid());
        return video;
    },



    getInputTextInitStyle: function () {
        var obj = ItemInit.getImageInitStyle();
        obj["item_border"] = 2;
        return obj;
    },

    inputInit: function () {
        var text = fmaobj.elem.create();
        text.set("item_id", uuid.generateUidNum());
        text.set("item_type", 14);
        //text.set("item_layer", MakeStore.getPage().get("item_object").length);
        text.set("item_top", 132);
        text.set("item_left", 116);
        text.set("frame_color", "#ffffff");
        text.set("frame_pixes", 0);
        text.set("item_width", 400);
        text.set("item_height", 79);
        text.set("font_dist", 5);
        text.set("font_size", "30px");
        text.set("item_opacity", 100);
        text.set("bg_color", "#FFFFFF");
        text.set("font_frame", false);
        text.set("bd_radius", "0");
        text.set("bd_style", "solid");
        text.set("bd_color", "#000000");
        text.set("bd_side", "top,right,bottom,left");
        text.set("item_border", 2);
        text.set("item_animation", "bounceIn");
        text.set("item_animation_val", '{"delay":0,"duration":0.1,"type":"in","infinite":1}');
        text.set("item_val", "描述");
        text.set("field_recommend", 0);
        text.set("item_uuid", uuid.generateUid());

        return text;
    },

    getButtonInitStyle: function () {
        return ItemInit.getImageInitStyle();
    },

    ButtonInit: function () {
        var button = fmaobj.elem.create();
        //button.set("item_layer", MakeStore.getPage().get("item_object").length);
        button.set("item_id", uuid.generateUidNum());
        button.set("item_type", 19);
        button.set("item_val", "提交");
        button.set("item_href", "submit");
        button.set("font_halign", "center");
        button.set("item_color", "#FFFFFF");
        button.set("frame_color", "#ffffff");
        button.set("frame_pixes", 0);
        button.set("item_top", 132);
        button.set("item_left", 116);
        button.set("item_width", 400);
        button.set("item_height", 79);
        button.set("font_dist", 5);
        button.set("font_size", "30px");
        button.set("item_opacity", 100);
        button.set("bg_color", "#383b42");
        button.set("font_frame", false);
        button.set("bd_radius", "0");
        button.set("item_border", 0);
        button.set("bd_color", "#000000");
        button.set("item_animation", "bounceIn");
        button.set("item_animation_val", '{"delay":0,"duration":0.1,"type":"in","infinite":1}');
        button.set("font_valight", "middle");
        button.set("bd_side", "top,right,bottom,left");
        button.set("item_uuid", uuid.generateUid());
        return button;
    },

    radioInit: function () {
        var radio = fmaobj.elem.create();
        radio.set("item_id", uuid.generateUidNum());
        radio.set("item_type", 20);
        radio.set("item_val", '{"title":"标题","options":["选项1","选项2","选项3"]}');
        radio.set("item_top", 132);
        radio.set("item_left", 87);
        radio.set("item_width", 480);
        radio.set("item_height", 361);
        radio.set("item_opacity", 100);
        radio.set("font_size", "30px");
        radio.set("font_dist", 2);
        radio.set("font_halign", "left");
        radio.set("bg_color", "#000000");
        radio.set("item_color", "#FFFFFF");
        radio.set("frame_color", "#ffffff");
        radio.set("bd_style", "solid");
        radio.set("bd_radius", "10");
        radio.set("bd_color", "#000000");
        radio.set("item_border", 2);
        radio.set("item_opacity", 100);
        radio.set("font_frame", false);
        radio.set("item_animation", "bounceIn");
        radio.set("item_animation_val", '{"delay":0,"duration":0.1,"type":"in","infinite":1}');
        radio.set("font_valight", "middle");
        radio.set("bd_side", "top,right,bottom,left");
        radio.set("fb_field", "cd_radio");
        radio.set("item_uuid", uuid.generateUid());
        return radio;
    },

    checkboxInit: function () {
        var radio = fmaobj.elem.create();
        radio.set("item_id", uuid.generateUidNum());
        radio.set("item_type", 21);
        radio.set("item_val", '{"title":"标题","options":["选项1","选项2","选项3"]}');
        radio.set("item_top", 132);
        radio.set("item_left", 87);
        radio.set("item_width", 480);
        radio.set("item_height", 361);
        radio.set("item_opacity", 100);
        radio.set("font_size", "30px");
        radio.set("font_dist", 2);
        radio.set("font_halign", "left");
        radio.set("bg_color", "#000000");
        radio.set("item_color", "#FFFFFF");
        radio.set("frame_color", "#ffffff");
        radio.set("bd_style", "solid");
        radio.set("bd_radius", "10");
        radio.set("bd_color", "#000000");
        radio.set("item_border", 2);
        radio.set("item_opacity", 100);
        radio.set("font_frame", false);
        radio.set("item_animation", "bounceIn");
        radio.set("item_animation_val", '{"delay":0,"duration":0.1,"type":"in","infinite":1}');
        radio.set("font_valight", "middle");
        radio.set("bd_side", "top,right,bottom,left");
        radio.set("fb_field", "cd_checkbox");
        radio.set("item_uuid", uuid.generateUid());
        return radio;
    },

    voteInit: function () {
        var vote = fmaobj.elem.create();
        vote.set("item_id", uuid.generateUidNum());
        vote.set("item_type", 22);
        vote.set("item_val", "icon-love");
        vote.set("item_top", 132);
        vote.set("item_left", 87);
        vote.set("item_width", 120);
        vote.set("item_height", 60);
        vote.set("item_opacity", 100);
        vote.set("font_size", "50px");
        vote.set("font_dist", 8);
        vote.set("item_color", "rgb(183,28,28)");
        vote.set("frame_color", "#ffffff");
        vote.set("font_valight", "middle");
        vote.set("font_halign", "center");
        vote.set("item_animation", "bounceIn");
        vote.set("item_animation_val", '{"delay":0,"duration":0.1,"type":"in","infinite":1}');
        vote.set("item_border", 0);

        vote.set("bd_radius", "0");
        vote.set("bd_color", "#000000");
        vote.set("x_scale", 1);
        vote.set("y_scale", 1);
        vote.set("bd_side", "top,right,bottom,left");
        vote.set("item_uuid", uuid.generateUid());
        return vote;
    },

    musicInit: function (musicInf) {
        var music = fmaobj.elem.create();
        music.set("item_id", uuid.generateUidNum());
        music.set("item_type", 7);
        music.set("item_val", musicInf.tpl_music);
        music.set('music_img',musicInf.tpl_music_img);
        music.set('music_name',musicInf.tpl_music_name);
        music.set('music_autoplay',musicInf.tpl_music_autoplay);
        music.set("item_top", 132);
        music.set("item_left", 87);
        music.set("item_width", 62);
        music.set("item_height", 62);
        music.set("item_opacity", 100);
        music.set("frame_color", "#ffffff");
        music.set("item_animation", "bounceIn");
        music.set("item_animation_val", '{"delay":0,"duration":0.1,"type":"in","infinite":1}');
        music.set("item_border", 0);
        music.set("bd_radius", "0");
        music.set("bd_color", "#000000");
        music.set("x_scale", 1);
        music.set("y_scale", 1);
        music.set("bd_side", "top,right,bottom,left");
        music.set("item_uuid", uuid.generateUid());
        return music;
    },

    fingerprintInit: function () {
        var fingerprintInit = fmaobj.elem.create();
        fingerprintInit.set("item_id", uuid.generateUidNum());
        fingerprintInit.set("item_type", 25);
        fingerprintInit.set("item_val", "icon-fingerprint");
        fingerprintInit.set("item_top", 718);
        fingerprintInit.set("item_left", 232);
        fingerprintInit.set("item_width", 170);
        fingerprintInit.set("item_height", 170);
        fingerprintInit.set("item_opacity", 100);
        fingerprintInit.set("font_size", "140px");
        fingerprintInit.set('bd_style', "140px");
        fingerprintInit.set("item_color", "rgb(183,28,28)");
        fingerprintInit.set("frame_color", "#ffffff");
        fingerprintInit.set("font_valight", "middle");
        fingerprintInit.set("font_halign", "center");
        fingerprintInit.set("item_animation", "bounceIn");
        fingerprintInit.set("item_animation_val", '{"delay":0,"duration":0.1,"type":"in","infinite":1}');
        fingerprintInit.set("bd_style", "none");
        fingerprintInit.set("item_border", 1);
        fingerprintInit.set("bd_radius", "0");
        fingerprintInit.set("bd_color", "#000000");
        fingerprintInit.set("x_scale", 1);
        fingerprintInit.set("y_scale", 1);
        fingerprintInit.set("bd_side", "top,right,bottom,left");
        fingerprintInit.set("item_uuid", uuid.generateUid());
        return fingerprintInit;
    },

    shakeInit: function () {
        var item = fmaobj.elem.create();
        item.set("item_id", uuid.generateUidNum());
        item.set("item_type", 27);
        item.set("item_val", "icon-fingerprint");
        item.set("item_top", 361);
        item.set("item_left", 224);
        item.set("item_width", 170);
        item.set("item_height", 170);
        item.set("item_opacity", 100);
        item.set("font_size", "140px");
        item.set("item_color", "#7a7a7a");
        item.set("frame_color", "#ffffff");
        item.set("font_valight", "middle");
        item.set("font_halign", "center");
        item.set("bd_style", "none");
        item.set("item_border", 1);
        item.set("bd_radius", "0");
        item.set("bd_color", "#000000");
        item.set("x_scale", 1);
        item.set("y_scale", 1);
        item.set("bd_side", "top,right,bottom,left");
        item.set("item_uuid", uuid.generateUid());
        return item;
    },

    phoneInit: function () {
        var item = fmaobj.elem.create();
        item.set("item_id", uuid.generateUidNum());
        item.set("item_type", 12);
        item.set("item_val", "88888888");
        item.set("item_val_sub", "拨打电话");
        item.set("item_top", 361);
        item.set("item_left", 224);
        item.set("item_width", 250);
        item.set("item_height", 88);
        item.set("item_opacity", 100);
        item.set("font_size", "28px");
        item.set("item_color", "#ffffff");
        item.set("font_halign", "center");
        item.set("bg_color", "#4cd964");
        item.set("item_animation", "bounceIn");
        item.set("item_animation_val", '{"delay":0,"duration":0.1,"type":"in","infinite":1}');
        item.set("bd_style", "solid");
        item.set("item_border", 2);
        item.set("bd_radius", "40");
        item.set("bd_color", "#ffffff");
        item.set("x_scale", 1);
        item.set("y_scale", 1);
        item.set("bd_side", "top,right,bottom,left");
        item.set("item_uuid", uuid.generateUid());
        return item;
    },

    arInit: function () {
        var item = fmaobj.elem.create();
        item.set("item_id", uuid.generateUidNum());
        item.set("item_type", 45);
        item.set("item_val", "开启直播");
        item.set("item_val_sub", "");
        item.set("item_top", 361);
        item.set("item_left", 224);
        item.set("item_width", 250);
        item.set("item_height", 88);
        item.set("item_opacity", 100);
        item.set("font_size", "28px");
        item.set("item_color", "#ffffff");
        item.set("font_halign", "center");
        item.set("bg_color", "#4cd964");
        item.set("item_animation", "bounceIn");
        item.set("item_animation_val", '{"delay":0,"duration":0.1,"type":"in","infinite":1}');
        item.set("bd_style", "solid");
        item.set("item_border", 2);
        item.set("bd_radius", "40");
        item.set("bd_color", "#ffffff");
        item.set("x_scale", 1);
        item.set("y_scale", 1);
        item.set("bd_side", "top,right,bottom,left");
        item.set("item_uuid", uuid.generateUid());
        return item;
    },

    vrInit: function () {
        var item = fmaobj.elem.create();
        item.set("item_id", uuid.generateUidNum());
        item.set("item_type", 46);
        item.set("item_val", "开启直播");
        item.set("item_val_sub", "");
        item.set("item_top", 361);
        item.set("item_left", 224);
        item.set("item_width", 250);
        item.set("item_height", 88);
        item.set("item_opacity", 100);
        item.set("font_size", "28px");
        item.set("item_color", "#ffffff");
        item.set("font_halign", "center");
        item.set("bg_color", "#4cd964");
        item.set("item_animation", "bounceIn");
        item.set("item_animation_val", '{"delay":0,"duration":0.1,"type":"in","infinite":1}');
        item.set("bd_style", "solid");
        item.set("item_border", 2);
        item.set("bd_radius", "40");
        item.set("bd_color", "#ffffff");
        item.set("x_scale", 1);
        item.set("y_scale", 1);
        item.set("bd_side", "top,right,bottom,left");
        item.set("item_uuid", uuid.generateUid());
        return item;
    },

    embeddedInit: function () {
        var item = fmaobj.elem.create();
        item.set("item_id", uuid.generateUidNum());
        item.set("item_type", 35);
        item.set("item_val", "http://www.agoodme.com");
        item.set("item_val_sub", "关于我们");
        item.set("item_top", 361);
        item.set("item_left", 224);
        item.set("item_width", 250);
        item.set("item_height", 88);
        item.set("item_opacity", 100);
        item.set("font_size", "28px");
        item.set("item_color", "#ffffff");
        item.set("font_halign", "center");
        item.set("bg_color", "#4cd964");
        item.set("item_animation", "bounceIn");
        item.set("item_animation_val", '{"delay":0,"duration":0.1,"type":"in","infinite":1}');
        item.set("bd_style", "solid");
        item.set("item_border", 2);
        item.set("bd_radius", "40");
        item.set("bd_color", "#ffffff");
        item.set("x_scale", 1);
        item.set("y_scale", 1);
        item.set("bd_side", "top,right,bottom,left");
        item.set("item_uuid", uuid.generateUid());
        return item;
    },

    labelInit: function () {
        var item = fmaobj.elem.create();
        item.set("item_id", uuid.generateUidNum());
        item.set("item_type", 38);
        item.set("item_val", "");
        item.set("item_val_sub", '{"地点":"http://ac-hf3jpeco.clouddn.com/3bce28861e082296e8b7.png"}');
        item.set("item_top", 361);
        item.set("item_left", 224);
        item.set("item_width", 190);
        item.set("item_height", 52);
        item.set("item_opacity", 100);
        item.set("font_size", "24px");
        item.set("font_valight", "middle");
        item.set("font_halign", "center");
        item.set("item_animation", "bounceIn");
        item.set("item_animation_val", '{"delay":0,"duration":0.1,"type":"in","infinite":1}');
        item.set("bd_style", "solid");
        item.set("bd_radius", "40");
        item.set("bd_color", "#fff");
        item.set("item_color", "#fff");
        item.set("x_scale", 1);
        item.set("y_scale", 1);
        item.set("bd_side", "top,right,bottom,left");
        item.set("ext_attr", "left");
        item.set("item_href", "");
        item.set("item_uuid", uuid.generateUid());
        return item;
    },

    rewardInit: function () {
        var item = fmaobj.elem.create();
        item.set("item_id", uuid.generateUidNum());
        item.set("item_type", 36);
        item.set("item_cntype", 2);
        item.set("item_val", "赏");
        item.set("item_href", "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd2714a072abdd918&redirect_uri=http://www.agoodme.com/payment/reward.php&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect");
        item.set("font_halign", "center");
        item.set("item_color", "#FFFFFF");
        item.set("frame_color", "#ffffff");
        item.set("frame_pixes", 0);
        item.set("item_top", 132);
        item.set("item_left", 116);
        item.set("item_width", 144);
        item.set("item_height", 144);
        item.set("font_dist", 5);
        item.set("font_size", "36px");
        item.set("item_opacity", 100);
        item.set("bg_color", "#d65645");
        item.set("font_frame", false);
        item.set("bd_radius", "72");
        item.set("item_border", 0);
        item.set("bd_color", "#000000");
        item.set("item_animation", "bounceIn");
        item.set("item_animation_val", '{"delay":0,"duration":0.1,"type":"in","infinite":1}');
        item.set("font_valight", "middle");
        item.set("bd_side", "top,right,bottom,left");
        item.set("item_uuid", uuid.generateUid());
        return item;
    },

    mapInit: function () {
        var mapInit = fmaobj.elem.create();
        mapInit.set("item_id", uuid.generateUidNum());
        mapInit.set("item_cntype", 2);
        mapInit.set("item_type", 15);
        mapInit.set("item_val", '{"lng":121.618461,"lat":31.213248,"zoom":15}');
        mapInit.set("item_top", 373);
        mapInit.set("item_left", 87);
        mapInit.set("item_width", 466);
        mapInit.set("item_height", 262);
        mapInit.set("item_opacity", 100);
        mapInit.set("x_scale", 1);
        mapInit.set("y_scale", 1);
        mapInit.set("bd_side", "top,right,bottom,left");
        mapInit.set("item_uuid", uuid.generateUid());
        mapInit.set("item_animation", "bounceIn");
        mapInit.set("item_animation_val", '{"delay":0,"duration":0.1,"type":"in","infinite":1}');
        return mapInit;
    },
redEnvelopeInit:function(redEnvelopeId,tid){
    var item = fmaobj.elem.create();
    item.set("item_id",  uuid.generateUidNum());
    item.set("item_type", ElementType.redEnvelope);
    item.set("item_cntype", 2);
    item.set("item_val_sub",redEnvelopeId);
    item.set("ext_attr", tid);
    item.set("item_val", "http://ac-hf3jpeco.clouddn.com/4975c276e6e9239d7afd.png");
    item.set("item_href", "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxd2714a072abdd918&redirect_uri=http://www.agoodme.com/payment/redEnvelopes.php&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect");
    item.set("frame_color", "#ffffff");
    item.set("frame_pixes", 0);
    item.set("item_top", 245);
    item.set("item_left", 168);
    item.set("item_width", 299);
    item.set("item_height", 399);
    item.set("item_opacity", 100);
    item.set("bd_radius", "0");
    item.set("item_border", 0);
    item.set("bd_color", "#000000");
    item.set("item_animation", "bounceIn");
    item.set("item_animation_val", '{"delay":0,"duration":0.1,"type":"in","infinite":1}');
    item.set("bd_side", "top,right,bottom,left");
    item.set("item_uuid",uuid.generateUid());
    return item;
},

    svgInit: function () {
        var item = fmaobj.elem.create();
        item.set("item_id", uuid.generateUidNum());
        item.set("item_type", 39);
        item.set("item_cntype", 2);
        item.set("item_val", "");
        item.set("item_val_sub", '{"delay":0,"duration":0.1,"infinite":"1","a1":0,"a2":0,"b1":0,"b2":100}');
        item.set("item_top", 344);
        item.set("item_left", 160);
        item.set("item_width", 320);
        item.set("item_height", 320);
        item.set("item_opacity", 100);
        item.set("item_uuid", uuid.generateUid());
        return item;
    },

    /*
       * version 2.0
       * time 4/6 10:45
       * add : ydq
       * 创建一个白色背景图 avos 对象
       */
    createBlankItemObj: function () {
        var itemObj = fmaobj.elem.create();
        itemObj.set("item_id", uuid.generateUidNum());
        itemObj.set("item_val", "http://ac-hf3jpeco.clouddn.com/wy7k70ifPffxR0VoCjcctqgAXRGsG4roiQNk1w3c.jpg");
         itemObj.set("pic_replace", 1);//不可替换
        itemObj.set("item_state", "none");
        itemObj.set("item_width", 2);
        itemObj.set("item_height", 2);
        itemObj.set("item_type", 1);
        itemObj.set("item_top", 0);
        itemObj.set("item_left", -10000);
        itemObj.set("item_opacity", 0);
        itemObj.set("item_layer", 0);
        itemObj.set("item_filter", "none");
        itemObj.set("font_family", "宋体");
        itemObj.set("item_angle", false);
        itemObj.set("font_frame", false);
        itemObj.set("frame_style", 1);
        itemObj.set("mask_color", "0");
        itemObj.set("lock_level", 0);
        itemObj.set("mask_height", 0);
        itemObj.set("item_uuid", uuid.generateUid());
        itemObj.set("item_cntype", 2);
        itemObj.set("mask_width", 0);
        itemObj.set("font_valight", "top");
        itemObj.set("font_halign", "left");
        itemObj.set("frame_color", "#ffffff");
        itemObj.set("item_color", "ffffff");
        itemObj.set("item_mirror", "null");
        itemObj.set("auto_play", false);
        itemObj.set("frame_pixes", 0);
        itemObj.set("use_mask", false);
        itemObj.set("x_scale", 1);
        itemObj.set("rotate_angle", 0);
        itemObj.set("y_scale", 1);
        itemObj.set("restart_play", false);
        itemObj.set("line_height", 0);
        itemObj.set("rotate_pos", "0.0");
        itemObj.set("font_dist", 0);
        itemObj.set("item_filter_val", "none");
        itemObj.set("font_size", "12");
        itemObj.set("item_animation", "none");
        // itemObj.set("createdAt", (new Date().toString));
        itemObj.set("bd_side", "top,right,bottom,left");
        return itemObj;
    },

    makeDisplayFrame: function () {
        var id = uuid.generateUidNum();
        var group = fmaobj.elem.create();
        group.set("item_type", 34);
        group.set("item_val", "");
        group.set("item_top", 0);
        group.set("item_left", 0);
        group.set("item_width", 640);
        group.set("item_height", 1008);
        group.set("item_opacity", 100);
        group.set("x_scale", 1);
        group.set("y_scale", 1);
        group.set("item_id", id);
        group.set("item_uuid", uuid.generateUid());
        group.set("group_id", id);
        group.set("item_display_status", 1);
        return group;
    },
    makeLink: function (url) {
        var id = uuid.generateUidNum();
        var el = fmaobj.elem.create();
        el.set("item_type", 43);
        el.set("item_val", url);
        el.set("item_top", 0);
        el.set("item_left", 0);
        el.set("item_width", 640);
        el.set("item_height", 1008);
        el.set("item_opacity", 100);
        el.set("item_id", id);
        el.set("item_uuid", uuid.generateUid());
        el.set("item_display_status",0);
        return el;
    },

    getTextLength: function (text) {
        function isChinese(temp) {
            var re = /[\u4e00-\u9fa5]/;
            return (!!re.test(temp));
        }
        var sum = 0;
        for (var i = 0; i < text.length; i++) {
            if (isChinese(text[i])) {
                sum += 34;
            } else {
                sum += 18
            }
            console.log(sum)
        }
        return sum;
    }

};


module.exports = ItemInit;
