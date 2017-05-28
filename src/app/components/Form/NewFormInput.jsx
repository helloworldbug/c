'use strict';
var React = require('react');
var tpl = require("../../utils/tpl");
var UserService = require("../../utils/user.js");

var formInput = React.createClass({

    getInitialState: function () {
        this.mounted=true;
        var strCQL = 'select count(*),* from me_customerdata where cd_tplid="15280b6423a249e4"';
        fmacloud.Query.doCloudQuery(strCQL, {
            success: function (result) {
                resolve(result);
            },
            error  : function (error) {
                reject(error);
            }
        });
        return {
            dataType        : [],
            dataCurrentPage : 1,
            pageIndex       : 1,
            pageCount       : 0,
            dataCount       : 0,
            dataContent     : null,
            dataIndexContent: [],
            dataHideTable   : null,
            hideTable       : false
        }
    },
componentWillUnmount:function(){
    this.mounted=false;
}
    ,
    componentDidMount: function () {
        //第一次查询 获取标题 总数 第一页数据等信息
        this.firstQueryData();
    },

    render: function () {
        return (
            <div>
                {/*导出excel*/}
                <div className="panelbar">
                    <span href="#" className="exce" id="exce" onClick={this.exportExcel}>导出Excel</span>
                </div>
                <div className="tables">
                    <div>
                        <table className={"tableContent "+this.props.tid} id="tableContent">
                            <thead>
                            {/*表头*/}
                            <tr>{this.state.dataType.map(function (item, index) {
                                return <td key={index}>{item.title}</td>
                            })}</tr>
                            </thead>
                            <tbody>
                            {/*表格内容*/}
                            {this.state.dataContent}
                            </tbody>

                        </table>
                    </div>
                    {/*下标*/}
                    <div className="subscript">
                        <span className="previous" onClick={this.prevPage}></span>
                        <div className="pagenumber">
                            <div>{this.state.dataIndexContent.map((item, index)=> {
                                return <span data-pagenumber={item}
                                             className={this.state.dataCurrentPage==item?"active":""}
                                             onClick={this.changeIndex} key={index}>
											<div data-pagenumber={item}></div>
											<span data-pagenumber={item}
                                                  className={this.state.dataCurrentPage==item?"":"hide"}>{item}</span>
										</span>
                            })}</div>
                        </div>
                        <span className="next" onClick={this.nextPage}></span>
                    </div>
                    {/*隐藏表格用于导出excel*/}
                    <table id={this.props.tid} style={{display:"none"}}>
                        <thead>
                        <tr>{this.state.dataType.map(function (item, index) {
                            return <td key={index}>{item.title}</td>
                        })}</tr>
                        </thead>
                        <tbody>
                        {this.state.dataHideTable}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    },

    firstQueryData: function () {
        var _this = this;
        var title = null;
        var count = null;
        var indexContent = null;
        //查询表头相关数据
        this.getFormTitle().then(function (data) {
            title = data;
        }).then(function () {
            //获取数据总数
            return tpl.getInputCount(_this.props.tid);
        }).then(function (data) {
            count = data;
            var promise = new Promise(function (resolve, reject) {
                if(_this.mounted){
                    _this.setState({
                        dataType : title,
                        pageCount: Math.ceil(count.count / 10),
                        dataCount: data.count
                    }, function () {
                        resolve();
                    });
                }

            });
            return promise;
        }).then(function () {
            //获取当前页数据
            if(_this.mounted){
                _this.getDataContent();
            }

        }).then(function () {
            //获取下标内容
            if(_this.mounted){
                _this.getIndexContent();
            }

        }).then(function () {
            //设置隐藏表格
            if(_this.mounted){
                _this.getHideTable();
            }

        });
    },

    getFormTitle: function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            //遍历作品所有元素 获取输入框元素的标题与ID
            fmacapi.tpl_get_data(_this.props.tid, function (pagesObject) {
                //console.log(pagesObject);
                var pages = pagesObject.attributes.pages;
                var type = [];
                for (var i = 0; i < pages.length; i++) {
                    for (var j = 0; j < pages[i].attributes.item_object.length; j++) {
                        if (pages[i].attributes.item_object[j].attributes.item_type == 14) {
                            var obj = pages[i].attributes.item_object[j];
                            type.push({title: obj.attributes.item_val, id: obj.id});
                        }
                    }
                }
                //表头中添加用户ID项
                type.unshift({title: "用户ID", id: "user"});
                if (type.length == 0) {
                    $('.' + _this.props.tid).append('<div style="text-align:center;margin-top:120px;">没有相关数据</div>');
                }
                resolve(type);
            });
        }.bind(this));
        return promise;
    },

    getIndexContent: function () {
        //页数为0 返回
        if (this.state.pageCount == 0) {
            return;
        }
        var content = [];
        var _this = this;
        //渲染当前页数 所在的10个数字
        for (var i = this.state.dataCurrentPage - this.state.pageIndex + 1; i <= this.state.pageCount; i++) {
            content.push(i);
            if (i % 10 == 0 && i >= 10) {
                break;
            }
        }
        //内容渲染至页面上
        var promise = new Promise(function (resolve, reject) {
            _this.setState({
                dataIndexContent: content
            }, function () {
                resolve();
            });
        });
        return promise;
    },

    getDataContent: function () {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            //分页查询当前页数据
            tpl.getInputData(_this.props.tid, (_this.state.dataCurrentPage - 1) * 10, 10).then(function (data) {
                //console.log(data);
                //渲染表格内容
                var content = data.results.map(function (value, index) {
                    var user = value.attributes.cd_userid;
                    var userID = user.slice(-4);
                    var value = eval("(" + value.attributes.cd_input + ")");
                    return (
                        //行
                        <tr key={index}>{_this.state.dataType.map(function (title, tdIndex) {
                            var result;
                            if (title.id == 'user') {
                                return (
                                    //第一列插入用户ID末四位
                                    <td key={tdIndex} title={userID}>{userID}</td>
                                )
                            }
                            for (var i = 0; i < value.input_content.length; i++) {
                                //返回表头对应的值
                                if (value.input_content[i][title.id]) {
                                    result = value.input_content[i][title.id];
                                    break;
                                }
                                ;
                            }
                            if (result == undefined) {
                                result = '\\'
                            }
                            ;
                            return (
                                //列
                                <td key={tdIndex} title={result}>{result}</td>
                            )
                        })}</tr>
                    )
                });
                _this.setState({
                    dataContent: content
                });
            }, function () {
                resolve();
            });
        });
        return promise;
    },

    nextPage: function () {
        //当前页是最大页 返回
        if (this.state.dataCurrentPage >= this.state.pageCount) {
            return;
        }
        var cur = this.state.dataCurrentPage;
        var pgi = this.state.pageIndex;
        var _this = this;
        //console.log(this.state.pageIndex);
        //当前页为10的整数倍 进入下10页
        if (this.state.pageIndex == 10) {
            this.setState({
                dataCurrentPage: cur + 1,
                pageIndex      : 1
            }, function () {
                _this.getIndexContent().then(function () {
                    _this.getDataContent();
                });
            });
        } else {
            //当前页数和下标数+1
            this.setState({
                dataCurrentPage: cur + 1,
                pageIndex      : pgi + 1,
            }, function () {
                _this.getDataContent();
            });
        }
    },

    prevPage: function () {
        //当前页是最小页 返回
        if (this.state.dataCurrentPage <= 1) {
            return;
        }
        var cur = this.state.dataCurrentPage;
        var pgi = this.state.pageIndex;
        var _this = this;
        //当前页为1结尾 进入上10页
        if (this.state.pageIndex == 1) {
            this.setState({
                dataCurrentPage: cur - 1,
                pageIndex      : 10
            }, function () {
                _this.getIndexContent().then(function () {
                    _this.getDataContent();
                });
            });
        } else {
            //当前页数和下标数+1
            this.setState({
                dataCurrentPage: cur - 1,
                pageIndex      : pgi - 1
            }, function () {
                _this.getDataContent();
            });
        }
    },

    changeIndex: function (e) {
        var _this = this;
        var n = e.target.dataset.pagenumber;
        var nL = n.length;
        var index = parseInt(n.charAt(nL - 1));
        if (index == 0) {
            index = 10;
        }
        this.setState({
            dataCurrentPage: parseInt(n),
            pageIndex      : index
        }, function () {
            _this.getDataContent().then(function () {
                _this.getIndexContent();
            });
        });
    },

    getHideTable: function () {
        // 接口一次最多返回900条 递归调用
        var _this = this;
        var runTime = Math.ceil(this.state.dataCount / 900);
        var dataStore = [];
        var content = null;
        var getData = function (times) {
            if (times == 0) {
                //递归结束 将内容插入表
                var content = dataStore.map(function (value, index) {
                    var userID = value.attributes.cd_userid;
                    var value = eval("(" + value.attributes.cd_input + ")");
                    return (
                        //逻辑与上述表格相同
                        <tr key={index}>{_this.state.dataType.map(function (title, tdIndex) {
                            var result;
                            if (title.id == 'user') {
                                return (
                                    <td key={tdIndex} title={userID}>{userID}</td>
                                )
                            }
                            for (var i = 0; i < value.input_content.length; i++) {
                                if (value.input_content[i][title.id]) {
                                    result = value.input_content[i][title.id];
                                    break;
                                }
                                ;
                            }
                            if (result == undefined) {
                                result = '\\'
                            }
                            ;
                            return (
                                <td key={tdIndex}>{result}</td>
                            )
                        })}</tr>
                    )
                });
                _this.setState({
                    dataHideTable: content
                });
            } else {
                //多次调用接口 直至times为0
                tpl.getInputData(_this.props.tid, (times - 1) * 900, 900).then(function (data) {
                    // var value = eval("("+value.attributes.cd_input+")");
                    dataStore = dataStore.concat(data.results);
                    getData(--times);
                });
            }
        }
        getData(runTime);
    },
    //绑定导出事件
    exportExcel : function () {
        UserService.exportExcel(this.props.tid);
    }
});

module.exports = formInput;
