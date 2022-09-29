import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { useField } from "react-final-form";
import { graphql } from "react-relay";

import { ValidationMessage } from "coral-framework/lib/form";
import { ExternalLink } from "coral-framework/lib/i18n/components";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { validateWebhookEventSelection } from "coral-framework/lib/validation";
import {
  Button,
  CheckBox,
  Flex,
  FormField,
  FormFieldDescription,
  HelperText,
  Label,
  ListGroup,
  ListGroupRow,
  Typography,
} from "coral-ui/components/v2";

import {
  EventsSelectField_settings,
  WEBHOOK_EVENT_NAME,
} from "coral-admin/__generated__/EventsSelectField_settings.graphql";

import styles from "./EventsSelectField.css";

interface Props {
  settings: EventsSelectField_settings;
}

const EventsSelectField: FunctionComponent<Props> = ({ settings }) => {
  const { input: all } = useField<boolean>("all");
  const { input: events, meta } = useField<WEBHOOK_EVENT_NAME[]>("events", {
    validate: validateWebhookEventSelection,
  });

  const onClear = useCallback(() => {
    if (all.value) {
      all.onChange(false);
    } else {
      events.onChange([]);
    }
  }, [all, events]);

  const onCheckChange = useCallback(
    (event: WEBHOOK_EVENT_NAME, selectedIndex: number) => () => {
      const changed = [...events.value];
      if (selectedIndex >= 0) {
        changed.splice(selectedIndex, 1);
      } else {
        changed.push(event);
      }

      events.onChange(changed);
    },
    [events]
  );

  const onReceiveAll = useCallback(() => {
    all.onChange(true);
  }, [all]);

  return (
    <FormField>
      <Flex justifyContent="space-between">
        <Localized id="configure-webhooks-eventsToSend">
          <Label>Events to send</Label>
        </Localized>
        {(all.value || events.value.length > 0) && (
          <Localized id="configure-webhooks-clearEventsToSend">
            <Button variant="text" onClick={onClear}>
              Clear
            </Button>
          </Localized>
        )}
      </Flex>
      <Localized
        id="configure-webhooks-eventsToSendDescription"
        elems={{
          externalLink: (
            <ExternalLink href="https://github.com/coralproject/talk/blob/main/WEBHOOKS.md#events-listing" />
          ),
        }}
      >
        <FormFieldDescription>
          These are the events that are registered to this particular endpoint.
          Visit our{" "}
          <ExternalLink href="https://github.com/coralproject/talk/blob/main/WEBHOOKS.md#events-listing">
            Webhook Guide
          </ExternalLink>{" "}
          for the schema of these events. Any event matching the following will
          be sent to the endpoint if it is enabled:
        </FormFieldDescription>
      </Localized>
      <ListGroup className={styles.list}>
        {settings.webhookEvents.map((event) => {
          const selectedIndex = events.value.indexOf(event);
          return (
            <ListGroupRow key={event}>
              <CheckBox
                disabled={all.value}
                checked={all.value || selectedIndex >= 0}
                onChange={onCheckChange(event, selectedIndex)}
              >
                <Typography className={styles.event}>{event}</Typography>
              </CheckBox>
            </ListGroupRow>
          );
        })}
      </ListGroup>
      {all.value ? (
        <Localized id="configure-webhooks-allEvents">
          <HelperText>
            The endpoint will receive all events, including any added in the
            future.
          </HelperText>
        </Localized>
      ) : events.value.length > 0 ? (
        <Localized
          id="configure-webhooks-selectedEvents"
          vars={{ count: events.value.length }}
        >
          <HelperText>{events.value.length} event selected.</HelperText>
        </Localized>
      ) : (
        <Localized
          id="configure-webhooks-selectAnEvent"
          elems={{ button: <Button variant="text" onClick={onReceiveAll} /> }}
        >
          <HelperText>
            Select events above or{" "}
            <Button variant="text" onClick={onReceiveAll}>
              receive all events
            </Button>
            .
          </HelperText>
        </Localized>
      )}
      <ValidationMessage meta={meta} fullWidth />
    </FormField>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment EventsSelectField_settings on Settings {
      webhookEvents
    }
  `,
})(EventsSelectField);

export default enhanced;
