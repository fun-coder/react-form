import { ComponentType, default as React, StatelessComponent } from "react";

interface LabelProps {
  label: string
  required?: boolean
}

export function withLabel<P>(ToWrapComp: ComponentType<P>): StatelessComponent<P & LabelProps> {
  return (props: P & LabelProps) => {
    const className = `label-text ${props.required ? 'required' : ''}`;
    return <div className="label-field">
      <label className={ className }>{ props.label }</label>
      <ToWrapComp { ...props }/>
    </div>;
  }
}