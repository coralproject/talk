import React from 'react';
import {Button, Checkbox} from 'coral-ui';
import QuestionBoxBuilder from './QuestionBoxBuilder';
import cn from 'classnames';

import styles from './ConfigureCommentStream.css';

import t from 'coral-framework/services/i18n';

export default ({handleChange, handleApply, changed, ...props}) => (
  <form onSubmit={handleApply}>
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h3>{t('configure.title')}</h3>
        <Button
          type="submit"
          className={cn(styles.apply, 'talk-embed-stream-configuration-submit-button')}
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
          {
            props.questionBoxEnable && <QuestionBoxBuilder
              questionBoxIcon={props.questionBoxIcon}
              questionBoxContent={props.questionBoxContent}
              handleChange={handleChange}
            />
          }
        </li>
      </ul>
    </div>
  </form>
);
