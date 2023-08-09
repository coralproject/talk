import cn from "classnames";
import React, { FunctionComponent, ReactElement } from "react";
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
            let tagChild: ReactElement<any, any> | string = badge;
            let displayBadge = true;
            if (/\.(jpe?g|png|gif)$/i.test(badge)) {
              if (settings.flairBadges?.flairBadgeURLs?.includes(badge)) {
                className = cn(className, styles.flairBadge);
                tagChild = <img src={badge} alt="" />;
              } else {
                // if a badge matches the image regex but is not included in flairBadgeURL
                // config, then we don't display it
                displayBadge = false;
              }
            }
            return (
              <>
                {displayBadge && (
                  <Tag key={badge} color="dark" className={className}>
                    {tagChild}
                  </Tag>
                )}
              </>
            );
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
