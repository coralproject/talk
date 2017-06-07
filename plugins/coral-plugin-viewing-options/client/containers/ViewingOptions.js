import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ViewingOptions from '../components/ViewingOptions';
import {openViewingOptions, closeViewingOptions} from '../actions';

const mapStateToProps = ({['coral-plugin-viewing-options']: state}) => ({open: state.open});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({openViewingOptions, closeViewingOptions}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ViewingOptions);
