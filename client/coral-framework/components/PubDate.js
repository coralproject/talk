import React from 'react';
import PropTypes from 'prop-types';
import {timeago} from 'coral-framework/services/i18n';

const name = 'talk-plugin-pubdate';

const PubDate = ({created_at}) => <div className={`${name}-text`}>
  {timeago(created_at)}
</div>;

PubDate.propTypes = {
  created_at: PropTypes.string,
};

export default PubDate;
