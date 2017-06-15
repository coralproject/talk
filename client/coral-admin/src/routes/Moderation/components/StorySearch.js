import React, {PropTypes} from 'react';
import styles from './StorySearch.css';
import {Button, Spinner, Icon} from 'coral-ui';
import {withRouter} from 'react-router';
import Story from './Story';

const StorySearch = (props) => {

  const {
    root: {
      assets = []
    },
    data: {loading}
  } = props;

  if (!props.moderation.storySearchVisible) {
    return null;
  }

  const goToStory = (id) => {
    props.router.push(`/admin/moderate/${id}`);
    props.closeSearch();
  };

  return (
    <div className={styles.container}>
      <div className={styles.positionShim}>
        <div className={styles.headInput}>
          <input
            className={styles.searchInput}
            onChange={props.handleSearchChange}
            value={props.moderation.storySearchString}
          />
          <Button
            cStyle='blue'
            className={styles.searchButton}
            onClick={props.search}
            raised >
            Search
          </Button>
        </div>
        <div className={styles.results}>
          <p className={styles.cta}>Moderate comments on All Stories</p>
          <div className={styles.storyList}>
            <div className={styles.recentStories}>
              <Icon name="access_time" />
              <span className={styles.headlineRecent}>Most Recent Stories</span>
            </div>
            {
              loading
              ? <Spinner />
              : assets.map((story, i) => {
                const storyOpen = story.closedAt === null || new Date(story.closedAt) > new Date();
                return <Story
                  key={i}
                  id={story.id}
                  title={story.title}
                  createdAt={new Date(story.created_at).toISOString()}
                  open={storyOpen}
                  author={story.author}
                  goToStory={goToStory}
                />;
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
};

// StorySearch.propTypes = {
//   storySearchChange: PropTypes.func.isRequired
// };

export default withRouter(StorySearch);
