import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, gql } from 'react-apollo';
import OrganizationSettings from '../components/OrganizationSettings';
import withFragments from 'coral-framework/hocs/withFragments';
import { getSlotFragmentSpreads } from 'coral-framework/utils';
import { updatePending } from '../../../actions/configure';
import { mapProps } from 'recompose';

const slots = ['adminOrganizationSettings'];

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
      fragment TalkAdmin_OrganizationSettings_root on RootQuery {
        __typename
        ${getSlotFragmentSpreads(slots, 'root')}
      }
    `,
    settings: gql`
      fragment TalkAdmin_OrganizationSettings_settings on Settings {
        organizationName
        organizationContactEmail
        ${getSlotFragmentSpreads(slots, 'settings')}
      }
    `,
  }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  mapProps(({ root, settings, updatePending, errors, ...rest }) => ({
    slotPassthrough: {
      root,
      settings,
      updatePending,
      errors,
    },
    updatePending,
    settings,
    errors,
    ...rest,
  }))
)(OrganizationSettings);
