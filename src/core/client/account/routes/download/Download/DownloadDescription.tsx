import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import { Flex, HorizontalGutter, Icon } from "coral-ui/components/v2";

import styles from "./DownloadDescription.css";

const DownloadDescription: FunctionComponent = () => {
  return (
    <HorizontalGutter size="double">
      <Localized id="download-landingPage-title">
        <h1 className={styles.title}>Download your comment history</h1>
      </Localized>
      <div className={styles.content}>
        <div className={styles.section}>
          <Localized id="download-landingPage-description">
            <div className={styles.sectionText}>
              Your comment history will be downloaded into a .zip file. After
              your comment history is unzipped you will have a comma separated
              value (or .csv) file that you can easily import into your favorite
              spreadsheet application.
            </div>
          </Localized>
        </div>

        <div className={styles.section}>
          <Localized id="download-landingPage-contentsDescription">
            <div className={styles.sectionText}>
              For each of your comments the following information is included:
            </div>
          </Localized>
          <ul className={styles.list}>
            <li>
              <Flex alignItems="flex-start">
                <Icon size="md" className={styles.bullet}>
                  check
                </Icon>
                <Localized id="download-landingPage-contentsDate">
                  <div className={cn(styles.sectionText, styles.listContent)}>
                    When you wrote the comment
                  </div>
                </Localized>
              </Flex>
            </li>
            <li>
              <Flex alignItems="flex-start">
                <Icon size="md" className={styles.bullet}>
                  check
                </Icon>
                <Localized id="download-landingPage-contentsUrl">
                  <div className={cn(styles.sectionText, styles.listContent)}>
                    The permalink URL for the comment
                  </div>
                </Localized>
              </Flex>
            </li>
            <li>
              <Flex alignItems="flex-start">
                <Icon size="md" className={styles.bullet}>
                  check
                </Icon>
                <Localized id="download-landingPage-contentsText">
                  <div className={cn(styles.sectionText, styles.listContent)}>
                    The comment text
                  </div>
                </Localized>
              </Flex>
            </li>
            <li>
              <Flex alignItems="flex-start">
                <Icon size="md" className={styles.bullet}>
                  check
                </Icon>
                <Localized id="download-landingPage-contentsStoryUrl">
                  <div className={cn(styles.sectionText, styles.listContent)}>
                    The URL on the article or story where the comment appears
                  </div>
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
