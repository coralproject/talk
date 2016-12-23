import React from 'react';

const FormCSRFField = ({...props}) => (
  <input type="hidden" name="_csrf" value={props.csrfToken_csrf} />
);

export default FormCSRFField;
