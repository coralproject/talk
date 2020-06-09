import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import RTEContainer from "../../RTE";
import { PropTypesOf } from "coral-framework/types";
import GifSelector from "../GifSelector";

import { Button, ButtonIcon } from "coral-ui/components/v2";

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
            /*props.showMessageBox ? styles.rteBorderless : undefined*/
          }
          value={props.value}
          placeholder="Post a comment"
          disabled={props.disabled}
          toolbarButtons={
            <Button onClick={onGifButtonClick} iconLeft>
              <ButtonIcon>add</ButtonIcon>
              GIF
            </Button>
          }
        />
      </Localized>
      {showGifSelector && <GifSelector />}
    </div>
  );
};

export default PostCommentInput;
