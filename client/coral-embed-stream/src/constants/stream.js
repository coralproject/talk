import defaultTo from 'lodash/defaultTo';

const prefix = 'TALK_EMBED_STREAM';

export const ADDTL_COMMENTS_ON_LOAD_MORE = parseInt(
  defaultTo(process.env.TALK_ADDTL_COMMENTS_ON_LOAD_MORE, '10')
);
export const ADDTL_REPLIES_ON_LOAD_MORE = parseInt(
  defaultTo(process.env.TALK_ADDTL_REPLIES_ON_LOAD_MORE, '999999')
);
export const ASSET_COMMENTS_LOAD_DEPTH = parseInt(
  defaultTo(process.env.TALK_ASSET_COMMENTS_LOAD_DEPTH, '10')
);
export const REPLY_COMMENTS_LOAD_DEPTH = parseInt(
  defaultTo(process.env.TALK_REPLY_COMMENTS_LOAD_DEPTH, '3')
);
export const THREADING_LEVEL = parseInt(
  defaultTo(process.env.TALK_THREADING_LEVEL, '3')
);

export const ADD_COMMENT_BOX_TAG = `${prefix}_COMMENT_BOX_ADD_TAG`;
export const ADD_COMMENT_CLASSNAME = 'ADD_COMMENT_CLASSNAME';
export const CLEAR_COMMENT_BOX_TAGS = `${prefix}_COMMENT_BOX_CLEAR_TAGS`;
export const REMOVE_COMMENT_BOX_TAG = `${prefix}_COMMENT_BOX_REMOVE_TAG`;
export const REMOVE_COMMENT_CLASSNAME = 'REMOVE_COMMENT_CLASSNAME';
export const SET_ACTIVE_REPLY_BOX = 'SET_ACTIVE_REPLY_BOX';
export const SET_ACTIVE_TAB = 'CORAL_STREAM_SET_ACTIVE_TAB';
export const SET_SORT = 'CORAL_STREAM_SET_SORT';
export const VIEW_ALL_COMMENTS = 'VIEW_ALL_COMMENTS';
export const VIEW_COMMENT = 'VIEW_COMMENT';
