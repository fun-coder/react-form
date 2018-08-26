# react-form

## Create a field

```typescript jsx
// input.tsx

import React from 'react';
import PropTypes from 'prop-types';
import { FieldFactory } from '@qlee/react-form';

interface TextFieldProps extends FieldProps<string> {
  type?: string
}

class InputComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: null, error: null };
  }
  
  onChange = event => {
    this.props.field.setValue(event.target.value);
  }
  
  componentWillMount() {
    this.props.field.subscribe(({ value, message }) => this.setState({ value, error: message }));
  }
  
  render() {
    return <div>
      <label>{this.props.label}</label>
      <input type="text" onChange={this.onChange} />
      {this.state.error && <span>{this.state.error}</span>}
    </div>
  }
  
  static propTypes = {
    field: PropTypes.object,
  }
}

export default fieldHOC(InputComponent);
```


## Create a form
```javascript
// order-form.js

import React from 'react';
import { formHOC, watchField } from '@qlee/react-form';
import Input from './input';

const requiredValidator = {
  message: 'Username is required',
  validate: name => !!name,
}

class OrderFormComponent extends React.Component {

  constructor(props) {
    super(props);
    props.form.registerTarget(this); // bind hooks for subscribers
  }
  
  @watchField('username', { valid: true, immediate: false })
  doSomethingWhenUsernameChanged({ value, prevValue, message }) {
    console.log('Update Value from', prevValue, 'to', value);
    if (message) console.log('And has error', message);
  }
  
  submit = () => {
    this.props.form.submit().then(data => {
      console.log(data);
    })
  }
  
  render() {
    return <div>
      <Input name='username' label='Username'
             validators={ [requiredValidator] } />
      <Input name='password' label='Password' />
      <button onClick={this.submit} >Submit</button>
    </div>
  }
  
  static propTypes = {
    form: PropTypes.object,
  }
}

export default formHOC(OrderFormComponent)
```
