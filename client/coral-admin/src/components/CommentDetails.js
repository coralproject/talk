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
    const { data, root, comment, clearHeightCache } = this.props;
    const { showDetail } = this.state;
    const queryData = {
      root,
      comment,
    };

    return (
      <div className={styles.root}>
        <IfSlotIsNotEmpty
          queryData={queryData}
          slot={['adminCommentMoreDetails', 'adminCommentMoreFlagDetails']}
        >
          <a onClick={this.toggleDetail} className={styles.moreDetail}>
            {showDetail ? t('modqueue.less_detail') : t('modqueue.more_detail')}
          </a>
        </IfSlotIsNotEmpty>
        <Slot
          fill="adminCommentDetailArea"
          data={data}
          clearHeightCache={clearHeightCache}
          queryData={queryData}
          more={showDetail}
        />
        {showDetail && (
          <Slot
            fill="adminCommentMoreDetails"
            data={data}
            clearHeightCache={clearHeightCache}
            queryData={queryData}
          />
        )}
      </div>
    );
  }
}

CommentDetails.propTypes = {
  data: PropTypes.object.isRequired,
  root: PropTypes.object.isRequired,
  comment: PropTypes.object.isRequired,
  clearHeightCache: PropTypes.func,
};

export default CommentDetails;
