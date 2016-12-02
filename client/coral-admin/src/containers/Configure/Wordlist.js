import React from 'react';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../../translations.json';
import styles from './Configure.css';
import {
  Card
} from 'react-mdl';

const Wordlist = ({wordlist, onChangeWordlist}) => <Card id={styles.bannedWordlist} shadow={2}>
  <p className={styles.bannedWordHeader}>{lang.t('configure.banned-word-header')}</p>
  <p className={styles.bannedWordText}>{lang.t('configure.banned-word-text')}</p>
  <textarea
    rows={5}
    type='text'
    className={styles.bannedWordInput}
    onChange={onChangeWordlist}
    value={wordlist}/>
</Card>;

export default Wordlist;

const lang = new I18n(translations);
