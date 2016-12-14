import React, {Component} from 'react';
import styles from './Streams.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../../translations.json';
import {
  RadioGroup,
  Radio,
  Icon
} from 'react-mdl';

class Streams extends Component {

  state = {
    searchTerm: '',
    sortBy: 'newest',
    statusFilter: 'all'
  }

  onSettingChange = (setting) => (e) => {
    this.setState({[setting]: e.target.value});
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
      </div>
    </div>;
  }
}

export default Streams;

const lang = new I18n(translations);
