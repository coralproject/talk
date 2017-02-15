import React, {Component} from 'react';
import {Textfield as TextFieldMDL} from 'react-mdl';
import 'material-design-lite';

export default class TextField extends Component {
  render() {
    const {id, className, onChange, label, rows, value} = this.props;
    return (
      <TextFieldMDL
        id={id}
        className={className}
        onChange={onChange}
        label={label}
        rows={rows}
        value={value}
      />
    );
  }
}
