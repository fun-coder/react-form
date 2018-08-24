import React, { Component } from "react";
import { UserContainer } from "./UserContainer";

export class App extends Component {
  render() {
    const defaultValue = { name: '', password: '', confirmedPassword: '' };
    return <UserContainer defaultValues={ defaultValue }/>;
  }
}