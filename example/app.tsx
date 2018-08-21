import React, { Component } from "react";
import { UserContainer } from "./UserContainer";

export class App extends Component {
  render() {
    const defaultValue = { name: 'Qlee', password: '123' };
    return <UserContainer defaultValues={ defaultValue }/>;
  }
}