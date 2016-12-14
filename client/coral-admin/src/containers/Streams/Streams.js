import React from 'react';
import styles from './Streams.css';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../../translations.json';
import {
  RadioGroup,
  Radio,
  Icon
} from 'react-mdl';

const Streams = () => <div className={styles.container}>
  <div className={styles.leftColumn}>
  <div className={styles.searchBox}>
    <Icon name='search' className={styles.searchIcon}/>
    <input
      type='text'
      className={styles.searchBoxInput}
      onChange={() => {}}
      placeholder={lang.t('streams.search')}/>
  </div>
  <div className={styles.optionHeader}>{lang.t('streams.filter-streams')}</div>
  <div className={styles.optionDetail}>{lang.t('streams.stream-status')}</div>
  <RadioGroup name='status' value='all' childContainer={<div/>}>
    <Radio value='all'>{lang.t('streams.all')}</Radio>
    <Radio value='open'>{lang.t('streams.open')}</Radio>
    <Radio value='closed'>{lang.t('streams.closed')}</Radio>
  </RadioGroup>
  <div className={styles.optionHeader}>{lang.t('streams.sort-by')}</div>
  <RadioGroup name='sortBy' value='newest'>
    <Radio value='newest'>{lang.t('streams.newest')}</Radio>
    <Radio value='oldest'>{lang.t('streams.oldest')}</Radio>
  </RadioGroup>
  </div>
  <div className={styles.mainContent}>
  </div>
</div>;

export default Streams;

const lang = new I18n(translations);
