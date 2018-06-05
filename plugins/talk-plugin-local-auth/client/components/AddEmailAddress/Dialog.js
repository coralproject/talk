import React from 'react';
import { Dialog } from 'plugin-api/beta/client/components/ui';
import styles from './Dialog.css';

export default props => <Dialog className={styles.root} {...props} />;
