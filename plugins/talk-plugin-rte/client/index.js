import Editor from './components/Editor';
import CommentContent from './containers/CommentContent';

export default {
  slots: {
    textArea: [Editor],
    commentContent: [CommentContent],
  },
};
