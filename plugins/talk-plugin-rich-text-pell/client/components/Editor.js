import React from 'react';
import PropTypes from 'prop-types';
import { init } from 'pell';
import styles from './Editor.css';
import cn from 'classnames';
import { pluginName } from '../../package.json';

class Editor extends React.Component {
  ref = null;

  handleRef = ref => (this.ref = ref);

  componentDidMount() {
    const { onChange, actions, classNames } = this.props;

    init({
      element: this.ref,
      onChange: richTextBody => {
        // We want to save the original comment body
        const originalBody = this.ref.childNodes[1].innerText;
        onChange(originalBody, { richTextBody });
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
    if (this.props.comment && this.props.comment.richTextBody) {
      this.ref.content.innerHTML = this.props.comment.richTextBody;
    }
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
  actions: ['bold', 'italic', 'quote'],
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
};

export default Editor;
