import React from 'react';
import {Button, Checkbox, TextField} from 'coral-ui';

import styles from './ConfigureCommentStream.css';

import I18n from 'coral-i18n/modules/i18n/i18n';
const lang = new I18n();

export default ({handleChange, handleApply, changed, ...props}) => (
  <form onSubmit={handleApply}>
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h3>{lang.t('configure.title')}</h3>
        <p>{lang.t('configure.description')}</p>
        <Button
          type="submit"
          className={styles.apply}
          onChange={handleChange}
          cStyle={changed ? 'green' : 'darkGrey'} >
          {lang.t('configure.apply')}
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
              title: lang.t('configure.enablePremod'),
              description: lang.t('configure.enablePremodDescription')
            }} />
        </li>
        <li>
          <Checkbox
            className={styles.checkbox}
            cStyle={changed ? 'green' : 'darkGrey'}
            name="plinksenable"
            onChange={handleChange}
            defaultChecked={props.premodLinksEnable}
            info={{
              title: lang.t('configure.enablePremodLinks'),
              description: lang.t('configure.enablePremodLinksDescription')
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
              title: lang.t('configure.enableQuestionBox'),
              description: lang.t('configure.enableQuestionBoxDescription')
            }} />
          <div className={`${props.questionBoxEnable ? null : styles.hidden}`} >
            <TextField
              id="qboxcontent"
              onChange={handleChange}
              rows={3}
              value={props.questionBoxContent}
              label={lang.t('configure.includeQuestionHere')}
            />
          </div>
        </li>

      </ul>
    </div>
  </form>
);
