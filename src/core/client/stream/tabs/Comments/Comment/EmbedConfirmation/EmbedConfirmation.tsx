import React, { FunctionComponent } from "react";

import { EmbedLink } from "coral-framework/helpers/findEmbedLinks";
import EmbedConfirmPrompt from "./EmbedConfirmPrompt";
import EmbedPreview from "./EmbedPreview";

import styles from "./EmbedConfirmation.css";

interface Props {
  embed: EmbedLink & {
    confirmed: boolean;
  };
  onConfirm: () => void;
  onRemove: () => void;
}

const EmbedConfirmation: FunctionComponent<Props> = ({
  embed,
  onConfirm,
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
      {embed.confirmed && <EmbedPreview embed={embed} onRemove={onRemove} />}
    </div>
  );
};

export default EmbedConfirmation;
