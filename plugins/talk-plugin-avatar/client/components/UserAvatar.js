import React from 'react';
import styles from './styles.css';
import avatarPlaceholder from '../assets/avatar-placeholder.png';

const UserAvatar = ({comment: {user}}) => 
  <img src={!user.avatar ? avatarPlaceholder : user.avatar} className={styles.avatarPlaceholder} />;

export default UserAvatar;
