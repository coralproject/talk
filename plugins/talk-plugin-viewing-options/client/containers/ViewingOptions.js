import { connect, withFragments } from 'plugin-api/beta/client/hocs';
import { bindActionCreators } from 'redux';
import ViewingOptions from '../components/ViewingOptions';
import { openMenu, closeMenu } from '../actions';
import { compose, gql } from 'react-apollo';
import { getSlotFragmentSpreads } from 'plugin-api/beta/client/utils';
import { mapProps } from 'recompose';

const slots = ['viewingOptionsSort', 'viewingOptionsFilter'];

const mapStateToProps = ({ talkPluginViewingOptions: state }) => ({
  open: state.open,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ openMenu, closeMenu }, dispatch);

const withViewingOptionsFragments = withFragments({
  root: gql`
    fragment TalkViewingOptions_ViewingOptions_root on RootQuery {
      __typename
      ${getSlotFragmentSpreads(slots, 'root')}
    }`,
  asset: gql`
    fragment TalkViewingOptions_ViewingOptions_asset on Asset {
      __typename
      ${getSlotFragmentSpreads(slots, 'asset')}
    }`,
});

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withViewingOptionsFragments,
  mapProps(({ root, asset, ...rest }) => ({
    slotPassthrough: {
      root,
      asset,
    },
    ...rest,
  }))
);

export default enhance(ViewingOptions);
