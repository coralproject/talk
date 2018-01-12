import React from 'react';
import cn from 'classnames';
import styles from './ModActionButton.css';
import { pluginName } from '../../package.json';
import { t } from 'plugin-api/beta/client/services';
import { Icon } from 'plugin-api/beta/client/components/ui';

export class ModActionButton extends React.Component {
  constructor() {
    super();

    this.state = {
      on: false,
    };
  }

  handleMouseEnter = e => {
    e.preventDefault();
    this.setState({
      on: true,
    });
  };

  handleMouseLeave = e => {
    e.preventDefault();
    this.setState({
      on: false,
    });
  };

  handleDeleteTag = () => {
    this.props.deleteTag();
    this.props.closeMenu();
  };

  handlePostTag = () => {
    this.props.postTag();
    this.props.closeMenu();
  };

  render() {
    const { alreadyTagged } = this.props;
    const { handleDeleteTag, handlePostTag } = this;

    return (
      <button
        className={cn(`${pluginName}-tag-button`, styles.button, {
          [styles.featured]: alreadyTagged,
        })}
        onClick={alreadyTagged ? handleDeleteTag : handlePostTag}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        {alreadyTagged ? (
          <span className={styles.approved}>
            <Icon name="star" className={styles.icon} />
            {!this.state.on
              ? t('talk-plugin-featured-comments.featured')
              : t('talk-plugin-featured-comments.un_feature')}
          </span>
        ) : (
          <span>
            <Icon name="star_border" className={styles.icon} />
            {t('talk-plugin-featured-comments.feature')}
          </span>
        )}
      </button>
    );
  }
}

export default ModActionButton;
