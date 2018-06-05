import ModTag from '../components/ModTag';
import { withTags, connect } from 'plugin-api/beta/client/hocs';
import { gql, compose } from 'react-apollo';
import { bindActionCreators } from 'redux';
import { openFeaturedDialog } from '../actions';

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
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
  connect(
    null,
    mapDispatchToProps
  ),
  withTags('featured', { fragments })
);

export default enhance(ModTag);
