import React from 'react'
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../../translations.json';
import styles from './Configure.css';
import {
  Card
} from 'react-mdl';

const Wordlist = () => <Card id='bannedWordlist'>
  <h4 className={styles.bannedWordHeader}>Write the bannned words list</h4>
  <p className={styles.bannedWordText}>Comments which contain these words or phrases, not seperated by commas and not
  case sensitive, will be automatically removed from the comment stream.</p>
</Card>;

export default Wordlist;

const lang = new I18n(translations);
