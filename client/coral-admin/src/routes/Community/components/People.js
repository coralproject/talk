import React from 'react';
import styles from './styles.css';
import Table from './Table';
import {Paginate, Icon} from 'coral-ui';
import EmptyCard from '../../../components/EmptyCard';
import t from 'coral-framework/services/i18n';

import PropTypes from 'prop-types';

const People = (props) => {
  const {
    users = [],
    searchValue,
    onSearchChange,
    onHeaderClickHandler,
    onNewPageHandler,
    totalPages,
  } = props;

  const hasResults = !!users.length;

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
              users={users}
              onHeaderClickHandler={onHeaderClickHandler}
            />
            : <EmptyCard>{t('community.no_results')}</EmptyCard>
        }

        <Paginate
          pageCount={totalPages}
          onPageChange={onNewPageHandler}
        />
      </div>
    </div>
  );
};

People.propTypes = {
  onHeaderClickHandler: PropTypes.func,
  users: PropTypes.array,
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func,
  totalPages: PropTypes.number,
  onNewPageHandler: PropTypes.func,
};

export default People;
