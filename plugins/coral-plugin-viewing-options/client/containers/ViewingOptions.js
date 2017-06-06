import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ViewingOptions from '../components/ViewingOptions';
import {openViewingOptions, closeViewingOptions} from 'coral-embed-stream/src/actions/stream';

const mapStateToProps = ({stream}) => ({open: stream.viewingOption.open});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({openViewingOptions, closeViewingOptions}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ViewingOptions);
