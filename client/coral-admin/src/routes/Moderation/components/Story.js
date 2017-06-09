import React, {PropTypes} from 'react';
import styles from './StorySearch.css';

const Story = ({author, title, createdAt, open}) => {
  return (
    <li className={styles.story}>
      <p className={styles.title}>{title}</p>
      <p className={styles.meta}>
        <span className={styles.author}>By {author}</span><span className={styles.createdAt}>{createdAt}</span><span className={styles.status}>{open ? 'Open' : 'Closed'}</span>
      </p>
    </li>
  );
};

Story.propTypes = {
  author: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired
};

export default Story;
