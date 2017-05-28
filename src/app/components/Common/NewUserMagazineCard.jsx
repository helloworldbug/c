/**
 /**
 * @component UserMagazineCard
 * @description 用户杂志卡片组件
 * @time 2015-09-22 11:32
 * @author StarZou
 **/

'use strict';

var React = require('react');
var Router = require('react-router');
var classNames = require('classnames');
var CommonUtils = require('../../utils/CommonUtils');
var MeStore = require('../../stores/MeStore');
var MeActionCreators = require('../../actions/MeActionCreators');
var MeAPI = require('../../utils/MeAPI');
var Dialog = require('../Common/Dialog');
var Base = require('../../utils/Base');
var MakeWebAPIUtils = require('../../utils/MakeWebAPIUtils');
var GlobalFunc = require('./GlobalFunc');
var PreviewShare = require('../Preview/PreviewShare');
var Route = Router.Route;
var Link = Router.Link;
var Cart = require("../Cart/Cart");
var MeStore = require('../../stores/MeStore');
var urlconfig = require("../../config/serverurl.js")
require('../../../assets/css/user-magazine-card.css');

// 作品类型与HeadBar映射
var TemplateTypeToHeadBarMap = {

    publishedMagazine: { //已发布
        edit: true,
        editName: true,
        create: true,
        deleteWorks: true,
        deleteFavorites: false,
        hasReadCount: false,
        replaceCover: true,
        share: true,
        down: true,
        recycleDelete: false,
        restore: false
    },

    unpublishedMagazine: {//草稿
        edit: true,
        editName: true,
        create: true,
        deleteWorks: true,
        deleteFavorites: false,
        hasReadCount: false,
        recycleDelete: false,
        down: true,
        replaceCover: true,
        restore: false
    },

    myFavoritesMagazine: { //收藏
        edit: false,
        editName: false,
        create: false,
        deleteWorks: false,
        deleteFavorites: true,
        hasReadCount: true,
        recycleDelete: false,
        restore: false
    },

    myTemplate: { //我的模版
        editName: true,
        edit: true,
        create: false,
        deleteWorks: true,
        deleteFavorites: false,
        hasReadCount: false,
        recycleDelete: false,
        restore: false
    },

    recycle: { //回收站
        edit: false,
        editName: false,
        create: false,
        deleteWorks: false,
        deleteFavorites: false,
        hasReadCount: false,
        replaceCover: false,
        share: false,
        down: false,
        recycleDelete: true,
        restore: true,//还原
    },
    illegalWork: { //异常作品
        editName: false,
        edit: true,
        create: false,
        deleteWorks: true,
        deleteFavorites: false,
        hasReadCount: false,
        replaceCover: false,
        share: false,
        down: false,
        recycleDelete: false,
        restore: false,//还原
    },

};

