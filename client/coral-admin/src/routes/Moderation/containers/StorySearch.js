import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose, gql} from 'react-apollo';
import StorySearch from '../components/StorySearch';
import withQuery from 'coral-framework/hocs/withQuery';
import {storySearchChange} from 'coral-admin/src/actions/moderation';

class StorySearchContainer extends React.Component {
  searchChange = (e) => {
    this.props.storySearchChange(e.target.value);
    this.props.data.refetch();
  }

  componentDidUpdate (prevProps) {
    if (prevProps.moderation.storySearchString !== this.props.moderation.storySearchString) {
      this.props.data.refetch();
    }
  }

  render () {
    return <StorySearch searchChange={this.searchChange} {...this.props} />;
  }
}

export const withAssetSearchQuery = withQuery(gql`
  query SearchStories($value: String = "") {
    assets(query: {value: $value}) {
      id
      title
      url
      created_at
      closedAt
      author
    }
  }
`, {
  options: ({moderation: {storySearchString = ''}}) => {
    return {
      variables: {
        value: storySearchString
      }
    };
  }
});

const mapStateToProps = (state) => ({
  moderation: state.moderation.toJS()
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    storySearchChange
  }, dispatch)
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withAssetSearchQuery
)(StorySearchContainer);
