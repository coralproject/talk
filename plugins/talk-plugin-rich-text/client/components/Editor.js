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

  handleChange = evt => {
    this.props.onInputChange({
      body: this.ref.htmlEl.innerText,
      richTextBody: evt.target.value,
    });
  };

  getHTML(props = this.props) {
    if (props.input.richTextBody) {
      return props.input.richTextBody;
    }
    return (
      (props.isEdit && (props.comment.richTextBody || props.comment.body)) || ''
    );
  }

  componentDidMount() {
    if (this.props.registerHook) {
      this.normalizeHook = this.props.registerHook('preSubmit', input => {
        if (input.richTextBody) {
          return {
            ...input,
            richTextBody: htmlNormalizer(input.richTextBody),
          };
        }
      });
    }
  }

  componentWillUnmount() {
    this.props.unregisterHook(this.normalizeHook);
  }

  hasAncestor(tag) {
    const sel = window.getSelection();
    const range = sel.getRangeAt(0);
    let cur = range.startContainer;
    do {
      if (cur.nodeName === tag) {
        return true;
      }
      cur = cur.parentNode;
    } while (cur);
    return false;
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
    if (this.hasAncestor('BLOCKQUOTE')) {
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
      setTimeout(() => {
        document.execCommand('outdent');
      });
    }
  };

  render() {
    const inputId = `${this.props.id}-rte`;
    return (
      <div className={cn(styles.root, `${PLUGIN_NAME}-container`)}>
        <label
          htmlFor={inputId}
          className="screen-reader-text"
          aria-hidden={true}
        >
          {this.props.label}
        </label>
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
        {!this.props.input.body && (
          <div className={styles.placeholder}>{this.props.placeholder}</div>
        )}
        <ContentEditable
          id={inputId}
          onKeyPress={this.outdentOnEnter}
          className={styles.contentEditable}
          ref={this.handleRef}
          html={this.getHTML()}
          disabled={false}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

Editor.propTypes = {
  input: PropTypes.object,
  placeholder: PropTypes.string,
  onInputChange: PropTypes.func,
  disabled: PropTypes.bool,
  comment: PropTypes.object,
  classNames: PropTypes.object,
  registerHook: PropTypes.func,
  unregisterHook: PropTypes.func,
  isReply: PropTypes.bool,
  isEdit: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
};

export default Editor;
