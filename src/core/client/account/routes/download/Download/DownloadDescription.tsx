import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { Flex, HorizontalGutter, Icon, Typography } from "coral-ui/components";

import styles from "./DownloadDescription.css";

const DownloadDescription: FunctionComponent = () => {
  return (
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
              value (or .csv) file that you can easily import into your favorite
              spreadsheet application.
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
                    className={cn(styles.sectionText, styles.listContent)}
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
                    className={cn(styles.sectionText, styles.listContent)}
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
                    className={cn(styles.sectionText, styles.listContent)}
                  >
                    The URL on the article or story where the comment appears
                  </Typography>
                </Localized>
              </Flex>
            </li>
          </ul>
        </div>
      </div>
    </HorizontalGutter>
  );
};

export default DownloadDescription;
