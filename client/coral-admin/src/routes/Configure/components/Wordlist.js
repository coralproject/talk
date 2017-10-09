import React from 'react';
import t from 'coral-framework/services/i18n';
import TagsInput from 'coral-admin/src/components/TagsInput';
import styles from './Wordlist.css';
import PropTypes from 'prop-types';
import {Card} from 'coral-ui';

const Wordlist = ({suspectWords, bannedWords, onChangeWordlist}) => (
  <div>
    <Card className={styles.card}>
      <div className={styles.header}>{t('configure.banned_words_title')}</div>
      <p>{t('configure.banned_word_text')}</p>
      <div className={styles.wrapper}>
        <TagsInput
          value={bannedWords}
          inputProps={{placeholder: 'word or phrase'}}
          onChange={(tags) => onChangeWordlist('banned', tags)}
        />
      </div>
    </Card>
    <Card className={styles.card}>
      <div className={styles.header}>{t('configure.suspect_word_title')}</div>
      <p>{t('configure.suspect_word_text')}</p>
      <div className={styles.wrapper}>
        <TagsInput
          value={suspectWords}
          inputProps={{placeholder: 'word or phrase'}}
          onChange={(tags) => onChangeWordlist('suspect', tags)} />
      </div>
    </Card>
  </div>
);

Wordlist.propTypes = {
  suspectWords: PropTypes.array.isRequired,
  bannedWords: PropTypes.array.isRequired,
  onChangeWordlist: PropTypes.func.isRequired,
};

export default Wordlist;
