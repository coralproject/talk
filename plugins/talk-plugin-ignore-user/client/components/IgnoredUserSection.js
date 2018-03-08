import React from 'react';
import PropTypes from 'prop-types';
import styles from './IgnoredUserSection.css';
import { t } from 'plugin-api/beta/client/services';

const IgnoreUserSection = ({ ignoredUsers, stopIgnoringUser }) => (
  <section className={'talk-plugin-ignore-user-section'}>
    <h3>{t('talk-plugin-ignore-user.section_title')}</h3>
    {!ignoredUsers.length && (
      <p className={styles.blank}>{t('talk-plugin-ignore-user.blank_info')}</p>
    )}
    {!!ignoredUsers.length && (
      <div>
        <p>{t('talk-plugin-ignore-user.section_info')}</p>
        <ul className={styles.list}>
          {ignoredUsers.map(({ username, id }) => (
            <li className={styles.listItem} key={id}>
              <span className={styles.username}>{username}</span>
              <button
                onClick={() => stopIgnoringUser({ id })}
                className={styles.button}
              >
                {t('talk-plugin-ignore-user.stop_ignoring')}
              </button>
            </li>
          ))}
        </ul>
      </div>
    )}
  </section>
);

IgnoreUserSection.propTypes = {
  ignoredUsers: PropTypes.array.isRequired,
  stopIgnoringUser: PropTypes.func.isRequired,
};

export default IgnoreUserSection;
