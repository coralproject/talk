import React, {PropTypes, Component} from 'react';
import CommentCount from './CommentCount';
import styles from './styles.css';
import {SelectField, Option} from 'react-mdl-selectfield';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-admin/src/translations.json';
import {Link} from 'react-router';

const lang = new I18n(translations);

class ModerationMenu extends Component {
  state = {
    sort: 'REVERSE_CHRONOLOGICAL',
  }

  static propTypes = {
    premodCount: PropTypes.number.isRequired,
    rejectedCount: PropTypes.number.isRequired,
    flaggedCount: PropTypes.number.isRequired,
    asset: PropTypes.shape({
      id: PropTypes.string
    })
  }

  selectSort = (sort) => {
    this.setState({sort});
    this.props.modQueueResort(sort);
  }

  render() {
    const {asset, premodCount, rejectedCount, flaggedCount} = this.props;
    const premodPath = asset ? `/admin/moderate/premod/${asset.id}` : '/admin/moderate/premod';
    const rejectPath = asset ? `/admin/moderate/rejected/${asset.id}` : '/admin/moderate/rejected';
    const flagPath = asset ? `/admin/moderate/flagged/${asset.id}` : '/admin/moderate/flagged';
    return (
      <div className='mdl-tabs'>
        <div className={`mdl-tabs__tab-bar ${styles.tabBar}`}>
          <div className={styles.tabBarPadding}/>
          <div>
            <Link to={premodPath} className={`mdl-tabs__tab ${styles.tab}`} activeClassName={styles.active}>
              {lang.t('modqueue.premod')} <CommentCount count={premodCount} />
            </Link>
            <Link to={rejectPath} className={`mdl-tabs__tab ${styles.tab}`} activeClassName={styles.active}>
              {lang.t('modqueue.rejected')} <CommentCount count={rejectedCount} />
            </Link>
            <Link to={flagPath} className={`mdl-tabs__tab ${styles.tab}`} activeClassName={styles.active}>
              {lang.t('modqueue.flagged')} <CommentCount count={flaggedCount} />
            </Link>
          </div>
          <SelectField
            className={styles.selectField}
            label='Sort'
            value={this.state.sort}
            onChange={sort => this.selectSort(sort)}>
            <Option value={'REVERSE_CHRONOLOGICAL'}>Newest First</Option>
            <Option value={'CHRONOLOGICAL'}>Oldest First</Option>
          </SelectField>
        </div>
      </div>
    );
  }
}

export default ModerationMenu;
