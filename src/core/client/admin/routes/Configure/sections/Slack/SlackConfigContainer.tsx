import { Localized } from "@fluent/react/compat";
import { FormApi } from "final-form";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { FieldArray } from "react-final-form-arrays";
import { graphql, useFragment } from "react-relay";

import { pureMerge } from "coral-common/utils";
import { ExternalLink } from "coral-framework/lib/i18n/components";
import {
  Button,
  ButtonIcon,
  FormFieldDescription,
  HorizontalGutter,
} from "coral-ui/components/v2";

import { SlackConfigContainer_settings$key as SlackConfigContainer_settings } from "coral-admin/__generated__/SlackConfigContainer_settings.graphql";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import SlackChannel from "./SlackChannel";

import styles from "./SlackConfigContainer.css";

interface Props {
  form: FormApi;
  submitting: boolean;
  settings: SlackConfigContainer_settings;
}

const SlackConfigContainer: FunctionComponent<Props> = ({ form, settings }) => {
  const settingsData = useFragment(
    graphql`
      fragment SlackConfigContainer_settings on Settings {
        slack {
          channels {
            enabled
            name
            hookURL
            triggers {
              reportedComments
              pendingComments
              featuredComments
              allComments
              staffComments
            }
          }
        }
      }
    `,
    settings
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const onAddChannel = useCallback(() => {
    // We use push here because final form still has issues tracking new items
    // being inserted at the old array index.
    //
    // Ref: https://github.com/final-form/final-form-arrays/issues/44
    //
    form.mutators.push("slack.channels", {
      enabled: true,
      name: "",
      hookURL: "",
      triggers: {
        allComments: false,
        reportedComments: false,
        pendingComments: false,
        featuredComments: false,
        staffComments: false,
      },
    });
    setTimeout(() => {
      if (inputRef && inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  }, [form]);

  const onRemoveChannel = useCallback(
    (index: number) => {
      form.mutators.remove("slack.channels", index);
    },
    [form]
  );

  const computedValues = useMemo(() => {
    let formValues = {
      slack: {
        channels: [
          {
            enabled: false,
            name: "",
            hookURL: "",
            triggers: {
              allComments: false,
              reportedComments: false,
              pendingComments: false,
              featuredComments: false,
              staffComments: false,
            },
          },
        ],
      },
    };
    if (
      settingsData.slack &&
      settingsData.slack.channels &&
      settingsData.slack.channels.length > 0
    ) {
      formValues = pureMerge(formValues, settingsData);
    }

    return formValues;
  }, [settingsData]);

  useEffect(() => {
    form.initialize(computedValues);
  }, [computedValues, form]);

  return (
    <HorizontalGutter size="double">
      <ConfigBox
        title={
          <Localized id="configure-slack-header-title">
            <Header htmlFor="configure-slack-header.title">
              Slack Integrations
            </Header>
          </Localized>
        }
      >
        <Localized
          id="configure-slack-description"
          externalLink={
            <ExternalLink href="https://docs.coralproject.net/slack/" />
          }
        >
          <FormFieldDescription>
            Automatically send comments from Coral moderation queues to Slack
            channels. You will need Slack admin access to set this up. For steps
            on how to create a Slack App see our documentation.
          </FormFieldDescription>
        </Localized>
        <Button iconLeft onClick={onAddChannel}>
          <ButtonIcon size="md" className={styles.icon}>
            add
          </ButtonIcon>
          <Localized id="configure-slack-addChannel">Add Channel</Localized>
        </Button>
        <FieldArray name="slack.channels">
          {({ fields }) =>
            fields.map((channel: any, index: number) => (
              <SlackChannel
                key={index}
                channel={channel}
                disabled={false}
                index={index}
                onRemoveClicked={onRemoveChannel}
                form={form}
                ref={
                  fields.length && fields.length - 1 === index ? inputRef : null
                }
              />
            ))
          }
        </FieldArray>
      </ConfigBox>
    </HorizontalGutter>
  );
};

export default SlackConfigContainer;
