import React from 'react';
import t from 'coral-framework/services/i18n';
import TagsInput from 'coral-admin/src/components/TagsInput';
import PropTypes from 'prop-types';
import ConfigureCard from 'coral-framework/components/ConfigureCard';

const Wordlist = ({ suspectWords, bannedWords, onChangeWordlist }) => (
  <div>
    <ConfigureCard collapsible title={t('configure.banned_words_title')}>
      <p>{t('configure.banned_word_text')}</p>
      <TagsInput
        value={bannedWords}
        inputProps={{
          placeholder: t('configure.suspect_or_forbidden_words_placeholder'),
        }}
        onChange={tags => onChangeWordlist('banned', tags)}
      />
    </ConfigureCard>
    <ConfigureCard collapsible title={t('configure.suspect_word_title')}>
      <p>{t('configure.suspect_word_text')}</p>
      <TagsInput
        value={suspectWords}
        inputProps={{
          placeholder: t('configure.suspect_or_forbidden_words_placeholder'),
        }}
        onChange={tags => onChangeWordlist('suspect', tags)}
      />
    </ConfigureCard>
  </div>
);

Wordlist.propTypes = {
  suspectWords: PropTypes.array.isRequired,
  bannedWords: PropTypes.array.isRequired,
  onChangeWordlist: PropTypes.func.isRequired,
};

export default Wordlist;
