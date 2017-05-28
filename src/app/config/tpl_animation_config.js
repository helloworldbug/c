var tpl_animation_mode = [
    {
        animationName : "纵向滑出",  //动画名
        animationValue: {
            "name"     : "scrollY",//纵向滑出
            "autoplay" : false,
            "interval" : 10000,
            "direction": 1,// 0横向  1纵向
            "lock"     : false
        },  //动画
        animationState: 1  //动画是否可用 , 1 为可用 , 0 为不可用
    },
    {
        animationName : "淡入淡出",  //动画名
        animationValue: {
            "name"     : "fade",//淡入淡出
            "autoplay" : false,
            "interval" : 10000,
            "direction": 1,// 0横向  1纵向
            "lock"     : false
        },  //动画
        animationState: 1  //动画是否可用 , 1 为可用 , 0 为不可用
    },
    //{
    //    animationName : "横向侧翻",  //动画名
    //    animationValue: {
    //        "name"     : "leftRight3DX",//横向侧翻
    //        "autoplay" : false,
    //        "interval" : 10000,
    //        "direction": 0,// 0横向  1纵向
    //        "lock"     : false
    //    },  //动画
    //    animationState: 1  //动画是否可用 , 1 为可用 , 0 为不可用
    //},
    //{
    //    animationName : "纵向侧翻",  //动画名
    //    animationValue: {
    //        "name"     : "leftRight3DY",//纵向侧翻
    //        "autoplay" : false,
    //        "interval" : 10000,
    //        "direction": 1,// 0横向  1纵向
    //        "lock"     : false
    //    },  //动画
    //    animationState: 1  //动画是否可用 , 1 为可用 , 0 为不可用
    //},
    // {
    //     animationName: "横向开门",  //动画名
    //     animationValue: {
    //         "name":"openDoorX",//横向开门
    //         "autoplay":false,
    //         "interval":10000,
    //         "direction":0,// 0横向  1纵向
    //         "lock":false
    //     },  //动画
    //     animationState: 1  //动画是否可用 , 1 为可用 , 0 为不可用
    // },
    // {
    //     animationName: "纵向开门",  //动画名
    //     animationValue: {
    //         "name":"openDoorY",//纵向开门
    //         "autoplay":false,
    //         "interval":10000,
    //         "direction":1,// 0横向  1纵向
    //         "lock":false
    //     },  //动画
    //     animationState: 1  //动画是否可用 , 1 为可用 , 0 为不可用
    // },
    {
        animationName : "滑出缩小",  //动画名
        animationValue: {
            "name"     : "slideCoverIn",//滑出缩小,老版动画同款******************************
            "autoplay" : false,
            "interval" : 10000,
            "direction": 1,// 0横向  1纵向
            "lock"     : false
        },  //动画
        animationState: 1  //动画是否可用 , 1 为可用 , 0 为不可用
    },
    {
        animationName : "横向滑出",  //动画名
        animationValue: {
            "name"     : "scrollX",//横向滑出
            "autoplay" : false,
            "interval" : 10000,
            "direction": 0,// 0横向  1纵向
            "lock"     : false
        },  //动画
        animationState: 1  //动画是否可用 , 1 为可用 , 0 为不可用
    },
    {
        animationName : "爆炸",  //动画名
        animationValue: {
            "name"     : "bomb",//爆炸
            "autoplay" : false,
            "interval" : 10000,
            "direction": 1,// 0横向  1纵向
            "lock"     : false
        },  //动画
        animationState: 1  //动画是否可用 , 1 为可用 , 0 为不可用
    },
    {
        animationName : "纵向拉伸",  //动画名
        animationValue: {
            "name"     : "bombY",//纵向拉伸
            "autoplay" : false,
            "interval" : 10000,
            "direction": 1,// 0横向  1纵向
            "lock"     : false
        },  //动画
        animationState: 1  //动画是否可用 , 1 为可用 , 0 为不可用
    },
    {
        animationName : "封面上翻",  //动画名
        animationValue: {
            "name"     : "flowCover",//封面上翻flowCover
            "autoplay" : false,
            "interval" : 10000,
            "direction": 1,// 0横向  1纵向
            "lock"     : false
        },  //动画
        animationState: 1  //动画是否可用 , 1 为可用 , 0 为不可用
    },
    {
        animationName : "封面下翻",  //动画名
        animationValue: {
            "name"     : "slideCover",//封面下翻flowCover
            "autoplay" : false,
            "interval" : 10000,
            "direction": 1,// 0横向  1纵向
            "lock"     : false
        },  //动画
        animationState: 1  //动画是否可用 , 1 为可用 , 0 为不可用
    },
    {
        animationName : "缩小放大",  //动画名
        animationValue: {
            "name"     : "zoom",//缩小放大
            "autoplay" : false,
            "interval" : 10000,
            "direction": 1,// 0横向  1纵向
            "lock"     : false
        },  //动画
        animationState: 1  //动画是否可用 , 1 为可用 , 0 为不可用
    },
    {
        animationName : "x轴旋转",  //动画名
        animationValue: {
            "name"     : "zoomY",//x轴旋转
            "autoplay" : false,
            "interval" : 10000,
            "direction": 1,// 0横向  1纵向
            "lock"     : false
        },  //动画
        animationState: 1  //动画是否可用 , 1 为可用 , 0 为不可用
    },
    {
        animationName : "纵向立体翻转",  //动画名
        animationValue: {
            "name"     : "flip3DX",//纵向立体翻转
            "autoplay" : false,
            "interval" : 10000,
            "direction": 1,// 0横向  1纵向
            "lock"     : false
        },  //动画
        animationState: 1  //动画是否可用 , 1 为可用 , 0 为不可用
    },
    {
        animationName : "横向立体翻转",  //动画名
        animationValue: {
            "name"     : "flip3DY",//横向立体翻转
            "autoplay" : false,
            "interval" : 10000,
            "direction": 0,// 0横向  1纵向
            "lock"     : false
        },  //动画
        animationState: 1  //动画是否可用 , 1 为可用 , 0 为不可用
    },
    {
        animationName : "禁止翻页",  //动画名
        animationValue: {
            "name"     : "",//横向立体翻转
            "autoplay" : false,
            "interval" : 10000,
            "direction": 0,// 0横向  1纵向
            "lock"     : true
        },  //动画
        animationState: 1  //动画是否可用 , 1 为可用 , 0 为不可用
    }

    //{
    //    animationName: "随机",  //动画名
    //    animationValue: {
    //        "name":"random",//随机
    //        "autoplay":false,
    //        "interval":10000,
    //        "direction":0,// 0横向  1纵向
    //        "lock":false
    //    },  //动画
    //    animationState: 1  //动画是否可用 , 1 为可用 , 0 为不可用
    //}
]

module.exports = tpl_animation_mode;