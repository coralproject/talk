import React from 'react';
import I18n from 'coral-i18n/modules/i18n/i18n';
import translations from 'coral-admin/src/translations.json';

import styles from './Community.css';
import Table from './Table';
import {Pager, Icon} from 'coral-ui';
import EmptyCard from '../../components/EmptyCard';

const lang = new I18n(translations);

const tableHeaders = [
  {
    title: lang.t('community.username_and_email'),
    field: 'username'
  },
  {
    title: lang.t('community.account_creation_date'),
    field: 'created_at'
  },
  {
    title: lang.t('community.status'),
    field: 'status'
  },
  {
    title: lang.t('community.newsroom_role'),
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
            placeholder={lang.t('streams.search')}
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
          : <EmptyCard>{lang.t('community.no-results')}</EmptyCard>
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
