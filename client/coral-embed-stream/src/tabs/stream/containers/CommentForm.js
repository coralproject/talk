import React from 'react';
import CommentForm from '../components/CommentForm';
import DraftArea from './DraftArea';

const CommentFormContainer = props => <CommentForm {...props} />;

CommentFormContainer.fragments = DraftArea.fragments;

export default CommentFormContainer;
