import React from 'react';
import PropTypes from 'prop-types';
import styles from './RTE.css';
import cn from 'classnames';
import ContentEditable from 'react-contenteditable';
import Toolbar from './Toolbar';

class Editor extends React.Component {
  ref = null;
  handleRef = ref => (this.ref = ref);
  buttonsRef = {};

  get contentEditable() {
    return this.ref.htmlEl;
  }

  createButtonRefHandler(key) {
    return ref => {
      if (ref) {
        this.buttonsRef[key] = ref;
      } else {
        delete this.buttonsRef[key];
      }
    };
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

  forEachButton(callback) {
    Object.keys(this.buttonsRef).map(k => callback(this.buttonsRef[k]));
  }

  handleChange = evt => {
    this.props.onChange({
      text: this.ref.htmlEl.innerText,
      html: evt.target.value,
    });
  };

  handleSelectionChange = () => {
    this.forEachButton(b => {
      b.onSelectionChange && b.onSelectionChange();
    });
  };

  handleClick = () => {
    this.handleSelectionChange();
  };

  handleKeyDown = () => {
    this.handleSelectionChange();
  };

  handleKeyUp = () => {
    this.handleSelectionChange();
  };

  handleKeyPress = e => {
    this.handleSelectionChange();
    if (e.key === 'Enter' && !e.shiftKey) {
      setTimeout(() => {
        document.execCommand('outdent');
      });
    }
  };

  renderButtons() {
    return this.props.buttons.map(b => {
      return React.cloneElement(b, {
        rte: this,
        ref: this.createButtonRefHandler(b.key),
      });
    });
  }

  render() {
    const {
      className,
      contentClassName,
      toolbarClassName,
      value,
      placeholder,
      inputId,
    } = this.props;

    return (
      <div className={cn(styles.root, className)}>
        <Toolbar className={toolbarClassName}>{this.renderButtons()}</Toolbar>
        {!value && <div className={styles.placeholder}>{placeholder}</div>}
        <ContentEditable
          id={inputId}
          onClick={this.handleClick}
          onKeyPress={this.handleKeyPress}
          onKeyDown={this.handleKeyDown}
          onKeyUp={this.handleKeyDown}
          className={cn(contentClassName, styles.contentEditable)}
          ref={this.handleRef}
          html={value}
          disabled={false}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

Editor.defaultProps = {
  buttons: [],
};

Editor.propTypes = {
  buttons: PropTypes.array,
  inputId: PropTypes.string,
  input: PropTypes.object,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  toolbarClassName: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
};

export default Editor;
