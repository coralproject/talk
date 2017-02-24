import React from 'react';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-admin/src/translations.json';
const lang = new I18n(translations);

import styles from './Community.css';

import Loading from './Loading';
import EmptyCard from '../../components/EmptyCard';

const FlaggedAccounts = ({isFetching}) => {
  const hasResults = false; // !isFetching && !!commenters.length;

  return (
    <div className={styles.container}>
    <div className={styles.mainContent}>
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
