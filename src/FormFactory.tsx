import { Component, ComponentType, default as React } from "react";
import { Form } from "./Form";
import { Dict, formKey } from "./utilities/common";
import { instanceOf, shape } from 'prop-types';

export interface FormProps {
  defaultValues?: Dict<any>
}

export const FormFactory = {
  create<P extends FormProps>(TargetComp: ComponentType<P>): ComponentType<P> {
    return class extends Component<P, any> {
      form: Form;

      constructor(props: P & FormProps) {
        super(props);
        this.form = new Form(props.defaultValues);
      }

      getChildContext() {
        return {
          [formKey]: this.form,
        };
      }

      render() {
        const props = this.props as any;
        const allProps = { form: this.form, ...props };
        return <TargetComp { ...allProps }/>;
      }

      static childContextTypes = {
        [formKey]: instanceOf(Form)
      };
    };
  }
};