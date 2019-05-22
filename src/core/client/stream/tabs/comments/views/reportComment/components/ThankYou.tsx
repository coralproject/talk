import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { Button, HorizontalGutter, Typography } from "coral-ui/components";

import styles from "./ThankYou.css";

interface Props {
  onDismiss: () => void;
}

class ReportForm extends React.Component<Props> {
  public render() {
    const { onDismiss } = this.props;
    const Content: FunctionComponent = ({ children }) => (
      <Typography variant="bodyCopy">
        {children}
        {" "}
        <Localized id="comments-reportPopover-dismiss">
          <Button
            className={styles.dismiss}
            color="primary"
            variant="underlined"
            onClick={onDismiss}
          >
            Dismiss
          </Button>
        </Localized>
      </Typography>
    );

    return (
      <HorizontalGutter className={styles.root}>
        <Localized id="comments-reportPopover-thankYou">
          <Typography variant="heading2" className={styles.title}>
            Thank you!
          </Typography>
        </Localized>
        <div>
          <Localized id="comments-reportPopover-receivedMessage">
            <Content>
              We’ve received your message. Reports from members like you keep
              the community safe.
            </Content>
          </Localized>
        </div>
      </HorizontalGutter>
    );
  }
}

export default ReportForm;
