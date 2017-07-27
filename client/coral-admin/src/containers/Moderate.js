import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Moderate from '../components/Moderate';

class ModerateContainer extends React.Component {

  render() {
    return <Moderate />;
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
  }, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(ModerateContainer);
