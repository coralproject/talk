import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

import {
  Button,
  CallOut,
  FieldSet,
  FormFieldDescription,
} from "coral-ui/components/v2";
import { PropTypesOf } from "coral-ui/types";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import Announcement from "./Announcement";
import AnnouncementForm from "./AnnouncementForm";

interface Props {
  settings: PropTypesOf<typeof AnnouncementForm>["settings"];
  createAnnouncement: (values: any) => void;
  deleteAnnouncement: () => void;
}

const AnnouncementConfig: FunctionComponent<Props> = ({
  settings,
  createAnnouncement,
  deleteAnnouncement,
  ...rest
}) => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState(null);
  const onClose = useCallback(() => {
    setShowForm(false);
  }, [showForm]);
  const onCreate = useCallback(values => {
    try {
      setSubmitError(null);
      createAnnouncement(values.announcement);
    } catch (error) {
      setSubmitError(error.message);
    }
  }, []);
  const onDelete = useCallback(() => {
    try {
      setSubmitError(null);
      deleteAnnouncement();
    } catch (error) {
      setSubmitError(error.message);
    }
  }, []);
  return (
    <ConfigBox
      title={
        <Localized id="configure-general-announcements-title">
          <Header container={<legend />}>Community announcement</Header>
        </Localized>
      }
      container={<FieldSet />}
    >
      <Localized id="configure-general-announcements-description">
        <FormFieldDescription>
          Add a temporary announcement that will appear at the top of all of
          your organization’s comment streams for a specific amount of time.
        </FormFieldDescription>
      </Localized>
      {!settings.announcement && !showForm && (
        <Button onClick={() => setShowForm(true)}>Add announcement</Button>
      )}
      {!settings.announcement && showForm && (
        <AnnouncementForm
          settings={{ announcement: null }}
          onSubmit={onCreate}
          onClose={onClose}
          disabled={false}
        />
      )}
      {submitError && (
        <CallOut fullWidth color="error">
          {submitError}
        </CallOut>
      )}
      {settings.announcement && settings.announcement.createdAt && (
        <>
          <Announcement
            content={settings.announcement.content}
            createdAt={settings.announcement.createdAt}
            duration={settings.announcement.duration}
          />
          <Button color="alert" onClick={onDelete}>
            Delete announcement
          </Button>
        </>
      )}
    </ConfigBox>
  );
};

export default AnnouncementConfig;
