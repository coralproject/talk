import { stripIndent } from "common-tags";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useMemo } from "react";

import { getLocationOrigin } from "coral-common/utils";
import { CopyButton } from "coral-framework/components";
import { HorizontalGutter, Typography } from "coral-ui/components";

import Header from "../../Header";

import styles from "./EmbedCode.css";

interface Props {
  staticURI: string | null;
}

const EmbedCode: FunctionComponent<Props> = ({ staticURI }) => {
  const embed = useMemo(() => {
    // Get the origin of the current page.
    const origin = getLocationOrigin();

    // Optionally use the staticURI for configuration.
    const script = staticURI || origin;

    // Return the HTML template.
    const text = stripIndent`
    <div id="coral_thread"></div>
    <script type="text/javascript">
      (function() {
          var d = document, s = d.createElement('script');
          s.src = '${script}/assets/js/embed.js';
          s.onload = function() {
              Coral.createStreamEmbed({
                  id: "coral_thread",
                  autoRender: true,
                  rootURL: '${origin}',
                  // Comment these out and replace with the ID of the
                  // story's ID and URL from your CMS to provide the
                  // tightest integration. Refer to our documentation at
                  // https://docs.coralproject.net for all the configuration
                  // options.
                  // storyID: '\${storyID}',
                  // storyURL: '\${storyURL}',
              });
          };
          (d.head || d.body).appendChild(s);
      })();
    </script>`;

    // Count the number of rows in the embed code.
    const rows = text.split(/\r\n|\r|\n/).length;

    return { text, rows };
  }, [staticURI]);

  return (
    <HorizontalGutter size="oneAndAHalf" container="fieldset">
      <Localized id="configure-advanced-embedCode-title">
        <Header container="legend">Embed Code</Header>
      </Localized>
      <Localized id="configure-advanced-embedCode-explanation">
        <Typography variant="detail">
          Copy and paste the code below into your CMS to embed Coral comment
          streams in each of your site’s stories.
        </Typography>
      </Localized>
      <textarea
        rows={embed.rows}
        className={styles.textArea}
        readOnly
        value={embed.text}
      />
      <HorizontalGutter className={styles.copyArea}>
        <CopyButton size="regular" text={embed.text} />
      </HorizontalGutter>
    </HorizontalGutter>
  );
};

export default EmbedCode;
