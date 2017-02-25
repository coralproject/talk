import React from 'react';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-admin/src/translations.json';
const lang = new I18n(translations);

import styles from './Community.css';

// import Loading from './Loading';
import EmptyCard from '../../components/EmptyCard';

const FlaggedAccounts = ({...props}) => {
  const {commenters, isFetching, error, totalPages, page} = props;
  const hasResults = !isFetching && !!commenters.length;

  console.log('debug props', props);
  console.log('debug commenters', commenters);
  console.log('debug error', error);
  console.log('debug totalPages', totalPages);
  console.log('debug page', page);

  return (
    <div className={styles.container}>
      <div className={styles.mainFlaggedContent}>
        { isFetching && <Loading /> }
        {
          hasResults
          ? <div></div>
          : <EmptyCard>{lang.t('community.no-flagged-accounts')}</EmptyCard>
        }
      </div>
    </div>
  );
};

export default FlaggedAccounts;
