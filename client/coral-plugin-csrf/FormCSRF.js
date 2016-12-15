import React from 'react';

export const FormCSRFInput = React.createClass({
  render() {
    const token = ''; //$('meta[name="csrf-token"]').attr('content');

    return (
      <input type="hidden" name="authenticity_token" value={token} readOnly={true} />
    );
  }
});
