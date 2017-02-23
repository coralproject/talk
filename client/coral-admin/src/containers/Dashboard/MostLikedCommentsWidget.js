import React from 'react';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-admin/src/translations';
import ModerationQueue from 'coral-admin/src/containers/ModerationQueue/ModerationQueue';
import {Spinner} from 'coral-ui';
import styles from './Widget.css';
import BanUserDialog from 'coral-admin/src/components/BanUserDialog';

const lang = new I18n(translations);

class MostLikedCommentsWidget extends React.Component {

  render () {
    // console.log('render! loading?', this.props.data.loading);

    // if (this.props.data.loading) {
    //   return <Spinner />;
    // }

    // const {
    //   comments,
    //   moderation,
    //   settings,
    //   showBanUserDialog,
    //   hideBanUserDialog
    // } = this.props;

    // console.log('MostLikedCommentsWidget', comments);

    return (
      <div className={styles.widget}>
        <h2 className={styles.heading}>{lang.t('most_liked_comments')}</h2>
        {/*<ModerationQueue
          comments={comments}
          suspectWords={settings.wordlist.suspect}
          showBanUserDialog={showBanUserDialog}
          acceptComment={() => {}}
          rejectComment={() => {}} />*/}
      </div>
    );
  }
}

export default MostLikedCommentsWidget;
