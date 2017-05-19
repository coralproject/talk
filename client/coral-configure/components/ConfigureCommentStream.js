import React from 'react';
import {Button, Checkbox, TextField} from 'coral-ui';

import styles from './ConfigureCommentStream.css';

import t from 'coral-framework/services/i18n';

export default ({handleChange, handleApply, changed, ...props}) => (
  <form onSubmit={handleApply}>
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h3>{t('configure.title')}</h3>
        <Button
          type="submit"
          className={styles.apply}
          onChange={handleChange}
          cStyle={changed ? 'green' : 'darkGrey'} >
          {t('configure.apply')}
        </Button>
        <p>{t('configure.description')}</p>
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
              title: t('configure.enable_premod'),
              description: t('configure.enable_premod_description')
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
              title: t('configure.enable_premod_links'),
              description: t('configure.enable_premod_links_description')
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
              title: t('configure.enable_questionbox'),
              description: t('configure.enable_questionbox_description')
            }} />
          <div className={`${props.questionBoxEnable ? null : styles.hidden}`} >
            <TextField
              id="qboxcontent"
              onChange={handleChange}
              rows={3}
              value={props.questionBoxContent}
              label={t('configure.include_question_here')}
            />
          </div>
        </li>

      </ul>
    </div>
  </form>
);
