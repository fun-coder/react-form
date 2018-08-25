import React, { Component } from "react";
import { Form } from "../src/Form";
import { FormFactory, FormProps } from "../src/FormFactory";
import { TextField } from "./fields/TextFields";
import { Validator } from "../src/utilities/validation";
import { Optional } from "../src/Optional";

interface UserContainerProps extends FormProps {
  form?: Form
}

const validators: Validator<string>[] = [{
  validate: (value?: string) => Optional.of(value).map(value => !!value).orElse(false),
  message: (fieldName: string, value: any) => `${fieldName} is required`
}];

const confirmPasswordValidator: Validator<string>[] = [{
  validate: (value: string) => !!value,
  message: 'confirmed password is required'
}, {
  validate: (value: string, form: Form) => (value === form.getFiled('password').getValue()),
  message: 'confirmed password is not same to password'
}];

class UserContainerComponent extends Component<UserContainerProps, any> {

  render() {
    return <div className="register-form">
      <div className="form-title">User Register</div>
      <TextField name="name" label="Username" required/>
      <TextField name="password" label="Password" type="password" validators={ validators } required/>
      <TextField name="confirmedPassword" type="password" label="Confirm Password"
                 validators={ confirmPasswordValidator } required/>
      <TextField name="mobile" label="Mobile" validators={ validators }/>
      <button className="submit-button" onClick={ this.submit }>Submit</button>
    </div>;
  }

  private submit = async () => {
    const data = await this.props.form!.submit().catch(e => {
      console.log(e);
      return null;
    });
    console.log('Data', data);
  }
}

export const UserContainer = FormFactory.create(UserContainerComponent);