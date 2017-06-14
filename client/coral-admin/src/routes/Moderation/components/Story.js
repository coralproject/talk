import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import styles from './StorySearch.css';

const Story = ({author, title, createdAt, open, id}) => {
  return (
    <Link className={styles.story} to={`/admin/moderate/${id}`}>
      <p className={styles.title}>{title}</p>
      <p className={styles.meta}>
        <span className={styles.author}>By {author}</span><span className={styles.createdAt}>{createdAt}</span><span className={styles.status}>{open ? 'Open' : 'Closed'}</span>
      </p>
    </Link>
  );
};

Story.propTypes = {
  id: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired
};

export default Story;
