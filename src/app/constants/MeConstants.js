/**
 * @module MeConstants
 * @description
 * @time 2015-07-21 15:15
 * @author StarZou
 **/

var keyMirror = require('keymirror');

module.exports = {

    Timeline: keyMirror({
        TIMELINE_FOCUS: null, ///切换焦点
        ADD_TIMELINE_FRAME: null, ///增加关键帧
        REMOVE_TIMELINE_FRAME: null ///删除关键帧
    }),
    // 动作类型
    ActionTypes: keyMirror({
        // 作品
        CANCEL_UPDATE: null, //取消保存作品后只更新pages_datar 的objectID
        SAVE_UPDATE: null, //保存作品后更新object
        WORK_INIT: null,
        CREATE_BLANK_MAGAZINE: null, //空白期刊
        CREATE_BLANK_TEMPLATE: null, //空白模板
        GET_TEMPLATE_DATA: null, // 查询作品数据
        SAVE_TEMPLATE_DATA: null, // 保存作品数据
        PUBLISH_TEMPLATE_DATA: null, // 发布作品数据
        QUERY_TEMPLATES_BY_CONDITION: null, // 根据条件查询作品数据
        TEMPLATES_EXCHANGE: null, // 兑换的模板
        CREATE_BY_PIC: null, //根据多张图片一键生成


        // 元素
        ADD_ELEMENT: null, // 添加元素
        MOVE_ELEMENT: null, // 移动元素
        MULTI_UPDATE: null, //拖拉多个元素
        UPDATE_ELEMENT: null, // 更新元素
        SELECT_ELEMENT: null, // 选中元素
        DRAG_SELECT: null, //拖拉选中
        RESIZE_ELEMENT: null, // 调整元素大小
        REMOVE_ELEMENT: null, // 删除元素
        COPY_ELEMENT: null, // 复制元素
        PASTE_ELEMENT: null, // 粘贴元素
        REPLACE_ELEMENT: null, // 替换元素
        UPDATE_TEXT_DIM: null, //文字更新大小等尺寸
        EDIT_GROUP: null, //编辑浮动层
        ELEMENTMOVEALL: null,
        ALIGN: null, //对齐
        UPDATE_EVENT: null, //触发事件


        // 页
        ADD_PAGE: null, // 添加页
        REPLACE_PAGE: null, // 替换页
        SELECT_PAGE: null, // 选中页
        MOVE_PAGE: null, // 移动页
        COPY_PAGE: null, // 复制页
        REMOVE_PAGE: null, // 删除页
        UPDATE_TPL: null,
        UPDATE_PAGEPROP: null, //更新页属性
        //弹出菜单
        CHANGE_POPMENU_STATE: null, //显示弹出
        CHANGE_CROP_STATE: null, //显示裁剪

        CHANGE_LAYER: null, //修改层级
        CHANGE_ZOOM: null, //修改device缩放程度

        UNDO: null,
        REDO: null,
        UNDORECORD: null, //录制撤消

        //树型结构
        TOGGLE_NODE: null, // 展开关闭组
        ADD_GROUP: null, //添加组
        SELECT: null, //选择组、页、元素
        UPDATE_ATTR: null, //更新组、页、元素的属性
        DRAG_NODE: null, ///拖动页或组
        REMOVE_NODE: null, //删除组或页
        COPY_NODE: null,
        // 用户操作
        QUERY_FAVORITES: null, // 查询收藏
        DO_FAVORITE_SUCCEED: null, // 进行收藏操作成功
        DO_FAVORITE_FAILED: null, // 进行收藏操作失败
        ADD_FAVORITE_SUCCEED: null, // 添加收藏成功
        DELETE_FAVORITE_SUCCEED: null, // 删除收藏成功
        DELETE_WORKS_SUCCEED: null, // 删除作品成功
        CREATE_TEMPLATE_SUCCEED: null, // 创建模板成功
        SHOW_TEMPLATE_PREVIEW: null, // 显示模板预览组件
        HIDE_TEMPLATE_PREVIEW: null, // 隐藏模板预览组件
        MERGE_MAGAZINE: null, //合并作品
        UPDATE_GROUPPAGENUM: null, //组显示页码状态


        MESSAGE_MANAGER: null, //推送消息管理
        UPDATE_MESSAGE_STATUS_SUCCEED: null, //更新消息状态成功
        DELETE_MESSAGE_SUCCEED: null, //删除消息刷新
        QUERY_AUTHlIST: null, //查询授权帐号列表
        CHANGE_AUTH_DIALOG: null, //改变授权框状态

        QUERY_MEMBERSHIPPRIVILEGES: null, //查询会员特权信息
        QUERY_MYPRIVILEGE: null, //查询我的特权信息、
        QUERY_MYORDER: null, //查询我的订单
        CANCEL_MY_ORDER: null, //取消我的订单
        PAY_MY_ORDER: null, //支付我的订单
        SHOW_CART_DIALOG: null, //购物车弹出框
        QUERY_TRADE_LIST: null, //查询交易记录

        //一键出版
        CHANGE_DATA_PROCESSING: null,       //改变转档状态
        CLOSE_DATA_PROCESSING_HINT: null,   //关闭转档提示
        HIDE_DATA_PROCESSING_ANNOUNCE: null,   //隐藏转档公告
        ADD_DATA_PROCESSING_ITEMS: null,   //添加转档的当条记录
        UPDATE_DATA_PROCESSING_ITEM: null,   //更新转档条目
        DELETE_DATA_PROCESSING_ITEM: null,   //删除单条记录
        TOGGLE_DATA_PROCESSING_DIALOG: null,   //显示或者隐藏对话框
        TOGGLE_DATA_PROCESSING_PREVIEW: null,   //显示或者隐藏预览
        TOGGLE_DATA_PROCESSING_DOWNLOAD: null   //显示或者隐藏选择下载类型框

    }),

    // 事件类型
    Events: keyMirror({
        CHANGE: null // 改变事件
    }),

    // 默认值
    Defaults: {
        pageIndex: 0, // 默认选中的页
        elementIndex: 0, // 默认选中的元素
        width: 640, // 默认宽度
        height: 1008, // 默认高度
        scale: 1, // 页缩放值
        PHONEWIDTH: 640,
        PHONEHIGHT: 1008,
        MINELEMENTWIDTH: 20,
        MAXINPUT: 9999999999, //输入框最大值
        MININPUT: -999999999, //输入框最小值
        MAXFONTSIZE: 200, //最大字号
        MINFONTSIZE: 12 //最小字号
    },

    // 元素类型定义
    Elements: {
        background: 1, // 背景
        text: 2, // 文本
        watermark: 3, // 水印
        music: 7, //音乐
        video: 8, // 视频
        borderFrame: 10, // 边框
        link: 11, // 链接
        phone: 12, // 电话
        inputText: 14, // 输入框
        map: 15, //地图
        pictureFrame: 17, // 画框
        image: 18, // 图片
        button: 19, // 按钮
        radio: 20, //单选
        checkbox: 21, //多选
        vote: 22, //投票
        scribble: 24, //涂抹
        fingerprint: 25, //指纹长按
        shake: 27, //摇一摇
        displayFrame: 34, //显示框 又叫 浮层
        embedded: 35, //嵌入网页
        reward: 36, //打赏
        picslide: 37, //图集
        label: 38, //标签
        svg: 39, //svg
        panorama: 40, //虚拟全景
        redEnvelope: 41, //红包
        ar: 45, //AR增强现实
        vr: 46, //VR增强现实
    },

    // 数据对象定义
    ClassesMap: {
        template: 'tplobj',
        page: 'page',
        element: 'element',
        favorite: 'me_favorites',
        pcMaterial: 'pc_material',
        music: 'me_music',
        musicStyle: 'me_musicstyle',
        label: 'labels',
        resource: 'resobj',
        feedback: 'feedback_obj',
        statistics: 'me_statistics',
        customerData: 'me_customerdata'
    },

    SelectDialog: keyMirror({
        SHOW: null,
        HIDE: null
    }),
    GridType: keyMirror({
        GRID_PANEL: null,
        GRID_SHOW: null,
        GRID_WIDTH: null,
        GRID_COLOR: null,
        GRID_SHOWREFERENCE: null,
        GRID_ADSORPTION: null,
        ITEM_MOVE_START: null,
        ITEM_MOVE_END: null,


    }),
    UserTab: {
        MYPRODUCT: 0, //我的发布作品
        MYDRAFT: 1, //我的草稿
        RECYCLE: 2, //我的回收站
        MYCOLLECTION: 3, //我的收藏
        MYMODE: 4, //我的模板
        MYDATA: 5, //数据统计
        MYSETTING: 6, //个人资料
        MYACCOUNT: 7, //我的账户
        DOMAINBIND: 8, //域名绑定
        AUTH: 9, //授权管理
        WEIXINPUSH: 10, //一键推送
        WEIXINMGR: 11, //推送消息管理
        WEIXINEDIT: 12, //图文编辑
        WEIXINMGRDRAFT: 13, //推送消息管理--草稿
        WEIXINMGRREC: 14, //推送消息管理--回收站
        USERDATACOLLECTION: 15, //作品-用户资料收集
        ELECTRICITYSUPPLIER: 16, //电商管理
        MYORDER: 17, //我的订单
        MYPRIVILEGES: 18, //我的特权
        CHARGEDTEMPLATE: 19, //已购买模板
        CONVERTRECORDS: 20, //转换记录
        ONLINEREAD: 21, //在线阅读管理
        MYBOOKRACK: 22, //我的书架
        ILLEGALWORK: 23, //异常作品
        
        /* add by gli-cq-gonglong 2017-04-20 内容仓库 Start*/
        COLLECT_CONTENT: 24, // 内容采集
        MY_CONTENT: 25, // 我的内容
        COLLECT_SETTING: 26, // 采集设置
        COMPOSE_PRODUCT: 27, // 合成作品
        UPLOAD_CONTENT: 28, // 内容上传
        /* add by gli-cq-gonglong 2017-04-20 内容仓库 End*/
    },
    MsgTabName: keyMirror({
        PUBLISH_MESSAGE: null, //已发消息
        UNPUBLISH_MESSAGE: null, //草稿箱消息
        RECYCLE_MESSAGE: null //回收站消息
    }),
    EditStates: keyMirror({
        TEXTPANNELMOUSEOVERSTATE: null //mouse是否在文字属性面板上
    })
    //AlignType:keyMirror({
    //    LOCK:null,
    //    UNLOCK:null,
    //    GROUP:null,
    //    UNGROUP:null,
    //    ALIGNLEFT:null,
    //    ALIGNRIGHT:null,
    //    ALIGNTOP:null,
    //    ALIGNBOTTOM:null,
    //    ALIGNCENTER:null,
    //    ALIGNMIDDLE:null,
    //    ALIGNHJUSTFY:null,
    //    ALIGNVJUSTFY:null
    //})
};