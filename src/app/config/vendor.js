var env = require("./env.js");
module.exports = new function () {
    this.qq = {};
    this.sina = {};
    var self = this;
    $.ajax({
        url: env.api + "?act=get_party",
        async :false,
        dataType:"json",
        success:function(data){
            self.qq = data.data[0]["http"];
			self.sina = data.data[1]["http"];
        }
    });
}