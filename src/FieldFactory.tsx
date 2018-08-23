import React, { Component, ComponentType } from "react";
import { instanceOf } from 'prop-types';
import { Form } from "./Form";
import { formKey, Validator } from "./types";

export interface FieldProps {
  name: string,
  defaultValue?: any,
  validators?: Validator[],
}

export interface ContextTypes {
  [formKey]: Form
}

export const FieldFactory = {
  create<P extends FieldProps>(TargetComp: ComponentType<P>): ComponentType<P> {
    return class extends Component<P> {
      componentDidMount() {
        const { name, validators } = this.props;
        const filed = this.getForm().getFiled(name);
        filed.setValidators(validators);
      }

      render() {
        const props = this.props as any;
        const form = this.getForm();
        const field = form.getFiled(props.name);
        const allProps = { ...props, field };
        return <TargetComp { ...allProps }/>;
      }

      private getForm() {
        return this.context[formKey];
      }

      static contextTypes = {
        [formKey]: instanceOf(Form),
      }
    };
  }
};