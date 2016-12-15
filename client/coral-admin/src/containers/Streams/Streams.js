import React, {Component} from 'react';
import styles from './Streams.css';
import {connect} from 'react-redux';
import I18n from 'coral-framework/modules/i18n/i18n';
import {ASSETS_FETCH} from '../../constants/assets';
import translations from '../../translations.json';
import {
  RadioGroup,
  Radio,
  Icon,
  DataTable,
  TableHeader
} from 'react-mdl';

class Streams extends Component {

  state = {
    searchTerm: '',
    sortBy: 'newest',
    statusFilter: 'all'
  }

  componentDidMount () {
    this.props.fetchAssets(0, 25, '', 'desc');
  }

  onSettingChange = (setting) => (e) => {
    this.setState({[setting]: e.target.value});
  }

  renderDate = (date) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  }

  renderStatus = (closedAt) => {
    const status = closedAt && new Date(closedAt) < Date.now ? lang.t('streams.closed') : lang.t('streams.open');
    return <div>{status}</div>;
  }

  render () {
    const {searchTerm, sortBy, statusFilter} = this.state;
    const {assets} = this.props;

    return <div className={styles.container}>
      <div className={styles.leftColumn}>

        <div className={styles.searchBox}>
          <Icon name='search' className={styles.searchIcon}/>
          <input
            type='text'
            value={searchTerm}
            className={styles.searchBoxInput}
            onChange={this.onSettingChange('searchTerm')}
            placeholder={lang.t('streams.search')}/>
        </div>

        <div className={styles.optionHeader}>{lang.t('streams.filter-streams')}</div>
        <div className={styles.optionDetail}>{lang.t('streams.stream-status')}</div>
          <RadioGroup
            name='status filter'
            value={statusFilter}
            childContainer='div'
            onChange={this.onSettingChange('statusFilter')}>
            <Radio value='all'>{lang.t('streams.all')}</Radio>
            <Radio value='open'>{lang.t('streams.open')}</Radio>
            <Radio value='closed'>{lang.t('streams.closed')}</Radio>
          </RadioGroup>
          <div className={styles.optionHeader}>{lang.t('streams.sort-by')}</div>
          <RadioGroup
            name='sort by'
            value={sortBy}
            childContainer='div'
            onChange={this.onSettingChange('sortBy')}>
            <Radio value='newest'>{lang.t('streams.newest')}</Radio>
            <Radio value='oldest'>{lang.t('streams.oldest')}</Radio>
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
    fetchAssets: (skip, limit, search, sort) => {
      dispatch({
        type: ASSETS_FETCH,
        skip,
        limit,
        search,
        sort
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Streams);

const lang = new I18n(translations);
