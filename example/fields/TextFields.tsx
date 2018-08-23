import { PureComponent, default as React } from "react";
import { Field, FieldChange, ChangeSubscriber } from "../../src/Field";
import { FieldFactory, FieldProps } from "../../src/FieldFactory";
import { Optional } from "../../src/Optional";
import { ValidationError } from "../../src/types";

interface TextFieldProps extends FieldProps {
  field?: Field
}

interface TextFieldState {
  value: string,
  error?: string,
}

class TextFieldComponent extends PureComponent<TextFieldProps, TextFieldState> {
  constructor(props: TextFieldProps) {
    super(props);
    this.state = { value: '' };
  }

  componentDidMount() {
    this.props.field!.subscribe(this.onFieldChange, this.onFieldError);
  }

  componentWillUnmount() {
    this.props.field!.unsubscribe(this.onFieldChange, this.onFieldError);
  }

  private onFieldChange: ChangeSubscriber = (change: FieldChange<string>) => {
    this.setState({ value: change.curr });
  };

  private onFieldError = (error?: ValidationError) => {
    this.setState({ error: Optional.of(error).mapTo(e => e.message) });
  };

  render() {
    const { value, error } = this.state;
    return <div>
      <span>
        <input type="text"
               value={ value }
               onChange={ this.setValue }/>
      </span>
      { error && <span>{ error }</span> }
    </div>;
  }

  private setValue = ({ target }: { target: HTMLInputElement }) => this.props.field!.setValue(target.value);

  private onBlur = () => this.props.field!.validate()
}

export const TextField = FieldFactory.create(TextFieldComponent);