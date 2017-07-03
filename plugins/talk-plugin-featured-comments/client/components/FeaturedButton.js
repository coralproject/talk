import React from 'react';
import withTags from './withTags';
import styles from './styles.css';
import cn from 'classnames';
import {t} from 'plugin-api/beta/client/services';
import {name} from '../../package.json';
import {Icon} from 'plugin-api/beta/client/components/ui';

const FeaturedButton = (props) => {
  const {alreadyTagged, deleteTag, postTag} = props;

  return (
    <button 
      className={cn([name, styles.button, {[styles.featured] : alreadyTagged}])}
      onClick={alreadyTagged ? deleteTag : postTag} >

      {alreadyTagged ? (
        <span>
          {t('featured')} <Icon name="label" />
        </span>
      ) : (
        <span>
          {t('feature')} <Icon name="label_outline" />
        </span>
      )}

    </button>
  );
};

export default withTags('featured')(FeaturedButton); 

