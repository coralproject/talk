import React from 'react';
import { CoralLogo } from 'plugin-api/beta/client/components/ui';
import styles from './MyPluginComponent.css';

class MyPluginComponent extends React.Component {
  render() {
    return (
      <div className={styles.myPluginContainer}>
        <CoralLogo className={styles.logo} />
        <div className={styles.description}>
          <h3>Plugin created by Talk CLI</h3>

          <small>
            To read more about plugins check{' '}
            <a href="https://docs.coralproject.net/talk/plugins-client">
              our docs and guides!
            </a>
          </small>
        </div>
      </div>
    );
  }
}

export default MyPluginComponent;
