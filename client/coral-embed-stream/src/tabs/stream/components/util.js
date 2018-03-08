/**
 * Given a comment, return when the comment can no longer be edited
 * @param {Object} comment
 * @returns {Date} when the comment can no longer be edited.
 */
export const getEditableUntilDate = comment => {
  const editing = comment && comment.editing;
  const editableUntil =
    editing &&
    editing.editableUntil &&
    new Date(Date.parse(editing.editableUntil));
  return editableUntil;
};
