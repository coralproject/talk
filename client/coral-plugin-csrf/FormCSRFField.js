import React from 'react';

const FormCSRFField = ({...props}) => (
  <input type="hidden" name="csrfToken" value={props.csrfToken} />
);

export default FormCSRFField;
