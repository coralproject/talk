import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import {
  fetchAssets,
  updateAssetState,
  setSearchValue,
  setCriteria,
  loadMoreAssets,
} from 'coral-admin/src/actions/stories';
import Stories from '../components/Stories';

class StoriesContainer extends Component {
  timer = null;

  componentDidMount() {
    this.fetchAssets();
  }

  onSearchChange = e => {
    const { value } = e.target;

    this.props.setSearchValue(value);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.fetchAssets();
    }, 350);
  };

  onSettingChange = setting => e => {
    const criteria = { [setting]: e.target.value };
    this.props.setCriteria(criteria);
    this.fetchAssets(criteria);
  };

  fetchAssets = query => {
    const { searchValue: value, filter } = this.props;

    this.props.fetchAssets({
      value,
      filter,
      ...query,
    });
  };

  onStatusChange = async (closeStream, id) => {
    const { updateAssetState } = this.props;

    try {
      await updateAssetState(id, closeStream ? Date.now() : null);
    } catch (err) {
      console.error(err);
    }
  };

  onLoadMore = async () => {
    const {
      searchValue: value,
      filter,
      assets: {
        pageInfo: { endCursor: cursor },
      },
      loadMoreAssets,
    } = this.props;
    try {
      await loadMoreAssets({ cursor, value, filter });
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    return (
      <Stories
        loading={this.props.loading}
        loadingMore={this.props.loadingMore}
        assets={this.props.assets}
        searchValue={this.props.searchValue}
        filter={this.props.filter}
        onStatusChange={this.onStatusChange}
        onSettingChange={this.onSettingChange}
        onSearchChange={this.onSearchChange}
        onLoadMore={this.onLoadMore}
      />
    );
  }
}

const mapStateToProps = ({ stories }) => ({
  assets: stories.assets,
  loading: stories.loading,
  loadingMore: stories.loadingMore,
  searchValue: stories.searchValue,
  filter: stories.criteria.filter,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setCriteria,
      setSearchValue,
      fetchAssets,
      updateAssetState,
      loadMoreAssets,
    },
    dispatch
  );

StoriesContainer.propTypes = {
  loading: PropTypes.bool,
  loadingMore: PropTypes.bool,
  assets: PropTypes.object,
  searchValue: PropTypes.string,
  filter: PropTypes.string,
  setCriteria: PropTypes.func.isRequired,
  setSearchValue: PropTypes.func.isRequired,
  fetchAssets: PropTypes.func.isRequired,
  loadMoreAssets: PropTypes.func.isRequired,
  updateAssetState: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StoriesContainer);
