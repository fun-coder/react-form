import React from "react";
import { Field } from './Field';
import { Dict } from "./types";

export class Form {
  private readonly fields: Dict<Field>;

  constructor(defaultValue: Dict<any> = {}) {
    this.fields = {};
    for (const fieldName in defaultValue) {
      const value = defaultValue[fieldName];
      this.fields[fieldName] = Form.createField(fieldName, value);
    }
  }

  public getFiled<T>(fieldName: string): Field {
    if (!this.fields[fieldName]) {
      this.fields[fieldName] = Form.createField(fieldName, undefined);
    }
    return this.fields[fieldName];
  }

  public async submit() {
    await Promise.all(Object.keys(this.fields)
      .map(fieldName => this.getFiled(fieldName).validate()));
    const data: Dict<any> = {};
    for (const fieldName in this.fields) {
      data[fieldName] = await this.getFiled(fieldName).getValue();
    }
    return data;
  }

  private static createField(name: string, defaultValue: any): Field {
    return new Field(name, defaultValue);
  }
};