import CommentContent from './containers/CommentContent';
import CommentMoreDetails from './containers/CommentMoreDetails';

export default {
  slots: {
    commentContent: [CommentContent],
    adminCommentMoreDetails: [CommentMoreDetails]
  }
};
