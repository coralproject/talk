import React from 'react';
import {compose} from 'react-apollo';
import {withSetCommentStatus} from 'coral-framework/graphql/mutations';
import RejectCommentAction from '../components/RejectCommentAction';

// change this

const enhance = compose(
  withSetCommentStatus
);

export default enhance(RejectCommentAction);
