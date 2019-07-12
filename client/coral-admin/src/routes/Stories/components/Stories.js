import React, { Component } from 'react';
import cn from 'classnames';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { DataTable, TableHeader, RadioGroup, Radio } from 'react-mdl';

import t from 'coral-framework/services/i18n';
import { Dropdown, Option, Icon, Spinner } from 'coral-ui';
import EmptyCard from 'coral-admin/src/components/EmptyCard';
import LoadMore from 'coral-admin/src/components/LoadMore';

import styles from './Stories.css';

class Stories extends Component {
  renderDate = date => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  };

  renderTitle = (title, { id }) => (
    <Link to={`/admin/moderate/${id}`}>{title}</Link>
  );

  renderStatus = (closedAt, { id }) => {
    const closed = !!(closedAt && new Date(closedAt).getTime() < Date.now());
    return (
      <Dropdown
        toggleClassName={styles.statusDropdown}
        value={closed}
        onChange={value => this.props.onStatusChange(value, id)}
      >
        <Option value={false} label={t('streams.open')} />
        <Option value={true} label={t('streams.closed')} />
      </Dropdown>
    );
  };

  render() {
    const {
      assets,
      searchValue,
      filter,
      onSearchChange,
      onSettingChange,
      onLoadMore,
      loading,
      loadingMore,
    } = this.props;
    const rows = assets.edges.map(({ node }) => node);

    return (
      <div className={cn('talk-admin-stories', styles.container)}>
        <div className={styles.leftColumn}>
          <div className={styles.searchBox}>
            <Icon name="search" className={styles.searchIcon} />
            <input
              type="text"
              value={searchValue}
              className={styles.searchBoxInput}
              onChange={onSearchChange}
              placeholder={t('streams.search')}
            />
          </div>
          <div className={styles.optionHeader}>
            {t('streams.filter_streams')}
          </div>
          <div className={styles.optionDetail}>
            {t('streams.stream_status')}
          </div>
          <RadioGroup
            name="statusFilter"
            value={filter}
            childContainer="div"
            onChange={onSettingChange('filter')}
            className={styles.radioGroup}
          >
            <Radio value="all">{t('streams.all')}</Radio>
            <Radio value="open">{t('streams.open')}</Radio>
            <Radio value="closed">{t('streams.closed')}</Radio>
          </RadioGroup>
        </div>
        <div className={styles.mainContent}>
          {loading ? (
            <Spinner />
          ) : rows.length ? (
            <div>
              <DataTable className={styles.streamsTable} rows={rows}>
                <TableHeader name="title" cellFormatter={this.renderTitle}>
                  {t('streams.article')}
                </TableHeader>
                <TableHeader
                  name="publication_date"
                  cellFormatter={this.renderDate}
                >
                  {t('streams.pubdate')}
                </TableHeader>
                <TableHeader
                  name="closedAt"
                  cellFormatter={this.renderStatus}
                  className={styles.status}
                >
                  {t('streams.status')}
                </TableHeader>
              </DataTable>
              {loadingMore ? (
                <Spinner className={styles.loadMoreSpinner} />
              ) : (
                <LoadMore
                  showLoadMore={assets.pageInfo.hasNextPage}
                  loadMore={onLoadMore}
                  className={styles.loadMore}
                />
              )}
            </div>
          ) : (
            <EmptyCard>{t('streams.empty_result')}</EmptyCard>
          )}
        </div>
      </div>
    );
  }
}

Stories.propTypes = {
  loading: PropTypes.bool,
  loadingMore: PropTypes.bool,
  assets: PropTypes.object,
  searchValue: PropTypes.string,
  filter: PropTypes.string,
  onLoadMore: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onSettingChange: PropTypes.func.isRequired,
};

export default Stories;
