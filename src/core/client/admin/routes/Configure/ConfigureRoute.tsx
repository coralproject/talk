import { FormApi, FormState } from "final-form";
import React, { FunctionComponent, useCallback, useState } from "react";

import { LanguageCode } from "coral-common/helpers/i18n";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { SubmitHookHandler } from "coral-framework/lib/form";
import { useMutation } from "coral-framework/lib/relay";

import Configure from "./Configure";
import NavigationWarningContainer from "./NavigationWarningContainer";
import UpdateSettingsMutation from "./UpdateSettingsMutation";

import { UpdateSettingsInput } from "coral-admin/__generated__/UpdateSettingsMutation.graphql";

interface Props {
  children: React.ReactElement;
}

const ConfigureRoute: FunctionComponent<Props> = ({ children }) => {
  const [dirtyState, setDirtyState] = useState(false);
  const { changeLocale } = useCoralContext();
  const updateSettings = useMutation(UpdateSettingsMutation);
  const handleExecute = async (
    data: UpdateSettingsInput["settings"],
    form: FormApi
  ) => {
    await updateSettings({ settings: data });
    const localeFieldState = form.getFieldState("locale");
    if (localeFieldState && localeFieldState.dirty) {
      await changeLocale(data.locale as LanguageCode);
    }
    form.initialize(data);
  };

  const handleChange = useCallback(
    ({ dirty }: FormState<any>) => {
      setDirtyState(dirty);
    },
    [setDirtyState]
  );

  return (
    <>
      <NavigationWarningContainer active={dirtyState} />
      <SubmitHookHandler onExecute={handleExecute}>
        {({ onSubmit }) => (
          <Configure onChange={handleChange} onSubmit={onSubmit}>
            {children}
          </Configure>
        )}
      </SubmitHookHandler>
    </>
  );
};

export default ConfigureRoute;
