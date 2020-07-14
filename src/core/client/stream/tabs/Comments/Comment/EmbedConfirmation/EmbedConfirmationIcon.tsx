import React, { FunctionComponent } from "react";

import { Icon } from "coral-ui/components/v2";

import { EmbedLink } from "coral-common/helpers/findEmbedLinks";
import styles from "./EmbedConfirmationIcon.css";
import twitterImg from "./twitter.png";

interface Props {
  embed: EmbedLink;
}

const EmbedConfirmationIcon: FunctionComponent<Props> = ({ embed }) => {
  return (
    <>
      {embed.type === "youtube" && <Icon>ondemand_video</Icon>}
      {embed.type === "twitter" && (
        <img className={styles.twitterIcon} src={twitterImg} alt="twitter" />
      )}
    </>
  );
};

export default EmbedConfirmationIcon;
