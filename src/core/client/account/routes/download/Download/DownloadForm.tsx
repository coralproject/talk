import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useState } from "react";

import { Button, HorizontalGutter } from "coral-ui/components";

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
        <Localized id="download-landingPage-downloadComments">
          <Button
            type="submit"
            variant="filled"
            color="primary"
            disabled={submitted}
            className={styles.downloadButton}
          >
            Download My Comment History
          </Button>
        </Localized>
      </form>
    </HorizontalGutter>
  );
};

export default DownloadForm;
