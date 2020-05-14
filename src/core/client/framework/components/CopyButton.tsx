import { Localized } from "@fluent/react/compat";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import CopyToClipboard from "react-copy-to-clipboard";

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
  let timeout: any = null;
  const [copied, setCopied] = useState(false);

  // clear time out when we de-scope
  useEffect(() => {
    return function cleanup() {
      clearTimeout(timeout);
    };
  }, [timeout]);

  const timeoutCallback = useCallback(() => {
    setCopied(false);
  }, [setCopied]);

  const handleCopy = useCallback(() => {
    setCopied(true);
    clearTimeout(timeout);
    timeout = setTimeout(timeoutCallback, 500);
  }, [timeout, setCopied]);

  const copyBody = useMemo(() => {
    if (inner) {
      return inner;
    }

    return (
      <Localized id="framework-copyButton-copy">
        <span>Copy</span>
      </Localized>
    );
  }, [inner]);
  const copiedBody = useMemo(() => {
    if (innerCopied) {
      return innerCopied;
    }

    return (
      <Localized id="framework-copyButton-copied">
        <span>Copied!</span>
      </Localized>
    );
  }, [innerCopied]);

  return (
    <CopyToClipboard text={text} onCopy={handleCopy}>
      <Button color={color || "mono"} variant="flat" {...rest}>
        {copied ? copiedBody : copyBody}
      </Button>
    </CopyToClipboard>
  );
};

export default CopyButton;
