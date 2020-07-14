import React, { FunctionComponent } from "react";

import { EmbedLink } from "coral-common/helpers/findEmbedLinks";
import EmbedConfirmPrompt from "./EmbedConfirmPrompt";
import EmbedPreview from "./EmbedPreview";

import styles from "./EmbedConfirmation.css";
interface EmbedConfig {
  giphy: {
    enabled: boolean;
  };
  twitter: {
    enabled: boolean;
  };
  youtube: {
    enabled: boolean;
  };
}

interface Props {
  embed: EmbedLink & {
    confirmed: boolean;
  };
  onConfirm: () => void;
  onRemove: () => void;
  config: EmbedConfig;
}

const EmbedConfirmation: FunctionComponent<Props> = ({
  embed,
  onConfirm,
  config,
  onRemove,
}) => {
  return (
    <div className={styles.root}>
      {!embed.confirmed && (
        <EmbedConfirmPrompt
          embed={embed}
          onConfirm={onConfirm}
          onRemove={onRemove}
        />
      )}
      {embed.confirmed && (
        <EmbedPreview embed={embed} onRemove={onRemove} config={config} />
      )}
    </div>
  );
};

export default EmbedConfirmation;
