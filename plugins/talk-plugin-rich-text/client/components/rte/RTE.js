import React from 'react';
import PropTypes from 'prop-types';
import styles from './RTE.css';
import cn from 'classnames';
import ContentEditable from 'react-contenteditable';
import Toolbar from './components/Toolbar';
import { insertNewLine } from './lib/dom';
import API from './lib/api';

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

  handleMouseUp = () => {
    setTimeout(() => this.handleSelectionChange());
  };

  handleKeyPress = e => {
    this.handleSelectionChange();
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
          onKeyUp={this.handleSelectionChange}
          onKeyPress={this.handleKeyPress}
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
