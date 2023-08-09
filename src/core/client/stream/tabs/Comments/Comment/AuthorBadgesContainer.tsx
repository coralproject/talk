import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { Tag } from "coral-ui/components/v2";

import { AuthorBadgesContainer_settings } from "coral-stream/__generated__/AuthorBadgesContainer_settings.graphql";

import styles from "./AuthorBadgesContainer.css";

interface Props {
  badges: ReadonlyArray<string>;
  settings: AuthorBadgesContainer_settings;
  className?: string;
}

const AuthorBadgesContainer: FunctionComponent<Props> = ({
  badges,
  settings,
  className,
}) => {
  const flairBadgesEnabled = settings.flairBadges?.flairBadgesEnabled;
  return (
    <>
      {flairBadgesEnabled ? (
        <>
          {badges.map((badge) => {
            if (/\.(jpe?g|png|gif)$/i.test(badge)) {
              if (settings.flairBadges?.flairBadgeURLs?.includes(badge)) {
                // todo: add stable classname specific to flair badge
                return <img src={badge} alt="" className={styles.flairBadge} />;
              } else {
                return null;
              }
            } else {
              return (
                <Tag key={badge} color="dark" className={className}>
                  {badge}
                </Tag>
              );
            }
          })}
        </>
      ) : (
        <>
          {badges.map((badge) => (
            <Tag key={badge} color="dark" className={className}>
              {badge}
            </Tag>
          ))}
        </>
      )}
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment AuthorBadgesContainer_settings on Settings {
      flairBadges {
        flairBadgesEnabled
        flairBadgeURLs
      }
    }
  `,
})(AuthorBadgesContainer);

export default enhanced;
