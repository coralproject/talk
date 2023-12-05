import { Localized } from "@fluent/react/compat";
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Field, useForm } from "react-final-form";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { getMessage } from "coral-framework/lib/i18n";
import { validateShareURL } from "coral-framework/lib/validation";
import { AddIcon, BinIcon, ButtonSvgIcon } from "coral-ui/components/icons";
import {
  Button as ButtonV2,
  Flex,
  InputLabel,
  TextField,
} from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { IllegalContentReportViewContainer_comment as CommentData } from "coral-stream/__generated__/IllegalContentReportViewContainer_comment.graphql";

import styles from "./AddAdditionalComments.css";

import AdditionalCommentQuery from "./AdditionalCommentQuery";

interface Props {
  additionalComments: Array<{ id: string; url: string }> | null;
  comment: CommentData | null;
  onAddAdditionalComment: (id: string, url: string) => void;
  onDeleteAdditionalComment: (id: string) => void;
}

const AddAdditionalComments: FunctionComponent<Props> = ({
  additionalComments,
  comment,
  onAddAdditionalComment,
  onDeleteAdditionalComment,
}) => {
  const form = useForm();
  const { localeBundles } = useCoralContext();
  const [addAdditionalCommentError, setAddAdditionalCommentError] = useState<
    null | string
  >(null);
  const [newComment, setNewComment] = useState<null | {
    id: string;
    url: string;
  }>(null);

  const isValidShareURL = useCallback((value: string) => {
    return validateShareURL(value);
  }, []);

  const maxCommentsEntered = useMemo(() => {
    // max comments is 1 overall plus 9 additional comments in one submission
    return additionalComments && additionalComments.length + 1 >= 10;
  }, [additionalComments]);

  const onAddCommentURL = useCallback(() => {
    const newAdditionalComment: string =
      form?.getFieldState("additionalComment")?.value;
    if (newAdditionalComment) {
      if (!isValidShareURL(newAdditionalComment)) {
        const validCommentURLError = getMessage(
          localeBundles,
          "comments-permalinkView-reportIllegalContent-additionalComments-validCommentURLError",
          "This is not a valid URL. Please enter a valid comment URL"
        );
        setNewComment(null);
        setAddAdditionalCommentError(validCommentURLError);
        return;
      }
      const newAdditionalCommentID =
        newAdditionalComment.split("?commentID=")[1];
      if (
        newAdditionalCommentID === comment?.id ||
        additionalComments?.some((c) => c.id === newAdditionalCommentID)
      ) {
        const uniqueCommentURLError = getMessage(
          localeBundles,
          "comments-permalinkView-reportIllegalContent-additionalComments-uniqueCommentURLError",
          "You've already added this comment to this report. Please add a unique comment URL"
        );
        setNewComment(null);
        setAddAdditionalCommentError(uniqueCommentURLError);
        return;
      }
      setNewComment({ id: newAdditionalCommentID, url: newAdditionalComment });
    }
  }, [
    form,
    isValidShareURL,
    setAddAdditionalCommentError,
    comment,
    localeBundles,
    setNewComment,
    additionalComments,
  ]);

  const onAddCommentSuccess = useCallback(
    (id: string, url: string) => {
      onAddAdditionalComment(id, url);
      form.change("additionalComment", undefined);
      setNewComment(null);
      setAddAdditionalCommentError(null);
    },
    [onAddAdditionalComment, form, setNewComment, setAddAdditionalCommentError]
  );

  const onAddCommentError = useCallback(
    (error: string) => {
      setAddAdditionalCommentError(error);
      setNewComment(null);
    },
    [setAddAdditionalCommentError, setNewComment]
  );

  return (
    <>
      <Localized id="comments-permalinkView-reportIllegalContent-additionalComments-inputLabel">
        <InputLabel>
          Would you like to report any other comments for containing illegal
          content?
        </InputLabel>
      </Localized>
      {additionalComments &&
        additionalComments.map(
          (additionalComment: { id: string; url: string }) => {
            return (
              <Flex key={additionalComment.id} alignItems="center">
                <div
                  className={styles.additionalCommentURLs}
                  key={additionalComment.id}
                >
                  {additionalComment.url}
                </div>
                <Localized
                  id="comments-permalinkView-reportIllegalContent-additionalComments-deleteButton"
                  elems={{ icon: <ButtonSvgIcon Icon={BinIcon} /> }}
                >
                  <ButtonV2
                    color="mono"
                    variant="text"
                    onClick={() =>
                      onDeleteAdditionalComment(additionalComment.id)
                    }
                    iconLeft
                  >
                    <ButtonSvgIcon Icon={BinIcon} />
                    Delete
                  </ButtonV2>
                </Localized>
              </Flex>
            );
          }
        )}
      {newComment && (
        <AdditionalCommentQuery
          additionalComment={newComment}
          onAddCommentError={onAddCommentError}
          onAddCommentSuccess={onAddCommentSuccess}
        />
      )}
      <>
        {!maxCommentsEntered && (
          <>
            <Field
              name={`additionalComment`}
              id={`reportIllegalContent-additionalComment`}
            >
              {({ input }: any) => (
                <Flex direction="column">
                  <Flex marginBottom={2}>
                    <Localized id="comments-permalinkView-reportIllegalContent-additionalComment-commentURLButton">
                      <InputLabel htmlFor={input.name}>Comment URL</InputLabel>
                    </Localized>
                  </Flex>
                  <Flex>
                    <TextField
                      {...input}
                      fullWidth
                      id={input.name}
                      value={input.value}
                    />
                    <Localized
                      id="comments-permalinkView-reportIllegalContent-additionalComments-addCommentURLButton"
                      elems={{
                        Button: (
                          <ButtonSvgIcon
                            Icon={AddIcon}
                            size="xs"
                            className={styles.leftIcon}
                          />
                        ),
                      }}
                    >
                      <Button
                        className={styles.addButton}
                        color="primary"
                        variant="outlined"
                        fontSize="small"
                        paddingSize="small"
                        upperCase
                        onClick={onAddCommentURL}
                        disabled={!input.value}
                      >
                        <ButtonSvgIcon
                          Icon={AddIcon}
                          size="xs"
                          className={styles.leftIcon}
                        />
                        Add
                      </Button>
                    </Localized>
                  </Flex>
                </Flex>
              )}
            </Field>
            {addAdditionalCommentError && (
              <div className={styles.error}>{addAdditionalCommentError}</div>
            )}
          </>
        )}
      </>
    </>
  );
};

export default AddAdditionalComments;
