import { Localized } from "@fluent/react/compat";
import { Match, Router, withRouter } from "found";
import React, { FunctionComponent, useCallback } from "react";

import ConfigBox from "coral-admin/routes/Configure/ConfigBox";
import Header from "coral-admin/routes/Configure/Header";
import { urls } from "coral-framework/helpers";
import { HorizontalGutter } from "coral-ui/components/v2";

import { ConfigureExternalModerationPhaseForm } from "../ConfigureExternalModerationPhaseForm";
import ExperimentalExternalModerationPhaseCallOut from "../ExperimentalExternalModerationPhaseCallOut";

interface Props {
  router: Router;
  match: Match;
}

const AddExternalModerationPhaseContainer: FunctionComponent<Props> = ({
  router,
}) => {
  const onCancel = useCallback(() => {
    router.push(urls.admin.moderationPhases);
  }, [router]);

  return (
    <HorizontalGutter size="double">
      <ExperimentalExternalModerationPhaseCallOut />
      <ConfigBox
        title={
          <Localized id="configure-moderationPhases-addExternalModerationPhase">
            <Header>Add external moderation phase</Header>
          </Localized>
        }
      >
        <ConfigureExternalModerationPhaseForm
          phase={null}
          onCancel={onCancel}
        />
      </ConfigBox>
    </HorizontalGutter>
  );
};

const enhanced = withRouter(AddExternalModerationPhaseContainer);

export default enhanced;
