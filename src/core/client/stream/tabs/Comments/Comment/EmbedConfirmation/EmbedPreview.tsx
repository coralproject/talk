import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { EmbedLink } from "coral-framework/helpers/findEmbedLinks";
import { Embed } from "coral-stream/common/OEmbed";
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
        <Embed type={embed.source} url={embed.url} settings={config} />
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
