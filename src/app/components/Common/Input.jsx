/**
  * @name 文本框组件
  * @author 曾文彬
  * @datetime 2015-9-9
*/

'use strict';

// require core module
var React = require('react');
import splitObject from "./splitObject"

// define a Input Component
var Input = React.createClass({
    getDefaultProps() {
        return {
            type: 'text',
            required: /^.+$/
        }
    },
    getInitialState() {
        return {
            isRequired: false,
            isFormated: false,
            requiredError: this.props.requiredError,
            formatedError: this.props.formatedError,
            value: ''
        }
    },
    handleChange(event) {
        var value = event.target.value,
            isRequired = this.validator(this.props.required, value),
            isFormated = this.validator(this.props.formated, value);
              
        this.setState({
            isRequired: isRequired,
            isFormated: isFormated,
            requiredError: isRequired ? '' : this.props.requiredError,
            formatedError: isFormated ? '' : this.props.formatedError,
            value: value
        });
    },
    validator(regular, value) {
        return regular && regular.test(value);
    },
    render() {
          const [{required, formated, id, type, maxLength,requiredError,formatedError}, others] = splitObject(this.props, ["required", "formated", "id", "type", "maxLength","requiredError","formatedError"]);
        return <input {...others}  id={id} name={id} type={type}  onChange={this.handleChange}  />
    }
});

// export a Input Component
module.exports = Input;

    
