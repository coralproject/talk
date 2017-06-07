import {ADD_COMMENT_CLASSNAME, REMOVE_COMMENT_CLASSNAME} from '../constants/comment';

export const addCommentClassName = (className) => ({
  type: ADD_COMMENT_CLASSNAME,
  className
});

export const removeCommentClassName = (idx) => ({
  type: REMOVE_COMMENT_CLASSNAME,
  idx
});
