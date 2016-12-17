import React from 'react';

export const FormCSRFInput = React.createClass({
  render() {
    const {csrfToken} = this.props;

    return (
      <input type="hidden" name="_csrf" value={csrfToken} />
    );
  }
});
