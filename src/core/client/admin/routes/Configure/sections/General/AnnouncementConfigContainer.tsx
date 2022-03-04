import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql, useFragment } from "react-relay";

import { useMutation } from "coral-framework/lib/relay";
import {
  Button,
  CallOut,
  FieldSet,
  FormFieldDescription,
} from "coral-ui/components/v2";

import { AnnouncementConfigContainer_settings$key as SettingsData } from "coral-admin/__generated__/AnnouncementConfigContainer_settings.graphql";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import Announcement from "./Announcement";
import AnnouncementFormModal from "./AnnouncementFormModal";
import CreateAnnouncementMutaiton from "./CreateAnnouncementMutation";
import DeleteAnnouncementMutaiton from "./DeleteAnnouncementMutation";

interface Props {
  settings: SettingsData;
  disabled: boolean;
}

const AnnouncementConfigContainer: FunctionComponent<Props> = ({
  settings,
  disabled,
}) => {
  const settingsData = useFragment(
    graphql`
      fragment AnnouncementConfigContainer_settings on Settings {
        announcement {
          content
          duration
          createdAt
        }
      }
    `,
    settings
  );

  const createAnnouncement = useMutation(CreateAnnouncementMutaiton);
  const deleteAnnouncement = useMutation(DeleteAnnouncementMutaiton);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState(null);
  const onClose = useCallback(() => {
    setShowForm(false);
  }, []);
  const onCreate = useCallback(
    (values) => {
      try {
        setSubmitError(null);
        void createAnnouncement(values);
        setShowForm(false);
      } catch (error) {
        setSubmitError(error.message);
      }
    },
    [createAnnouncement]
  );
  const onDelete = useCallback(() => {
    try {
      setSubmitError(null);
      void deleteAnnouncement();
    } catch (error) {
      setSubmitError(error.message);
      setShowForm(false);
    }
  }, [deleteAnnouncement]);
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
      {!settingsData.announcement && (
        <Localized id="configure-general-announcements-add">
          <Button disabled={disabled} onClick={() => setShowForm(true)}>
            Add announcement
          </Button>
        </Localized>
      )}
      <AnnouncementFormModal
        open={!settingsData.announcement && showForm}
        onSubmit={onCreate}
        onClose={onClose}
      />
      {submitError && (
        <CallOut fullWidth color="error">
          {submitError}
        </CallOut>
      )}
      {settingsData.announcement && settingsData.announcement.createdAt && (
        <>
          <Announcement
            content={settingsData.announcement.content}
            createdAt={settingsData.announcement.createdAt}
            duration={settingsData.announcement.duration}
          />
          <Localized id="configure-general-announcements-delete">
            <Button color="alert" onClick={onDelete}>
              Remove announcement
            </Button>
          </Localized>
        </>
      )}
    </ConfigBox>
  );
};

export default AnnouncementConfigContainer;
