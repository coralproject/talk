import React from 'react';

import t from 'coral-framework/services/i18n';
import EmptyCard from 'coral-admin/src/components/EmptyCard';
import LoadMore from '../../../components/LoadMore';
import FlaggedUser from '../containers/FlaggedUser';
import {CSSTransitionGroup} from 'react-transition-group';
import styles from './FlaggedAccounts.css';

class FlaggedAccounts extends React.Component {
  render() {
    const {
      users,
      loadMore,
      showBanUserDialog,
      showSuspendUserDialog,
      showRejectUsernameDialog,
      approveUser,
      me,
      viewUserDetail,
    } = this.props;

    const hasResults = users.nodes && !!users.nodes.length;

    return (
      <div className={styles.container}>
        <div className={styles.mainFlaggedContent}>
          {
            hasResults
              ? <CSSTransitionGroup
                component={'ul'}
                className={styles.list}
                transitionName={{
                  enter: styles.userEnter,
                  enterActive: styles.userEnterActive,
                  leave: styles.userLeave,
                  leaveActive: styles.userLeaveActive,
                }}
                transitionEnter={true}
                transitionLeave={true}
                transitionEnterTimeout={1000}
                transitionLeaveTimeout={1000}
              >
                {
                  users.nodes.map((user) => {
                    return (
                      <FlaggedUser
                        user={user}
                        key={user.id}
                        showBanUserDialog={showBanUserDialog}
                        showSuspendUserDialog={showSuspendUserDialog}
                        showRejectUsernameDialog={showRejectUsernameDialog}
                        approveUser={approveUser}
                        me={me}
                        viewUserDetail={viewUserDetail}
                      />
                    );
                  })
                }
              </CSSTransitionGroup>
              : <EmptyCard>{t('community.no_flagged_accounts')}</EmptyCard>
          }
          <LoadMore
            loadMore={loadMore}
            showLoadMore={users.hasNextPage}
          />
        </div>
      </div>
    );
  }
}

export default FlaggedAccounts;
