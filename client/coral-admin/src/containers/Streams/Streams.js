import React, {Component} from 'react';
import styles from './Streams.css';
import {connect} from 'react-redux';
import I18n from 'coral-framework/modules/i18n/i18n';
import {fetchAssets, updateAssetState} from '../../actions/assets';
import translations from '../../translations.json';
import {
  RadioGroup,
  Radio,
  Icon,
  DataTable,
  TableHeader
} from 'react-mdl';
import Pager from 'coral-ui/components/Pager';

const limit = 25;

class Streams extends Component {

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
    this.setState({search: e.target.value});
    this.setState((prevState) => {
      clearTimeout(prevState.timer);
      const fetchAssets = this.props.fetchAssets;
      prevState.timer = setTimeout(() => {
        fetchAssets(0, limit, this.state.search, this.state.sort, this.state.filter);
      }, 350);
      return prevState;
    });
  }

  renderDate = (date) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  }

  onStatusClick = (closeStream, id, statusMenuOpen) => () => {
    if (statusMenuOpen) {
      this.setState(prev => {
        prev.statusMenus[id] = false;
        return prev;
      });
      this.props.updateAssetState(id, closeStream ? Date.now() : null)
        .then(() => {
          const {search, sort, filter, page} = this.state;
          this.props.fetchAssets(page, limit, search, sort, filter);
        });
    } else {
      this.setState(prev => {
        prev.statusMenus[id] = true;
        return prev;
      });
    }
  }

  renderStatus = (closedAt, {id}) => {
    const closed = closedAt && new Date(closedAt).getTime() < Date.now();
    const statusMenuOpen = this.state.statusMenus[id];
    return <div className={styles.statusMenu}>
      <div
        className={closed ? styles.statusMenuClosed : styles.statusMenuOpen}
        onClick={this.onStatusClick(closed, id, statusMenuOpen)}>
        {closed ? lang.t('streams.closed') : lang.t('streams.open')}
        {!statusMenuOpen && <Icon className={styles.statusMenuIcon} name='keyboard_arrow_down'/>}
      </div>
      {
        statusMenuOpen &&
        <div
          className={!closed ? styles.statusMenuClosed : styles.statusMenuOpen}
          onClick={this.onStatusClick(!closed, id, statusMenuOpen)}>
          {!closed ? lang.t('streams.closed') : lang.t('streams.open')}
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

    console.log(assets);

    return <div className={styles.container}>
      <div className={styles.leftColumn}>

        <div className={styles.searchBox}>
          <Icon name='search' className={styles.searchIcon}/>
          <input
            type='text'
            value={search}
            className={styles.searchBoxInput}
            onChange={this.onSearchChange}
            placeholder={lang.t('streams.search')}/>
        </div>

        <div className={styles.optionHeader}>{lang.t('streams.filter-streams')}</div>
        <div className={styles.optionDetail}>{lang.t('streams.stream-status')}</div>
          <RadioGroup
            name='status filter'
            value={filter}
            childContainer='div'
            onChange={this.onSettingChange('filter')}>
            <Radio value='all'>{lang.t('streams.all')}</Radio>
            <Radio value='open'>{lang.t('streams.open')}</Radio>
            <Radio value='closed'>{lang.t('streams.closed')}</Radio>
          </RadioGroup>
          <div className={styles.optionHeader}>{lang.t('streams.sort-by')}</div>
          <RadioGroup
            name='sort by'
            value={sort}
            childContainer='div'
            onChange={this.onSettingChange('sort')}>
            <Radio value='desc'>{lang.t('streams.newest')}</Radio>
            <Radio value='asc'>{lang.t('streams.oldest')}</Radio>
          </RadioGroup>
      </div>

      <div className={styles.mainContent}>
      <DataTable
        className={styles.streamsTable}
        rows={assets.ids.map((id) => assets.byId[id])}>
        <TableHeader name="title">{lang.t('streams.article')}</TableHeader>
        <TableHeader numeric name="publication_date" cellFormatter={this.renderDate}>
          {lang.t('streams.pubdate')}
        </TableHeader>
        <TableHeader numeric name="closedAt" cellFormatter={this.renderStatus}>
          {lang.t('streams.status')}
        </TableHeader>
      </DataTable>
      <Pager
        totalPages={Math.ceil((assets.count || 0) / limit)}
        page={this.state.page}
        onNewPageHandler={this.onPageClick}
      />
      </div>
    </div>;
  }
}

const mapStateToProps = ({assets}) => {
  return {
    assets: assets.toJS()
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    fetchAssets: (...args) => {
      dispatch(fetchAssets.apply(this, args));
    },
    updateAssetState: (...args) => dispatch(updateAssetState.apply(this, args))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Streams);

const lang = new I18n(translations);
