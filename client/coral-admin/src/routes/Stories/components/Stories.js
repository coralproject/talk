import React, { Component } from 'react';
import cn from 'classnames';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { Dropdown, Option, Paginate, Icon } from 'coral-ui';
import { DataTable, TableHeader, RadioGroup, Radio } from 'react-mdl';
import t from 'coral-framework/services/i18n';
import styles from './Stories.css';
import EmptyCard from 'coral-admin/src/components/EmptyCard';

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
      onPageChange,
      asc,
    } = this.props;
    const rows = assets.ids.map(id => assets.byId[id]);

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
          <div className={styles.optionHeader}>{t('streams.sort_by')}</div>
          <RadioGroup
            name="sortBy"
            value={asc}
            childContainer="div"
            onChange={onSettingChange('asc')}
            className={styles.radioGroup}
          >
            <Radio value="false">{t('streams.newest')}</Radio>
            <Radio value="true">{t('streams.oldest')}</Radio>
          </RadioGroup>
        </div>
        {rows.length ? (
          <div className={styles.mainContent}>
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
            <Paginate
              pageCount={assets.totalPages}
              page={assets.page - 1}
              onPageChange={onPageChange}
            />
          </div>
        ) : (
          <EmptyCard>{t('streams.empty_result')}</EmptyCard>
        )}
      </div>
    );
  }
}

Stories.propTypes = {
  assets: PropTypes.object,
  searchValue: PropTypes.string,
  asc: PropTypes.string,
  filter: PropTypes.string,
  onStatusChange: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onSettingChange: PropTypes.func.isRequired,
};

export default Stories;
