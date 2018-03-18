import React from 'react';
import PropTypes from 'prop-types';
import styles from './Editor.css';
import cn from 'classnames';
import { PLUGIN_NAME } from '../constants';
import { htmlNormalizer } from '../utils';
import ContentEditable from 'react-contenteditable';
import Toolbar from './Toolbar';
import Button from './Button';
import bowser from 'bowser';

class Editor extends React.Component {
  ref = null;
  handleRef = ref => (this.ref = ref);
  state = {
    html:
      !this.props.isReply && this.props.comment
        ? this.props.comment.richTextBody || this.props.comment.body || ''
        : '',
  };

  handleChange = evt => {
    const html = evt.target.value;
    this.setState({ html });
    this.props.onChange(this.ref.htmlEl.innerText, {
      richTextBody: htmlNormalizer(html),
    });
  };

  componentDidMount() {
    if (this.props.registerHook) {
      this.clearInputHook = this.props.registerHook(
        'postSubmit',
        (res, handleBodyChange) => {
          this.setState({ html: '' });
          handleBodyChange('', { richTextBody: '' });
        }
      );
    }
  }

  shouldComponentUpdate(nextProps) {
    if (this.props.value !== nextProps.value) {
      return false;
    }
    return true;
  }

  componentWillUnmount() {
    this.props.unregisterHook(this.clearInputHook);
  }

  getCurrentTagName() {
    const sel = window.getSelection();
    const range = sel.getRangeAt(0);
    if (range.startContainer.nodeName !== '#text') {
      return range.startContainer.nodeName;
    }
    return range.startContainer.parentNode.tagName;
  }

  formatBold = () => {
    document.execCommand('bold');
    this.ref.htmlEl.focus();
  };

  formatItalic = () => {
    document.execCommand('italic');
    this.ref.htmlEl.focus();
  };

  formatBlockquote = () => {
    const currentTag = this.getCurrentTagName();
    if (currentTag === 'BLOCKQUOTE') {
      document.execCommand('outdent');
    } else {
      if (bowser.msie) {
        document.execCommand('indent');
      } else {
        document.execCommand('formatBlock', false, 'blockquote');
      }
    }
    this.ref.htmlEl.focus();
  };

  outdentOnEnter = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      setTimeout(() => document.execCommand('outdent'));
    }
  };

  render() {
    const { id } = this.props;
    return (
      <div className={cn(styles.root, `${PLUGIN_NAME}-container`)}>
        <Toolbar>
          <Button icon="format_bold" title="bold" onClick={this.formatBold} />
          <Button
            icon="format_italic"
            title="italic"
            onClick={this.formatItalic}
          />
          <Button
            icon="format_quote"
            title="quote"
            onClick={this.formatBlockquote}
          />
        </Toolbar>
        <ContentEditable
          onKeyPress={this.outdentOnEnter}
          className={styles.contentEditable}
          id={id}
          ref={this.handleRef}
          html={this.state.html}
          disabled={false}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

Editor.propTypes = {
  rows: PropTypes.number, // TODO: should not be passed.
  id: PropTypes.string, // TODO: should not be passed.
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  comment: PropTypes.object,
  classNames: PropTypes.object,
  registerHook: PropTypes.func,
  unregisterHook: PropTypes.func,
  isReply: PropTypes.bool,
};

export default Editor;
