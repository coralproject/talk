import React from 'react';
import PropTypes from 'prop-types';
import Slot from 'coral-framework/components/Slot';
import CommentHistory from '../containers/CommentHistory';

import t from 'coral-framework/services/i18n';

const Profile = ({ username, emailAddress, data, root }) => (
  <div className="talk-my-profile talk-embed-stream-profile-container">
    <h2>{username}</h2>
    {emailAddress ? <p>{emailAddress}</p> : null}
    <Slot fill="profileSections" data={data} queryData={{ root }} />
    <hr />
    <h3>{t('framework.my_comments')}</h3>
    <CommentHistory data={data} root={root} />
  </div>
);

Profile.propTypes = {
  username: PropTypes.string,
  emailAddress: PropTypes.string,
  data: PropTypes.object,
  root: PropTypes.object,
};

export default Profile;
