import { Localized } from "@fluent/react/compat";
import React, {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Field, useForm } from "react-final-form";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { getMessage } from "coral-framework/lib/i18n";
import { validateShareURL } from "coral-framework/lib/validation";
import { AddIcon, ButtonSvgIcon } from "coral-ui/components/icons";
import { InputLabel, TextField } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { IllegalContentReportViewContainer_comment as CommentData } from "coral-stream/__generated__/IllegalContentReportViewContainer_comment.graphql";

import styles from "./IllegalContentReportViewContainer.css";

interface Props {
  additionalComments: { id: string; url: string }[] | null;
  comment: CommentData | null;
  setAdditionalComments: Dispatch<
    SetStateAction<{ id: string; url: string }[] | null>
  >;
}

const AddAdditionalComments: FunctionComponent<Props> = ({
  additionalComments,
  setAdditionalComments,
  comment,
}) => {
  const form = useForm();
  const { localeBundles } = useCoralContext();
  const [showAddAdditionalComment, setShowAddAdditionalComment] =
    useState(false);
  const [addAdditionalCommentError, setAddAdditionalCommentError] = useState<
    null | string
  >(null);

  const isValidShareURL = useCallback((value: string) => {
    return validateShareURL(value);
  }, []);

  const maxCommentsEntered = useMemo(() => {
    // max comments is 1 overall plus 9 additional comments in one submission
    return additionalComments && additionalComments.length + 1 >= 10;
  }, [additionalComments]);

  const onAddCommentURL = useCallback(() => {
    const newAdditionalComment =
      form?.getFieldState("additionalComment")?.value;
    if (newAdditionalComment) {
      const newAdditionalCommentID =
        newAdditionalComment.split("?commentID=")[1];
      if (!isValidShareURL(newAdditionalComment)) {
        const validCommentURLError = getMessage(
          localeBundles,
          "comments-permalinkView-reportIllegalContent-additionalComments-validCommentURLError",
          "Please add a valid comment URL."
        );
        setAddAdditionalCommentError(validCommentURLError);
        return;
      } else if (
        newAdditionalCommentID === comment?.id ||
        additionalComments?.some((c) => c.id === newAdditionalCommentID)
      ) {
        const uniqueCommentURLError = getMessage(
          localeBundles,
          "comments-permalinkView-reportIllegalContent-additionalComments-uniqueCommentURLError",
          "Please add a unique comment URL. This is a duplicate of another comment you are reporting."
        );
        setAddAdditionalCommentError(uniqueCommentURLError);
        return;
      } else {
        setAddAdditionalCommentError(null);
      }
      const newAdditionalCommentObj = {
        id: newAdditionalCommentID,
        url: newAdditionalComment,
      };
      if (additionalComments) {
        setAdditionalComments([...additionalComments, newAdditionalCommentObj]);
      } else {
        setAdditionalComments([newAdditionalCommentObj]);
      }
      // clear additionalComment form input value now that it's been added
      form.change("additionalComment", undefined);
    }
    if (!additionalComments || additionalComments.length < 9) {
      setShowAddAdditionalComment(false);
    }
  }, [
    setAdditionalComments,
    additionalComments,
    setShowAddAdditionalComment,
    isValidShareURL,
    setAddAdditionalCommentError,
    comment,
    form,
  ]);

  return (
    <>
      <Localized id="comments-permalinkView-reportIllegalContent-additionalComments-inputLabel">
        <InputLabel>
          Have other comments you'd like to report for breaking this law?
        </InputLabel>
      </Localized>
      {additionalComments &&
        additionalComments.map(
          (additionalComment: { id: string; url: string }) => {
            // TODO: Add styles
            return <p key={additionalComment.id}>{additionalComment.url}</p>;
          }
        )}
      <>
        {!maxCommentsEntered && (
          <>
            {showAddAdditionalComment ? (
              <>
                <Field
                  name={`additionalComment`}
                  id={`reportIllegalContent-additionalComment`}
                >
                  {({ input }: any) => (
                    <>
                      <Localized id="">
                        <InputLabel htmlFor={input.name}>
                          Comment URL
                        </InputLabel>
                      </Localized>
                      <TextField
                        {...input}
                        fullWidth
                        id={input.name}
                        value={input.value}
                      />
                    </>
                  )}
                </Field>
                {addAdditionalCommentError && (
                  <div>{addAdditionalCommentError}</div>
                )}
                {/* // TODO: Update localized */}
                <Localized
                  id="comments-permalinkView-reportIllegalContent-additionalComments-"
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
                    color="primary"
                    variant="outlined"
                    fontSize="small"
                    paddingSize="small"
                    upperCase
                    onClick={onAddCommentURL}
                  >
                    <ButtonSvgIcon
                      Icon={AddIcon}
                      size="xs"
                      className={styles.leftIcon}
                    />
                    Add comment URL
                  </Button>
                </Localized>
              </>
            ) : (
              <Localized
                id="comments-permalinkView-reportIllegalContent-additionalComments-button"
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
                  color="primary"
                  variant="outlined"
                  fontSize="small"
                  paddingSize="small"
                  upperCase
                  onClick={() => setShowAddAdditionalComment(true)}
                >
                  <ButtonSvgIcon
                    Icon={AddIcon}
                    size="xs"
                    className={styles.leftIcon}
                  />
                  Add additional comments
                </Button>
              </Localized>
            )}
          </>
        )}
      </>
    </>
  );
};

export default AddAdditionalComments;
