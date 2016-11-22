import React from 'react';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../../translations.json';
import {Grid, Cell} from 'react-mdl';

import styles from './Community.css';
import Table from './Table';
import Loading from './Loading';
import NoResults from './NoResults';
import Pager from './Pager';

const lang = new I18n(translations);

const tableHeaders = [
  {
    title: lang.t('community.username_and_email'),
    field: 'displayName'
  },
  {
    title: lang.t('community.account_creation_date'),
    field: 'created_at'
  },
  {
    title: lang.t('community.status'),
    field: 'status'
  },
  {
    title: lang.t('community.newsroom_role'),
    field: 'role'
  }
];

const Community = ({isFetching, commenters, ...props}) => {
  const hasResults = !isFetching && !!commenters.length;
  return (
    <Grid>
      <Cell col={3}>
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
                value={props.searchValue}
                onKeyDown={props.onKeyDownHandler}
                onChange={props.onChangeHandler}
              />
            </div>
          </div>
        </form>
      </Cell>
      <Cell col={8}>
        { isFetching && <Loading/> }
        { !hasResults && <NoResults/> }
        { hasResults &&
          <Table
            headers={tableHeaders}
            data={commenters}
            onHeaderClickHandler={props.onHeaderClickHandler}
          />
        }
        <Pager
          totalPages={props.totalPages}
          page={props.page}
          onNewPageHandler={props.onNewPageHandler}
        />
      </Cell>
    </Grid>
  );
};

export default Community;
