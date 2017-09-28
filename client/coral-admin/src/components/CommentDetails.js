import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styles from './CommentDetails.css';
import t from 'coral-framework/services/i18n';
import FlagDetails from './FlagDetails';

class CommentDetails extends Component {
  state = {
    showDetail: false
  };

  constructor () {
    super();
    this.state = {
      showDetail: false
    };
  }

  toggleDetail = () => {
    this.setState((state) => ({
      showDetail: !state.showDetail
    }));
  }

  render() {
    const {actions, viewUserDetail} = this.props;
    const {showDetail} = this.state;

    return (
      <div className={styles.root}>
        <a onClick={this.toggleDetail} className={styles.moreDetail}>{showDetail ? t('modqueue.less_detail') : t('modqueue.more_detail')}</a>
        <FlagDetails
          actions={actions}
          viewUserDetail={viewUserDetail}
          more={showDetail}
        />
      </div>
    );
  }
}

CommentDetails.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({
    message: PropTypes.string,
    user: PropTypes.shape({username: PropTypes.string})
  })).isRequired,
  viewUserDetail: PropTypes.func.isRequired,
};

export default CommentDetails;
