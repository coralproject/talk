import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import {
  Button,
  Flex,
  HorizontalGutter,
  Icon,
  Typography,
} from "coral-ui/components";

import styles from "./DownloadForm.css";

interface Props {
  token: string;
}

const DownloadForm: FunctionComponent<Props> = ({ token }) => {
  return (
    <div>
      <HorizontalGutter size="double">
        <Localized id="download-landingPage-title">
          <div className={styles.title}>Download Your Comment History</div>
        </Localized>
        <div className={styles.content}>
          <div className={styles.section}>
            <Localized id="download-landingPage-description">
              <Typography variant="bodyCopy" className={styles.sectionText}>
                Your comment history will be downloaded into a .zip file. After
                your comment history is unzipped you will have a comma separated
                value (or .csv) file that you can easily import into your
                favorite spreadsheet application.
              </Typography>
            </Localized>
          </div>

          <div className={styles.section}>
            <Localized id="download-landingPage-contentsDescription">
              <Typography variant="bodyCopy" className={styles.sectionText}>
                For each of your comments the following information is included:
              </Typography>
            </Localized>
            <ul className={styles.list}>
              <li>
                <Flex alignItems="center">
                  <Icon size="lg" className={styles.bullet}>
                    check
                  </Icon>
                  <Localized id="download-landingPage-contentsDate">
                    <Typography
                      variant="bodyCopy"
                      className={cn(styles.sectionText, styles.listContent)}
                    >
                      When you wrote the comment
                    </Typography>
                  </Localized>
                </Flex>
              </li>
              <li>
                <Flex alignItems="center">
                  <Icon size="lg" className={styles.bullet}>
                    check
                  </Icon>
                  <Localized id="download-landingPage-contentsUrl">
                    <Typography
                      variant="bodyCopy"
                      className={styles.sectionText}
                    >
                      The permalink URL for the comment
                    </Typography>
                  </Localized>
                </Flex>
              </li>
              <li>
                <Flex alignItems="center">
                  <Icon size="lg" className={styles.bullet}>
                    check
                  </Icon>
                  <Localized id="download-landingPage-contentsText">
                    <Typography
                      variant="bodyCopy"
                      className={styles.sectionText}
                    >
                      The comment text
                    </Typography>
                  </Localized>
                </Flex>
              </li>
              <li>
                <Flex alignItems="center">
                  <Icon size="lg" className={styles.bullet}>
                    check
                  </Icon>
                  <Localized id="download-landingPage-contentsStoryUrl">
                    <Typography
                      variant="bodyCopy"
                      className={styles.sectionText}
                    >
                      The URL on the article or story where the comment appears
                    </Typography>
                  </Localized>
                </Flex>
              </li>
            </ul>
          </div>

          <form
            className={styles.form}
            method="post"
            action="http://localhost:8080/api/account/download"
          >
            <input name="token" type="hidden" value={token} />
            <Localized id="download-landingPage-downloadComments ">
              <Button
                type="submit"
                variant="filled"
                color="primary"
                fullWidth={false}
                className={styles.downloadButton}
              >
                Download My Comment History
              </Button>
            </Localized>
          </form>
        </div>
      </HorizontalGutter>
    </div>
  );
};

export default DownloadForm;
