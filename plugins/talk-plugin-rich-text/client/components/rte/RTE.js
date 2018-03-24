import React from 'react';
import PropTypes from 'prop-types';
import styles from './RTE.css';
import cn from 'classnames';
import ContentEditable from 'react-contenteditable';
import Toolbar from './components/Toolbar';
import { insertNewLine, insertText } from './lib/dom';
import API from './lib/api';
import bowser from 'bowser';

class RTE extends React.Component {
  ref = null;
  api = null;
  buttonsRef = {};

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

  handleChange = () => {
    this.handleSelectionChange();
    this.props.onChange({
      text: this.ref.htmlEl.innerText,
      html: this.ref.htmlEl.innerHTML,
    });
  };

  handleRef = ref => (
    (this.ref = ref), (this.api = new API(this.ref.htmlEl, this.handleChange))
  );

  handleSelectionChange = () => {
    //  console.log(window.getSelection().getRangeAt(0));
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

  handleKeyDown = () => {
    // IE has issues not firing the onChange event.
    if (bowser.msie) {
      setTimeout(this.handleChange);
    }
  };

  handleKeyUp = () => {
    // IE has issues not firing the onChange event.
    if (bowser.msie) {
      setTimeout(this.handleChange);
    }
    this.handleSelectionChange();
  };

  handleKeyPress = e => {
    this.handleSelectionChange();
    // IE has issues not firing the onChange event.
    if (bowser.msie) {
      setTimeout(this.handleChange);
    }
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
          onKeyPress={this.handleKeyPress}
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
