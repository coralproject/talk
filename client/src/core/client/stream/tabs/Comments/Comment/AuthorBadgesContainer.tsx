import cn from "classnames";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
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
            const flairBadge = settings.flairBadges?.badges.find(
              (b) => b.name === badge
            );

            if (flairBadge) {
              return (
                <img
                  key={badge}
                  src={flairBadge.url}
                  alt={flairBadge.name}
                  className={cn(
                    styles.flairBadge,
                    CLASSES.comment.topBar.flairBadge
                  )}
                />
              );
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
        badges {
          name
          url
        }
      }
    }
  `,
})(AuthorBadgesContainer);

export default enhanced;