var UserMagazineCard = React.createClass({

    getInitialState: function () {
        return {
            showQRCodeImage: false,
            showShare: false,
            cartData: []
        };
    },
    appealWork: function (tid, name, createdAt) {
        var obj = { tid, name, createdAt }
        localStorage.setItem("appealWorkStr", JSON.stringify(obj));
        window.open(location.origin + "/appeal")
        // Base.linkToPath("/appeal");
    },
    render: function () {
        var pic = [];
        var read = [];
        var attributes = this.attributes = this.props.template.attributes;
        var tid = this.tid = attributes.tpl_id;
        var previewParams = {
            tid: tid,
            uid: attributes.author
        };

        var picList, lists, list;
        if (this.props.templateType == "myFavoritesMagazine") {
            var favorites = MeStore.getFavorites();

            var favoriteObject;
            for (var i = 0; i < favorites.length; i++) {
                favoriteObject = favorites[i];
                if (attributes.tpl_id == favoriteObject.attributes.fav_id) {
                    this.props.template.add_fav_date = favoriteObject.createdAt;
                }
            }

        }


        //插入作者作品信息
        if (this.props.templateType == "myFavoritesMagazine" || this.props.templateType == "searchWork") {
            pic.push(
                <div key="content" className="card-content">
                    <div className="avatar">
                        <Link to={'/designerDetail/uid=' + attributes.author}><img
                            src={attributes.author_img || CommonUtils.getDefaultUserAvatar()} /></Link>
                    </div>
                    <div className="info">
                        <div className="author" title={attributes.name} dangerouslySetInnerHTML={{ __html: attributes.name }}></div>
                        <div className="name"><Link
                            to={'/designerDetail/uid=' + attributes.author}>{attributes.author_name}</Link></div>
                    </div>
                </div>
            );
            read.push(
                <div key="number" className="number" title="阅读数">{attributes.read_pv}</div>
            );
        }
        else if (this.props.templateType != "searchMode") {
            var nameBox = this.attributes.nofree || TemplateTypeToHeadBarMap[this.props.templateType].editName == false ? (<div key="action" className="card-action">
                <div className="name cannot-edit">{attributes.name}</div>
            </div>) : (<div key="action" className="card-action">
                <div className="name" title="点击修改" onClick={this.showEditName} dangerouslySetInnerHTML={{ __html: attributes.name }}></div>
                <input id="editName" className="editName" type="text" defaultValue={GlobalFunc.htmlDecode(attributes.name)}
                    onBlur={this.changeName} />
            </div>)
            pic.push(nameBox);
        }
        //插入使用模版按钮
        if (this.props.templateType == "searchMode") {
            pic.push(
                <div key="search" className="card-search">
                    <div title={attributes.name}>{attributes.name}</div>
                    <div>{attributes.author_name}</div>
                </div>
            );
            read.push(
                <Link key="userMode" to={"/make/" + previewParams.tid} className="searchUseMode" target="_blank">使用模版</Link>
            );
        }

        var deleteDate = this.props.templateType == "recycle" ?
            <div className="delete-date">删除时间：{this.parseNewDate(attributes.tpl_delete_date)}</div> : null;
        var createAt = this.parseNewDate(this.props.template.createdAt);
        var updateTime = attributes.reupdate_date ? this.parseNewDate(this.getLocalTime(attributes.reupdate_date)) : "";
        {
            this.props.templateType == "recycle" ? this.parseNewDate(attributes.tpl_delete_date) : updateTime
        }
        var date = '';
        switch (this.props.templateType) {
            case "recycle":
                date = this.parseNewDate(attributes.tpl_delete_date);
                break;
            case "myFavoritesMagazine":
                date = this.parseNewDate(this.props.template.add_fav_date);
                createAt = updateTime;
                break;

            default:
                date = updateTime;
        }
        //卡片视图
        picList = (<div className="user-magazine-card-frame">
            <div className="works-card user-magazine-card">
                <div className="card-image" onMouseOver={this.changeState.bind(this, true)}>
                    <Link to={"/preview/tid=" + previewParams.tid} target="_blank">
                        {/*<img src={attributes.effect_img.substr(3)}/>*/}
                        <img src={GlobalFunc.subAvChar(attributes.tpl_share_img)} />
                        {this.generateQRCode()}
                    </Link>
                </div>
                {pic}
                <div className="card-head-bar">
                    {read}
                    {this.generateHeadBar()}
                </div>
                {this.props.templateType === "illegalWork" && <div className="appeal-tips"> 该作品违规，请重新修改后<span onClick={this.appealWork.bind(this, previewParams.tid, attributes.name, createAt)} className="appeal-link">申诉解封</span> </div>}
                {deleteDate}

                <Dialog title={this.state.dialogTitle} appearanceState={this.state.showDialog}
                    sureFn={this.state.sureFn} cancelFn={this.hideDialog} />
            </div>
            <div className="bottomFirstLine bottomLine"></div>
            <div className="bottomSecondLine bottomLine"></div>
            <Cart ref="cart" data={this.state.cartData} onOk={this.onPayOk.bind(this, this.state.cartData)} />
        </div>);

        var listInfo = this.props.templateType === "illegalWork" ? (<ul className="appeal">
            <li className="title"><Link to={"/preview/tid=" + previewParams.tid}
                title={attributes.name} target="_blank"><img
                    src={GlobalFunc.subAvChar(attributes.tpl_share_img)} width="24"
                    height="24" /><span dangerouslySetInnerHTML={{ __html: attributes.name }}></span></Link></li>
            <li className="time appeal-tips">该作品违规，请重新修改后<span onClick={this.appealWork.bind(this, previewParams.tid, attributes.name, createAt)} className="appeal-link">申诉解封</span></li>
            <li className="icon card-head-bar"> {this.generateHeadBar()}</li>
        </ul>) : (
                <ul>
                    <li className="title"><Link to={"/preview/tid=" + previewParams.tid}
                        title={attributes.name} target="_blank"><img
                            src={GlobalFunc.subAvChar(attributes.tpl_share_img)} width="24"
                            height="24" /><span dangerouslySetInnerHTML={{ __html: attributes.name }}></span></Link></li>
                    <li className="time">{createAt}</li>
                    <li className="time">{date}</li>
                    <li className="icon card-head-bar"> {this.generateHeadBar()}</li>
                </ul>
            )
        //列表
        lists = (<div className="template-list">
            {listInfo}
            <Dialog title={this.state.dialogTitle} appearanceState={this.state.showDialog}
                sureFn={this.state.sureFn} cancelFn={this.hideDialog} />
            <Cart ref="cart" data={this.state.cartData} onOk={this.onPayOk.bind(this, this.state.cartData)} />
        </div>);

        list = this.props.viewState == 1 ? picList : lists;
        return list;
    },

    /*
     * 解析 new Date() 对象
     */
    parseNewDate: function (d) {
        return GlobalFunc.parseNewDate(d)
    },

    getLocalTime: function (d) {
        return new Date(parseInt(d) * 1000);
    },

    /*
     * 分享弹出层
     */
    generateShare: function () {
        return (
            <div className="share-box">
                <PreviewShare ref="share" />
            </div>
        )
    },

    showShare: function () {
        this.setState({
            showShare: !this.state.showShare
        });
    },

    initShare() {
        var attributes = this.attributes = this.props.template.attributes;
        var tid = this.tid = attributes.tpl_id;
        var title = attributes.author_name;
        var pic = GlobalFunc.subAvChar(attributes.tpl_share_img);
        var summary = attributes.brief;
        var url = location.origin + "/preview/tid=" + tid;
        var shareComponentObject = {
            url: encodeURIComponent(url),
            title: title,
            content: title,
            pic: pic,
            pics: pic,
            summary: summary,
            comment: summary,
            description: summary
        };
        var shareComponentObjects = {};

        ['tsina', 'renren', 'tqq', 'tqzone', 'kaixin', 'tieba', 'cqq'].forEach(_name => {
            shareComponentObjects[_name] = shareComponentObject;
        });

        this.refs.share && this.refs.share.setState(shareComponentObjects);
    },

    componentWillUnmount: function () {
        console.log("Unmount");
    },
    componentDidMount: function () {
        // 查数据数
        console.log("didmount");
        if (this.isNeedGetDataCount()) {
            var me = this;

            MeAPI.getDataCount(this.tid).then(function (count) {
                console.log("finished get data");
                me.setState({ dataCount: count });
            });
        }

        /*var _this = this;
         $(document).bind("click",function(e){
         if($(e.target).closest(".share-box").length == 0 && $(e.target).closest(".share-hover").length == 0){
         if(_this.state.showShare) {
         _this.setState({
         showShare: false
         });
         }
         }
         });*/

        //$(document)
    },

    componentDidUpdate: function () {
        this.initShare();
    },

    /**
     * 显示二维码
     * @param isShow
     */
    changeState: function (isShow) {
        this.setState({ showQRCodeImage: isShow });
    },

    /**
     * 关闭dialog
     */
    hideDialog: function () {
        this.setState({
            showDialog: false
        });
    },

    /**
     * 生成模板
     */
    createTemplate: function () {
        var _this = this;
        // todo
        // if (confirm('要生成模板吗？')) {
        //     MeActionCreators.createTemplate(this.props.template);
        // }
        this.setState({
            dialogTitle: '要生成模板吗？',
            showDialog: true,
            sureFn: this._createTemplates
        });
    },
    _createTemplates: function () {
        MeActionCreators.createTemplate(this.props.template);
        this.hideDialog();
    },

    /**
     * 删除作品
     */
    deleteWorks: function () {
        this.setState({
            dialogTitle: '确定要删除吗？',
            showDialog: true,
            sureFn: this._deleteWorks()
        });
    },

    _deleteWorks: function () {
        if (this.props.refresh) {
            this.props.refresh()
        }
        MeActionCreators.deleteWorks(this.props.template);
        this.hideDialog();
    },

    /*
     * 作品假删
     */
    fakeDelete: function (type) {
        var _this = this,
            _type = type;

        var title = '';

        switch (this.props.templateType) {
            case "publishedMagazine":
                title = '确定要把此作品放入回收站吗？';
                break;
            case "recycle":
                title = '确定要永久性的删除此作品吗？';
                break;
            case "myTemplate":
                title = '确定要删除此模板吗？';
                break;
            case "unpublishedMagazine":
                title = '确定要删除此草稿吗？';
                break;
            case "illegalWork":
                title = '确定要把此作品放入回收站吗？';
                break;
        }

        if (_type > 0) {
            this.setState({
                dialogTitle: title,
                showDialog: true,
                sureFn: _this._fakeDelete.bind(this, _type)
            });
        } else {
            this._fakeDelete(_type, this.props.templateType);
        }

    },

    _fakeDelete: function (type, oriType) {
        if (this.props.refresh) {
            this.props.refresh()
        }
        MeActionCreators.fakeDelete(this.props.template, type);
        var user = Base.getCurrentUser();
        var obj = {
            tpl_id: this.props.template.attributes.tpl_id,
            user_name: user.get("user_nick"),
            user_id: user.id
        }

        switch (this.props.templateType) {
            case "publishedMagazine":
            case "unpublishedMagazine":
            case "illegalWork":
                obj.action = 7;
                obj.delete_status = 1;
                obj.tpl_state = "用户删除"
                break;
            case "recycle":
                obj.action = 8;
                obj.tpl_state = "用户恢复"
                break;
        }
        if (obj.action) {
            GlobalFunc.addRecord(obj)
        }

        this.hideDialog();
    },
    exportWork: function () {
        if (this.props.exportWork) {
            this.props.exportWork(this.props.template.attributes.tpl_id)
        }
    },
    exportWorkCheck: function () {
        var tplID = this.props.template.attributes.tpl_id;
        var userID = Base.getCurrentUser().id;
        MakeWebAPIUtils.ifWorkUsed(tplID, userID, "Svc_DownloadWroksPdf").then(used => {
            if (used) {
                //作品已经使用过下载
                this.exportWork();
            } else {
                //作品没使用过下载
                //判断套餐判断
                let hasTime;
                MakeWebAPIUtils.loadOwnGoods(userID,true).then(data => {
                    //看用户是否有购买过足够的下载次数
                    if (data.err) {
                        return 0
                    }
                    var ownGoods = data.result;
                    //增加包年包月提示
                    for(let value of ownGoods){
                        if (value.item_description.item_id == "Svc_Mouth" || value.item_description.item_id == "Svc_Year") {
                            hasTime = Base.formattime(value.available_end_at, 'yyyy年MM月dd日');
                        }
                    }
                    for (var i = 0, len = ownGoods.length; i < len; i++) {
                        var item = ownGoods[i];
                        if (item.item_description.item_id == "Svc_DownloadWroksPdf" && item.item_count > 0) {
                            return item.item_count;
                        }
                    }
                    return 0
                }).then(times => {
                    if (times) {
                        //显示使用信息
                        let message = `开启作品下载特权剩余使用${times}次<br/>确定使用该特权?`;
                        //增加套餐提示
                        if(typeof hasTime!=='undefined'){
                            message =`您购买的包月/包年特权,<br/>将于${hasTime}到期,<br/>期满后尚有${times}次该特权可使用。`
                        }
                        this.props.showCharge(() => {
                            //用户还有下载功能可用，使用一次下载功能 
                            MakeWebAPIUtils.usePrivilege(["Svc_DownloadWroksPdf"], tplID, "works", userID).then(ret => {
                                if (ret.err) {
                                    console.log(ret.err);
                                    //使用失败用户需要购买下载
                                    this.payDownloadPdf();
                                    return;
                                }
                                MakeWebAPIUtils.updateOwnGoods(ret);
                                this.exportWork();
                            }, err => {
                                //更新owngoods，提醒用户失败
                                // pop dialog
                                MakeWebAPIUtils.clearOwnGoods()
                                MakeWebAPIUtils.loadOwnGoods(userID, true).then(() => {
                                    this.exportWorkCheck();
                                })
                            })

                        }, undefined, message)

                    } else {
                        this.payDownloadPdf(hasTime);
                    }
                })
            }
        })
    },
    payDownloadPdf: function (hasTime) {
        let message = "开启作品下载需要购买特权";
        //增加套餐提示
        if(typeof hasTime!=='undefined'){
            message =`您购买的包月/包年特权,<br/>将于${hasTime}到期。`;
        }
        debugger;
        this.props.showCharge(() => {
            MakeWebAPIUtils.getGoodPrice(["Svc_DownloadWroksPdf"], true, "service").then((goodsInfos) => {
                var netgoodsInfos = goodsInfos.map(item => {
                    var expire = !!item.end_at ? item.end_at : "永久";
                    return { name: item.name, icon: item.icon, price: (item.price / 100).toFixed(2), sum: "1", qixian: expire, id: item.id, custom_code: item.custom_code }
                })
                this.setState({ cartData: netgoodsInfos }, () => {
                    this.refs["cart"].changeDialogStatus(true,0);
                })
            });

        }, undefined, message)
    },
    onPayOk: function (cartData, status) {
        if (status != 2) {
            return
        } else {
            var tplID = this.props.template.attributes.tpl_id;
            var userID = Base.getCurrentUser().id;
            MakeWebAPIUtils.usePrivilege(["Svc_DownloadWroksPdf"], tplID, "works", userID).then(ret => {
                if (ret.err) {
                    console.log(ret.err);
                    //使用失败用户需要购买下载
                    // pop dialog
                    return;
                }
                MakeWebAPIUtils.updateOwnGoods(ret);
                this.exportWork();
            }, err => {
                //更新owngoods，提醒用户失败
                // pop dialog
                MakeWebAPIUtils.clearOwnGoods()
                MakeWebAPIUtils.loadOwnGoods(userID, true).then(() => {
                    this.exportWorkCheck();
                })
            })
        }
    },
    /**
     * 替换封面
     */
    replaceCover: function () {
        var _this = this;
        $("#croped-img-url").unbind("finished").on("finished", function (event, data) {
            var tpl = _this.props.template;
            tpl.set("tpl_share_img", data.cropedUrl + "?imageView/2/w/200/h/200/q/80/format/jpeg")

            tpl.save().then(() => {
                if (_this.props.refresh) {
                    _this.props.refresh();
                }
            });
        });
        $("#croped-img-url").unbind("upload").on("upload", function (event, url) {
            var tpl = _this.props.template
            tpl.set("upload_url", url);
            tpl.save();
        })
        //$("#croped-img-url").val(file.url());
        $("#publish-info-uploadFile").find("input").trigger("click");

    },
    /**
     * 删除收藏
     */
    deleteFavorites: function () {
        this.setState({
            dialogTitle: '确定要删除此收藏吗？',
            showDialog: true,
            sureFn: this._deleteFavorites
        });
    },

    _deleteFavorites: function () {
        if (this.props.refresh) {
            this.props.refresh()
        }
        MeActionCreators.deleteFavorites(this.tid);
        this.hideDialog();
    },

    /**
     * 生成头部栏
     */
    generateHeadBar: function () {
        var templateType = this.props.templateType,
            hearBarOption = TemplateTypeToHeadBarMap[templateType],
            headBar = [];

        if (!hearBarOption) {
            return null;
        }
        //
        if (hearBarOption.edit && this.attributes["data_site"] == 1) {
            //if (hearBarOption.edit) {
            var editParams;
            var editClass = this.props.templateType == "myTemplate" ? "edit tpl-edit" : "edit";
            if (templateType == "myTemplate") {


                headBar.push(
                    <Link key="1" to={`/make/${this.tid}`}>
                        <span className={editClass} title="进入编辑" />
                    </Link>
                );
            } else {

                headBar.push(
                    <Link key="1" to={`/make/${this.tid}&reEdit=true`}>
                        <span className={editClass} title="进入编辑" />
                    </Link>
                );
            }
        }

        if (hearBarOption.create && this.attributes["data_site"] == 1) {
            if(!this.attributes["templeteStatus"]){
                var className = "create1";
                if (this.attributes["tpl_state"] == 1) {
                    className = "create1 unpublish-create";
                }
                headBar.push(
                    <span key="3" className={className} title="生成模版" />
                );
            }else{
                var className = "create";
                if (this.attributes["tpl_state"] == 1) {
                    className = "create unpublish-create";
                }
                headBar.push(
                    <span key="3" className={className} title="生成模版" onClick={this.createTemplate} />
                );
            }
        }

        if (this.attributes["data_site"] == 0 && (templateType == "myTemplate" || templateType == "unpublishedMagazine" || templateType == "publishedMagazine")) {
            headBar.push(
                <span key="fromapp" className="fromapp">FROM APP</span>
            );

        }
        if (hearBarOption.deleteWorks && !this.attributes.nofree) {
            headBar.push(
                <span key="4" className="delete" title="删除作品" onClick={this.fakeDelete.bind(this, 1)} />
            );
        }

        if (hearBarOption.deleteFavorites) {
            headBar.push(
                <span key="5" className="delete" title="删除收藏" onClick={this.deleteFavorites} />
            );
        }

        //替换封面
        if (hearBarOption.replaceCover && this.attributes["data_site"] == 1) {
            headBar.push(
                <span key="6" className="replace" title="替换封面" onClick={this.replaceCover}></span>
            )
        }

        //分享
        if (hearBarOption.share) {
            headBar.push(
                <span key="7" className="share" title="分享">
                    {this.generateShare()}
                </span>
            )
        }

        //下载
        if (hearBarOption.down) {
            headBar.push(
                <span key="8" className="down" title="下载PDF" onClick={this.exportWorkCheck}></span>
            )
        }

        //回收站删除
        if (hearBarOption.recycleDelete) {
            headBar.push(
                <span key="9" className="delete recycleDelete" title="删除作品" onClick={this.fakeDelete.bind(this, 2)} />
            );
        }

        //restore
        if (hearBarOption.restore) {
            headBar.push(
                <span key="10" className="restore" title="还原作品" onClick={this.fakeDelete.bind(this, 0)} />
            );
        }

        return headBar;
    },

    /**
     * 生成二维码
     */
    generateQRCode: function () {
        return (
            <div className="qr-code-image" title="点击或扫描浏览作品">
                {CommonUtils.generateQRCode(CommonUtils.generateViewTemplateUrl(this.tid), 150)}
            </div>
        );
    },

    /**
     * 是否需要查询数据数, 已发布的作品需要查询
     * @return {boolean}
     */
    isNeedGetDataCount: function () {
        return this.props.templateType === 'publishedMagazine';
    },

    showEditName: function (event) {
        $(event.target).next().show();
        $(event.target).next().focus();
        $(event.target).next().select();
    },

    changeName: function (event) {
        var _tid = this.tid, value = GlobalFunc.htmlEncode(event.target.value);
        $(event.target).hide();
        $(event.target).prev(".name").html(value);
        var query = new fmacloud.Query("tplobj");
        query.equalTo("tpl_id", _tid);
        query.descending("createdAt");
        query.first({
            success: function (tplObj) {
               if (tplObj) {
                    var json_url = JSON.parse(tplObj.get("json_url"))

                   MakeWebAPIUtils.getWorkJSON(json_url.key + json_url.postfix).then(tplJsonObj => {
                       tplJsonObj.tplObj.name = value;
                       var textInfo = JSON.stringify(tplJsonObj);
                       var b64 = Base64.encode(textInfo);
                       var file = new AV.File(_tid + '.json', { base64: b64 });
                       file.save().then(fileInfo => {
                           debugger;
                           var temp = fileInfo.url().split("/");
                           var fileId = temp[temp.length - 1].split(".")[0];
                           var result = {};
                           result.url_type = "leancloud";
                           result.postfix = ".json";
                           result.key = fileId;
                           var jsonUrl = JSON.stringify(result);
                            var reviewStatus = tplObj.get("review_status")
                           if (tplObj.get("tpl_state") == 2) {
                               var user = GlobalFunc.getUserObj();
                               var obj = {
                                   tpl_id: _tid,
                                   user_name: user.user_nick,
                                   user_id: user.objectId,
                                   action: 2
                               }
                               //已经发布的作品
                               if (reviewStatus != 2 && reviewStatus != 4 && reviewStatus != 5 && reviewStatus != 6) {
                                   //上次审核通过了，重新走审核流程
                                   fmacapi.update_tplobj(_tid, { name: value,tpl_state:1, json_url: jsonUrl }, () => {
                                       var ori=GlobalFunc.getReviewText(reviewStatus);
                                       obj.tpl_state= `发布,${ori}-1待审核`
                                       GlobalFunc.addRecord(obj, function () {
                                           $.get(urlconfig.api + "/v1/verify/sensitive?tid=" + tplid, function () { })
                                       })
                                   })
                               } else {
                                   //上次审核不通过，不改变审核状态
                                   fmacapi.update_tplobj(_tid, { name: value, json_url: jsonUrl }, () => {
                                       obj.tpl_state= "发布"
                                       GlobalFunc.addRecord(obj)
                                   })
                               }
                           }
                       }, err => {
                       });
                   }).catch(err => {

                    })

               }
            }, error: function () {
            }
        });
    }

});

module.exports = UserMagazineCard;