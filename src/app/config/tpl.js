var env = require("./env.js");
module.exports = new function () {
    this.tpl = {};
    this.page = {};
    this.item = {};
    var self = this;
    $.ajax({
        url: env.api + "?act=load_mod",
        async :false,
        dataType:"json",
        success:function(data){
            self.tpl = data.data.tpl;
            self.page = data.data.page;
            self.item = data.data.item;
        }
    });
}