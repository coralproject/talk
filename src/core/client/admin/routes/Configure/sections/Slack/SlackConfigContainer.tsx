import { FormApi } from "final-form";
import { RouteProps } from "found";
import React from "react";
import { FieldArray } from "react-final-form-arrays";

import { pureMerge } from "coral-common/utils";
import { graphql, withFragmentContainer } from "coral-framework/lib/relay";
import { Button, HorizontalGutter } from "coral-ui/components";

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
  private onAddChannel: () => void;
  private onRemoveChannel: (index: number) => void;

  constructor(props: Props) {
    super(props);
    this.handleOnInitValues(this.props.settings);

    const mutators = this.props.form.mutators;
    this.onAddChannel = () => {
      mutators.push("slack.channels", {
        enabled: true,
        hookURL: "",
        triggers: {
          allComments: false,
          reportedComments: false,
          pendingComments: false,
          featuredComments: false,
        },
      });
    };
    this.onRemoveChannel = (index: number) => {
      mutators.remove("slack.channels", index);
    };
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
                    onRemoveClicked={this.onRemoveChannel}
                  />
                </div>
              ))
            }
          </FieldArray>
          <hr />
          <Button variant="filled" color="success" onClick={this.onAddChannel}>
            Add
          </Button>
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
