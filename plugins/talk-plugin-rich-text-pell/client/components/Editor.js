import React from 'react';
import PropTypes from 'prop-types';
import { init } from 'pell';
import styles from './Editor.css';
import cn from 'classnames';
import { pluginName } from '../../package.json';
import { htmlNormalizer } from '../utils';

class Editor extends React.Component {
  ref = null;

  handleRef = ref => (this.ref = ref);

  componentDidMount() {
    const { onChange, actions, classNames, isReply } = this.props;

    init({
      element: this.ref,
      onChange: richTextBody => {
        // We want to save the original comment body
        const originalBody = this.ref.childNodes[1].innerText;
        onChange(originalBody, { richTextBody: htmlNormalizer(richTextBody) });
      },
      actions,
      classes: {
        actionbar: cn(
          styles.actionBar,
          classNames.actionbar,
          `${pluginName}-action-bar`
        ),
        content: cn(
          styles.content,
          classNames.content,
          `${pluginName}-content`
        ),
        button: cn(styles.button, classNames.button, `${pluginName}-button`),
      },
    });

    // To edit comments and have the previous html comment
    if (this.props.comment && this.props.comment.richTextBody && !isReply) {
      this.ref.content.innerHTML = this.props.comment.richTextBody;
    }

    if (this.props.registerHook) {
      this.clearInputHook = this.props.registerHook(
        'postSubmit',
        (res, handleBodyChange) => {
          this.ref.content.innerHTML = '';
          handleBodyChange('', { richTextBody: '' });
        }
      );
    }
  }

  componentWillUnmount() {
    this.props.unregisterHook(this.clearInputHook);
  }

  render() {
    const { id, classNames } = this.props;

    return (
      <div
        id={id}
        ref={this.handleRef}
        className={cn(
          styles.container,
          classNames.container,
          `${pluginName}-container`
        )}
      />
    );
  }
}

Editor.defaultProps = {
  defaultContent: '',
  styleWithCSS: false,
  actions: [
    { name: 'bold', icon: '<i class="material-icons">format_bold</i>' },
    { name: 'italic', icon: '<i class="material-icons">format_italic</i>' },
    { name: 'quote', icon: '<i class="material-icons">format_quote</i>' },
  ],
  classNames: {
    button: '',
    content: '',
    actionbar: '',
    container: '',
  },
};

Editor.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  rows: PropTypes.number,
  comment: PropTypes.object,
  classNames: PropTypes.object,
  actions: PropTypes.array,
  registerHook: PropTypes.func,
  unregisterHook: PropTypes.func,
  isReply: PropTypes.bool,
};

export default Editor;
