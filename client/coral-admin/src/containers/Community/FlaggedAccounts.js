import React from 'react';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-admin/src/translations.json';
const lang = new I18n(translations);

import styles from './Community.css';

import Loading from './Loading';
import EmptyCard from '../../components/EmptyCard';
import User from './components/User';

// actions={commenter.actions}

const FlaggedAccounts = ({...props}) => {
  const {commenters, isFetching} = props;
  const hasResults = !isFetching && commenters && !!commenters.length;

  // const menuOptions = {
  //   'reject': {status: 'REJECTED', icon: 'close', key: 'r'},
  //   'approve': {status: 'ACCEPTED', icon: 'done', key: 't'},
  //   'ban': {status: 'BANNED', icon: 'not interested'}
  // };
  //
  //
  // onClickAction={this.onClickAction}
  // onClickShowBanDialog={this.onClickShowBanDialog}
  // acceptCommenter={props.acceptCommenter}
  // rejectCommenter={props.rejectCommenter}
  // menuOptions={menuOptions}

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
              showBanUserDialog={props.showBanUserDialog}/>;
          })
          : <EmptyCard>{lang.t('community.no-flagged-accounts')}</EmptyCard>
        }
      </div>
    </div>
  );
};

export default FlaggedAccounts;
