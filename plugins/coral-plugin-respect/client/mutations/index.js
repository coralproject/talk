import {graphql} from 'react-apollo';
import POST_RESPECT from './postRespect.graphql';

export const postRespect = graphql(POST_RESPECT, {
  props: ({mutate}) => ({
    postRespect: (respect) => {
      return mutate({
        variables: {
          respect
        }
      });
    }})
});
