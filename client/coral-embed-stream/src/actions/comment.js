import {ADD_CLASSNAME, REMOVE_CLASSNAME} from '../constants/comment';

export const addClassName = (className) => ({
  type: ADD_CLASSNAME,
  className
});

export const removeClassName = (idx) => ({
  type: REMOVE_CLASSNAME,
  idx
});
