import React from 'react';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../../translations.json';
import TagsInput from 'react-tagsinput';
import styles from './Configure.css';
import {Card} from 'coral-ui';

const Wordlist = ({suspectWords, bannedWords, onChangeWordlist}) => (
  <div>
    <h3>{lang.t('configure.banned-words-title')}</h3>
    <Card id={styles.bannedWordlist}>
      <p className={styles.wordlistHeader}>{lang.t('configure.banned-word-header')}</p>
      <p className={styles.wordlistDesc}>{lang.t('configure.banned-word-text')}</p>
      <TagsInput
        value={bannedWords}
        inputProps={{placeholder: 'word or phrase'}}
        addOnPaste={true}
        pasteSplit={data => data.split(',').map(d => d.trim())}
        onChange={tags => onChangeWordlist('banned', tags)}
      />
    </Card>
    <h3>{lang.t('configure.suspect-words-title')}</h3>
    <Card id={styles.suspectWordlist}>
      <p className={styles.wordlistHeader}>{lang.t('configure.suspect-word-header')}</p>
      <p className={styles.wordlistDesc}>{lang.t('configure.suspect-word-text')}</p>
      <TagsInput
        value={suspectWords}
        inputProps={{placeholder: 'word or phrase'}}
        addOnPaste={true}
        pasteSplit={data => data.split(',').map(d => d.trim())}
        onChange={tags => onChangeWordlist('suspect', tags)} />
    </Card>
  </div>
);

export default Wordlist;

const lang = new I18n(translations);
