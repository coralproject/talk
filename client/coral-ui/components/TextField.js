import React, {Component} from 'react';
import {Textfield as TextFieldMDL} from 'react-mdl';
import 'material-design-lite';

export default class TextField extends Component {
  render() {
    const {className, onChange, rows, questionBoxContent} = this.props;
    return (
      <TextFieldMDL
        className={className}
        onChange={onChange}
        label=""
        rows={rows}
        id="qboxcontent"
        value={questionBoxContent}
        expandable={false}
        style={{width: '100%'}}
      />
    );
  }
}
