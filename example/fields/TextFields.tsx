import { PureComponent, default as React } from "react";
import { Field, FieldChange, ChangeSubscriber } from "../../src/Field";
import { FieldFactory, FieldProps } from "../../src/FieldFactory";
import { Optional } from "../../src/Optional";
import { ValidationError } from "../../src/types";
import { withLabel } from "../withLabel";

interface TextFieldProps extends FieldProps {
  field?: Field
  type?: string
}

interface TextFieldState {
  value: string,
  error?: string,
}

class TextFieldComponent extends PureComponent<TextFieldProps, TextFieldState> {

  static defaultProps: Partial<TextFieldProps> = {
    type: 'text'
  };

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
    if (change.curr !== undefined) {
      this.setState({ value: change.curr });
    }
  };

  private onFieldError = (error?: ValidationError) => {
    this.setState({ error: Optional.of(error).mapTo(e => e.message) });
  };

  render() {
    const { value, error } = this.state;
    return <div className="text-field">
      <input type={ this.props.type }
             value={ value }
             onFocus={ this.onFocus }
             onChange={ this.setValue }/>
      { error && <p className="error-message">{ error }</p> }
    </div>;
  }

  private setValue = ({ target }: { target: HTMLInputElement }) => this.props.field!.setValue(target.value);

  private onFocus = () => this.props.field!.cleanError();
}

export const TextField = FieldFactory.create(withLabel(TextFieldComponent));