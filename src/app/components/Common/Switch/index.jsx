/**
 * @description 开关按钮封装
 * 
 * @author lifeng
*/

import * as React from 'react';
import RcSwitch from 'rc-switch';
import classNames from 'classnames';
require("./style.css")

 var  Switch = React.createClass({
  getDefaultProps() {
    return {
      prefixCls: 'me-switch'
    }
  },

  render() {
    const { prefixCls, className } = this.props;
    const classes = classNames({
      [className]: !!className
    });
    return <RcSwitch {...this.props} className={classes} />;
  }
})
export default  Switch;