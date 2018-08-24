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
    validate: value => !!value.trim(),
    message: (fieldName: string, value: any) => `${fieldName} is required`
  }
];

class UserContainerComponent extends Component<UserContainerProps, any> {

  render() {
    return <div className="register-form">
      <TextField name="name" label="Username" required/>
      <TextField name="password" label="Password" type="password"
                 validators={ validators } required/>
      <TextField name="confirmedPassword" type="password"
                 label="Confirm Password" validators={ validators } required/>
      <TextField name="mobile" label="Mobile" validators={ validators }/>
      <button onClick={ this.submit }>Submit</button>
    </div>;
  }

  private submit = async () => {
    const data = await this.props.form!.submit().catch(e => null);
    console.log('Data', data);
  }
}

export const UserContainer = FormFactory.create(UserContainerComponent);