import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { compose } from 'react-apollo';
import {
  fetchAssets,
  updateAssetState,
  setPage,
  setSearchValue,
  setCriteria,
} from 'coral-admin/src/actions/stories';
import { withForceScrapeAsset } from 'coral-framework/graphql/mutations';
import Stories from '../components/Stories';

class StoriesContainer extends Component {
  timer = null;

  componentDidMount() {
    this.fetchAssets();
  }

  onSearchChange = e => {
    this.props.setSearchValue(e.target.value);
    clearTimeout(this.timer);
    this.timer = setTimeout(this.fetchAssets, 350);
  };

  onSettingChange = setting => e => {
    const criteria = { [setting]: e.target.value };
    this.props.setCriteria(criteria);
    this.fetchAssets(criteria);
  };

  fetchAssets = query => {
    const { searchValue, asc, filter, limit } = this.props;

    this.props.fetchAssets({
      value: searchValue,
      asc,
      filter,
      limit,
      ...query,
    });
  };

  onScrapeAssets = () => {
    const { forceScrapeAsset, assets } = this.props;

    assets.ids.forEach(id => {
      forceScrapeAsset(id);
    });
  };

  onStatusChange = async (closeStream, id) => {
    const { updateAssetState } = this.props;

    try {
      updateAssetState(id, closeStream ? Date.now() : null);
      this.fetchAssets();
    } catch (err) {
      console.error(err);
    }
  };

  onPageChange = ({ selected }) => {
    const page = selected + 1;
    this.props.setPage(page);
    this.fetchAssets({ page });
  };

  render() {
    return (
      <Stories
        assets={this.props.assets}
        searchValue={this.props.searchValue}
        asc={this.props.asc}
        filter={this.props.filter}
        limit={this.props.limit}
        onPageChange={this.onPageChange}
        onStatusChange={this.onStatusChange}
        onSettingChange={this.onSettingChange}
        onSearchChange={this.onSearchChange}
        onScrapeAssets={this.onScrapeAssets}
      />
    );
  }
}

const mapStateToProps = ({ stories }) => ({
  assets: stories.assets,
  searchValue: stories.searchValue,
  asc: stories.criteria.asc,
  filter: stories.criteria.filter,
  limit: stories.criteria.limit,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setPage,
      setCriteria,
      setSearchValue,
      fetchAssets,
      updateAssetState,
    },
    dispatch
  );

StoriesContainer.propTypes = {
  assets: PropTypes.object,
  searchValue: PropTypes.string,
  asc: PropTypes.string,
  filter: PropTypes.string,
  limit: PropTypes.number,
  setPage: PropTypes.func.isRequired,
  setCriteria: PropTypes.func.isRequired,
  setSearchValue: PropTypes.func.isRequired,
  fetchAssets: PropTypes.func.isRequired,
  updateAssetState: PropTypes.func.isRequired,
  forceScrapeAsset: PropTypes.func.isRequired,
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withForceScrapeAsset
)(StoriesContainer);
