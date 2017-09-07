import React from 'react';
import {withSetCommentStatus} from 'plugin-api/beta/client/hocs';
import RejectCommentAction from '../components/RejectCommentAction';

export default withSetCommentStatus(RejectCommentAction);
