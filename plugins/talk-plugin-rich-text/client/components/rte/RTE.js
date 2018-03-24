import React from 'react';
import PropTypes from 'prop-types';
import styles from './RTE.css';
import cn from 'classnames';
import ContentEditable from 'react-contenteditable';
import Toolbar from './components/Toolbar';
import {
  insertNewLine,
  insertText,
  getSelectionRange,
  replaceSelection,
  cloneNodeAndRange,
  replaceNodeChildren,
} from './lib/dom';
import API from './lib/api';
import Undo from './lib/undo';
import bowser from 'bowser';
import throttle from 'lodash/throttle';

class RTE extends React.Component {
  ref = null;
  api = null;
  undo = new Undo();
  buttonsRef = {};

  saveCheckpoint = throttle((html, node, range) => {
    const args = [html];
    if (node && range) {
      args.push(...cloneNodeAndRange(node, range));
    }
    this.undo.save(...args);
  }, 1000);

  createButtonRefHandler(key) {
    return ref => {
      if (ref) {
        this.buttonsRef[key] = ref;
      } else {
        delete this.buttonsRef[key];
      }
    };
  }

  forEachButton(callback) {
    Object.keys(this.buttonsRef).map(k => callback(this.buttonsRef[k]));
  }

  constructor(props) {
    super(props);
    this.saveCheckpoint(props.value);
  }

  componentWillReceiveProps(props) {
    if (props.value !== this.ref.htmlEl.innerHTML) {
      this.undo.clear();
      this.saveCheckpoint(props.value);
    }
  }

  handleChange = () => {
    this.handleSelectionChange();
    this.props.onChange({
      text: this.ref.htmlEl.innerText,
      html: this.ref.htmlEl.innerHTML,
    });
    this.ref.htmlEl.focus();
    this.saveCheckpoint(
      this.ref.htmlEl.innerHTML,
      this.ref.htmlEl,
      getSelectionRange()
    );
  };

  handleRef = ref => (
    (this.ref = ref), (this.api = new API(this.ref.htmlEl, this.handleChange))
  );

  handleSelectionChange = () => {
    this.forEachButton(b => {
      b.onSelectionChange && b.onSelectionChange();
    });
  };

  handleSpecialEnter = () => {
    let handled = false;
    const sel = window.getSelection();
    const range = sel.getRangeAt(0);
    let container = range.startContainer;
    while (!handled && container && container !== this.ref.htmlEl) {
      this.forEachButton(b => {
        if (!handled) {
          handled = !!(b.onEnter && b.onEnter(container));
        }
      });
      container = container.parentNode;
    }
    return handled;
  };

  handleCut = () => {
    // IE has issues not firing the onChange event.
    if (bowser.msie) {
      setTimeout(this.handleChange);
    }
  };

  handlePaste = e => {
    // Get text representation of clipboard
    // This works cross browser.
    const text = (
      (e.originalEvent || e).clipboardData || window.clipboardData
    ).getData('Text');

    // insert text manually
    insertText(text);
    this.handleChange();

    e.preventDefault();
    return false;
  };

  handleMouseUp = () => {
    setTimeout(() => this.handleSelectionChange());
  };

  handleKeyDown = e => {
    // IE has issues not firing the onChange event.
    if (bowser.msie) {
      setTimeout(this.handleChange);
    }

    // Undo Redo
    if (e.key === 'z' && e.metaKey) {
      if (e.shiftKey) {
        this.handleRedo();
      } else {
        this.handleUndo();
      }
      e.preventDefault();
      return false;
    }

    // Newlines Or Special Enter Behaviors.
    if (e.key === 'Enter') {
      if (!e.shiftKey && this.handleSpecialEnter()) {
        this.handleChange();
        e.preventDefault();
        return false;
      }

      insertNewLine(true);

      this.handleChange();
      e.preventDefault();
      return false;
    }
  };

  handleKeyUp = () => {
    // IE has issues not firing the onChange event.
    if (bowser.msie) {
      setTimeout(this.handleChange);
    }
    this.handleSelectionChange();
  };

