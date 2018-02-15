import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose, gql } from 'react-apollo';
import { withQuery, withMergedSettings } from 'coral-framework/hocs';
import { Spinner } from 'coral-ui';
import PropTypes from 'prop-types';
import { withUpdateSettings } from 'coral-framework/graphql/mutations';
import { getDefinitionName } from 'coral-framework/utils';
import StreamSettings from './StreamSettings';
import TechSettings from './TechSettings';
import ModerationSettings from './ModerationSettings';
import { clearPending, setActiveSection } from '../../../actions/configure';
import Configure from '../components/Configure';

class ConfigureContainer extends Component {
  savePending = async () => {
    await this.props.updateSettings(this.props.pending);
    this.props.clearPending();
  };

  render() {
    if (this.props.data.error) {
      return <div>{this.props.data.error.message}</div>;
    }

    if (this.props.data.loading) {
      return <Spinner />;
    }

    return (
      <Configure
        currentUser={this.props.currentUser}
        data={this.props.data}
        root={this.props.root}
        settings={this.props.mergedSettings}
        canSave={this.props.canSave}
        savePending={this.savePending}
        setActiveSection={this.props.setActiveSection}
        activeSection={this.props.activeSection}
      />
    );
  }
}

const withConfigureQuery = withQuery(
  gql`
  query TalkAdmin_Configure {
    settings {
      ...${getDefinitionName(StreamSettings.fragments.settings)}
      ...${getDefinitionName(TechSettings.fragments.settings)}
      ...${getDefinitionName(ModerationSettings.fragments.settings)}
    }
    ...${getDefinitionName(StreamSettings.fragments.root)}
    ...${getDefinitionName(TechSettings.fragments.root)}
    ...${getDefinitionName(ModerationSettings.fragments.root)}
  }
  ${StreamSettings.fragments.root}
  ${StreamSettings.fragments.settings}
  ${TechSettings.fragments.root}
  ${TechSettings.fragments.settings}
  ${ModerationSettings.fragments.root}
  ${ModerationSettings.fragments.settings}
  `,
  {
    options: () => ({
      variables: {},
      fetchPolicy: 'network-only',
    }),
  }
);

const mapStateToProps = state => ({
  currentUser: state.auth.user,
  pending: state.configure.pending,
  canSave: state.configure.canSave,
  activeSection: state.configure.activeSection,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      clearPending,
      setActiveSection,
    },
    dispatch
  );

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withUpdateSettings,
  withConfigureQuery,
  withMergedSettings('root.settings', 'pending', 'mergedSettings')
)(ConfigureContainer);

ConfigureContainer.propTypes = {
  updateSettings: PropTypes.func.isRequired,
  clearPending: PropTypes.func.isRequired,
  setActiveSection: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  root: PropTypes.object.isRequired,
  canSave: PropTypes.bool.isRequired,
  pending: PropTypes.object.isRequired,
  mergedSettings: PropTypes.object.isRequired,
  activeSection: PropTypes.string.isRequired,
};
