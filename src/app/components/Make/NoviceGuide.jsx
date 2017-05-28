/**
 * @component NoviceGuide
 * @description 新手引导
 * @time 2016-04-16 10:40
 * @author 杨建
 **/

var React = require('react'),
    $ = require("jquery"),
    GlobalFunc = require('../Common/GlobalFunc');

var NoviceGuide = React.createClass({

    getInitialState: function (){
        return {
            guideStep: 1
        };
    },
    //第一步
    step1: function () {
        return (
            <div>
                <div className="guide-step1-1"></div>
                <div className="guide-step1-out">
                    <h3>点击添加页或组</h3>
                    <p>
                        <a href="javascript:;" onClick={this.handleClick.bind(this, 2)}>继 续</a>
                        <span>1 / 4</span>
                    </p>
                </div>
            </div>
        );
    },

    //第二步
    step2: function () {
        return (
            <div>
                <div className="guide-step2-1"></div>
                <div className="guide-step1-out guide-step2">
                    <h3>拖动页或组改变顺序</h3>
                    <p>
                        <a href="javascript:;" onClick={this.handleClick.bind(this, 3)}>继 续</a>
                        <span>2 / 4</span>
                    </p>
                </div>
            </div>
        );
    },

    //第三步
    step3: function () {
        return (
            <div>
                <div className="guide-step3-1"></div>
                <div className="guide-step3-2"></div>
                <div className="guide-step1-out guide-step3">
                    <h3>用组管理不同章节的内容</h3>
                    <p>
                        <a href="javascript:;" onClick={this.handleClick.bind(this, 4)}>继 续</a>
                        <span>3 / 4</span>
                    </p>
                </div>
                <div className="guide-phone">
                    <div className="phone-ani"></div>
                </div>
            </div>
        );
    },

    //第四步
    step4: function () {
        return (
            <div>
                <div className="guide-step4-1"></div>
                <div className="guide-step4-out">
                    <h3>发布试试吧</h3>
                    <p>
                        <a href="javascript:;" onClick={this.handleClick.bind(this, 5)}>开始体验</a>
                        <span>4 / 4</span>
                    </p>
                </div>
            </div>
        );
    },

    render: function () {
        var guideStep = this.state.guideStep;
        var step = '';
        switch (guideStep) {
            case 1:
                step = this.step1();
            break;

            case 2:
                step = this.step2();
                break;

            case 3:
                step = this.step3();
                break;

            case 4:
                step = this.step4();
                break;
            case 5:
                step = '';
                GlobalFunc.setUserExtra("noviceGuide");
                break;
        }

        var guideBg = guideStep == 5 ? void 0 : <div className="guide-bg">{step}</div>;

        return (
            <div>
                { guideBg }
            </div>
        );
    },

    //点击事件
    handleClick: function (step) {
        this.setState({
            guideStep: step
        });
    },

});


module.exports = NoviceGuide;