import {compose, gql, graphql} from 'react-apollo';
import LoveIcon from '../components/LoveIcon';

export const LOVE_QUERY = gql`
  query LoveQuery {
    me {
      status
      roles
    }
  }
`;

const withQuery = graphql(LOVE_QUERY);

const enhance = compose(
  withQuery,
);

export default enhance(LoveIcon);
