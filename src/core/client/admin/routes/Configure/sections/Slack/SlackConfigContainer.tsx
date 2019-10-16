import { FormApi } from "final-form";
import React, { FunctionComponent } from "react";
import { Field } from "react-final-form";

import { parseBool } from "coral-framework/lib/form";
import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import { Flex, HorizontalGutter } from "coral-ui/components";
import { Localized } from "fluent-react/compat";

import { SlackConfigContainer_settings } from "coral-admin/__generated__/SlackConfigContainer_settings.graphql";

import Header from "../../Header";
import SectionContent from "../../SectionContent";
import SlackChannelContainer from "./SlackChannelContainer";
import styles from "./SlackConfigContainer.css";

interface Props {
  form: FormApi;
  submitting: boolean;
  settings: SlackConfigContainer_settings;
}

const SlackConfigContainer: FunctionComponent<Props> = ({
  settings,
  form,
  submitting,
}) => {
  const { slack } = settings;
  return (
    <HorizontalGutter size="double">
      <Field name="slack.enabled" type="checkbox" parse={parseBool}>
        {({ input }) => (
          <Header
            className={styles.title}
            container={<Flex justifyContent="space-between" />}
          >
            <Localized id="configure-slack">
              <span>Slack settings</span>
            </Localized>
          </Header>
        )}
      </Field>
      <Field name="slack.enabled" subscription={{ value: true }}>
        {({ input: { value } }) => (
          <SectionContent>
            {slack &&
              slack.channels &&
              slack.channels.map((ch, i) => {
                if (!ch) {
                  return;
                }
                return (
                  <SlackChannelContainer
                    key={i}
                    channel={ch}
                    disabled={false}
                  />
                );
              })}
          </SectionContent>
        )}
      </Field>
    </HorizontalGutter>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment SlackConfigContainer_settings on Settings {
      slack {
        channels {
          ...SlackChannelContainer_slackChannel
        }
      }
    }
  `,
})(SlackConfigContainer);

export default enhanced;
