import { useRouter } from "found";
import { FunctionComponent, useEffect } from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { getMessage } from "coral-framework/lib/i18n";

interface Props {
  active: boolean;
}

const NavigationWarningContainer: FunctionComponent<Props> = ({ active }) => {
  const { router } = useRouter();
  const { localeBundles } = useCoralContext();
  const warningMessage = getMessage(
    localeBundles,
    "configure-unsavedInputWarning",
    "You have unsaved changes. Are you sure you want to continue?"
  );
  useEffect(() => {
    const removeTransitionHook = router.addNavigationListener(() =>
      active ? warningMessage : undefined
    );
    return () => {
      removeTransitionHook();
    };
  }, [active]);
  return null;
};

export default NavigationWarningContainer;
