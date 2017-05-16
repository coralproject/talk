import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations.json';
import React, {PropTypes} from 'react';
import Modal from 'components/Modal';
import styles from './ModerationKeysModal.css';

const lang = new I18n(translations);

const shortcuts = [
  {
    title: 'modqueue.navigation',
    shortcuts: {
      'j': 'modqueue.nextcomment',
      'k': 'modqueue.prevcomment',
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
          <p className={styles.ctaHeader}>{lang.t('modqueue.mod-faster')}</p>
          <p><strong>{lang.t('modqueue.try-these')}:</strong></p>
          <ul>
            <li><span>{lang.t('modqueue.approve')}</span> <span className={styles.smallKey}>t</span></li>
            <li><span>{lang.t('modqueue.reject')}</span> <span className={styles.smallKey}>r</span></li>
          </ul>
          <p><span>{lang.t('modqueue.view-more-shortcuts')}</span> <span className={styles.smallKey}>{lang.t('modqueue.shift-key')}</span> + <span className={styles.smallKey}>/</span></p>
        </div>
        <Modal open={open} onClose={onClose}>
          <h3>{lang.t('modqueue.shortcuts')}</h3>
          <div className={styles.container}>
            {shortcuts.map((shortcut, i) => (
              <table className={styles.table} key={i}>
                <thead>
                  <tr>
                    <th>{lang.t(shortcut.title)}</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(shortcut.shortcuts).map((key) => (
                    <tr key={`${key}tr`}>
                      <td className={styles.shortcut}><span className={styles.key}>{key}</span></td>
                      <td>{lang.t(shortcut.shortcuts[key])}</td>
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
