import React from 'react';
import cn from 'classnames';
import { Icon } from 'coral-ui';
import styles from './KarmaTooltip.css';
import ClickOutside from 'coral-framework/components/ClickOutside';
import t from 'coral-framework/services/i18n';

const initialState = { menuVisible: false };

class KarmaTooltip extends React.Component {
  state = initialState;

  toogleMenu = () => {
    this.setState({ menuVisible: !this.state.menuVisible });
  };

  hideMenu = () => {
    this.setState({ menuVisible: false });
  };

  render() {
    const { menuVisible } = this.state;

    return (
      <ClickOutside onClickOutside={this.hideMenu}>
        <div className={cn(styles.karmaTooltip, 'talk-admin-karma-tooltip')}>
          <span
            onClick={this.toogleMenu}
            className={cn(styles.icon, 'talk-admin-karma-tooltip-icon')}
          >
            <Icon name="info" />
          </span>

          {menuVisible && (
            <div className={cn(styles.menu, 'talk-admin-karma-tooltip-menu')}>
              <strong>{t('user_detail.user_karma_score')}</strong>
              <a
                className={styles.link}
                href={t('user_detail.karma_docs_link')}
                target="_blank"
              >
                {t('user_detail.learn_more')}
              </a>
            </div>
          )}
        </div>
      </ClickOutside>
    );
  }
}

export default KarmaTooltip;
