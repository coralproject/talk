import React from 'react';
import { compose, gql } from 'react-apollo';
import StorySearch from '../components/StorySearch';
import { withRouter } from 'react-router';
import withQuery from 'coral-framework/hocs/withQuery';
import isEmpty from 'lodash/isEmpty';

class StorySearchContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchValue: props.moderation.storySearchString,
    };
  }

  componentWillUnmount() {
    this.props.storySearchChange('');
  }

  clearSearch = () => {
    this.setState({ searchValue: '' }, () => {
      this.search();
    });
  };

  clearAndCloseSearch = () => {
    if (!isEmpty(this.state.searchValue)) {
      this.clearSearch();
    }
    this.props.closeSearch();
  };

  handleSearchChange = e => {
    const { value } = e.target;
    this.setState({
      searchValue: value,
    });
  };

  handleEsc = e => {
    if (e.key === 'Escape') {
      e.preventDefault();
      this.clearAndCloseSearch();
    }
  };

  handleEnter = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      this.search();
    }
  };

  search = () => {
    const { searchValue } = this.state;
    this.props.storySearchChange(searchValue);
  };

  goToStory = id => {
    const { router } = this.props;
    router.push(`/admin/moderate/${id}`);
    this.clearAndCloseSearch();
  };

  goToModerateAll = () => {
    const { router } = this.props;
    router.push('/admin/moderate');
    this.clearAndCloseSearch();
  };

  render() {
    return (
      <StorySearch
        search={this.search}
        goToStory={this.goToStory}
        goToModerateAll={this.goToModerateAll}
        handleEsc={this.handleEsc}
        handleEnter={this.handleEnter}
        searchValue={this.state.searchValue}
        handleSearchChange={this.handleSearchChange}
        clearAndCloseSearch={this.clearAndCloseSearch}
        {...this.props}
      />
    );
  }
}

export const withAssetSearchQuery = withQuery(
  gql`
    query SearchStories($value: String = "") {
      assets(query: { value: $value, limit: 10 }) {
        nodes {
          id
          title
          url
          created_at
          closedAt
          author
        }
      }
    }
  `,
  {
    options: ({ moderation: { storySearchString = '' } }) => {
      return {
        variables: {
          value: storySearchString,
        },
      };
    },
  }
);

export default compose(withRouter, withAssetSearchQuery)(StorySearchContainer);
