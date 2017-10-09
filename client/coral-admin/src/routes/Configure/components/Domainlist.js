import React from 'react';
import PropTypes from 'prop-types';
import {Card} from 'coral-ui';
import styles from './Domainlist.css';
import TagsInput from 'coral-admin/src/components/TagsInput';
import t from 'coral-framework/services/i18n';

const Domainlist = ({domains, onChangeDomainlist}) => {
  return (
    <Card className={styles.card}>
      <div className={styles.wrapper}>
        <div className={styles.header}>{t('configure.domain_list_title')}</div>
        <p>{t('configure.domain_list_text')}</p>
        <div className={styles.wrapper}>
          <TagsInput
            value={domains}
            inputProps={{placeholder: 'URL'}}
            onChange={(tags) => onChangeDomainlist('whitelist', tags)}
          />
        </div>
      </div>
    </Card>
  );
};

Domainlist.propTypes = {
  domains: PropTypes.array.isRequired,
  onChangeDomainlist: PropTypes.func.isRequired,
};

export default Domainlist;
