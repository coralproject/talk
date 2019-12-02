import { FormApi } from "final-form";
import { Localized } from "fluent-react/compat";
import { RouteProps } from "found";
import React from "react";
import { FieldArray } from "react-final-form-arrays";

import { pureMerge } from "coral-common/utils";
import { ExternalLink } from "coral-framework/lib/i18n/components";
import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import { FormFieldDescription, HorizontalGutter } from "coral-ui/components/v2";

import { SlackConfigContainer_settings } from "coral-admin/__generated__/SlackConfigContainer_settings.graphql";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import SlackChannel from "./SlackChannel";

interface Props {
  form: FormApi;
  submitting: boolean;
  settings: SlackConfigContainer_settings;
}

interface Channel {
  enabled: boolean;
  hookURL: string;
  triggers: {
    allComments: boolean;
    reportedComments: boolean;
    pendingComments: boolean;
    featuredComments: boolean;
  };
}

class SlackConfigContainer extends React.Component<Props> {
  public static routeConfig: RouteProps;
  private initialValues = {
    slack: {
      channels: new Array<Channel>(),
    },
  };

  constructor(props: Props) {
    super(props);
    this.handleOnInitValues(this.props.settings);
  }

  public componentDidMount() {
    this.props.form.initialize(this.initialValues);
  }

  private handleOnInitValues = (values: any) => {
    if (
      !values ||
      !values.slack ||
      !values.slack.channels ||
      values.slack.channels.length === 0
    ) {
      this.initialValues = {
        slack: {
          channels: [
            {
              enabled: false,
              hookURL: "",
              triggers: {
                allComments: false,
                reportedComments: false,
                pendingComments: false,
                featuredComments: false,
              },
            },
          ],
        },
      };
    } else {
      this.initialValues = pureMerge(this.initialValues, values);
    }
  };

  public render() {
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
              channels. You will need Slack admin access to set this up. For
              steps on how to create a Slack App see our documentation.
            </FormFieldDescription>
          </Localized>
          <FieldArray name="slack.channels">
            {({ fields }) =>
              fields.map((channel: any, index: number) => (
                <div key={index}>
                  <SlackChannel
                    channel={channel}
                    disabled={false}
                    index={index}
                  />
                </div>
              ))
            }
          </FieldArray>
        </ConfigBox>
      </HorizontalGutter>
    );
  }
}

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment SlackConfigContainer_settings on Settings {
      slack {
        channels {
          enabled
          hookURL
          triggers {
            allComments
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
