import React from 'react'
import styles from './EmbedLink.css'
import I18n from 'coral-framework/i18n/i18n'
import translations from '../translations'
import { Button } from 'react-mdl'

const embedText =
`<div id='coralStreamEmbed'></div><script type='text/javascript' src='http://pym.nprapps.org/pym.v1.min.js'></script><script>var pymParent = new pym.Parent('coralStreamEmbed', '${window.location.protocol}//${window.location.host}/embedScript/index.html', {});</script>`

const copyToClipBoard = event => {
  const copyTextarea = document.querySelector('.' + styles.embedTextarea)
  copyTextarea.select()

  try {
    document.execCommand('copy')
  } catch (err) {
    console.error('Unable to copy')
  }
}

const EmbedLink = () => <div id={styles.embedLink}>
  <h3>Embed Comment Stream</h3>
  <textarea
    className={styles.embedTextarea}
    onClick={copyToClipBoard}
    rows={4}
    value={embedText} />
  <div className={styles.copyButton}>
    <Button onClick={copyToClipBoard} raised>
      {lang.t('embedlink.copy')}
    </Button>
  </div>
</div>

export default EmbedLink

const lang = new I18n(translations)
