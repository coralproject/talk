import React from 'react';
import t from 'coral-i18n/services/i18n';
import TagsInput from 'react-tagsinput';
import styles from './Configure.css';
import {Card} from 'coral-ui';

const Wordlist = ({suspectWords, bannedWords, onChangeWordlist}) => (
  <div>
    <Card id={styles.bannedWordlist} className={styles.configSetting}>
      <div className={styles.settingsHeader}>{t('configure.banned_words_title')}</div>
      <p className={styles.wordlistDesc}>{t('configure.banned_word_text')}</p>
      <div className={styles.wrapper}>
        <TagsInput
          value={bannedWords}
          inputProps={{placeholder: 'word or phrase'}}
          addOnPaste={true}
          pasteSplit={(data) => data.split(',').map((d) => d.trim())}
          onChange={(tags) => onChangeWordlist('banned', tags)}
        />
      </div>
    </Card>
    <Card id={styles.suspectWordlist} className={styles.configSetting}>
      <div className={styles.settingsHeader}>{t('configure.suspect_word_title')}</div>
      <p className={styles.wordlistDesc}>{t('configure.suspect_word_text')}</p>
      <div className={styles.wrapper}>
        <TagsInput
          value={suspectWords}
          inputProps={{placeholder: 'word or phrase'}}
          addOnPaste={true}
          pasteSplit={(data) => data.split(',').map((d) => d.trim())}
          onChange={(tags) => onChangeWordlist('suspect', tags)} />
      </div>
    </Card>
  </div>
);

export default Wordlist;
