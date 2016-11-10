import React from 'react';
import I18n from 'coral-framework/i18n/i18n';
import translations from '../../translations';
import {Grid, Cell} from 'react-mdl';

import styles from './Community.css';
import Table from './Table';
import Loading from './Loading';
import NoResults from './NoResults';
import Pager from './Pager';

const Community = ({searchValue, onKeyDownHandler, onChangeHandler, commenters, isFetching, onHeaderClickHandler, totalPages, currentPage, onNext, onPrev}) => (
  <Grid>
    <Cell col={4}>
      <form action="">
        <div className={`mdl-textfield ${styles.searchBox}`}>
          <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="commenters-search">
            <i className="material-icons">search</i>
          </label>
          <div className="">
            <input
              id="commenters-search"
              className={`mdl-textfield__input ${styles.searchInput}`}
              type="text"
              value={searchValue}
              onKeyDown={onKeyDownHandler}
              onChange={onChangeHandler}
            />
          </div>
        </div>
      </form>
    </Cell>
    <Cell col={8}>
      {
        (isFetching)
          ?
          <Loading />
          :
          (
            (commenters.length)
              ?
              <Table
                headers={[
                  {
                    title: lang.t('community.username_and_email'),
                    field: 'displayName'
                  },
                  {
                    title: lang.t('community.account_creation_date'),
                    field: 'created_at'
                  }
                ]}
                data={commenters}
                onHeaderClickHandler={onHeaderClickHandler}
              />
              :
              <NoResults />
          )
      }
      <Pager
        totalPages={totalPages}
        currentPage={currentPage}
        onNext={onNext}
        onPrev={onPrev}
      />
    </Cell>
  </Grid>
);

export default Community;

const lang = new I18n(translations);
