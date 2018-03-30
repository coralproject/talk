import React from 'react';
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
import {
  clearPending,
  setActiveSection,
  showSaveDialog,
  hideSaveDialog,
} from '../../../actions/configure';
import Configure from '../components/Configure';
import { withRouter } from 'react-router';

class ConfigureContainer extends React.Component {
  savePending = async () => {
    await this.props.updateSettings(this.props.pending);
    this.props.clearPending();
  };

  setActiveSection = section => {
    // Check if pending
    console.log('pending', this.props.pending);
    this.props.setActiveSection(section);
    this.props.router.push(`/admin/configure/${section}`);
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
        saveDialog={this.props.saveDialog}
        activeSection={this.props.activeSection}
        hideSaveDialog={this.props.hideSaveDialog}
        canSave={this.props.canSave}
        currentUser={this.props.currentUser}
        root={this.props.root}
        settings={this.props.mergedSettings}
        setActiveSection={this.setActiveSection}
        savePending={this.savePending}
      >
        {this.props.children}
      </Configure>
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
  saveDialog: state.configure.saveDialog,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      clearPending,
      setActiveSection,
      showSaveDialog,
      hideSaveDialog,
    },
    dispatch
  );

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withUpdateSettings,
  withConfigureQuery,
  withMergedSettings('root.settings', 'pending', 'mergedSettings')
)(ConfigureContainer);

ConfigureContainer.propTypes = {
  activeSection: PropTypes.string,
  updateSettings: PropTypes.func.isRequired,
  clearPending: PropTypes.func.isRequired,
  setActiveSection: PropTypes.func.isRequired,
  showSaveDialog: PropTypes.func.isRequired,
  hideSaveDialog: PropTypes.func.isRequired,
  saveDialog: PropTypes.bool.isRequired,
  currentUser: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  root: PropTypes.object.isRequired,
  canSave: PropTypes.bool.isRequired,
  pending: PropTypes.object.isRequired,
  mergedSettings: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  router: PropTypes.object,
};
