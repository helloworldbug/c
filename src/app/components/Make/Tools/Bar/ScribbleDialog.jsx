var React = require("react");
var DialogBase = require("../../../Common/SelectDialog");
var DialogAction = require("../../../../actions/DialogActionCreator");
var MakeAction = require("../../../../actions/MakeActionCreators")
var Tpl = require("../../../../utils/tpl");
var User = require("../../../../utils/user");
var GlobalFunc = require("../../../Common/GlobalFunc");
var Range = require('../../../Common/Range');
var MaterialDialog = require('./MaterialDialog.jsx');
var user_obj;
var selectOptions = [{
    text: "雾",
    url : "http://ac-hf3jpeco.clouddn.com/8a337c8fc57785666c27.jpg"
},{
    text: "细沙",
    url : "http://ac-hf3jpeco.clouddn.com/150acbb53883a62f.jpg?imageView2/2/w/640/h/1008"
}, {
    text: "水滴",
    url : "http://ac-hf3jpeco.clouddn.com/150a3f5a0167cdd0.jpg?imageView2/2/w/640/h/1008"
}, {text: "选择图片(640*1008)", url: ""}];
var doodle = null;
var lastSelect = 2;
function getNumber(num,defaultNum){
    if(num==0)return num;
    if(!num) return defaultNum;
    else return num;

}
module.exports = React.createClass({
    getInitialState(){
        var imgUrl = this.props.imgUrl;
        var selected = 0;
        if (imgUrl) {
            for (var i = 0; i < selectOptions.length; i++) {
                if (selectOptions[i].url == imgUrl) {
                    selected = i;
                    break;
                }
            }
            if (i > selectOptions.length - 1) {
                selectOptions.splice(0, 0, {text: "图片1", url: imgUrl});
            }

        }
        var tips= this.props.tips || ""
        if(!this.props.reEdit&&tips=="")
        {
            tips="擦一擦有惊喜!"
        }

        return {
            opacity      : getNumber(this.props.opacity,25),
            showImgDialog: false,
            selectValue  : selected,
            clipPercent  :getNumber(this.props.clipPercent ,20) ,
            tips         : tips
        }
    },
    closeDialog(){
        DialogAction.hide();
    },
    dialogClick  : function (e) {
        e.stopPropagation();
    },
    componentDidMount(){
        doodle = new CanvasDoodle(this.refs.CanvasDoodle);
        selectOptions.forEach((obj, index)=> {
            var selected = this.state.selectValue == index
            if (selected && obj.url != "") {
                doodle.setUrl(obj.url);
                doodle.setOpacity(1 - (this.state.opacity / 100));
                doodle.play();
            }
        })

    },
    componentDidUpdate(){
        selectOptions.forEach((obj, index)=> {
            var selected = this.state.selectValue == index
            if (selected && obj.url != "") {
                doodle.setUrl(obj.url);
                doodle.setOpacity(1 - (this.state.opacity / 100));
                doodle.restart();
            }
        });
    },
    selectOptionChange(event){
        var value = parseInt(event.target.value);
        lastSelect = this.state.selectValue;
        if (selectOptions.length-1 == value) {
            this.setState({showImgDialog: true, selectValue: value})
        } else {
            this.setState({selectValue: value})
        }

    },
    selectImg    : function (imgUrl,imgName) {
        if (imgUrl) {
            if (!selectOptions[0].custom) {
                selectOptions.splice(0, 0, {text: "图片1", url: imgUrl,custom:true})
            } else {
                selectOptions[0].url = imgUrl;
                selectOptions[0].text = "图片1";
            }
            lastSelect = this.state.selectValue;
            this.setState({showImgDialog: false, selectValue: 0})
        }

    },
    hideImgDialog: function () {
        this.setState({showImgDialog: false, selectValue: lastSelect})
    },
    stopPropagation(e){
        e.stopPropagation()
    },
    changeOpacity(value){
        if (!!value.target) {
            value = parseInt(value.target.value);
        }else{
            value=parseInt(value)
        }
        this.setState({opacity: value})
    },
    changeClipPercent(value){
        if (!!value.target) {
            value = parseInt(value.target.value);
        }else{
            value=parseInt(value)
        }
        this.setState({clipPercent: value})
    },
    addScribble(){
        var _this = this;
        var image = new Image();
        var imgUrl = selectOptions[this.state.selectValue].url;
        image.onload = function () {
            var itemObj = {type: 'scribble'};
            itemObj.img = image;
            itemObj.src = imgUrl;
            itemObj.opacity = _this.state.opacity;
            itemObj.clipPercent = _this.state.clipPercent;
            itemObj.tips = _this.state.tips;
            MakeAction.addElement(itemObj);
            DialogAction.hide();
        }
        image.src = imgUrl;

    },
    input(){
        var text = this.refs.tips.value;
        if(text.length>19){
            return
        }
        this.setState({tips: GlobalFunc.htmlEncode(text)});
        //console.log(text);
    },
    render(){

        var showtips=this.state.tips? <div className="showtips"><span className="tipscontent">{GlobalFunc.htmlDecode(this.state.tips)}</span></div>:null
        var options = selectOptions.map((obj, index)=> {
            return <option key={index} value={index}>{obj.text}</option>
        })
        //var dialog = this.state.showImgDialog ?
        //    <ImgDialog ref="imgDialog" cancelHandle={this.hideImgDialog}
        //               confirmHandle={this.selectImg}> </ImgDialog> : null;
        var dialog = this.state.showImgDialog ?
            <MaterialDialog ref="imgDialog" materialType={5} cancelHandle={this.hideImgDialog}
                            confirmHandle={this.selectImg}> </MaterialDialog> : null;
        return (
            <div className="select-dialog show" onClick={this.closeDialog}>
                <div onClick={this.stopPropagation}> {dialog}</div>

                <div className="modal-dialog scribble-dialog" onClick={this.dialogClick}>
                    <div className="dialog-body">

                        <div className="img">
                            <img className="bg-img" src="http://ac-hf3jpeco.clouddn.com/ff7df8800d49efbc6e6f.jpg" alt=""
                                 width="260"
                                 height="410"/>
                            <canvas className="bg-scribble" ref="CanvasDoodle"
                                    data-imgsrc='http://ac-hf3jpeco.clouddn.com/150a3f5a0167cdd0.jpg?imageView2/2/w/640/h/1008'
                                    width="260"
                                    height="410"></canvas>
                            {showtips}
                        </div>

                        <div className="setting">
                            <form >
                                <div className="form-item"><label htmlFor="">覆盖效果</label>

                                    <div className="form-input">

                                        <select onChange={this.selectOptionChange} value={this.state.selectValue}>
                                            {options}
                                        </select></div>
                                </div>


                                <div className="form-item "><label htmlFor="">透明度</label>

                                    <div className="form-input newline"><Range mod="animate" max={100} min={0}
                                                                               width={182}
                                                                               step={1}
                                                                               value={getNumber(this.state.opacity,25)}
                                                                               change={this.changeOpacity}/> <input
                                        type="number"
                                        className="range-number"
                                        max="100" min="0" step="1"
                                        value={getNumber(this.state.opacity,25)}
                                        onChange={this.changeOpacity}/></div>
                                </div>
                                <div className="form-item "><label htmlFor="">涂抹比例</label>

                                    <div className="form-input newline"><Range mod="animate" max={100} min={0}
                                                                               width={182}
                                                                               step={1}
                                                                               value={getNumber(this.state.clipPercent,20)}
                                                                               change={this.changeClipPercent}/> <input
                                        type="number"
                                        className="range-number"
                                        max="100" min="0" step="1"
                                        value={getNumber(this.state.clipPercent,20)} onChange={this.changeClipPercent}
                                        /></div>
                                </div>
                                <div className="form-item"><label htmlFor="">提示文字</label>

                                    <div className="form-input tips"><input className="editor" type="text" value={GlobalFunc.htmlDecode(this.state.tips)}
                                                                            onChange={this.input} ref="tips" placeholder="提示文字最多18个字"/>
                                    </div>

                                </div>

                            </form>
                        </div>
                    </div>
                    <div className="dialog-footer ">
                        <button className="confirm" onClick={this.addScribble}>确定</button>
                        <button className="cancel" onClick={this.closeDialog}>取消</button>

                    </div>

                </div>
            </div>
        )
    }

});
function CanvasDoodle(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

}

