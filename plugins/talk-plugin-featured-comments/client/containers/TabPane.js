import {compose, gql} from 'react-apollo';
import withFragments from 'coral-framework/hocs/withFragments';
import TabPane from '../components/TabPane';

const enhance = compose(
  withFragments({
    asset: gql`
      fragment TalkFeatured_TabPane_asset on Asset {
        featuredComments: comments(tags: ["FEATURED"]) {
              nodes {
                  id
                  body
                  created_at
                  user {
                    id
                    username
                  }
              }
          }
      }`,
  }),
);

export default enhance(TabPane);
