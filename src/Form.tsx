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
      this.fields[fieldName] = Form.createField(fieldName, null);
    }
    return this.fields[fieldName];
  }

  public async submit() {
    const data: Dict<any> = {};
    for(const fieldName in this.fields) {
      data[fieldName] = await this.getFiled(fieldName).getValidValue();
    }
    return data;
  }

  private static createField(name: string, defaultValue: any): Field {
    return new Field(name, defaultValue);
  }
};