import React from 'react';
import timeago from 'timeago.js';
import Linkify from 'react-linkify';
import Highlighter from 'react-highlight-words';
import {Link} from 'react-router';

import styles from './styles.css';
import {Icon} from 'coral-ui';
import ActionButton from '../../../components/ActionButton';
const linkify = new Linkify();
const lang = new I18n(translations);

import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-admin/src/translations.json';

const Comment = ({actions = [], ...props}) => {
  const links = linkify.getMatches(props.comment.body);

  return (
    <li tabIndex={props.index}
        className={`mdl-card mdl-shadow--2dp ${styles.Comment} ${styles.listItem} ${props.isActive && !props.hideActive ? styles.activeItem : ''}`}>
      <div className={styles.itemHeader}>
        <div className={styles.author}>
          <span>{props.comment.user.name}</span>
          <span className={styles.created}>
            {timeago().format(props.comment.created_at || (Date.now() - props.index * 60 * 1000), lang.getLocale().replace('-', '_'))}
          </span>
          {props.flagged ? <p className={styles.flagged}>{lang.t('comment.flagged')}</p> : null}
        </div>
        <div className={styles.sideActions}>
          {links ? <span className={styles.hasLinks}><Icon name='error_outline'/> Contains Link</span> : null}
           <div className={`actions ${styles.actions}`}>
             {actions.map((action, i) =>
               <ActionButton key={i}
                 type={action}
                 user={props.comment.user}
                 acceptComment={() => props.acceptComment({commentId: props.comment.id})}
                 rejectComment={() => props.rejectComment({commentId: props.comment.id})}
                 showBanUserDialog={() => props.showBanUserDialog(props.comment.user, props.comment.id)}
               />
             )}
           </div>
          {props.comment.user.banned === 'banned' ?
            <span className={styles.banned}>
              <Icon name='error_outline'/>
              {lang.t('comment.banned_user')}
            </span>
          : null}
        </div>
      </div>

     <div className={styles.moderateArticle}>
       {props.comment.asset.title} <Link to={`/admin/moderate/${props.comment.asset.id}`}>Moderate Article</Link>
     </div>

      <div className={styles.itemBody}>
        <p className={styles.body}>
          <Linkify component='span' properties={{style: linkStyles}}>
            <Highlighter searchWords={props.suspectWords} textToHighlight={props.comment.body}/>
          </Linkify>
        </p>
      </div>

      {/* <span className={styles.context}>*/}
       {/* <a>View context</a>*/}
     {/* </span>*/}

    </li>
  );
};

const linkStyles = {
  backgroundColor: 'rgb(255, 219, 135)',
  padding: '1px 2px'
};

export default Comment;
