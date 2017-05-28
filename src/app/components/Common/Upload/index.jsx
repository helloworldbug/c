/**
 * @description 上传按钮封装
 * 
 * @author lifeng
*/

import * as React from 'react';
import splitObject from "../splitObject"

var Upload = React.createClass({
    getDefaultProps() {
        return {
            component: 'span',
            multiple: false
        }
    },
    onChange: function (e) {
        this.props.onChange(e);
        e.target.value = ""
    },
    onClick(e) {
        if(this.props.onClick){
            var ret=this.props.onClick(e);
            if(!ret){
            return 
        }
        }
        
        const el = this.refs.file;
        if (!el) {
            return;
        }
        el.click();
    },
    render() {
        const [{component:Tag, multiple, accept, onChange, children}, others] = splitObject(this.props, ["component", "multiple", "accept", "onChange", "children"]);

        return <Tag {...others} onClick={this.onClick} >
            <input type="file" ref="file" style={{ display: 'none' }}  accept={accept}
                multiple={multiple}
                onChange={this.onChange}/>
            {children}
        </Tag>;
    }
})
export default Upload;