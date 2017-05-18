import React, {PropTypes} from 'react';
import Modal from 'components/Modal';
import styles from './ModerationKeysModal.css';
import t from 'coral-i18n/services/i18n';

const shortcuts = [
  {
    title: 'modqueue.navigation',
    shortcuts: {
      'j': 'modqueue.next_comment',
      'k': 'modqueue.prev_comment',
      's': 'modqueue.singleview',
      '?': 'modqueue.thismenu'
    }
  },
  {
    title: 'modqueue.actions',
    shortcuts: {
      't': 'modqueue.approve',
      'r': 'modqueue.reject'
    }
  }
];

export default class ModerationKeysModal extends React.Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    hideShortcutsNote: PropTypes.func.isRequired,
    shortcutsNoteVisible: PropTypes.string.isRequired
  }

  render () {
    const {open, onClose, hideShortcutsNote, shortcutsNoteVisible} = this.props;
    return (
      <div>
        <div className={styles.callToAction} style={{display: shortcutsNoteVisible === 'show' ? 'block' : 'none'}}>
          <div onClick={hideShortcutsNote} className={styles.closeButton}>×</div>
          <p className={styles.ctaHeader}>{t('modqueue.mod_faster')}</p>
          <p><strong>{t('modqueue.try_these')}:</strong></p>
          <ul>
            <li><span>{t('modqueue.approve')}</span> <span className={styles.smallKey}>t</span></li>
            <li><span>{t('modqueue.reject')}</span> <span className={styles.smallKey}>r</span></li>
          </ul>
          <p><span>{t('modqueue.view_more_shortcuts')}</span> <span className={styles.smallKey}>{t('modqueue.shift_key')}</span> + <span className={styles.smallKey}>/</span></p>
        </div>
        <Modal open={open} onClose={onClose}>
          <h3>{t('modqueue.shortcuts')}</h3>
          <div className={styles.container}>
            {shortcuts.map((shortcut, i) => (
              <table className={styles.table} key={i}>
                <thead>
                  <tr>
                    <th>{t(shortcut.title)}</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(shortcut.shortcuts).map((key) => (
                    <tr key={`${key}tr`}>
                      <td className={styles.shortcut}><span className={styles.key}>{key}</span></td>
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
