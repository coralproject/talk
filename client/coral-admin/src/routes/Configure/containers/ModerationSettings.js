import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, gql } from 'react-apollo';
import ModerationSettings from '../components/ModerationSettings';
import withFragments from 'coral-framework/hocs/withFragments';
import { getSlotFragmentSpreads } from 'coral-framework/utils';
import { updatePending } from '../../../actions/configure';

const slots = ['adminModerationSettings'];

const mapStateToProps = state => ({
  errors: state.configure.errors,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updatePending,
    },
    dispatch
  );

export default compose(
  withFragments({
    root: gql`
      fragment TalkAdmin_ModerationSettings_root on RootQuery {
        __typename
        ${getSlotFragmentSpreads(slots, 'root')}
      }
    `,
    settings: gql`
      fragment TalkAdmin_ModerationSettings_settings on Settings {
        requireEmailConfirmation
        moderation
        premodLinksEnable
        wordlist {
          suspect
          banned
        }
        ${getSlotFragmentSpreads(slots, 'settings')}
      }
    `,
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(ModerationSettings);
