import React, {PropTypes} from 'react';
import styles from './StorySearch.css';
import {Button, Spinner} from 'coral-ui';
import Story from './Story';

const StorySearch = (props) => {

  const {
    root: {assets = []},
    data: {loading}
  } = props;

  return (
    <div className={styles.container}>
      <div className={styles.positionShim}>
        <div className={styles.headInput}>
          <input className={styles.searchInput} onChange={props.storySearchChange} />
          <Button cStyle='facebook'>Search</Button>
        </div>
        <div className={styles.results}>
          <p className={styles.cta}>Moderate comments on All Stories</p>
          <ul className={styles.storyList}>
            {
              loading
              ? <Spinner />
              : assets.map((story, i) => {
                const storyOpen = story.closedAt === null || new Date(story.closedAt) > new Date();
                return <Story
                  key={i}
                  title={story.title}
                  createdAt={new Date(story.created_at).toISOString()}
                  open={storyOpen}
                  author={story.author} />;
              })
            }
          </ul>
        </div>
      </div>
    </div>
  );
};

StorySearch.propTypes = {
  storySearchChange: PropTypes.func.isRequired
};

export default StorySearch;
