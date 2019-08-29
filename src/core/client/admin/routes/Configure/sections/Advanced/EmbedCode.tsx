import { stripIndent } from "common-tags";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useMemo } from "react";

import { getLocationOrigin } from "coral-common/utils";
import { CopyButton } from "coral-framework/components";
import { GetMessage, withGetMessage } from "coral-framework/lib/i18n";
import { HorizontalGutter, Typography } from "coral-ui/components";

import Header from "../../Header";

import styles from "./EmbedCode.css";

interface Props {
  staticURI: string | null;
  getMessage: GetMessage;
}

const EmbedCode: FunctionComponent<Props> = ({ staticURI, getMessage }) => {
  const embed = useMemo(() => {
    // Get the origin of the current page.
    const origin = getLocationOrigin();

    // Optionally use the staticURI for configuration.
    const script = staticURI || origin;

    let comment: string | string[] = getMessage(
      "configure-advanced-embedCode-comment",
      stripIndent`
      Uncomment these lines and replace with the ID of the
      story's ID and URL from your CMS to provide the
      tightest integration. Refer to our documentation at
      https://docs.coralproject.net for all the configuration
      options.
    `
    );

    // Sometimes when the translation gets to us, it has newlines split onto
    // it's own lines, so we filter those lines out first to ensure we don't
    // end up printing it twice. We then wrap each line in the correct amount
    // of indentation to match the indentation below in the stripIndent block
    // below, and rejoin the line (trimming it to remove the leading space) so
    // it will fit in the text block that is rendered.
    comment = comment
      .split("\n")
      .filter(line => line !== "\n")
      .map(line => `                  // ${line.trim()}`)
      .join("\n")
      .trim();

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
                  ${comment}
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
        <Header container="legend">Embed code</Header>
      </Localized>
      <Localized id="configure-advanced-embedCode-explanation">
        <Typography variant="bodyCopy">
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

const enhanced = withGetMessage(EmbedCode);

export default enhanced;