  restoreCheckpoint(html, node, range) {
    if (node && range) {
      // We need to clone it, otherwise we'll mutate
      // that original one which can still be in the undo stack.
      const [nodeCloned, rangeCloned] = cloneNodeAndRange(node, range);

      // Remember range values, as `rangeCloned` can changed during
      // DOM manipulation.
      const startOffset = rangeCloned.startOffset;
      const endOffset = rangeCloned.startOffset;

      // Rewrite startContainer if it was pointing to `nodeCloned`.
      const startContainer =
        rangeCloned.startContainer === nodeCloned
          ? this.ref.htmlEl
          : rangeCloned.startContainer;

      // Rewrite endContainer if it was pointing to `nodeCloned`.
      const endContainer =
        rangeCloned.endContainer === nodeCloned
          ? this.ref.htmlEl
          : rangeCloned.endContainer;

      // Replace children with the ones from nodeCloned.
      replaceNodeChildren(this.ref.htmlEl, nodeCloned);

      // Now setup the selection range.
      const finalRange = document.createRange();
      finalRange.setStart(startContainer, startOffset);
      finalRange.setEnd(endContainer, endOffset);

      // SELECT!
      replaceSelection(finalRange);
    } else {
      this.ref.htmlEl.innerHTML = html;
    }
    this.handleChange();
  }

  handleUndo() {
    this.saveCheckpoint.flush();
    if (this.undo.canUndo()) {
      const [html, node, range] = this.undo.undo();
      this.restoreCheckpoint(html, node, range);
    }
  }

  handleRedo() {
    this.saveCheckpoint.flush();
    if (this.undo.canRedo()) {
      const [html, node, range] = this.undo.redo();
      this.restoreCheckpoint(html, node, range);
    }
  }

  renderButtons() {
    return this.props.buttons.map(b => {
      return React.cloneElement(b, {
        disabled: this.props.disabled,
        api: this.api,
        ref: this.createButtonRefHandler(b.key),
      });
    });
  }

  getClassNames() {
    const { disabled } = this.props;
    return {
      toolbar: cn(this.props.toolbarClassName, {
        [this.props.toolbarClassNameDisabled]: disabled,
        [styles.toolbarDisabled]: disabled,
      }),
      content: cn(styles.contentEditable, this.props.contentClassName, {
        [this.props.contentClassNameDisabled]: disabled,
        [styles.contentEditableDisabled]: disabled,
      }),
      root: cn(this.props.className, {
        [this.props.classNameDisabled]: disabled,
      }),
      placeholder: cn(styles.placeholder, this.props.placeholderClassName, {
        [this.props.placeholderClassNameDisabled]: disabled,
      }),
    };
  }

  render() {
    const { value, placeholder, inputId, disabled } = this.props;

    const classNames = this.getClassNames();

    return (
      <div className={classNames.root}>
        <Toolbar className={classNames.toolbar}>{this.renderButtons()}</Toolbar>
        {!value && <div className={classNames.placeholder}>{placeholder}</div>}
        <ContentEditable
          id={inputId}
          onMouseUp={this.handleMouseUp}
          onKeyDown={this.handleKeyDown}
          onKeyUp={this.handleKeyUp}
          onPaste={this.handlePaste}
          onCut={this.handleCut}
          className={classNames.content}
          ref={this.handleRef}
          html={value}
          disabled={disabled}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

RTE.defaultProps = {
  buttons: [],
};

RTE.propTypes = {
  buttons: PropTypes.array,
  inputId: PropTypes.string,
  input: PropTypes.object,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  classNameDisabled: PropTypes.string,
  contentClassName: PropTypes.string,
  contentClassNameDisabled: PropTypes.string,
  toolbarClassName: PropTypes.string,
  toolbarClassNameDisabled: PropTypes.string,
  placeholderClassName: PropTypes.string,
  placeholderClassNameDisabled: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
};

export default RTE;
