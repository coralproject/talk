import { FormApi } from "final-form";
import { Localized } from "fluent-react/compat";
import { RouteProps } from "found";
import React from "react";
import { FieldArray } from "react-final-form-arrays";

import { pureMerge } from "coral-common/utils";
import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import { HorizontalGutter, Typography } from "coral-ui/components";

import { SlackConfigContainer_settings } from "coral-admin/__generated__/SlackConfigContainer_settings.graphql";

import Header from "../../Header";
import SectionContent from "../../SectionContent";
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
        <Localized id="configure-slack-header-title">
          <Header>Slack Integrations</Header>
        </Localized>
        <SectionContent>
          <Localized id="configure-slack-description">
            <Typography variant="bodyShort">
              Automatically send comments from Coral moderation queues to Slack
              channels. You will need Slack admin access to set this up.
            </Typography>
          </Localized>
        </SectionContent>
        <SectionContent>
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
        </SectionContent>
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
