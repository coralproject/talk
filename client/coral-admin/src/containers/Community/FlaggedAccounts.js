import React from 'react';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-admin/src/translations.json';
const lang = new I18n(translations);

import styles from './Community.css';

import Loading from './Loading';
import EmptyCard from '../../components/EmptyCard';
import User from './components/User';

const FlaggedAccounts = ({...props}) => {
  const {commenters, isFetching} = props;
  const hasResults = !isFetching && commenters && !!commenters.length;

  return (
    <div className={styles.container}>
      <div className={styles.mainFlaggedContent}>
        { isFetching && <Loading /> }
        {
          hasResults
          ? commenters.map((commenter, index) => {
            return <User
              user={commenter}
              key={index}
              index={index}
              modActionButtons={['REJECT', 'APPROVE']}
              showBanUserDialog={props.showBanUserDialog}
              showSuspendUserDialog={props.showSuspendUserDialog}
              approveUser={props.approveUser}
              suspendUser={props.suspendUser}
              />;
          })
          : <EmptyCard>{lang.t('community.no-flagged-accounts')}</EmptyCard>
        }
      </div>
    </div>
  );
};

export default FlaggedAccounts;
