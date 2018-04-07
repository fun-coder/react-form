import React from "react";
import PropTypes from 'prop-types';
import { Form } from "./form";
import { getSubscribers } from "./watch-field";

export const formKey = '__rnForm';
export const formHOC = WrappedComponent => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.form = new Form({
        subscribers: getSubscribers(WrappedComponent.prototype),
      });
    }

    getChildContext() {
      return {
        [formKey]: this.form,
      };
    }

    componentDidMount() {
      this.form.startAllHooks();
    }

    render() {
      const allProps = { ...this.props, form: this.form };
      return <WrappedComponent { ...allProps }/>
    }

    static childContextTypes = {
      [formKey]: PropTypes.object
    }
  };
};