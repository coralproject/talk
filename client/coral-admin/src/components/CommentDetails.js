import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styles from './CommentDetails.css';
import t from 'coral-framework/services/i18n';
import Slot from 'coral-framework/components/Slot';

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
    const {data, root, comment} = this.props;
    const {showDetail} = this.state;
    const queryData = {
      root,
      comment,
    };

    return (
      <div className={styles.root}>
        <a onClick={this.toggleDetail} className={styles.moreDetail}>{showDetail ? t('modqueue.less_detail') : t('modqueue.more_detail')}</a>
        <Slot
          fill="adminCommentDetailArea"
          data={data}
          queryData={queryData}
          more={showDetail}
        />
      </div>
    );
  }
}

CommentDetails.propTypes = {
  data: PropTypes.object.isRequired,
  root: PropTypes.object.isRequired,
  comment: PropTypes.object.isRequired,
};

export default CommentDetails;
