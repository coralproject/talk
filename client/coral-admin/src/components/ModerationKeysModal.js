import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import styles from './ModerationKeysModal.css';
import t from 'coral-framework/services/i18n';

export default class ModerationKeysModal extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    hideShortcutsNote: PropTypes.func.isRequired,
    shortcutsNoteVisible: PropTypes.string.isRequired,
    queueCount: PropTypes.number.isRequired,
  };

  buildShortcuts = () => {
    return [
      {
        title: 'modqueue.navigation',
        shortcuts: {
          j: 'modqueue.next_comment',
          k: 'modqueue.prev_comment',
          'ctrl+f': 'modqueue.toggle_search',
          t: 'modqueue.next_queue',
          [`1...${this.props.queueCount}`]: 'modqueue.jump_to_queue',
          s: 'modqueue.singleview',
          '?': 'modqueue.thismenu',
        },
      },
      {
        title: 'modqueue.actions',
        shortcuts: {
          d: 'modqueue.approve',
          f: 'modqueue.reject',
        },
      },
    ];
  };

  render() {
    const {
      open,
      onClose,
      hideShortcutsNote,
      shortcutsNoteVisible,
    } = this.props;
    return (
      <div>
        <div
          className={styles.callToAction}
          style={{
            display: shortcutsNoteVisible === 'show' ? 'block' : 'none',
          }}
        >
          <div onClick={hideShortcutsNote} className={styles.closeButton}>
            ×
          </div>
          <p className={styles.ctaHeader}>{t('modqueue.mod_faster')}</p>
          <p>
            <strong>{t('modqueue.try_these')}:</strong>
          </p>
          <ul>
            <li>
              <span>{t('modqueue.approve')}</span>{' '}
              <span className={styles.smallKey}>d</span>
            </li>
            <li>
              <span>{t('modqueue.reject')}</span>{' '}
              <span className={styles.smallKey}>f</span>
            </li>
          </ul>
          <p>
            <span>{t('modqueue.view_more_shortcuts')}</span>{' '}
            <span className={styles.smallKey}>{t('modqueue.shift_key')}</span> +{' '}
            <span className={styles.smallKey}>/</span>
          </p>
        </div>
        <Modal open={open} onClose={onClose}>
          <h3>{t('modqueue.shortcuts')}</h3>
          <div className={styles.container}>
            {this.buildShortcuts().map((shortcut, i) => (
              <table className={styles.table} key={i}>
                <thead>
                  <tr>
                    <th>{t(shortcut.title)}</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(shortcut.shortcuts).map(key => (
                    <tr key={`${key}tr`}>
                      <td className={styles.shortcut}>
                        <span className={styles.key}>{key}</span>
                      </td>
                      <td>{t(shortcut.shortcuts[key])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
          </div>
        </Modal>
      </div>
    );
  }
}
