import React from 'react';
import PropTypes from 'prop-types';

const CommentMoreDetails = (props) => {
  const details = props.comment.status_history.slice(-1)[0];

  return details.assigned_by ? (
    <p>{details.assigned_by.username} : {details.type}</p>
  ) : null;
};

CommentMoreDetails.propTypes = {
  comment: PropTypes.shape({
    status_history: PropTypes.array
  })
};

export default CommentMoreDetails;
