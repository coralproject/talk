import React from 'react';
import {compose} from 'react-apollo';
import {mostLikedComments} from 'coral-admin/src/graphql/queries';

// import I18n from 'coral-framework/modules/i18n/i18n';
// import translations from 'coral-admin/src/translations';

import ModerationQueue from 'coral-admin/src/containers/ModerationQueue/ModerationQueue';
import {Spinner} from 'coral-ui';
import styles from './Widget.css';

// const lang = new I18n(translations);

const MostLikedCommentsWidget = props => {

  if (props.data.loading) {
    return <Spinner />;
  }

  const {data: {comments}} = props;

  console.log('MostLikedCommentsWidget', comments);

  return (
    <div className={styles.widget}>
      <h2 className={styles.heading}>most liked comments</h2>
      <ModerationQueue
        comments={comments}
        suspectWords={[]}
        showBanUserDialog={() => {}}
        acceptComment={() => {}}
        rejectComment={() => {}} />
    </div>
  );
};

export default compose(mostLikedComments)(MostLikedCommentsWidget);
