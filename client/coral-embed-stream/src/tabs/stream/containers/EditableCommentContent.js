import React from 'react';
import PropTypes from 'prop-types';

import { notifyForNewCommentStatus } from '../helpers';
import { getEditableUntilDate } from '../util';
import { can } from 'coral-framework/services/perms';
import t from 'coral-framework/services/i18n';

import EditableCommentContent from '../components/EditableCommentContent';
import CommentForm from './CommentForm';
import withHooks from '../hocs/withHooks';
import { compose } from 'recompose';

/**
 * Renders a Comment's body in such a way that the end-user can edit it and save changes
 */
class EditableCommentContentContainer extends React.Component {
  unmounted = false;
  editWindowExpiryTimeout = null;
  state = {
    loadingState: '',
    submitEnabled: false,
    input: {
      body: this.props.comment.body,
    },
  };

  componentDidMount() {
    const editableUntil = getEditableUntilDate(this.props.comment);
    const now = new Date();
    const editWindowRemainingMs = editableUntil && editableUntil - now;
    if (editWindowRemainingMs > 0) {
      this.editWindowExpiryTimeout = setTimeout(() => {
        this.forceUpdate();
      }, editWindowRemainingMs);
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
    if (this.editWindowExpiryTimeout) {
      this.editWindowExpiryTimeout = clearTimeout(this.editWindowExpiryTimeout);
    }
  }

  handleInputChange = input => {
    this.setState(state => ({
      submitEnabled: true,
      input: {
        ...state.input,
        ...input,
      },
    }));
  };

  handleSubmit = async () => {
    if (!can(this.props.currentUser, 'INTERACT_WITH_COMMUNITY')) {
      this.props.notify('error', t('error.NOT_AUTHORIZED'));
      return;
    }

    this.setState({ loadingState: 'loading' });

    const { editComment, stopEditing } = this.props;
    if (typeof editComment !== 'function') {
      return;
    }

    let input = this.state.input;

    // Execute preSubmit Hooks
    this.props.forEachHook('preSubmit', hook => {
      const result = hook(input);
      if (result) {
        input = result;
      }
    });

    let response;
    try {
      response = await editComment(input);
      // Execute postSubmit Hooks
      this.props.forEachHook('postSubmit', hook =>
        hook(response, this.handleInputChange)
      );

      if (!this.unmounted) {
        this.setState({ loadingState: 'success' });
      }
      const status = response.data.editComment.comment.status;
      notifyForNewCommentStatus(this.props.notify, status);
      if (typeof stopEditing === 'function') {
        stopEditing();
      }
    } catch (error) {
      this.setState({ loadingState: 'error' });
    }
  };

  getEditableUntil = (props = this.props) => {
    return getEditableUntilDate(props.comment);
  };

  isEditWindowExpired = (props = this.props) => {
    return this.getEditableUntil(props) - new Date() < 0;
  };

  isSubmitEnabled = () => this.state.submitEnabled;

  render() {
    return (
      <EditableCommentContent
        charCountEnable={this.props.charCountEnable}
        submitEnabled={this.isSubmitEnabled}
        maxCharCount={this.props.maxCharCount}
        root={this.props.root}
        comment={this.props.comment}
        input={this.state.input}
        onInputChange={this.handleInputChange}
        onSubmit={this.handleSubmit}
        onCancel={this.props.stopEditing}
        loadingState={this.state.loadingState}
        editWindowExpired={this.isEditWindowExpired()}
        editableUntil={this.getEditableUntil()}
        registerHook={this.props.registerHook}
        unregisterHook={this.props.unregisterHook}
      />
    );
  }
}

EditableCommentContentContainer.propTypes = {
  notify: PropTypes.func.isRequired,
  root: PropTypes.object.isRequired,
  comment: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
  charCountEnable: PropTypes.bool,
  maxCharCount: PropTypes.number,
  editComment: PropTypes.func,
  stopEditing: PropTypes.func,
  registerHook: PropTypes.func.isRequired,
  unregisterHook: PropTypes.func.isRequired,
  forEachHook: PropTypes.func.isRequired,
};

EditableCommentContentContainer.fragments = CommentForm.fragments;

const enhance = compose(withHooks(['preSubmit', 'postSubmit']));

export default enhance(EditableCommentContentContainer);
