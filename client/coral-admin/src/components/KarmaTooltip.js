import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Icon } from 'coral-ui';
import styles from './KarmaTooltip.css';
import ClickOutside from 'coral-framework/components/ClickOutside';
import t from 'coral-framework/services/i18n';

const initialState = { menuVisible: false };

class KarmaTooltip extends React.Component {
  static propTypes = {
    thresholds: PropTypes.shape({
      reliable: PropTypes.number.isRequired,
      unreliable: PropTypes.number.isRequired,
    }).isRequired,
  };

  state = initialState;

  toogleMenu = () => {
    this.setState({ menuVisible: !this.state.menuVisible });
  };

  hideMenu = () => {
    this.setState({ menuVisible: false });
  };

  render() {
    const {
      thresholds: { unreliable },
    } = this.props;
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
              <ul>
                {/* NOTE: we may display this data in the future, keeping around for that eventuality */}
                {/* <li>
                  <span>Reliable</span>{' '}
                  <span className={cn(styles.label, styles.reliable)}>
                    &ge; {reliable}
                  </span>
                </li>
                <li>
                  <span>Neutral</span>{' '}
                  <span className={cn(styles.label, styles.neutral)}>
                    &lt; {reliable}, &gt; {unreliable}
                  </span>
                </li> */}
                <li>
                  <span>{t('user_detail.unreliable')}</span>{' '}
                  <span className={cn(styles.label, styles.unreliable)}>
                    &le; {unreliable}
                  </span>
                </li>
              </ul>
              <a
                className={styles.link}
                href={t('user_detail.karma_docs_link')}
                target="_blank"
                rel="noopener noreferrer"
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
