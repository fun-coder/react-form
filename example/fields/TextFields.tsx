import { PureComponent, default as React } from "react";
import { ChangeSubscriber, Field, FieldChange } from "../../src/Field";
import { FieldFactory, FieldProps } from "../../src/FieldFactory";
import { Optional } from "../../src/optional";
import { ValidationError } from "../../src/types";

interface TextFieldProps extends FieldProps {
  field?: Field
}

interface TextFieldState {
  value?: string,
  error?: string,
}

class TextFieldComponent extends PureComponent<TextFieldProps, TextFieldState> {
  constructor(props: TextFieldProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.field!.subscribe(this.onField);
  }

  componentWillUnmount() {
    this.props.field!.unsubscribe(this.onField);
  }

  private onField = (change?: FieldChange<string>, error?: ValidationError) => {
    this.setState({
      value: Optional.of(change).mapTo(c => c.curr),
      error: Optional.of(error).mapTo(e => e.message)
    });
  };

  render() {
    const { value, error } = this.state;
    return <div>
      <span>
        <input type="text" value={ value } onChange={ this.setValue }/>
      </span>
      { error && <span>{ error }</span> }
    </div>;
  }

  private setValue = ({ target }: { target: HTMLInputElement }) => this.props.field!.setValue(target.value);
}

export const TextField = FieldFactory.create(TextFieldComponent);