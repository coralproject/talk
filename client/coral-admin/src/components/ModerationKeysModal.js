import I18n from 'coral-framework/i18n/i18n'
import translations from '../translations'
import React from 'react'
import Modal from 'components/Modal'
import styles from './ModerationKeysModal.css'
import { Map } from 'immutable'

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
]

export default ({ open, onClose }) => (
  <Modal open={open} onClose={onClose}>
    <h3>{lang.t('modqueue.shortcuts')}</h3>
    <div className={styles.container}>
      {shortcuts.map(shortcut => (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{lang.t(shortcut.title)}</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(shortcut.shortcuts).map(key => (
              <tr>
                <td className={styles.shortcut}><span className={styles.key}>{key}</span></td>
                <td>{lang.t(shortcut.shortcuts[key])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ))}
    </div>
  </Modal>
)

const lang = new I18n(translations)
