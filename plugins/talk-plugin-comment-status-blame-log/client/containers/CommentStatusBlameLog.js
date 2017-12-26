import {compose, gql} from 'react-apollo';
import CommentStatusBlameLog from '../components/CommentStatusBlameLog';
import withQuery from 'coral-framework/hocs/withQuery';
import {withFragments, excludeIf} from 'plugin-api/beta/client/hocs';

export default compose(
  withQuery(gql`
    query CoralAdmin_StatusBlameLog_comment($id: ID = "") {
      comment(id: $id) {
        status_history {
          type
          created_at
          assigned_by {
            username
          }
        }
      }
    }
    `, {
    options: ({comment: {id = ''}}) => ({
      variables: {
        id
      }
    })
  }),
  excludeIf(({comment: {status_history = []}} = {}) =>
    status_history.filter((status) => status.type !== 'PREMOD').length === 0
  )
)(CommentStatusBlameLog);
