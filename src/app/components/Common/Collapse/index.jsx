/**
 * @description 折叠组件封装
 * 
 * @author lifeng
*/

import * as React from 'react';
import RcCollapse,{Panel} from 'rc-collapse';
import classNames from 'classnames';
require("./style.css")

 var  Collapse = React.createClass({
  getDefaultProps() {
    return {
      prefixCls: 'me-collapse'
    }
  },

  render() {
    
    return <RcCollapse {...this.props} />;
  }
});
export {Panel};
export default  Collapse;