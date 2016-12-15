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
    return `${d.getMonth()}/${d.getDate()}/${d.getYear()}`;
  }

  renderStatus = (status) => {
    return <div>{status}</div>;
  }

  render () {
    const {searchTerm, sortBy, statusFilter} = this.state;

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
        rows={[
            {article: 'Acrylic (Transparent)', pubdate: 25, status: 2.90},
            {article: 'Plywood (Birch)', pubdate: 50, status: 1.25},
            {article: 'Laminate (Gold on Blue)', pubdate: 10, status: 2.35}
        ]}
      >
        <TableHeader name="article">{lang.t('streams.article')}</TableHeader>
        <TableHeader name="pubdate" cellFormatter={this.renderDate}>
          {lang.t('streams.pubdate')}
        </TableHeader>
        <TableHeader name="status" cellFormatter={this.renderStatus}>
          {lang.t('streams.status')}
        </TableHeader>
      </DataTable>
      </div>
    </div>;
  }
}

const mapStateToProps = () => {};
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
