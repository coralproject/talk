import React from 'react';
import PropTypes from 'prop-types';
import styles from './StorySearch.css';
import {Button, Spinner, Icon} from 'coral-ui';
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

  return (
    <div>
      <div className={styles.container} role='alertdialog'>
        <div className={styles.positionShim}>
          <div className={styles.headInput}>
            <input
              className={styles.searchInput}
              onChange={props.handleSearchChange}
              onKeyDown={props.handleEnter}
              value={props.searchValue}
              autoFocus
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

              {
                props.moderation.storySearchString ? (
                  <div className={styles.searchResults}>
                    <Icon name="search" />
                    <span className={styles.headlineRecent}>Search Results</span>
                  </div>
                ) : (
                  <div className={styles.searchResults}>
                    <Icon name="access_time" />
                    <span className={styles.headlineRecent}>Most Recent Stories</span>
                  </div>
                )
              }

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
                    goToStory={props.goToStory}
                  />;
                })
              }

              {assets.length === 0 && <div className={styles.noResults}>No results</div>}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.overlay} onClick={props.closeSearch} />
    </div>
  );
};

StorySearch.propTypes = {
  search: PropTypes.func.isRequired,
  goToStory: PropTypes.func.isRequired,
  closeSearch: PropTypes.func.isRequired,
  moderation: PropTypes.object.isRequired,
  handleSearchChange: PropTypes.func.isRequired
};

export default StorySearch;
