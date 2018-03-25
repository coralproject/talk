import React from 'react';
import PropTypes from 'prop-types';
import styles from './Editor.css';
import cn from 'classnames';
import { PLUGIN_NAME } from '../constants';
import { htmlNormalizer } from '../utils';
import RTE from './rte/RTE';
import { Icon } from 'plugin-api/beta/client/components/ui';
import { Bold, Italic, Blockquote } from './rte/features';
import { t } from 'plugin-api/beta/client/services';

class Editor extends React.Component {
  ref = null;
  handleRef = ref => (this.ref = ref);

  handleChange = c => {
    this.props.onInputChange({
      body: c.text,
      richTextBody: c.html,
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
    if (this.props.isReply) {
      this.ref.focus();
    }
  }

  componentWillUnmount() {
    this.props.unregisterHook(this.normalizeHook);
  }

  render() {
    const { id, placeholder, label, disabled } = this.props;

    const inputId = `${id}-rte`;
    return (
      <div className={cn(styles.root, `${PLUGIN_NAME}-container`)}>
        <label
          htmlFor={inputId}
          className="screen-reader-text"
          aria-hidden={true}
        >
          {label}
        </label>
        <RTE
          inputId={inputId}
          className={`${PLUGIN_NAME}-editor`}
          classNameDisabled={`${PLUGIN_NAME}-editor-disabled`}
          contentClassName={cn(`${PLUGIN_NAME}-content`, styles.commentContent)}
          contentClassNameDisabled={`${PLUGIN_NAME}-content-disabled`}
          toolbarClassName={`${PLUGIN_NAME}-toolbar`}
          toolbarClassNameDisabled={`${PLUGIN_NAME}-toolbar-disabled`}
          onChange={this.handleChange}
          value={this.getHTML()}
          disabled={disabled}
          placeholder={placeholder}
          ref={this.handleRef}
          features={[
            <Bold
              key="bold"
              title={t('talk-plugin-rich-text.format_bold')}
              className={`${PLUGIN_NAME}-feature-bold`}
            >
              <Icon className={styles.icon} name="format_bold" />
            </Bold>,
            <Italic
              key="italic"
              title={t('talk-plugin-rich-text.format_italic')}
              className={`${PLUGIN_NAME}-feature-italic`}
            >
              <Icon className={styles.icon} name="format_italic" />
            </Italic>,
            <Blockquote
              key="blockquote"
              title={t('talk-plugin-rich-text.format_blockquote')}
              className={`${PLUGIN_NAME}-feature-blockquote`}
            >
              <Icon className={styles.icon} name="format_quote" />
            </Blockquote>,
          ]}
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
  registerHook: PropTypes.func,
  unregisterHook: PropTypes.func,
  isReply: PropTypes.bool,
  isEdit: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
};

export default Editor;
