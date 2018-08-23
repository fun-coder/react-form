import React, { Component } from "react";
import { Form } from "../src/Form";
import { FormFactory, FormProps } from "../src/FormFactory";
import { Validator } from "../src/types";
import { TextField } from "./fields/TextFields";

interface UserContainerProps extends FormProps {
  form?: Form
}

const validators: Validator[] = [
  {
    validate: value => {
      console.log('value', value, !!value.trim());
      return !!value.trim();
    },
    message: 'the field is required'
  }
];

class UserContainerComponent extends Component<UserContainerProps, any> {

  render() {
    return <div>
      <TextField name="name"/>
      <TextField name="password" validators={validators} />
      <button onClick={ this.submit }>Submit</button>
    </div>;
  }

  private submit = async () => {
    const data = await this.props.form!.submit().catch(e => null);
    console.log('Data', data);
  }
}

export const UserContainer = FormFactory.create(UserContainerComponent);