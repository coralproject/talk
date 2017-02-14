import React from 'react';
import {Textfield as TextFieldMDL} from 'react-mdl';

const TextField = ({onChange, label, rows}) => (
  <TextFieldMDL
    onChange={onChange}
    label={label}
    rows={rows}/>
);

export default TextField;
