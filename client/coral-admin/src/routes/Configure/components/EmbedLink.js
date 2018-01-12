import React, { Component } from 'react';
import t from 'coral-framework/services/i18n';
import join from 'url-join';
import styles from './EmbedLink.css';
import { Button } from 'coral-ui';
import { BASE_URL } from 'coral-framework/constants/url';
import ConfigureCard from 'coral-framework/components/ConfigureCard';
import { stripIndent } from 'common-tags';

class EmbedLink extends Component {
  state = { copied: false };

  copyToClipBoard = () => {
    const copyTextarea = document.querySelector(`.${styles.embedInput}`);
    copyTextarea.select();

    try {
      document.execCommand('copy');
      this.setState({ copied: true });
    } catch (err) {
      console.error('Unable to copy', err);
    }
  };

  render() {
    const coralJsUrl = join(BASE_URL, '/static/embed.js');
    const embedText = stripIndent`
      <div id="coral_talk_stream"></div>
      <script src="${coralJsUrl}" async onload="
        Coral.Talk.render(document.getElementById('coral_talk_stream'), {
          talk: '${BASE_URL}'
        });
      "></script>
    `;

    return (
      <ConfigureCard title={'Embed Comment Stream'}>
        <p>{t('configure.copy_and_paste')}</p>
        <textarea
          rows={5}
          type="text"
          className={styles.embedInput}
          value={embedText}
          readOnly={true}
        />
        <div className={styles.actions}>
          <Button
            raised
            className={styles.copyButton}
            onClick={this.copyToClipBoard}
            cStyle="black"
          >
            {t('embedlink.copy')}
          </Button>
          <div className={styles.copiedText}>
            {this.state.copied && 'Copied!'}
          </div>
        </div>
      </ConfigureCard>
    );
  }
}

export default EmbedLink;
