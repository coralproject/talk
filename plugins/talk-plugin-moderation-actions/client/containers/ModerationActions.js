import {gql, compose} from 'react-apollo';
import {can} from 'plugin-api/beta/client/services';
import ModerationActions from '../components/ModerationActions';
import {connect, excludeIf, withFragments} from 'plugin-api/beta/client/hocs';

const mapStateToProps = ({auth}) => ({
  user: auth.user
});

const enhance = compose(
  connect(mapStateToProps),
  withFragments({
    asset: gql`
      fragment TalkModerationActions_asset on Asset {
        id
      }`
    ,
    comment: gql`
      fragment TalkModerationActions_comment on Comment {
        id
        status
        tags {
          tag {
            name
          }
        }
      }
  `}),
  excludeIf((props) => !can(props.user, 'MODERATE_COMMENTS')),
);

export default enhance(ModerationActions);
