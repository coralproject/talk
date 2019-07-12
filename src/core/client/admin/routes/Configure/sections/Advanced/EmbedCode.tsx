import { stripIndent } from "common-tags";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useMemo } from "react";

import { getLocationOrigin } from "coral-common/utils";
import { HorizontalGutter, Typography } from "coral-ui/components";

import Header from "../../Header";

import styles from "./EmbedCode.css";

interface Props {
  staticURI: string | null;
}

const EmbedCode: FunctionComponent<Props> = ({ staticURI }) => {
  const value = useMemo(() => {
    // Get the origin of the current page.
    const origin = getLocationOrigin();

    // Optionally use the staticURI for configuration.
    const script = staticURI || origin;

    // Return the HTML template.
    return stripIndent`
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
              });
          };
          (d.head || d.body).appendChild(s);
      })();
    </script>`;
  }, [staticURI]);

  return (
    <HorizontalGutter size="oneAndAHalf" container="fieldset">
      <Localized id="configure-advanced-embedCode-title">
        <Header container="legend">Embed Code</Header>
      </Localized>
      <Localized id="configure-advanced-embedCode-explanation">
        <Typography variant="detail">
          Copy and paste code below into your CMS to embed the comment box in
          your articles.
        </Typography>
      </Localized>
      <textarea className={styles.textArea} readOnly value={value} />
    </HorizontalGutter>
  );
};

export default EmbedCode;
