import React, { Component, ComponentType } from "react";
import { Field } from './Field';
import { Class } from "estree";

type Dict<T> = {
  [key: string]: T
}

export class Form {
  public static create<P>(TargetComp: ComponentType<P>): ComponentType<P> {
    return class extends Component<P> {
      form: Form;

      constructor(props: P) {
        super(props);
        this.form = new Form();
      }

      render() {
        const props = this.props as any;
        const allProps = { form: this.form, ...props };
        return <TargetComp { ...allProps }/>;
      }
    };
  }

  private fields: Dict<Field> = {};

  constructor(private defaultValue: Dict<any> = {}) {
    Object
      .keys(defaultValue)
      .forEach(key => {
        this.fields[key] = Form.createField(key, defaultValue[key]);
      });
  }

  getFiled<T>(fieldName: string): Field {
    if (!!this.fields[fieldName]) {
      this.fields[fieldName] = Form.createField(fieldName, this.defaultValue[fieldName]);
    }
    return this.fields[fieldName];
  }

  private static createField<T>(name: string, defaultValue: T): Field {
    return new Field(name, defaultValue);
  }
};