import React from 'react';

import t from 'coral-framework/services/i18n';
import styles from './Community.css';
import EmptyCard from 'coral-admin/src/components/EmptyCard';
import LoadMore from '../../../components/LoadMore';
import FlaggedUser from '../containers/FlaggedUser';

const FlaggedAccounts = (props) => {
  const {
    users,
    loadMore,
    showBanUserDialog,
    showSuspendUserDialog,
    showRejectUsernameDialog,
    approveUser,
    me,
    viewUserDetail,
  } = props;

  const hasResults = users.nodes && !!users.nodes.length;

  return (
    <div className={styles.container}>
      <div className={styles.mainFlaggedContent}>
        {
          hasResults
          ? users.nodes.map((user, index) => {
            return <FlaggedUser
              user={user}
              key={index}
              index={index}
              modActionButtons={['APPROVE', 'REJECT']}
              showBanUserDialog={showBanUserDialog}
              showSuspendUserDialog={showSuspendUserDialog}
              showRejectUsernameDialog={showRejectUsernameDialog}
              approveUser={approveUser}
              me={me}
              viewUserDetail={viewUserDetail}
              />;
          })
          : <EmptyCard>{t('community.no_flagged_accounts')}</EmptyCard>
        }
        <LoadMore
          loadMore={loadMore}
          showLoadMore={users.hasNextPage}
          />
      </div>
    </div>
  );
};

export default FlaggedAccounts;
