import React from 'react';

import styles from './styles.css';
import Table from '../containers/Table';
import {Pager, Icon} from 'coral-ui';
import EmptyCard from '../../../components/EmptyCard';
import t from 'coral-framework/services/i18n';

const tableHeaders = [
  {
    title: t('community.username_and_email'),
    field: 'username'
  },
  {
    title: t('community.account_creation_date'),
    field: 'created_at'
  },
  {
    title: t('community.status'),
    field: 'status'
  },
  {
    title: t('community.newsroom_role'),
    field: 'role'
  }
];

const People = ({commenters, searchValue, onSearchChange, ...props}) => {
  const hasResults = !!commenters.length;
  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <div className={styles.searchBox}>
          <Icon name='search' className={styles.searchIcon}/>
          <input
            id="commenters-search"
            type="text"
            className={styles.searchBoxInput}
            value={searchValue}
            onChange={onSearchChange}
            placeholder={t('streams.search')}
          />
        </div>
      </div>
      <div className={styles.mainContent}>
        {
          hasResults
            ? <Table
              headers={tableHeaders}
              commenters={commenters}
              onHeaderClickHandler={props.onHeaderClickHandler}
            />
            : <EmptyCard>{t('community.no_results')}</EmptyCard>
        }
        <Pager
          totalPages={props.totalPages}
          page={props.page}
          onNewPageHandler={props.onNewPageHandler}
        />
      </div>
    </div>
  );
};

export default People;
