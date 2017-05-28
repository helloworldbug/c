var React = require("react");
var DialogBase = require("../../../Common/SelectDialog");
var DialogAction = require("../../../../actions/DialogActionCreator");
var MakeAction = require("../../../../actions/MakeActionCreators");
var Tpl = require("../../../../utils/tpl");
var User = require("../../../../utils/user");
var GlobalFunc = require("../../../Common/GlobalFunc");
var user_obj;
module.exports = React.createClass({

    mixins: [DialogBase],

    componentWillMount: function () {
        user_obj = GlobalFunc.getUserObj();

    },

    getInitialState: function () {
        return {
            loaded       : false,
            menuName     : "我的图片",
            currentPage  : 0,
            hoverPage    : 0,
            data         : [],
            count        : 0,
            indexSrc     : null,
            pagePageCount: 0,
            checked      : false,
            loading      : "",
            perPageNum   : 10
        }
    },

    changeTap: function (name) {
        this.setState({
                menuName   : name,
                currentPage: 0,
                hoverPage  : 0,
                data       : []
            },
            function () {
                switch (this.state.menuName) {
                    case "我的图片":
                        this.getUserImage();
                        break;
                    case "图片库":
                        this.getPublicImage();
                        break;
                }
            }.bind(this))
    },

    okBtnClick: function () {
        if (this.props.confirmHandle) {
            this.props.confirmHandle(this.state.indexSrc, this.state.imgName);
            return;
        }
        if (this.state.indexSrc != null) {
            var _this = this;
            var image = new Image();
            image.onload = function () {
                var indexSrc = _this.state.indexSrc;
                var type = _this.props.type;
                var itemObj = {type: type, src: indexSrc, img: image};
                if (_this.props.replace == true) {
                    MakeAction.replaceElement(itemObj);
                } else {
                    MakeAction.addElement(itemObj);
                }
            };
            image.src = this.state.indexSrc;
        }
        DialogAction.hide();

    },

    getUserImage: function () {
        var user_id = user_obj.objectId;
        if (!user_id) {
            GlobalFunc.addSmallTips("请先登录", null, {clickCancel: true});
        } else {
            User.getMaterial(function (data) {
                this.setState({
                    data : data.data,
                    count: data.count
                })
            }.bind(this), {
                "uid"           : user_id,
                "material_type" : 5,
                "material_owner": 1,
                "skip"          : this.state.currentPage * (this.state.perPageNum - 1),
                "limit"         : (this.state.perPageNum - 1)
            })
        }
    },

    getPublicImage: function () {
        Tpl.getResModel(function (data) {
            this.setState({
                data : data.data,
                count: data.count
            })
        }.bind(this), {
            "category": 5,
            "skip"    : this.state.currentPage * this.state.perPageNum,
            "limit"   : this.state.perPageNum
        })
    },

    getUserInfo: function () {
        return user_obj;
    },

    getHeader: function () {
        return this.getBaseHeader("我的图片", "图片库");
    },

    getFooter: function () {
        return this.getBaseFooter("我的图片");
    },

    getBody: function () {
        var images;

        var imgOverStyle = {
            width : "128px",
            height: "203px",
            border: "1px solid #ececec"
        };

        images = this.state.data.map(function (image) {
            var imgName = this.state.menuName == "我的图片" ? image.attributes.material_name : image.attributes.res_name;
            var imgSrc = this.state.menuName == "我的图片" ? image.attributes.material_src : image.attributes.item_val;
            if (imgSrc.indexOf("imageView2") < 0) {
                imgSrc = imgSrc + "?imageView2/2/w/640/h/1008";
            }

            return <li>
                <div className={this.state.indexSrc == imgSrc ? "imgBorder active": "imgBorder"}
                     onClick={this.imageClick.bind(this, imgSrc)}>
                    <div className="imgOver" style={imgOverStyle} onDoubleClick={this.okBtnClick}>
                        <div className="imgBox">
                            <img title="双击添加" src={imgSrc}/>
                            <span className={this.state.menuName == "我的图片" ? "delImg": "hide"}
                                  onClick={this.delImg.bind(this,image.id)}>
                            </span>
                        </div>
                    </div>
                </div>
                <label>{imgName}</label>
            </li >
        }.bind(this));

        return (<div className="modal-body">
            <ul className={this.state.menuName == "我的图片" ? "show": "hide"}>
                <li className="hr"></li>
                <li>
                    <div id="frame-addmaterial" onClick={this.openFile}>{this.state.loading}</div >
                    <input type="file" accept="image/jpeg,image/jpg,image/png,image/gif"
                           onChange={this.fileChange.bind(this,5,1)}
                           multiple/>
                    <label>添加图片</label>
                </li>
                {images}
            </ul>
            <ul className={this.state.menuName=="图片库"?"show":"hide"}>
                <li className="hr"></li>
                {images}
            </ul>
        </div>)
    }

});
