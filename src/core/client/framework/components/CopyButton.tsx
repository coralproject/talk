import { Localized } from "@fluent/react/compat";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import CopyToClipboard from "react-copy-to-clipboard";

import { useCoralContext } from "coral-framework/lib/bootstrap/CoralContext";
import { Button } from "coral-ui/components/v2";
import { PropTypesOf } from "coral-ui/types";

interface Props extends Omit<PropTypesOf<typeof Button>, "ref"> {
  text: string;
  inner?: React.ReactNode;
  innerCopied?: React.ReactNode;
}

const CopyButton: FunctionComponent<Props> = ({
  text,
  color,
  size,
  inner,
  innerCopied,
  ...rest
}) => {
  const { window } = useCoralContext();
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    setCopied(true);
  }, [setCopied]);

  // Handle the animation event associated with toggling the copied state.
  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setCopied(false);
    }, 500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [copied, window]);

  return (
    <CopyToClipboard text={text} onCopy={handleCopy}>
      <Button color={color || "mono"} variant="flat" {...rest}>
        {copied ? (
          innerCopied ? (
            innerCopied
          ) : (
            <Localized id="framework-copyButton-copied">
              <span>Copied!</span>
            </Localized>
          )
        ) : inner ? (
          inner
        ) : (
          <Localized id="framework-copyButton-copy">
            <span>Copy</span>
          </Localized>
        )}
      </Button>
    </CopyToClipboard>
  );
};

export default CopyButton;
