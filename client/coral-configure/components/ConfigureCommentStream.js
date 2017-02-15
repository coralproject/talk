import React from 'react';
import {Button, Checkbox, TextField} from 'coral-ui';

import styles from './ConfigureCommentStream.css';

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations.json';
const lang = new I18n(translations);

export default ({handleChange, handleApply, changed, updateQuestionBoxContent, ...props}) => (
  <form onSubmit={handleApply}>
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h3>{lang.t('configureCommentStream.title')}</h3>
        <p>{lang.t('configureCommentStream.description')}</p>
        <Button
          type="submit"
          className={styles.apply}
          onChange={handleChange}
          cStyle={changed ? 'green' : 'darkGrey'} >
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
            defaultChecked={props.premod}
            info={{
              title: lang.t('configureCommentStream.enablePremod'),
              description: lang.t('configureCommentStream.enablePremodDescription')
            }} />
        </li>
        <li>
          <Checkbox
            className={styles.checkbox}
            cStyle={changed ? 'green' : 'darkGrey'}
            name="qboxenable"
            onChange={handleChange}
            defaultChecked={props.questionBoxEnable}
            info={{
              title: lang.t('configureCommentStream.enableQuestionBox'),
              description: lang.t('configureCommentStream.enableQuestionBoxDescription')
            }} />

          <div className={`${styles.configSettingQuestionBox} ${props.questionBoxEnable ? null : styles.hidden}`} >
            <TextField
              id="qboxcontent"
              className={`${styles.configSettingQuestionBoxInfo}`}
              onChange={updateQuestionBoxContent}
              rows={3}
              value={props.questionBoxContent}
              label={lang.t('configureCommentStream.includeQuestionHere')}
            />
          </div>
        </li>

      </ul>
    </div>
  </form>
);
