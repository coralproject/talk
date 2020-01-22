import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

import { Button, FieldSet } from "coral-ui/components/v2";
import { PropTypesOf } from "coral-ui/types";

import ConfigBox from "../../ConfigBox";
import Header from "../../Header";
import UpdateAnnouncementConfig from "./UpdateAnnouncementConfig";

interface Props {
  settings: PropTypesOf<typeof UpdateAnnouncementConfig>["settings"];
}

const AnnouncementConfig: FunctionComponent<Props> = ({ settings }) => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const onUpdate = useCallback(
    values => {
      // console.log(values);
    },
    [settings]
  );
  const onCreate = useCallback(
    values => {
      // console.log(values);
    },
    [settings]
  );
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
        <UpdateAnnouncementConfig
          settings={{ announcement: null }}
          onSubmit={onCreate}
        />
      )}
      {settings.announcement && (
        <UpdateAnnouncementConfig settings={settings} onSubmit={onUpdate} />
      )}
    </ConfigBox>
  );
};

export default AnnouncementConfig;
