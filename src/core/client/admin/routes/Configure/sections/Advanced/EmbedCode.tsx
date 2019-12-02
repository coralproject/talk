import { stripIndent } from "common-tags";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent, useMemo } from "react";

import { CopyButton } from "coral-framework/components";
import { GetMessage, withGetMessage } from "coral-framework/lib/i18n";
import { getLocationOrigin } from "coral-framework/utils";
import {
  FieldSet,
  FormFieldDescription,
  HorizontalGutter,
  Textarea,
} from "coral-ui/components/v2";

import ConfigBox from "../../ConfigBox";
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
          s.async = false;
          s.defer = true;
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
    <ConfigBox
      title={
        <Localized id="configure-advanced-embedCode-title">
          <Header container={<legend />}>Embed code</Header>
        </Localized>
      }
      container={<FieldSet />}
    >
      <Localized id="configure-advanced-embedCode-explanation">
        <FormFieldDescription>
          Copy and paste the code below into your CMS to embed Coral comment
          streams in each of your site’s stories.
        </FormFieldDescription>
      </Localized>
      <Textarea
        rows={embed.rows}
        className={styles.textArea}
        readOnly
        value={embed.text}
      />
      <HorizontalGutter className={styles.copyArea}>
        <CopyButton size="medium" text={embed.text} />
      </HorizontalGutter>
    </ConfigBox>
  );
};

const enhanced = withGetMessage(EmbedCode);

export default enhanced;
