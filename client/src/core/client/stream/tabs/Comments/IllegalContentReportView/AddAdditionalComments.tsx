import { Localized } from "@fluent/react/compat";
import React, {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import { Field, useForm } from "react-final-form";

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
  const [showAddAdditionalComment, setShowAddAdditionalComment] =
    useState(false);
  const [addAdditionalCommentError, setAddAdditionalCommentError] = useState<
    null | string
  >(null);

  const isValidShareURL = useCallback((value: string) => {
    return validateShareURL(value);
  }, []);

  const onAddCommentURL = useCallback(() => {
    const newAdditionalComment =
      form?.getFieldState("additionalComment")?.value;
    if (newAdditionalComment) {
      const newAdditionalCommentID =
        newAdditionalComment.split("?commentID=")[1];
      if (!isValidShareURL(newAdditionalComment.url)) {
        // TODO: Update to localize
        setAddAdditionalCommentError("Please add a valid comment URL.");
        return;
      } else if (newAdditionalCommentID === comment?.id) {
        setAddAdditionalCommentError(
          "Additional comments cannot be the same as overall reported comment."
        );
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
      // clear additionalComment value now that it's been added
      form.change("additionalComment", undefined);
    }
    if (additionalComments && additionalComments.length < 9) {
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
        {showAddAdditionalComment ? (
          <>
            <Field
              name={`additionalComment`}
              id={`reportIllegalContent-additionalComment`}
            >
              {({ input }: any) => (
                <>
                  <Localized id="">
                    <InputLabel htmlFor={input.name}>Comment URL</InputLabel>
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
    </>
  );
};

export default AddAdditionalComments;
