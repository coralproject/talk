import React from 'react';

import t from 'coral-i18n/services/i18n';
import styles from './Community.css';
import Loading from './Loading';
import EmptyCard from 'coral-admin/src/components/EmptyCard';
import User from './components/User';

const FlaggedAccounts = ({...props}) => {
  const {commenters, isFetching} = props;
  const hasResults = !isFetching && commenters && !!commenters.length;

// if (commenter.status === 'PENDING' && commenter.actions.length > 0) {

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
              modActionButtons={['APPROVE', 'REJECT']}
              showBanUserDialog={props.showBanUserDialog}
              showSuspendUserDialog={props.showSuspendUserDialog}
              approveUser={props.approveUser}
              suspendUser={props.suspendUser}
              />;
          })
          : <EmptyCard>{t('community.no-flagged-accounts')}</EmptyCard>
        }
      </div>
    </div>
  );
};

export default FlaggedAccounts;
