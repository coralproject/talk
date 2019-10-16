import { FormApi } from "final-form";
import { RouteProps } from "found";
import React from "react";
import { FieldArray } from "react-final-form-arrays";

import { pureMerge } from "coral-common/utils";
import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import { HorizontalGutter } from "coral-ui/components";

import { SlackConfigContainer_settings } from "coral-admin/__generated__/SlackConfigContainer_settings.graphql";

import Header from "../../Header";
import SectionContent from "../../SectionContent";
import SlackChannel from "./SlackChannel";

interface Props {
  form: FormApi;
  submitting: boolean;
  settings: SlackConfigContainer_settings;
}

class SlackConfigContainer extends React.Component<Props> {
  public static routeConfig: RouteProps;
  private initialValues = {
    slack: {
      channels: [],
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
    this.initialValues = pureMerge(this.initialValues, values);
  };

  public render() {
    if (!this.props.settings) {
      return null;
    }
    if (!this.props.settings.slack) {
      return null;
    }
    if (!this.props.settings.slack.channels) {
      return null;
    }

    return (
      <HorizontalGutter size="double">
        <Header>Channels</Header>
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
                  <button
                    type="button"
                    onClick={() => {
                      this.props.form.mutators.remove("slack.channels", index);
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))
            }
          </FieldArray>
          <hr />
          <button
            type="button"
            onClick={() =>
              this.props.form.mutators.push("slack.channels", {
                enabled: true,
                hookURL: "",
                triggers: {
                  allComments: false,
                  reportedComments: false,
                  pendingComments: false,
                  featuredComments: false,
                },
              })
            }
          >
            Add
          </button>
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
