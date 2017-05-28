/**
 * @component MaterialDialog
 * @description 资源库
 * @time 2015-11-24 10:45
 * @author Nick
 **/

var React = require("react");
var DialogMixin = require("./DialogMixin");
var DialogAction = require("../../../../actions/DialogActionCreator");
var MakeAction = require("../../../../actions/MakeActionCreators");
var GlobalFunc = require("../../../Common/GlobalFunc");
var _=require("lodash")

var MultiSelectMaterialDialog = React.createClass({

    mixins: [DialogMixin],
    getInitialState: function () {
        var _state = {
            checked    : false,
            loading    : "",
            perPageNum : 30,
            count      : 0,
            data       : [],
            labels     : [],
            isMultiDelete: false,
            deleteImgIds:[],
            selectImg:[],
        };
        if(this.props.selectImg){
            _state.selectImg=this.props.selectImg
        }
        switch (this.props.materialType) {
            case 1:
                _state.materialType = "水印";
                _state.menuName = "我的水印";
                break;
            case 2:
                _state.materialType = "边框";
                _state.menuName = "我的边框";
                break;
            case 3:
                _state.materialType = "图形";
                _state.menuName = "我的图形";
                break;
            case 4:
                _state.materialType = "背景";
                _state.menuName = "我的背景";
                break;
            case 5:
                _state.materialType = "图片";
                _state.menuName = "我的图片";
                break;
            case 10:
                _state.materialType = "音乐";
                _state.menuName = "我的音乐";
                break;
        }
        return _state;
    },
    queryLabels: function () {
        var _this = this;
        var query = new fmacloud.Query("labels");
        query.equalTo("type", "res_subtype_pc");
        query.equalTo("description", this.props.materialType + "");
        query.ascending("order");
        query.find({
            success : function (results) {
                if (results) {
                    var labels = [];
                    for (var i = 0; i < results.length; i++) {
                        labels.push(results[i].attributes.name);
                    }
                    _this.setState({labels: labels});
                } else {
                    GlobalFunc.addSmallTips("标签查询失败,请稍后再试", 2, {clickCancel: true});
                }
            }, error: function (error) {
                console.log("Error: " + error.code + " " + error.message);
                GlobalFunc.addSmallTips("标签查询失败,请稍后再试", 2, {clickCancel: true});
            }
        });
    },

    getBody: function () {
        var images;

        var imgStyle = {}, liStyle = {}, itemStyle = {}, addMaterialStyle = {}, nameStyle = {};
        if (this.props.materialType == 1 || this.props.materialType == 3) {
            imgStyle = {height: "130px"};
            liStyle = {height: "144px"};
            itemStyle = {maxHeight: "130px"};
            addMaterialStyle = {paddingTop: "82px"};
            nameStyle = {top: "106px"};
        }
        var selectIds=this.state.selectImg.map(img=>{
            return img.id
        })
        var isPersonal = this.state.menuName == "我的" + this.state.materialType;
        images = this.state.data.map(function (image,index) {
            var imgName = isPersonal ? image.attributes.material_name : image.attributes.res_name;
            var imgSrc = isPersonal ? image.attributes.material_src : image.attributes.item_val;
            if (imgSrc.indexOf("imageView2") < 0 && imgSrc.indexOf("gif") < 0) {
                imgSrc = imgSrc + "?imageView2/2/w/640/h/1008";
            }
            if(this.state.isMultiDelete){
                return (<li key={index} style={liStyle}>
                    <div className={_.indexOf(this.state.deleteImgIds,image.id)>-1? "imgBorder active": "imgBorder"}
                         style={imgStyle} onClick={this.addMultiDeleteImg.bind(this, image.id)}>
                        <div className="imgOver">
                            <div className="imgBox" style={imgStyle}>
                                <img  src={imgSrc} style={itemStyle}/>
                                <span className="delete-select"> </span>
                                <label style={nameStyle}>{imgName}</label>
                            </div>
                        </div>
                    </div>
                </li >)
            }else{
                return <li key={index} style={liStyle}>
                    <div className={_.indexOf(selectIds,image.id)>-1 ? "imgBorder active": "imgBorder"}
                         style={imgStyle} onClick={this.imageClick.bind(this, {name:imgName,src:imgSrc,id:image.id})}>
                        <div className="imgOver" >
                            <div className="imgBox" style={imgStyle}>
                                <img  src={imgSrc} style={itemStyle}/>
                            <span className={isPersonal ? "delImg": "hide"}
                                  onClick={this.delMaterial.bind(this,image.id)}>
                            </span>
                                <label style={nameStyle}>{imgName}</label>
                            </div>
                        </div>
                    </div>
                </li >
            }
            }.bind(this)
        );

        var modalBody;

        if (isPersonal) {
            modalBody = <ul>
                <li style={liStyle}>
                    <div className="imgBorder" style={imgStyle} onClick={this.openFile}>
                        <div className="imgOver">
                            <div className="imgBox" style={imgStyle}>
                                <div className="addMaterial" style={addMaterialStyle}>添加图片</div >
                                <input id="addMaterial" type="file" accept="image/jpeg,image/jpg,image/png,image/gif"
                                       onChange={this.fileChange.bind(this, this.props.materialType, 1)}
                                       multiple/>
                                {this.state.loading}
                            </div>
                        </div>
                    </div>
                </li>
                {images}
                <div id="loadNewImg"></div>
            </ul>
        } else {
            modalBody = <ul>
                {images}
                <div id="loadNewImg"></div>
            </ul>
        }

        return (<div className="modal-body">{modalBody}</div>)
    },

    imageClick: function (imgObj, e) {
        var _this = $(e.target);
        var selectImg=this.state.selectImg;

        var selectIds=selectImg.map(img=>{
            return img.id
        })
        var index=_.indexOf(selectIds,imgObj.id);
        if(index>-1){
            selectImg.splice(index,1);
        }else{
            if(this.props.maxselect&&selectImg.length>=this.props.maxselect){
                GlobalFunc.addSmallTips("最多只能选择 "+ this.props.maxselect+ " 张图片", null, {clickCancel: true});
                return
            }
            selectImg.push(imgObj);
        }
        this.setState({
            selectImg : selectImg
        });
    },
    getFooter  : function () {
        var _tips;
        if (this.state.menuName.indexOf("我的") == 0) {
            if(this.state.isMultiDelete){
                let num=this.state.deleteImgIds.length;
                let allNum=this.state.data.length;
                _tips = <span className="select-all" ><input className="select" type="checkbox"  checked={num==allNum} onChange={this.selectAllDeleteImg}/>全选<span className="count">已选择：{num} 张图片</span></span>
            }else{
                if(this.state.selectImg.length===0){
                    _tips = <span className="tips" onClick={this.enterMultiDelete}>批量删除</span>
                }else{
                    let num=this.state.selectImg.length;
                    _tips = <span className="count">已选择：{num} 张图片</span>
                }

            }
        }else{
            let num=this.state.selectImg.length;
            _tips = <span className="count">已选择：{num} 张图片</span>
        }

        //if (this.props.materialType == 10) {
        //    _tips = "建议格式：mp3　　可同时上传多个音乐";
        //} else {
        //    _tips = "建议格式：JPG, PNG, GIF　　可同时上传多张图片";
        //}
        var okButton= <button className={this.state.checked ? "active" : ""} onClick={this.okBtnClick}>确定</button >
        var cancelButton=<button className="cancel" onClick={this.closeDialog}>取消</button >
        if(this.state.isMultiDelete){
            okButton=<button className={this.state.checked ? "active" : ""} onClick={this.MultiDelete}>删除</button >;
            cancelButton=<button className="cancel" onClick={this.quitMultiDelete}>取消</button >
        }
        return (
            <div className="modal-footer">
                {_tips}
                {cancelButton}
                {okButton}
            </div>
        )
    },
    okBtnClick: function () {

            var selectImg=this.state.selectImg;
        if(selectImg.length>0){
            var _this = this;
            var image = new Image();
            image.onload = function () {
               var srcArr=selectImg.map(img=>img.src);
                var nameArr=selectImg.map(img=>img.name+"@"+img.id);
                var hrefArr=selectImg.map(img=>{return ""});

                if (_this.props.replace) {
                    MakeAction.replaceElement({srcInfo:{name:nameArr.join("|"),src:srcArr.join("|"),href:hrefArr.join("@")}, type: _this.props.itemType, img: image})
                } else {
                    MakeAction.addElement({srcInfo:{name:nameArr.join("|"),src:srcArr.join("|"),href:hrefArr.join("@")}, type: _this.props.itemType, img: image});
                }
            };
            image.src = selectImg[0].src;
        }


        DialogAction.hide();
    }
});
module.exports = MultiSelectMaterialDialog;