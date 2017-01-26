import React from 'react';
import {Button, Checkbox} from 'coral-ui';
import styles from './ConfigureCommentStream.css';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations.json';
const lang = new I18n(translations);

export default ({handleChange, handleApply, changed, ...props}) => (
  <div className={styles.wrapper}>
    <div className={styles.container}>
      <h3>{lang.t('configureCommentStream.title')}</h3>
      <p>{lang.t('configureCommentStream.description')}</p>
      <Button
        className={styles.apply}
        cStyle={changed ? 'green' : 'darkGrey'}
        onClick={handleApply}
      >
        {lang.t('configureCommentStream.apply')}
      </Button>
    </div>
    <ul>
      <li>
        <Checkbox
          className={styles.checkbox}
          cStyle={changed ? 'green' : 'darkGrey'}
          name="premod"
          onChange={handleChange}
          checked={props.premod}
          info={{
            title: lang.t('configureCommentStream.enablePremod'),
            description: lang.t('configureCommentStream.enablePremodDescription')
          }}
        />
        {/* To be implimented
        <ul>
          <li>
            <Checkbox
              className={styles.checkbox}
              cStyle={changed ? 'green' : 'darkGrey'}
              name="premodLinks"
              onChange={handleChange}
              checked={props.premodLinks}
              info={{
                title: lang.t('configureCommentStream.enablePremodLinks'),
                description: lang.t('configureCommentStream.enablePremodDescription')
              }}
            />
          </li>
        </ul>
        */}
      </li>
    </ul>
  </div>
);
