import React from 'react';
import styles from './styles.css';
import {t} from 'plugin-api/beta/client/services';
import {PLUGIN_NAME, DEFAULT_CONFIG} from '../constants';

export default class OffTopicCheckbox extends React.Component {

  config = this.props.config;
  pluginConfig = {...DEFAULT_CONFIG, ...(this.config && this.config[`${PLUGIN_NAME}`])};
  label = 'OFF_TOPIC';

  componentWillUnmount() {
    this._isMounted = false;
    this.props.unregisterHook(this.clearTagsHook);
  }

  componentDidMount() {
    this._isMounted = true;
    this.clearTagsHook = this.props.registerHook('postSubmit', () => {
      const idx = this.props.tags.indexOf(this.label);
      this.props.removeTag(idx);
    });
  }

  handleChange = (e) => {
    const {addTag, removeTag} = this.props;
    if (e.target.checked) {
      addTag(this.label);
    } else {
      const idx = this.props.tags.indexOf(this.label);
      removeTag(idx);
    }
  }

  render() {
    if (!this.pluginConfig.enabled) {return (null);}

    return (
        <div className={`${name} ${styles.offTopic}`}>
        {
          !this.props.isReply ? (
            <label className={styles.offTopicLabel}>
              <input type="checkbox" onChange={this.handleChange}/>
              {t('off_topic_checkbox')}
            </label>
          ) : null
        }
      </div>
    );
  }
}
