import React from 'react';
import PropTypes from 'prop-types';
import t from 'coral-framework/services/i18n';
import RestrictedMessageBox from './RestrictedMessageBox';

const RestrictedContent = ({
  children,
  restricted,
  message = t('framework.content_not_available'),
  restrictedComp,
}) => {
  if (restricted) {
    return restrictedComp ? (
      restrictedComp
    ) : (
      <RestrictedMessageBox message={message} />
    );
  } else {
    return <div className="talk-restricted-content">{children}</div>;
  }
};

RestrictedContent.propTypes = {
  children: PropTypes.node,
  restricted: PropTypes.bool,
  message: PropTypes.string,
  restrictedComp: PropTypes.node,
};

export default RestrictedContent;
