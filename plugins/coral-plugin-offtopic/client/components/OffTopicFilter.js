import React from 'react';
import styles from './styles.css';
import {t} from 'plugin-api/beta/client/services';
import {PLUGIN_NAME, DEFAULT_CONFIG} from '../constants';

/* plugin_config:
  "coral-plugin-offtopic": {
      enabled: true|false,
      action_style: "checkbox|link",
      use_tooltip: true|false
    }
  }

*/

export default class OffTopicFilter extends React.Component {

  getPluginConfig({config} = this.props) {
    return {...DEFAULT_CONFIG, ...(config && config[`${PLUGIN_NAME}`])};
  }

  tag = 'OFF_TOPIC';
  className = 'coral-plugin-off-topic-comment';
  cn = {[this.className] : {tags: [this.tag]}};

  handleChange = () => {
    if (this.props.offTopicState === 'shown') {
      this.props.addCommentClassName(this.cn);
      this.props.toggleState();
      if (this.actionStyle === 'checkbox'){ this.props.toggleCheckbox();}
    } else {
      const idx = this.props.commentClassNames.findIndex((i) => i[this.className]);
      this.props.removeCommentClassName(idx);
      this.props.toggleState();
      if (this.actionStyle === 'checkbox'){ this.props.toggleCheckbox();}
    }
    this.props.onClick && this.props.onClick();
  }

  render() {
    let pluginConfig = this.getPluginConfig(this.props);

    if (!pluginConfig.enabled) {return (null);}

    const offTopicState = this.props.offTopicState;
    const actionCheckbox = (
      <label>
        <input type="checkbox" onChange={this.handleChange} checked={this.props.checked} />
        Hide Off-Topic Comments
      </label>
    );
    const actionLink = (
      <label>
        <span className={styles.offTopicFilter}>
          <a className={offTopicState} onClick={this.handleChange}>
            {offTopicState === 'hiding' ? t('off_topic_filter_hidden') : t('off_topic_filter_shown') }
          </a>
        </span>
      </label>
    );
    return (
      <div>
        {pluginConfig.action_style === 'checkbox' ? actionCheckbox : actionLink}
      </div>
    );
  }
}
