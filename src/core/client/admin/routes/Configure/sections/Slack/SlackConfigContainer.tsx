import { Localized } from "@fluent/react/compat";
import { FormApi } from "final-form";
import React, {
  FunctionComponent,
  useCallback,
  useMemo,
  useState,
} from "react";
import { FieldArray } from "react-final-form-arrays";

import { pureMerge } from "coral-common/utils";
import { ExternalLink } from "coral-framework/lib/i18n/components";
import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import {
  Button,
  ButtonIcon,
  FormFieldDescription,
  HorizontalGutter,
} from "coral-ui/components/v2";

import { SlackConfigContainer_settings } from "coral-admin/__generated__/SlackConfigContainer_settings.graphql";

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
  const [defaultValues] = useState({
    slack: {
      channels: [
        {
          enabled: false,
          name: "",
          hookURL: "",
          triggers: {
            reportedComments: false,
            pendingComments: false,
            featuredComments: false,
          },
        },
      ],
    },
  });

  const onAddChannel = useCallback(() => {
    const mutators = form.mutators;
    mutators.insert("slack.channels", 0, {
      enabled: true,
      hookURL: "",
      triggers: {
        reportedComments: false,
        pendingComments: false,
        featuredComments: false,
      },
    });
  }, [form]);
  const onRemoveChannel = useCallback(
    (index: number) => {
      const mutators = form.mutators;
      mutators.remove("slack.channels", index);
    },
    [form]
  );

  useMemo(() => {
    if (
      !settings ||
      !settings.slack ||
      !settings.slack.channels ||
      settings.slack.channels.length === 0
    ) {
      form.initialize(defaultValues);
    } else {
      const settingsValues = pureMerge(defaultValues, settings);
      form.initialize(settingsValues);
    }
  }, [settings, defaultValues]);

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
            <ExternalLink href="https://docs.coralproject.net/coral/v5/integrating/slack/" />
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
              <div key={index}>
                <SlackChannel
                  channel={channel}
                  disabled={false}
                  index={index}
                  onRemoveClicked={onRemoveChannel}
                />
              </div>
            ))
          }
        </FieldArray>
      </ConfigBox>
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
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
          }
        }
      }
    }
  `,
})(SlackConfigContainer);

export default enhanced;
