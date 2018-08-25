import React, { Component, ComponentType } from "react";
import { instanceOf } from 'prop-types';
import { Form } from "./Form";
import { formKey } from "./utilities/common";
import { Validator } from "./utilities/validation";
import { Field } from "./Field";

export interface FieldProps<T> {
  name: string,
  defaultValue?: T,
  validators?: Validator<T>[],
  field?: Field<T>
}

export interface ContextTypes {
  [formKey]: Form
}

export const FieldFactory = {
  create<P extends FieldProps<any>>(TargetComp: ComponentType<P>): ComponentType<P> {
    return class extends Component<P> {
      componentDidMount() {
        const { name, validators = [] } = this.props;
        const form = this.getForm();
        const fieldValidators = validators.map((validator: Validator<any>) => ({
          validate: (value: any) => validator.validate(value, form),
          message: validator.message
        }));
        form.getFiled(name).setValidators(fieldValidators);
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