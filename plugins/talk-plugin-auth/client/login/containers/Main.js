import React from 'react';
import PropTypes from 'prop-types';
import Main from '../components/Main';
import { connect } from 'plugin-api/beta/client/hocs';
import { bindActionCreators } from 'redux';
import { setView } from '../actions';
import * as views from '../enums/views';

class MainContainer extends React.Component {
  resetView = () => {
    this.props.setView(views.SIGN_IN);
  };

  resizeHeight() {
    setTimeout(() => {
      const height = document.getElementById('signInDialog').offsetHeight + 100;
      window.resizeTo(500, height);
    }, 20);
  }

  componentDidMount() {
    this.resizeHeight();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.view !== this.props.view) {
      this.resizeHeight();
    }
  }

  render() {
    return <Main onResetView={this.resetView} view={this.props.view} />;
  }
}

MainContainer.propTypes = {
  view: PropTypes.string.isRequired,
  setView: PropTypes.func.isRequired,
};

const mapStateToProps = ({ talkPluginAuth: state }) => ({
  view: state.view,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setView,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainContainer);
