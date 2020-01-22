import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

import { useMutation } from "coral-framework/lib/relay";
import { Button, FieldSet } from "coral-ui/components/v2";
import { PropTypesOf } from "coral-ui/types";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import AnnouncementForm from "./AnnouncementForm";
import CreateAnnouncementMutaiton from "./CreateAnnouncementMutation";
import DeleteAnnouncementMutaiton from "./DeleteAnnouncementMutation";

interface Props {
  settings: PropTypesOf<typeof AnnouncementForm>["settings"];
}

const AnnouncementConfig: FunctionComponent<Props> = ({
  settings,
  ...rest
}) => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const createAnnouncement = useMutation(CreateAnnouncementMutaiton);
  const deleteAnnouncement = useMutation(DeleteAnnouncementMutaiton);
  const onCreate = useCallback(values => {
    createAnnouncement(values.announcement);
  }, []);
  const onDelete = useCallback(() => deleteAnnouncement(), []);
  return (
    <ConfigBox
      title={
        <Localized id="configure-general-announcements-title">
          <Header container={<legend />}>Community announcement</Header>
        </Localized>
      }
      container={<FieldSet />}
    >
      {!settings.announcement && (
        <Button onClick={() => setShowForm(true)}>Add announcement</Button>
      )}
      {showForm && (
        <AnnouncementForm
          settings={{ announcement: null }}
          onSubmit={onCreate}
          disabled={false}
        />
      )}
      {settings.announcement && (
        <>
          <AnnouncementForm settings={settings} disabled={false} />
          <Button onClick={onDelete}>Delete announcement</Button>
        </>
      )}
    </ConfigBox>
  );
};

export default AnnouncementConfig;
