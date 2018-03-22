import once from 'lodash/once';

// @Deprecated
const showOldTagsWarningOnce = once(() => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      '`commentBoxTagsSelector` is deprecated. Please switch to `input.tags` instead'
    );
  }
});

export const commentBoxTagsSelector = state => {
  showOldTagsWarningOnce();
  return state.stream.commentBoxTags;
};

export const commentClassNamesSelector = state =>
  state.stream.commentClassNames;
