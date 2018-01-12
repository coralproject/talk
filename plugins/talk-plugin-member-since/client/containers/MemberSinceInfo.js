import React from 'react';
import MemberSinceInfo from '../components/MemberSinceInfo';
import { compose, gql } from 'react-apollo';
import { withFragments } from 'plugin-api/beta/client/hocs';

class MemberSinceInfoContainer extends React.Component {
  render() {
    return (
      <MemberSinceInfo memberSinceDate={this.props.comment.user.created_at} />
    );
  }
}

const withMemberSinceInfoFragments = withFragments({
  comment: gql`
    fragment TalkMemberSince_MemberSinceInfo_comment on Comment {
      user {
        username
        created_at
      }
    }
  `,
});

const enhance = compose(withMemberSinceInfoFragments);

export default enhance(MemberSinceInfoContainer);
