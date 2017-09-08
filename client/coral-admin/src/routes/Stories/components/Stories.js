import React, {Component} from 'react';
import styles from './Stories.css';
import t from 'coral-framework/services/i18n';
import {Link} from 'react-router';

import {Pager, Icon} from 'coral-ui';
import {DataTable, TableHeader, RadioGroup, Radio} from 'react-mdl';
import EmptyCard from 'coral-admin/src/components/EmptyCard';
import sortBy from 'lodash/sortBy';

const limit = 25;

export default class Stories extends Component {

  state = {
    search: '',
    sort: 'desc',
    filter: 'all',
    statusMenus: {},
    timer: null,
    page: 0
  }

  componentDidMount () {
    this.props.fetchAssets(0, limit, '', this.state.sortBy);
  }

  onSettingChange = (setting) => (e) => {
    let options = this.state;
    this.setState({[setting]: e.target.value});
    options[setting] = e.target.value;
    this.props.fetchAssets(0, limit, options.search, options.sort, options.filter);
  }

  onSearchChange = (e) => {
    const search = e.target.value;
    this.setState((prevState) => {
      prevState.search = search;
      clearTimeout(prevState.timer);
      const fetchAssets = this.props.fetchAssets;
      prevState.timer = setTimeout(() => {
        fetchAssets(0, limit, search, this.state.sort, this.state.filter);
      }, 350);
      return prevState;
    });
  }

  renderDate = (date) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  }

  onStatusClick = (closeStream, id, statusMenuOpen) => async () => {
    if (statusMenuOpen) {
      this.setState((prev) => {
        prev.statusMenus[id] = false;
        return prev;
      });

      try {
        await this.props.updateAssetState(id, closeStream ? Date.now() : null);
        const {search, sort, filter, page} = this.state;
        this.props.fetchAssets(page, limit, search, sort, filter);
      } catch (err) {

        // TODO: handle error.
        console.error(err);
      }
    } else {
      this.setState((prev) => {
        prev.statusMenus[id] = true;
        return prev;
      });
    }
  }

  renderTitle = (title, {id}) =>  <Link to={`/admin/moderate/${id}`}>{title}</Link>

  renderStatus = (closedAt, {id}) => {
    const closed = closedAt && new Date(closedAt).getTime() < Date.now();
    const statusMenuOpen = this.state.statusMenus[id];
    return <div className={styles.statusMenu}>
      <div
        className={closed ? styles.statusMenuClosed : styles.statusMenuOpen}
        onClick={this.onStatusClick(closed, id, statusMenuOpen)}>
        {!statusMenuOpen && <Icon className={styles.statusMenuIcon} name='keyboard_arrow_down'/>}
        {closed ? t('streams.closed') : t('streams.open')}
      </div>
      {
        statusMenuOpen &&
        <div
          className={!closed ? styles.statusMenuClosed : styles.statusMenuOpen}
          onClick={this.onStatusClick(!closed, id, statusMenuOpen)}>
          {!closed ? t('streams.closed') : t('streams.open')}
        </div>
      }
    </div>;
  }

  onPageClick = (page) => {
    this.setState({page});
    const {search, sort, filter} = this.state;
    this.props.fetchAssets((page - 1) * limit, limit, search, sort, filter);
  }

  render () {
    const {search, sort, filter} = this.state;
    const {assets} = this.props;

    const assetsIds = sortBy(assets.ids.map((id) => assets.byId[id]), 'publication_date');

    if (this.state.sort === 'desc') {
      assetsIds.reverse();
    }

    return (
      <div className={styles.container}>
        <div className={styles.leftColumn}>
          <div className={styles.searchBox}>
            <Icon name='search' className={styles.searchIcon}/>
            <input
              type='text'
              value={search}
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
              <Pager
                totalPages={Math.ceil((assets.count || 0) / limit)}
                page={this.state.page}
                onNewPageHandler={this.onPageClick} />
            </div>
            : <EmptyCard>{t('streams.empty_result')}</EmptyCard>
        }
      </div>
    );
  }
}

