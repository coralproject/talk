import React from 'react';
import styles from './styles.css';
import {t} from 'plugin-api/beta/client/services';
import {PLUGIN_NAME, DEFAULT_CONFIG} from '../constants';

const isOffTopic = (tags) => !!tags.filter((t) => t.tag.name === 'OFF_TOPIC').length;

export default class OffTopicTag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      offTopicTipDisplayed: false
    };
  }

  config = this.props.config;
  pluginConfig = {...DEFAULT_CONFIG, ...(this.config && this.config[`${PLUGIN_NAME}`])};

  handleClose= () => {
    this.setState({offTopicTipDisplayed: false});
  }

  handleClick = () => {
    this.setState({offTopicTipDisplayed: !this.state.offTopicTipDisplayed});
  }

  handleMouseEnter = () => {
    this.setState({offTopicTipDisplayed: true});
  }

  handleMouseLeave = () => {
    this.setState({offTopicTipDisplayed: false});
  }

  render() {
    if (!this.pluginConfig.enabled) {return (null);}

    const offTopicTip = <div className={styles.tooltipContainer}>
      {this.state.offTopicTipDisplayed ? (
        <div className={styles.tooltip}>
          <div className={`tooltip-header ${styles.tooltipHeader}`}><span className={styles.textAlignLeft}>{t('off_topic_info_header')}</span> <span className={`tooltip-close ${styles.tooltipClose}`} onClick={this.handleClose}><i className={'fa fa-times-circle'} aria-hidden='true'></i></span></div>
          <div className={'tooltip-content'}>{t('off_topic_info_description')}</div>
        </div>
      )
      : null }
    </div>;

    return (
      <span>
      {
        isOffTopic(this.props.comment.tags) && this.props.depth === 0 ? (
          <div>
            <div className={styles.tag}
              onClick={this.handleClick}
              onMouseEnter={this.handleMouseEnter}
              onMouseLeave={this.handleMouseLeave}>
              {t('off_topic_tag')}
            </div>
            {this.pluginConfig.use_tooltip ? offTopicTip  : null }
          </div>

        ) : null
      }
       </span>
    );
  }
}

