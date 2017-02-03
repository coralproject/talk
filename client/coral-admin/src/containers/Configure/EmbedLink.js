import React, {Component} from 'react';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../../translations.json';
import styles from './Configure.css';
import {Button, Card} from 'coral-ui';

class EmbedLink extends Component {

  constructor (props) {
    super(props);

    this.state = {copied: false};
  }

  copyToClipBoard = () => {
    const copyTextarea = document.querySelector(`.${styles.embedInput}`);
    copyTextarea.select();

    try {
      document.execCommand('copy');
      this.setState({copied: true});
    } catch (err) {
      console.error('Unable to copy', err);
    }
  }

  render () {
    const location = window.location;
    const talkBaseUrl = [
      location.protocol,
      '//',
      location.hostname,
      location.port ? (`:${  window.location.port}`) : ''
    ].join('');
    const coralJsUrl = [talkBaseUrl, '/Coral.js'].join('');
    const nonce = String(Math.random()).slice(2);
    const streamElementId = `coral_talk_${nonce}`;
    const embedText = `
<div id="${streamElementId}"></div>
<script src="${coralJsUrl}" onload="
  Coral.Talk.render(document.getElementById('${streamElementId}'), {
    talk: '${talkBaseUrl}'
  });
"></script>
    `.trim();
    return (
      <div>
        <h3>{this.props.title}</h3>
        <div>
          <Card shadow="2">
            <p>{lang.t('configure.copy-and-paste')}</p>
            <textarea rows={5} type='text' className={styles.embedInput} value={embedText} readOnly={true}/>
            <Button raised className={styles.copyButton} onClick={this.copyToClipBoard} cStyle="black">
              {lang.t('embedlink.copy')}
            </Button>
            <div className={styles.copiedText}>{this.state.copied && 'Copied!'}</div>
          </Card>
        </div>
      </div>
    );
  }
}

export default EmbedLink;

const lang = new I18n(translations);
