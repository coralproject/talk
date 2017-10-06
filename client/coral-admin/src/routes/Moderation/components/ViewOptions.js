import React from 'react';
import PropTypes from 'prop-types';
import styles from './ViewOptions.css';
import {Card} from 'coral-ui';
import cn from 'classnames';

class ViewOptions extends React.Component {
  render() {
    return (
      <Card className={cn(styles.viewOptions, 'talk-admin-moderation-view-options')}>
        <h2 className={cn(styles.headline, 'talk-admin-moderation-view-options-headline')}>
          View Options
        </h2>
        <div className={styles.viewOptionsContent}> 
          <ul className={styles.viewOptionsList}>
            <li className={styles.viewOptionsItem}>
              Sort Comments
            </li>
          </ul>
        </div>
      </Card>
    );
  }
}

ViewOptions.propTypes = {};

export default ViewOptions;
