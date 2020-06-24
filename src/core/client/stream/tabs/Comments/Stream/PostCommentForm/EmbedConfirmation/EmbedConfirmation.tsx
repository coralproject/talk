import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import { EmbedLink } from "coral-common/utils/findEmbedLinks";
import { Button, Flex, Icon } from "coral-ui/components/v2";

import twitterImg from "./twitter.png";

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
      <Flex alignItems="flex-start" spacing={2}>
        <div>
          {embed.source === "YOUTUBE" && <Icon>ondemand_video</Icon>}
          {embed.source === "TWITTER" && (
            <img
              className={styles.twitterIcon}
              src={twitterImg}
              alt="twitter"
            />
          )}
        </div>
        <div>
          <Flex alignItems="center" spacing={1}>
            {!embed.confirmed && (
              <>
                {embed.source === "YOUTUBE" && (
                  <Localized id="comments-postComment-confirmEmbed-youtube">
                    <p className={styles.prompt}>
                      Add this YouTube video to the end of your comment?
                    </p>
                  </Localized>
                )}
                {embed.source === "TWITTER" && (
                  <Localized id="comments-postComment-confirmEmbed-twitter">
                    <p className={styles.prompt}>
                      Add this tweet to the end of your comment?
                    </p>
                  </Localized>
                )}
                <Localized id="comments-postComment-confirmEmbed-yes">
                  <Button
                    color="stream"
                    uppercase={false}
                    variant="text"
                    onClick={onConfirm}
                    underline={true}
                  >
                    Yes
                  </Button>
                </Localized>
                <Localized id="comments-postComment-confirmEmbed-no">
                  <Button
                    color="stream"
                    uppercase={false}
                    variant="text"
                    onClick={onRemove}
                    underline={true}
                  >
                    No
                  </Button>
                </Localized>
              </>
            )}
          </Flex>
          <Flex spacing={2}>
            <p
              className={cn(styles.url, {
                [styles.boldURL]: embed.confirmed,
              })}
            >
              {embed.url}
            </p>
            {embed.confirmed && (
              <Localized id="comments-postComment-confirmEmbed-remove">
                <Button
                  uppercase={false}
                  color="stream"
                  variant="text"
                  onClick={onRemove}
                  underline={true}
                >
                  Remove
                </Button>
              </Localized>
            )}
          </Flex>
        </div>
      </Flex>
    </div>
  );
};

export default EmbedConfirmation;
