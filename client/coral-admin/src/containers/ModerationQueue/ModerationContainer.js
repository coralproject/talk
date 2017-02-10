import React, {Component} from 'react';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import key from 'keymaster';
import isEqual from 'lodash/isEqual';

import {modQueueQuery} from '../../graphql/queries';

import {fetchSettings} from 'actions/settings';
import {updateAssets} from 'actions/assets';
import {setActiveTab, toggleModal, singleView} from 'actions/moderation';

import {Spinner} from 'coral-ui';
import ModerationQueue from './ModerationQueue';
import ModerationMenu from './components/ModerationMenu';
import ModerationHeader from './components/ModerationHeader';
import NotFoundAsset from './components/NotFoundAsset';

class ModerationContainer extends Component {

  componentWillMount() {
    const {toggleModal, singleView} = this.props;

    this.props.fetchSettings();

    key('s', () => singleView());
    key('shift+/', () => toggleModal(true));
    key('esc', () => toggleModal(false));
  }

  componentWillUnmount() {
    key.unbind('s');
    key.unbind('shift+/');
    key.unbind('esc');
  }

  componentWillReceiveProps(nextProps) {
    const {updateAssets} = this.props;
    if(!isEqual(nextProps.data.assets, this.props.data.assets)) {
      updateAssets(nextProps.data.assets);
    }
  }

  render () {
    const {data, moderation, settings, assets} = this.props;
    const providedAssetId = this.props.params.id;
    let asset;

    if (data.loading) {
      return <div><Spinner/></div>;
    }

    if (providedAssetId) {
      asset = assets.find(asset => asset.id === this.props.params.id);

      if (!asset) {
        return <NotFoundAsset assetId={providedAssetId} />;
      }
    }

    const enablePremodTab = !!data.premod.length;
    return (
      <div>
        <ModerationHeader asset={asset} />
        <ModerationMenu
          onTabClick={this.props.onTabClick}
          enablePremodTab={enablePremodTab}
          {...moderation} />
        <ModerationQueue
          data={data}
          activeTab={moderation.activeTab}
          enablePremodTab={enablePremodTab}
          suspectWords={settings.wordlist.suspect}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  moderation: state.moderation.toJS(),
  settings: state.settings.toJS(),
  assets: state.assets.get('assets')
});

const mapDispatchToProps = dispatch => ({
  onTabClick: activeTab => dispatch(setActiveTab(activeTab)),
  toggleModal: toggle => dispatch(toggleModal(toggle)),
  onClose: () => dispatch(toggleModal(false)),
  singleView: () => dispatch(singleView()),
  updateAssets: assets => dispatch(updateAssets(assets)),
  fetchSettings: () => dispatch(fetchSettings())
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  modQueueQuery
)(ModerationContainer);