CanvasDoodle.prototype = {
    setUrl    : function (url) {
        this.imgSrc = url;
    },
    setOpacity: function (op) {
        this.globalAlpha = op;
    },
    play      : function () {
        var _this = this;
        this._restart = false;
        var img = new Image();
        img.onload = function () {
            var canvasW = _this.canvas.width;
            var canvasH = _this.canvas.height;
            var rw = img.width / canvasW, rh = img.height / canvasH;

            _this.ctx.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
            _this.ctx.save();
            _this.ctx.beginPath();
            _this.ctx.globalAlpha = _this.globalAlpha;

            if (rw > rh) {
                //image with rate is bigger then height, clip image with
                var clipW = rh * canvasW;
                var sx = (img.width - clipW) / 2;
                _this.ctx.drawImage(img, sx, 0, clipW, img.height, 0, 0, canvasW, canvasH);

            } else {
                var clipH = rh * canvasH;
                var sy = (img.height - clipH) / 2;
                _this.ctx.drawImage(img, 0, sy, img.width, clipH, 0, 0, canvasW, canvasH);
            }

            _this.ctx.globalCompositeOperation = "destination-out";
            _this.ctx.lineWidth = 15;
            _this.ctx.lineCap = "round";
            _this.ctx.lineJoin = "round";
            _this.autoScrath();
        }
        img.src = this.imgSrc;
    },
    restart   : function () {
        this._restart = true;
    },
    autoScrath: function () {
        var _this = this;
        this.lastX=72;
        this.lastY=124;

        function LineAnim( to, stepNum, ctx, cb) {
            var stepx = (to.x -_this.lastX) / stepNum;
            var stepy = (to.y - _this.lastY) / stepNum;
            var x = _this.lastX, y = _this.lastY;
            var i = 0;
            var animating = setInterval(
                function () {
                    if (i < stepNum && !_this._restart) {
                        x = _this.lastX + stepx;
                        y = _this.lastY + stepy ;
                        ctx.lineTo(x, y);
                        _this.lastX=x;
                        _this.lastY=y;
                        ctx.stroke();
                    } else {
                        clearTimeout(animating);
                        if (cb) {
                            cb();
                        }
                    }
                    i++;
                }
                , 40)
        }
        LineAnim( {x: 183, y: 134}, 30, _this.ctx, ll);
        function ll(){
            LineAnim( {x: 90, y: 156}, 20, _this.ctx, l1);
        }
        function l1() {
            LineAnim( {x: 175, y: 167}, 20, _this.ctx, l2);
        }

        function l2() {
            LineAnim( {x: 101, y: 183}, 30, _this.ctx, restart);
        }

        function restart() {
            _this.ctx.restore();
            _this.play();
        }
    }
};