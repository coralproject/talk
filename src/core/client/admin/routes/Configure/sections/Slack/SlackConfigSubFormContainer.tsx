import React, { FunctionComponent, useMemo } from "react";
import { useForm } from "react-final-form";
import { graphql, useFragment } from "react-relay";

import { pureMerge } from "coral-common/utils";

import { SlackConfigSubFormContainer_settings$key } from "coral-admin/__generated__/SlackConfigSubFormContainer_settings.graphql";

import SlackConfigContainer from "./SlackConfigContainer";

interface Props {
  submitting: boolean;
  settings: SlackConfigSubFormContainer_settings$key;
}

const SlackConfigSubFormContainer: FunctionComponent<Props> = ({
  submitting,
  settings,
}) => {
  const settingsData = useFragment(
    graphql`
      fragment SlackConfigSubFormContainer_settings on Settings {
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

  const form = useForm();

  useMemo(() => {
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

    form.initialize(formValues);
  }, [settingsData, form]);

  return <SlackConfigContainer form={form} submitting={submitting} />;
};

export default SlackConfigSubFormContainer;
