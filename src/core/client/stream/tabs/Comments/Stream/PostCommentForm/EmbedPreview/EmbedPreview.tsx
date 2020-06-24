import React, { FunctionComponent } from "react";

import { EmbedLink } from "coral-common/utils/findEmbedLinks";
import { Embed } from "coral-stream/common/OEmbed";

import styles from "./EmbedPreview.css";

interface Props {
  onRemove: () => void;
  embed: EmbedLink;
}

const EmbedPreview: FunctionComponent<Props> = ({ embed, onRemove }) => {
  return (
    <div className={styles.root}>
      <Embed
        type={embed.source}
        url={embed.url}
        settings={{
          twitter: true,
          giphy: true,
          youtube: true,
        }}
      />
    </div>
  );
};

export default EmbedPreview;
