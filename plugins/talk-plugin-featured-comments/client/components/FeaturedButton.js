import React from 'react';
import styles from './styles.css';
import cn from 'classnames';
import {t, can} from 'plugin-api/beta/client/services';
import {name} from '../../package.json';
import {withTags} from 'plugin-api/beta/client/hocs';
import {Icon} from 'plugin-api/beta/client/components/ui';

const FeaturedButton = (props) => {
  const {alreadyTagged, deleteTag, postTag, user} = props;

  return can(user, 'MODERATE_COMMENTS') ? (
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
  ) : null ;
};

export default withTags('featured')(FeaturedButton); 

