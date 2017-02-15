import React, {Component} from 'react';
import {Textfield as TextFieldMDL} from 'react-mdl';
import 'material-design-lite';

export default class TextField extends Component {
  render() {
    const {name, className, onChange, label, rows, value, style} = this.props;
    return (
      <TextFieldMDL
        name={name}
        className={className}
        onChange={onChange}
        label={label}
        rows={rows}
        value={value}
        style={style}
      />
    );
  }
}
