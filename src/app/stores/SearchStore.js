/**
 * @description 搜索存储
 * @time 2015-11-9
 * @author 刘华
*/
var Reflux = require('reflux');
var SearchAction = require('../actions/SearchAction');
var tpl = require("../utils/tpl");

var _result = {modeNumber:0,
            workNumber:0,
            userNumber:0,
            userStore:[],
            modeStore:[],
            workStore:[],
            };

var NoteStore = Reflux.createStore({
    searchContent:"",
    modeCurrent:1,
    workCurrent:1,
    userCurrent : 1,
    isModeRun:false,
    isWorkRun:false,
    isUserRun : false,
    init: function() {
        this.listenTo(SearchAction.search, this.onSearch);
        this.listenTo(SearchAction.searchCount, this.onSearchCount);
    },

    onSearch: function(value,type) {
        if(type == "mode" && this.isModeRun == false){
            this.isModeRun = true;
            this.getMode(value);
        }else if(type == "work" && this.isWorkRun == false){
            this.isWorkRun = true;
            this.getWork(value);
        }else if (type == 'user' && this.isUserRun == false) {
            this.isUserRun = true;
            this.getUser(value);
        }else if(type == "all" && this.isWorkRun == false  &&  this.isModeRun == false && this.isUserRun == false ){
            this.isModeRun = true;
            this.isWorkRun = true;
            this.isUserRun = true;
            this.refresh();
            this.getAll(value); 
        }        
    },
    //查询更多模板
    getMode:function(value){
        var _this = this;
        tpl.searchTpl(function(data){
            _result.modeStore = _result.modeStore.concat(data.data);
            _this.modeCurrent += 1;
            _this.trigger(_result);
            _this.isModeRun = false;
        }, this.modeCurrent, 12,"read_int", " desc", "", value, "10");
    },
    //查询更多作品
    getWork:function(value){
        var _this = this;
        tpl.searchTpl(function(data){
            _result.workStore = _result.workStore.concat(data.data);
            _this.workCurrent += 1;
            _this.trigger(_result);
            _this.isWorkRun = false;
        }, this.workCurrent, 12,"read_int", " desc", "", value, "11");
    },
    //查询更多用户
    getUser:function(value){
        var _this = this;
        tpl.searchUser(value,_this.userCurrent,12).then(function(result){
            _result.userStore = _result.userStore.concat(result);
            _this.userCurrent += 1;
            _this.trigger(_result);
            _this.isUserRun = false;
        });
    },
    //第一次搜索
    getAll:function(value){
        var _this = this;
        tpl.searchTpl(function(datas){
            _result.modeStore = _result.modeStore.concat(datas.data);
            _this.modeCurrent += 1;
            tpl.searchTpl(function(data){
                _result.workStore = _result.workStore.concat(data.data);
                _this.workCurrent += 1;
                tpl.searchUser(value,_this.userCurrent,12).then(function(result){
                    _result.userStore = _result.userStore.concat(result);
                    _this.userCurrent += 1;
                    _this.trigger(_result);
                    _this.isWorkRun = false;
                    _this.isModeRun = false;
                    _this.isUserRun = false;
                });
            }, _this.workCurrent, 12,"read_int", " desc", "", value, "11");
        },this.workCurrent, 12,"read_int", " desc", "", value, "10");
    },
    onSearchCount:function(value){
        var _this = this;
        tpl.searchWorkCount(function(data){
            _result.workNumber = data.count;
            tpl.searchModeCount(function(datas){
                _result.modeNumber = datas.count;
                tpl.searchUserCount(value).then(function(result){
                    _result.userNumber = result;
                    _this.trigger(_result);
                });
            },value);
        },value);
    },
    refresh:function(){
        this.modeCurrent = 1;
        this.workCurrent = 1;
        this.userCurrent = 1;
        _result = {modeNumber:0,
            workNumber:0,
            userNumber:0,
            modeStore:[],
            workStore:[],
            userStore:[]
        };
    }
});

module.exports = NoteStore;