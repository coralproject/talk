import React from 'react';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-admin/src/translations.json';

import styles from './Community.css';
import Table from './Table';
import Loading from './Loading';
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

const People = ({isFetching, commenters, searchValue, onSearchChange, ...props}) => {
  const hasResults = !isFetching && !!commenters.length;
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
        { isFetching && (searchValue === null) && <Loading /> }
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
