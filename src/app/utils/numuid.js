/**
 * Created by 95 on 2015/11/20.
 */

module.exports={
    generateUid:function(len){
        len = len || 12;
        return Math.random().toString(35).substr(2, len);

    },
    generateUidNum:function(len){
        len = len || 8;
        return parseInt(Math.random().toString(10).substr(2, len))

    }
}