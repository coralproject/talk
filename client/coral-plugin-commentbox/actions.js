export const addTag = (tag) => ({
  type: 'ADD_TAG',
  tag
});

export const removeTag = (idx) => ({
  type: 'REMOVE_TAG',
  idx
});
