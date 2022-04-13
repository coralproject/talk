import { useRouter } from "found";
import { FunctionComponent, useEffect } from "react";

import { useGetMessage } from "coral-framework/lib/i18n";

interface Props {
  active: boolean;
}

const NavigationWarningContainer: FunctionComponent<Props> = ({ active }) => {
  const { router } = useRouter();
  const getMessage = useGetMessage();
  const warningMessage = getMessage(
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
