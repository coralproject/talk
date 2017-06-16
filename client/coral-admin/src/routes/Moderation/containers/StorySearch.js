import React from 'react';
import {compose, gql} from 'react-apollo';
import StorySearch from '../components/StorySearch';
import {withRouter} from 'react-router';
import withQuery from 'coral-framework/hocs/withQuery';

class StorySearchContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchValue: props.moderation.storySearchString
    };
  }

  handleSearchChange = (e) => {
    const {value} = e.target;
    this.setState({
      searchValue: value
    });
  }

  handleEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.search();
    }
  }

  search = () => {
    const {searchValue} = this.state;
    this.props.storySearchChange(searchValue);
  }

  goToStory = (id) => {
    const {router, closeSearch} = this.props;
    router.push(`/admin/moderate/${id}`);
    closeSearch();
  }

  render () {
    return (
      <StorySearch
        search={this.search}
        goToStory={this.goToStory}
        handleEnter={this.handleEnter}
        searchValue={this.state.searchValue}
        handleSearchChange={this.handleSearchChange}
        {...this.props}
      />
    );
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

export default compose(
  withRouter,
  withAssetSearchQuery
)(StorySearchContainer);
