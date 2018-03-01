import React from 'react';
import EditableCommentContent from '../components/EditableCommentContent';
import CommentForm from './CommentForm';

const EditableCommentContentContainer = props => (
  <EditableCommentContent {...props} />
);

EditableCommentContentContainer.fragments = CommentForm.fragments;

export default EditableCommentContentContainer;
