/**
 * @description 一键转档功能介绍页面
 * @time 2016-11-7
 * @author fisnYu
 */

'use strict';
//require owner style
require("./dataProcessingHint.css");
//require core module
var React = require('react');
import {Link} from 'react-router';
/**
 * 一键转档页面
 */
export default class DataProcessingHint extends React.Component{
    /**
     *构造函数
     */
    constructor(props) {
        super(props);
    }
    /**
     *渲染界面
     */
    render() {
        return (
            <div className="data-processing-hint-container">
                <div className="data-processing-hint">
                    <button className="data-processing-hint-close" onClick={this.props.closeHint.bind(this)} ></button>
                    测试提示页面
                </div>
            </div>
        );
    }
};