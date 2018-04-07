import React from "react";
import PropTypes from 'prop-types';
import { Field } from "./field";
import { formKey } from "./form-hoc";

export const fieldHOC = Component => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.field = new Field({
        validators: props.validators,
        defaultValue: props.defaultValue,
      });
    }

    get form() {
      return this.context[formKey];
    }

    componentWillMount() {
      console.log('FieldHOC will mount');
      const { name } = this.props;
      this.form.mountField(name, this.field);
    }

    componentWillUnmount() {
      const { name } = this.props;
      this.form.unmountFiled(name);
    }

    getValue() {
      return this.state.value;
    }

    setValue = value => this.setState({ value });

    render() {
      const props = {
        ...this.props,
        field: this.field,
      };
      return <Component { ...props }/>;
    }

    static propTypes = {
      name: PropTypes.string,
      validators: PropTypes.array,
    };

    static defaultProps = {
      validators: [],
      defaultValue: null,
    };

    static contextTypes = {
      [formKey]: PropTypes.object.isRequired
    };
  }
};
