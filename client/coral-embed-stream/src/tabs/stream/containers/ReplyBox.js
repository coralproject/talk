import React from 'react';
import ReplyBox from '../components/ReplyBox';
import CommentBox from './CommentBox';

const ReplyBoxContainer = props => <ReplyBox {...props} />;

ReplyBoxContainer.fragments = CommentBox.fragments;

export default ReplyBoxContainer;
