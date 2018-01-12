import ModTag from '../components/ModTag';
import { withTags, connect } from 'plugin-api/beta/client/hocs';
import { gql, compose } from 'react-apollo';
import { bindActionCreators } from 'redux';
import { openFeaturedDialog } from '../actions';
import { notify } from 'plugin-api/beta/client/actions/notification';

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      notify,
      openFeaturedDialog,
    },
    dispatch
  );

const fragments = {
  comment: gql`
    fragment TalkFeaturedComments_ModTag_comment on Comment {
      user {
        username
      }
    }
  `,
};
const enhance = compose(
  withTags('featured', { fragments }),
  connect(null, mapDispatchToProps)
);

export default enhance(ModTag);
