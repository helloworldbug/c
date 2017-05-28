/**
 * @component 合并作品对话框
 * @description 合并作品对话框
 * @time 2016-06-14 09:20
 * @author lifeng
 **/
var React = require("react");

var DialogAction = require("../../../../actions/DialogActionCreator");
var MakeActionCreator = require("../../../../actions/MakeActionCreators");
var MakeWebAPIUtils=require("../../../../utils/MakeWebAPIUtils");
var GlobalFunc=require("../../../../components/Common/GlobalFunc")
var AutoSave = require("../autoSave");

module.exports = React.createClass({

    componentDidMount: function () {
        AutoSave.stop();
    },
close:function(){
    AutoSave.start();
    DialogAction.hide()
},
    ///http://localhost:8000/#/preview/tid=1554d97e2b2bc872
    render    : function () {
        return (
            <div className="select-dialog">
                <div className="merge-magazine vhcenter">
                    <h1>添加合并作品链接</h1>
                    <input type="text" ref="url" onBlur={this.validURL}/>
                    <div className="modal-footer">
                        <button className="cancel" onClick={this.close}>取消</button >
                        <button  onClick={this.okBtnClick}>确定</button >
                    </div>
                </div>
            </div>
        )
    },
    validURL:function(){
        var isMerging=false;
        var url=this.refs.url.value;
        var idMatch=url.match(/tid=([\d|\w]*)/);
        if(idMatch==null){
            alert("作品链接格式不对，请填写预览时的链接地址");
        }
    },
    okBtnClick:function(){
        //匹配出ID,取回作品数据，交给后台合并
        var isMerging=false;
        var url=this.refs.url.value;
        var idMatch=url.match(/tid=([\d|\w]*)/);
        if(idMatch!=null){
            var tid=idMatch[1];
            DialogAction.hide();
            GlobalFunc.addSmallTips("正在合并作品... ", null, {
                cancel   : true,
                cb_cancel: function () {
                    isMerging=false;
                    AutoSave.start();
                }
            });
            ///取作品id对应的数据
            isMerging=true;
            MakeWebAPIUtils.getMagazineTreeDataById(tid,success,error);
            function success(tpl,tpl_data) {
                console.log(tpl_data);
                MakeActionCreator.mergeMagazine(tpl_data);
                GlobalFunc.addSmallTips("合并成功", 3, {clickCancel: true});
                isMerging=false;
                AutoSave.start();
            }
            function error(){
                GlobalFunc.addSmallTips("取作品错误", null, {clickCancel: true});
                isMerging=false;
                AutoSave.start();

            }
            //AutoSave.start();

        }else{
            alert("作品链接格式不对，请填写预览时的链接地址");
        }
    },

});
