import React, {Component} from 'react';
import cn from 'classnames';
import {Link} from 'react-router';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import {Dropdown, Option, Paginate, Icon} from 'coral-ui';
import {DataTable, TableHeader, RadioGroup, Radio} from 'react-mdl';
import t from 'coral-framework/services/i18n';
import styles from './Stories.css';
import EmptyCard from 'coral-admin/src/components/EmptyCard';

class Stories extends Component {

  state = {
    searchValue: '',
    sort: 'desc',
    filter: 'all',
    statusMenus: {},
    timer: null,
  }

  componentDidMount () {
    this.fetchAssets();
  }

  onSettingChange = (setting) => (e) => {
    const {searchValue} = this.state;
    const criteria = {[setting]: e.target.value};

    this.setState(criteria);

    this.props.fetchAssets({
      value: searchValue,
      ...criteria,
    });
  }

  onSearchChange = (e) => {
    const {value} = e.target;

    this.setState((prevState) => {
      prevState.searchValue = value;
      clearTimeout(prevState.timer);

      prevState.timer = setTimeout(() => {
        this.fetchAssets();
      }, 350);
      return prevState;
    });
  }

  renderDate = (date) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  }

  fetchAssets = (query) => {
    const {searchValue, sort, filter, limit} = this.state;

    this.props.fetchAssets({
      value: searchValue,
      sort,
      filter,
      limit,
      ...query
    });
  };

  onStatusChange = async (closeStream, id) => {
    const {updateAssetState} = this.props;

    try {
      updateAssetState(id, closeStream ? Date.now() : null);
      this.fetchAssets();
    } catch(err) {
      console.error(err);
    }
  }

  renderTitle = (title, {id}) =>  <Link to={`/admin/moderate/${id}`}>{title}</Link>

  renderStatus = (closedAt, {id}) => {
    const closed = !!(closedAt && new Date(closedAt).getTime() < Date.now());
    return (
      <Dropdown
        value={closed}
        onChange={(value) => this.onStatusChange(value, id)}>
        <Option value={false} label={t('streams.open')} />
        <Option value={true} label={t('streams.closed')} />
      </Dropdown>
    );
  }

  onPageChange = ({selected}) => {
    const page = selected + 1;
    this.props.setPage(page);
    this.props.fetchAssets({page});
  }

  render () {
    const {searchValue, sort, filter} = this.state;
    const {assets} = this.props;

    const assetsIds = sortBy(assets.ids.map((id) => assets.byId[id]), 'publication_date');

    if (this.state.sort === 'desc') {
      assetsIds.reverse();
    }

    return (
      <div className={cn('talk-admin-stories', styles.container)}>
        <div className={styles.leftColumn}>
          <div className={styles.searchBox}>
            <Icon name='search' className={styles.searchIcon}/>
            <input
              type='text'
              value={searchValue}
              className={styles.searchBoxInput}
              onChange={this.onSearchChange}
              placeholder={t('streams.search')}/>
          </div>
          <div className={styles.optionHeader}>{t('streams.filter_streams')}</div>
          <div className={styles.optionDetail}>{t('streams.stream_status')}</div>
          <RadioGroup
            name='status filter'
            value={filter}
            childContainer='div'
            onChange={this.onSettingChange('filter')}
            className={styles.radioGroup}
          >
            <Radio value='all'>{t('streams.all')}</Radio>
            <Radio value='open'>{t('streams.open')}</Radio>
            <Radio value='closed'>{t('streams.closed')}</Radio>
          </RadioGroup>
          <div className={styles.optionHeader}>{t('streams.sort_by')}</div>
          <RadioGroup
            name='sort by'
            value={sort}
            childContainer='div'
            onChange={this.onSettingChange('sort')}
            className={styles.radioGroup}
          >
            <Radio value='desc'>{t('streams.newest')}</Radio>
            <Radio value='asc'>{t('streams.oldest')}</Radio>
          </RadioGroup>
        </div>
        {
          assetsIds.length
            ? <div className={styles.mainContent}>
              <DataTable className={styles.streamsTable} rows={assetsIds} onClick={this.goToModeration}>
                <TableHeader name="title" cellFormatter={this.renderTitle}>{t('streams.article')}</TableHeader>
                <TableHeader name="publication_date" cellFormatter={this.renderDate}>
                  {t('streams.pubdate')}
                </TableHeader>
                <TableHeader name="closedAt" cellFormatter={this.renderStatus} className={styles.status}>
                  {t('streams.status')}
                </TableHeader>
              </DataTable>
              <Paginate
                pageCount={assets.totalPages}
                page={assets.page - 1}
                onPageChange={this.onPageChange} />
            </div>
            : <EmptyCard>{t('streams.empty_result')}</EmptyCard>
        }
      </div>
    );
  }
}

Stories.propTypes = {
  assets: PropTypes.object,
  setPage: PropTypes.func,
  fetchAssets: PropTypes.func,
  updateAssetState: PropTypes.func,
};

export default Stories;

