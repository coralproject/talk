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
  selectEndOfNode,
  isSelectionInside,
  traverse,
} from './lib/dom';
import createAPI from './lib/api';
import Undo from './lib/undo';
import bowser from 'bowser';
import throttle from 'lodash/throttle';

class RTE extends React.Component {
  /// Ref to react-contenteditable
  ref = null;

  // Our "plugins" api.
  api = createAPI(
    () => this.ref.htmlEl,
    () => this.handleChange(),
    () => this.undo.canUndo(),
    () => this.undo.canRedo(),
    () => this.handleUndo(),
    () => this.handleRedo(),
    () => this.focused
  );

  // Instance of undo stack.
  undo = new Undo();

  // Refs to the features.
  featuresRef = {};

  // Export this for parent components.
  focus = () => this.ref.htmlEl.focus();

  unmounted = false;
  focused = false;

  // Should be called on every change to feed
  // our Undo stack. We save the innerHTML and if available
  // a copy of the contentEditable node and a copy of the range.
  saveCheckpoint = throttle((html, node, range) => {
    const args = [html];
    if (node && range) {
      args.push(...cloneNodeAndRange(node, range));
    }
    this.undo.save(...args);
  }, 1000);

  constructor(props) {
    super(props);
    this.saveCheckpoint(props.value);
  }

  // Returns a handler that fills our `featuresRef`.
  createFeatureRefHandler(key) {
    return ref => {
      if (ref) {
        this.featuresRef[key] = ref;
      } else {
        delete this.featuresRef[key];
      }
    };
  }

  // Ref to react-contenteditable.
  handleRef = ref => (this.ref = ref);

  forEachFeature(callback) {
    Object.keys(this.featuresRef).map(k => {
      const instance = this.featuresRef[k].getFeatureInstance
        ? this.featuresRef[k].getFeatureInstance()
        : this.featuresRef[k];
      callback(instance);
    });
  }

  componentWillReceiveProps(props) {
    // Clear undo stack if content was set to sth different.
    if (props.value !== this.ref.htmlEl.innerHTML) {
      this.undo.clear();
      this.saveCheckpoint(props.value);
      if (isSelectionInside(this.ref.htmlEl)) {
        setTimeout(() => !this.unmounted && selectEndOfNode(this.ref.htmlEl));
      }
    }
  }

  componentWillUnmount() {
    // Cancel pending stuff.
    this.saveCheckpoint.cancel();
    this.unmounted = true;
  }

  handleChange = () => {
    // TODO: don't rely on this hack.
    // It removes all `style` attr that
    // remaining execCommand still add.
    traverse(this.ref.htmlEl, n => {
      n.removeAttribute && n.removeAttribute('style');
    });

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

  handleSelectionChange = () => {
    // Let features know selection has changeed, so they
    // can update.
    this.forEachFeature(b => {
      b.onSelectionChange && b.onSelectionChange();
    });
  };

  // Allow features to handle shortcuts.
  handleShortcut = e => {
    let handled = false;
    this.forEachFeature(b => {
      if (!handled) {
        handled = !!(b.onShortcut && b.onShortcut(e));
      }
    });
    return handled;
  };

  // Called when Enter was pressed without shift.
  // Traverses from bottom to top and calling
  // feature handlers and stops when one has handled this event.
  handleSpecialEnter = () => {
    let handled = false;
    const sel = window.getSelection();
    const range = sel.getRangeAt(0);
    let container = range.startContainer;
    while (!handled && container && container !== this.ref.htmlEl) {
      this.forEachFeature(b => {
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
      setTimeout(() => !this.unmounted && this.handleChange());
    }
  };

  handleFocus = () => {
    this.focused = true;
  };

  handleBlur = () => {
    this.focused = false;
    // Sometimes the onselect event doesn't fire on blur.
    this.handleSelectionChange();
  };

  // We intercept pasting, so that we
  // force text/plain content.
  handlePaste = e => {
    // Get text representation of clipboard
    // This works cross browser.
    const text = (
      (e.originalEvent || e).clipboardData || window.clipboardData
    ).getData('Text');

    // IE does this funny thing to change the selection after the paste
    // event, remember the range for now.
    const range = getSelectionRange().cloneRange();

    // Run outside of event loop to fix
    // selection issues with IE.
    setTimeout(() => {
      // Manually delete range, cope with IE.
      if (!range.collapsed) {
        range.deleteContents();
      }

      // insert text manually
      insertText(text);
      this.handleChange();
    });

    e.preventDefault();
    return false;
  };

  handleKeyDown = e => {
    // IE has issues not firing the onChange event.
    if (bowser.msie) {
      setTimeout(() => !this.unmounted && this.handleChange());
    }

    // Undo Redo 'Z'
    if (e.key === 'z' && (e.metaKey || e.ctrlKey)) {
      if (e.shiftKey) {
        this.handleRedo();
      } else {
        this.handleUndo();
      }
      e.preventDefault();
      return false;
    }

    if (e.metaKey || e.ctrlKey) {
      if (this.handleShortcut(e)) {
        e.preventDefault();
        return false;
      }
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
      selectEndOfNode(this.ref.htmlEl);
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

  renderFeatures() {
    return this.props.features.map(b => {
      return React.cloneElement(b, {
        disabled: this.props.disabled,
        api: this.api,
        ref: this.createFeatureRefHandler(b.key),
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
        <Toolbar className={classNames.toolbar}>
          {this.renderFeatures()}
        </Toolbar>
        {!value && <div className={classNames.placeholder}>{placeholder}</div>}
        <ContentEditable
          id={inputId}
          onMouseUp={this.handleMouseUp}
          onKeyDown={this.handleKeyDown}
          onKeyPress={this.handleKeyPress}
          onKeyUp={this.handleKeyUp}
          onPaste={this.handlePaste}
          onCut={this.handleCut}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onSelect={this.handleSelectionChange}
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
  features: [],
};

RTE.propTypes = {
  features: PropTypes.array,
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
