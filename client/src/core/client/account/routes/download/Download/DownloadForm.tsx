import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

import { HorizontalGutter } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import styles from "./DownloadForm.css";

interface Props {
  token: string;
}

const DownloadForm: FunctionComponent<Props> = ({ token }) => {
  const [submitted, setSubmitted] = useState(false);
  const onSubmit = useCallback(() => {
    setSubmitted(true);
    return true;
  }, [setSubmitted]);

  return (
    <HorizontalGutter size="double">
      <form
        className={styles.form}
        method="post"
        action="/api/account/download"
        onSubmit={onSubmit}
      >
        <input name="token" type="hidden" value={token} />
        <Localized id="download-landingPage-download">
          <Button
            type="submit"
            variant="filled"
            color="primary"
            paddingSize="medium"
            disabled={submitted}
            upperCase
          >
            Download
          </Button>
        </Localized>
      </form>
    </HorizontalGutter>
  );
};

export default DownloadForm;
