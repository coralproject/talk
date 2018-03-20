import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './CommentDetails.css';
import t from 'coral-framework/services/i18n';
import Slot from 'coral-framework/components/Slot';
import IfSlotIsNotEmpty from 'coral-framework/components/IfSlotIsNotEmpty';

class CommentDetails extends Component {
  state = {
    showDetail: false,
  };

  constructor() {
    super();
    this.state = {
      showDetail: false,
    };
  }

  toggleDetail = () => {
    this.setState(state => ({
      showDetail: !state.showDetail,
    }));
    this.props.clearHeightCache && this.props.clearHeightCache();
  };

  render() {
    const { root, comment, clearHeightCache } = this.props;
    const { showDetail } = this.state;

    const slotPassthrough = {
      clearHeightCache,
      root,
      comment,
      more: showDetail,
    };

    return (
      <div className={styles.root}>
        <IfSlotIsNotEmpty
          slot={['adminCommentMoreDetails', 'adminCommentMoreFlagDetails']}
          passthrough={slotPassthrough}
        >
          <a onClick={this.toggleDetail} className={styles.moreDetail}>
            {showDetail ? t('modqueue.less_detail') : t('modqueue.more_detail')}
          </a>
        </IfSlotIsNotEmpty>
        <Slot fill="adminCommentDetailArea" passthrough={slotPassthrough} />
        {showDetail && (
          <Slot fill="adminCommentMoreDetails" passthrough={slotPassthrough} />
        )}
      </div>
    );
  }
}

CommentDetails.propTypes = {
  root: PropTypes.object.isRequired,
  comment: PropTypes.object.isRequired,
  clearHeightCache: PropTypes.func,
};

export default CommentDetails;
