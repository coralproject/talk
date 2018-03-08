import React from 'react';
import PropTypes from 'prop-types';
import TagsInput from 'coral-admin/src/components/TagsInput';
import t from 'coral-framework/services/i18n';
import ConfigureCard from 'coral-framework/components/ConfigureCard';

const Domainlist = ({ domains, onChangeDomainlist }) => {
  return (
    <ConfigureCard title={t('configure.domain_list_title')}>
      <p>{t('configure.domain_list_text')}</p>
      <TagsInput
        value={domains}
        inputProps={{ placeholder: 'URL' }}
        onChange={tags => onChangeDomainlist('whitelist', tags)}
      />
    </ConfigureCard>
  );
};

Domainlist.propTypes = {
  domains: PropTypes.array.isRequired,
  onChangeDomainlist: PropTypes.func.isRequired,
};

export default Domainlist;
