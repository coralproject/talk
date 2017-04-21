import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations.json';
import React from 'react';
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
  constructor (props) {
    super(props);
    try {
      if (window.localStorage.getItem('coral:shortcutsNote') === null) {
        window.localStorage.setItem('coral:shortcutsNote', 'show');
      }
    } catch (e) {

      // above will fail in Private Mode in some browsers.
    }
    this.state = {
      shortcutsNote: window.localStorage.getItem('coral:shortcutsNote') || 'show'
    };
  }

  closeCallToAction = () => {
    try {
      window.localStorage.setItem('coral:shortcutsNote', 'hide');
      this.setState({foo: Math.random()}); // apparently this.forceUpdate() is bad, but we need a re-render
    } catch (e) {

      // when setItem fails in Safari Private mode
      this.setState({shortcutsNote: 'hide'});
    }
  }

  render () {
    const {open, onClose} = this.props;
    const hideShortcutsNote = window.localStorage.getItem('coral:shortcutsNote') === 'hide' ||
      this.state.dashboardNote === 'hide'; // for Safari Incognito
    return (
      <div>
        <div className={styles.callToAction} style={{display: hideShortcutsNote ? 'none' : 'block'}}>
          <div onClick={this.closeCallToAction} className={styles.closeButton}>×</div>
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
                  {Object.keys(shortcut.shortcuts).map(key => (
                    <tr key={`${key  }tr`}>
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
