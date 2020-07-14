import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { EmbedLink } from "coral-common/helpers/findEmbedLinks";
import { TwitterEmbed, YouTubeEmbed } from "coral-stream/common/Embed";
import {
  Button,
  ButtonIcon,
  Flex,
  HorizontalGutter,
  MatchMedia,
} from "coral-ui/components/v2";

import EmbedConfirmationIcon from "./EmbedConfirmationIcon";

import styles from "./EmbedPreview.css";
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
  embed: EmbedLink;
  onRemove: () => void;
  config: EmbedConfig | null;
}

const EmbedPreview: FunctionComponent<Props> = ({
  embed,
  onRemove,
  config,
}) => {
  return (
    <div>
      <HorizontalGutter spacing={3} className={styles.root}>
        <div>
          <Flex justifyContent="space-between">
            <Flex spacing={2}>
              <div className={styles.icon}>
                <EmbedConfirmationIcon embed={embed} />
              </div>
              <a
                href={embed.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.url}
              >
                {embed.url}
              </a>
            </Flex>
            <MatchMedia gteWidth="xs">
              <Localized id="comments-postComment-confirmEmbed-remove">
                <Button onClick={onRemove} color="mono" variant="text" iconLeft>
                  <ButtonIcon>close</ButtonIcon>
                  Remove
                </Button>
              </Localized>
            </MatchMedia>
          </Flex>
        </div>
        {embed.type === "twitter" && <TwitterEmbed url={embed.url} />}
        {embed.type === "youtube" && <YouTubeEmbed url={embed.url} />}
      </HorizontalGutter>
      <MatchMedia ltWidth="xs">
        <Localized id="comments-postComment-confirmEmbed-remove">
          <Button
            onClick={onRemove}
            color="mono"
            variant="text"
            iconLeft
            size="large"
            className={styles.removeButton}
          >
            <ButtonIcon>close</ButtonIcon>
            Remove
          </Button>
        </Localized>
      </MatchMedia>
    </div>
  );
};

export default EmbedPreview;
