import React from "react";
import { Field } from './Field';
import { Dict, ValidationError } from "./types";
import { Optional } from "./Optional";

export class Form {
  private readonly fields: Dict<Field<any>>;

  constructor(defaultValue: Dict<any> = {}) {
    this.fields = {};
    for (const fieldName in defaultValue) {
      const value = defaultValue[fieldName];
      this.fields[fieldName] = Form.createField(fieldName, value);
    }
  }

  public getFiled<T>(fieldName: string): Field<T> {
    if (!this.fields[fieldName]) {
      this.fields[fieldName] = Form.createField(fieldName);
    }
    return this.fields[fieldName];
  }

  private async getFieldErrors(): Promise<Dict<ValidationError<any>>|undefined> {
    const errors: Dict<ValidationError<any>> = {};
    for (const fieldName in this.fields) {
      await this.fields[fieldName].validate().catch(() => null);
      const error = this.fields[fieldName].getError();
      Optional.of(error).ifPresent(e => errors[fieldName] = e);
    }
    return Object.keys(errors).length > 0 ? errors : undefined
  }

  public async submit() {
    const errors = await this.getFieldErrors();
    if (errors) throw errors;
    const data: Dict<any> = {};
    for (const fieldName in this.fields) {
      data[fieldName] = this.getFiled(fieldName).getValue();
    }
    return data;
  }

  private static createField<T>(name: string, defaultValue?: T): Field<T> {
    return new Field(name, defaultValue);
  }
};