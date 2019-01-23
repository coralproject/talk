import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'coral-ui';
import { setActiveTab } from '../../../actions/embed';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import t from 'coral-framework/services/i18n';

class CommentNotFound extends React.Component {
  showAllTab = () => {
    this.props.setActiveTab('all');
  };

  render() {
    return (
      <div>
        <p>{t('stream.comment_not_found')}</p>
        <Button onClick={this.showAllTab}>Show all comments</Button>
      </div>
    );
  }
}

CommentNotFound.propTypes = {
  setActiveTab: PropTypes.func,
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setActiveTab,
    },
    dispatch
  );

export default connect(
  null,
  mapDispatchToProps
)(CommentNotFound);
