import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

import { PropTypesOf } from "coral-framework/types";
import { Button, ButtonIcon } from "coral-ui/components/v2";

import RTEContainer from "../../RTE";
import GifSelector, { GifPreview } from "../GifSelector";
import { GifResult } from "../GifSelector/GifSearchFetch";

import styles from "./PostCommentInput.css";

interface Props {
  rteConfig: PropTypesOf<typeof RTEContainer>["config"];
  onFocus: () => void;
  onChange: (html: string) => void;
  showMessageBox?: boolean;
  isQA?: boolean;
  value?: string;
  disabled?: boolean;
}

const PostCommentInput: FunctionComponent<Props> = (props) => {
  const [showGifSelector, setShowGifSelector] = useState(false);
  const onGifButtonClick = useCallback(() => {
    setShowGifSelector(!showGifSelector);
  }, [showGifSelector]);
  const [selectedGif, setSelectedGif] = useState<GifResult | null>(null);
  const onRemoveGif = useCallback(() => {
    setSelectedGif(null);
  }, []);
  const onGifSelect = useCallback(
    (gif: GifResult) => {
      setSelectedGif(gif);
      setShowGifSelector(false);
    },
    [selectedGif, showGifSelector]
  );
  return (
    <div className={styles.root}>
      <Localized
        id={
          props.isQA
            ? "qa-postQuestionForm-rte"
            : "comments-postCommentForm-rte"
        }
        attrs={{ placeholder: true }}
      >
        <RTEContainer
          inputID="comments-postCommentForm-field"
          config={props.rteConfig}
          onFocus={props.onFocus}
          onChange={props.onChange}
          contentClassName={
            undefined
            /* props.showMessageBox ? styles.rteBorderless : undefined*/
          }
          value={props.value}
          placeholder="Post a comment"
          disabled={props.disabled}
          toolbarButtons={
            <Button
              color="mono"
              variant={showGifSelector ? "regular" : "flat"}
              onClick={onGifButtonClick}
              iconLeft
            >
              <ButtonIcon>add</ButtonIcon>
              GIF
            </Button>
          }
        />
      </Localized>
      {showGifSelector && <GifSelector onGifSelect={onGifSelect} />}
      {selectedGif && (
        <GifPreview
          onRemove={onRemoveGif}
          title={selectedGif.title}
          url={selectedGif.images.original.url}
        />
      )}
    </div>
  );
};

export default PostCommentInput;
