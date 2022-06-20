import { Localized } from "@fluent/react/compat";
import { Router, useRouter } from "found";
import React, {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import { graphql } from "react-relay";

import { getModerationLink, QUEUE_NAME } from "coral-framework/helpers";
import { useEffectWhenChanged } from "coral-framework/hooks";
import { useCoralContext } from "coral-framework/lib/bootstrap/CoralContext";
import { useFetch, withFragmentContainer } from "coral-framework/lib/relay";
import { GQLFEATURE_FLAG } from "coral-framework/schema";
import { PropTypesOf } from "coral-framework/types";
import { Flex, Spinner } from "coral-ui/components/v2";
import { blur } from "coral-ui/helpers";
import {
  ListBoxOptionClickOrEnterHandler,
  ListBoxOptionElement,
} from "coral-ui/hooks/useComboBox";

import { ModerateSearchBarContainer_settings as SettingsData } from "coral-admin/__generated__/ModerateSearchBarContainer_settings.graphql";
import { ModerateSearchBarContainer_story as ModerationQueuesData } from "coral-admin/__generated__/ModerateSearchBarContainer_story.graphql";
import { SearchStoryFetchQueryResponse } from "coral-admin/__generated__/SearchStoryFetchQuery.graphql";

import Bar from "./Bar";
import GoToAriaInfo from "./GoToAriaInfo";
import ModerateAllOption from "./ModerateAllOption";
import Option from "./Option";
import OptionDetail from "./OptionDetail";
import SearchStoryFetch from "./SearchStoryFetch";
import SeeAllOption from "./SeeAllOption";

interface Props {
  story: ModerationQueuesData | null;
  settings: SettingsData | null;
  allStories: boolean;
  siteSelector: React.ReactNode;
  sectionSelector?: React.ReactNode;
  siteID: string | null;
  queueName: QUEUE_NAME | undefined;
}

type SearchBarOptions = PropTypesOf<typeof Bar>["options"];

/**
 * useLinkNavHandler returns a handler that navigates to `href` prop and blurs
 * the TextField.
 *
 * @param router Router from the _found_ library
 * @returns A handler for ListBoxOption
 */
function useLinkNavHandler(router: Router): ListBoxOptionClickOrEnterHandler {
  const { window } = useCoralContext();
  return useCallback(
    (evt: MouseEvent | KeyboardEvent, element: ListBoxOptionElement) => {
      if (element.props.href) {
        router.push(element.props.href);
        if (evt.preventDefault) {
          // We prevent default behavior because we handled navigation ourselves
          // and the browser don't need to follow anchor hrefs natively.
          evt.preventDefault();
        }
        // Blur will inactivate the textfield and close the popover/listbox.
        blur(window);
      }
    },
    [router, window]
  );
}

function getStoryDetails(
  {
    multisite,
    featureFlags,
  }: SettingsData | SearchStoryFetchQueryResponse["settings"],
  {
    site,
    metadata,
  }:
    | ModerationQueuesData
    | SearchStoryFetchQueryResponse["stories"]["edges"][0]["node"]
) {
  return (
    <Flex itemGutter>
      {/* If we're multisite, show the site name. */}
      {multisite && <OptionDetail variant="bold">{site.name}</OptionDetail>}
      {/* If the section is available, show it on the story result */}
      {!multisite &&
        featureFlags.includes(GQLFEATURE_FLAG.SECTIONS) &&
        (metadata?.section ? (
          <OptionDetail variant="bold">{metadata.section}</OptionDetail>
        ) : (
          <Localized id="moderate-section-uncategorized">
            <OptionDetail variant="muted">Uncategorized</OptionDetail>
          </Localized>
        ))}
      {/* If the author is available, show it on the story result */}
      {metadata?.author && <OptionDetail>{metadata.author}</OptionDetail>}
    </Flex>
  );
}

function getContextOptionsWhenModeratingAll(
  onClickOrEnter: ListBoxOptionClickOrEnterHandler,
  siteID: string | null,
  queue: QUEUE_NAME | undefined
): SearchBarOptions {
  return [
    {
      element: (
        <Option href={getModerationLink({ queue, siteID })}>
          <GoToAriaInfo />
          <Localized id="moderate-searchBar-allStories">
            <span>All stories</span>
          </Localized>
        </Option>
      ),
      onClickOrEnter,
      group: "CONTEXT",
    },
  ];
}

function getContextOptionsWhenModeratingStory(
  onClickOrEnter: ListBoxOptionClickOrEnterHandler,
  settings: SettingsData | null,
  story: ModerationQueuesData | null,
  siteID: string | null,
  queue: QUEUE_NAME | undefined
): SearchBarOptions {
  if (story === null || settings === null) {
    return [];
  }
  return [
    {
      element: (
        <Option
          href={getModerationLink({ queue, storyID: story.id })}
          details={getStoryDetails(settings, story)}
        >
          <GoToAriaInfo /> {story.metadata && story.metadata.title}
        </Option>
      ),
      onClickOrEnter,
      group: "CONTEXT",
    },
    {
      element: (
        <ModerateAllOption
          href={getModerationLink({
            queue,
            siteID: siteID || (story && story.site.id),
          })}
        />
      ),
      onClickOrEnter,
      group: "CONTEXT",
    },
  ];
}

type OnSearchCallback = (search: string) => void;

interface SearchParams {
  query: string;
  limit: number;
  siteIDs?: string[];
}
/**
 * useSearchOptions
 *
 * @param onClickOrEnter A handler that reacts to click or enter for the search options
 * @param story Current active story
 */
function useSearchOptions(
  onClickOrEnter: ListBoxOptionClickOrEnterHandler,
  story: ModerationQueuesData | null,
  siteID: string | null,
  queue: QUEUE_NAME | undefined
): [SearchBarOptions, OnSearchCallback] {
  const searchStory = useFetch(SearchStoryFetch);

  const [searchOptions, setSearchOptions] = useState<SearchBarOptions>([]);

  useEffectWhenChanged(() => {
    setSearchOptions([]);
  }, [story]);

  const searchCountRef = useRef(0);

  const onSearch = useCallback(
    async (search: string) => {
      const nextSearchOptions: SearchBarOptions = [];

      const searchCount = ++searchCountRef.current;

      setSearchOptions([
        {
          element: (
            <Option>
              <Spinner size="xs" />
            </Option>
          ),
          group: "SEARCH",
        },
      ]);

      const searchParams: SearchParams = {
        query: search,
        limit: 5,
      };
      if (siteID) {
        searchParams.siteIDs = [siteID];
      }
      const { settings, stories } = await searchStory(searchParams);
      if (searchCount !== searchCountRef.current) {
        // This result is old, so we can discard it.
        return;
      }

      if (stories.edges.length > 0) {
        stories.edges.forEach((e) => {
          // Don't show current story in search results.
          if (story && story.id === e.node.id) {
            return;
          }
          nextSearchOptions.push({
            element: (
              <Option
                href={getModerationLink({
                  queue,
                  storyID: e.node.id,
                  siteID: e.node.site.id,
                })}
                details={getStoryDetails(settings, e.node)}
              >
                <GoToAriaInfo /> {e.node.metadata && e.node.metadata.title}
              </Option>
            ),
            onClickOrEnter,
            group: "SEARCH",
          });
        });
      } else {
        nextSearchOptions.push({
          element: (
            <Option>
              <Flex justifyContent="center">
                <Localized id="moderate-searchBar-noStories">
                  <span>
                    We could not find any stories matching your criteria
                  </span>
                </Localized>
              </Flex>
            </Option>
          ),
          group: "SEARCH",
        });
      }
      if (stories.pageInfo.hasNextPage) {
        nextSearchOptions.push({
          element: (
            <SeeAllOption
              href={`/admin/stories?q=${encodeURIComponent(search)}`}
            />
          ),
          onClickOrEnter,
          group: "SEARCH",
        });
      }
      setSearchOptions(nextSearchOptions);
    },
    [siteID, searchStory, story, queue, onClickOrEnter]
  );

  return [searchOptions, onSearch];
}

const ModerateSearchBarContainer: React.FunctionComponent<Props> = (props) => {
  const { router } = useRouter();
  const linkNavHandler = useLinkNavHandler(router);
  const contextOptions: PropTypesOf<typeof Bar>["options"] = props.allStories
    ? getContextOptionsWhenModeratingAll(
        linkNavHandler,
        props.siteID,
        props.queueName
      )
    : getContextOptionsWhenModeratingStory(
        linkNavHandler,
        props.settings,
        props.story,
        props.siteID,
        props.queueName
      );

  const [searchOptions, onSearch] = useSearchOptions(
    linkNavHandler,
    props.story,
    props.siteID,
    props.queueName
  );

  const options = [...contextOptions, ...searchOptions];

  const childProps = {
    options,
    onSearch,
  };

  // Still loading the story..
  if (props.allStories) {
    return (
      <Localized id="moderate-searchBar-allStories" attrs={{ title: true }}>
        <Bar
          siteSelector={props.siteSelector}
          sectionSelector={props.sectionSelector}
          multisite={props.settings ? props.settings.multisite : false}
          title="All stories"
          {...childProps}
        />
      </Localized>
    );
  }
  if (!props.story) {
    return (
      <Bar
        multisite={props.settings ? props.settings.multisite : false}
        siteSelector={props.siteSelector}
        sectionSelector={props.sectionSelector}
        title={""}
        {...childProps}
      />
    );
  }

  const title = props.story.metadata && props.story.metadata.title;
  if (title) {
    return (
      <Bar
        multisite={props.settings ? props.settings.multisite : false}
        siteSelector={props.siteSelector}
        sectionSelector={props.sectionSelector}
        title={title}
        {...childProps}
      />
    );
  }

  return (
    <Localized
      id="moderate-searchBar-titleNotAvailable"
      attrs={{ title: true }}
    >
      <Bar
        siteSelector={props.siteSelector}
        sectionSelector={props.sectionSelector}
        multisite={props.settings ? props.settings.multisite : false}
        title={"Title not available"}
        options={options}
        onSearch={onSearch}
      />
    </Localized>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment ModerateSearchBarContainer_settings on Settings {
      multisite
      featureFlags
    }
  `,
  story: graphql`
    fragment ModerateSearchBarContainer_story on Story {
      id
      site {
        name
        id
      }
      metadata {
        title
        author
        section
      }
    }
  `,
})(ModerateSearchBarContainer);

export default enhanced;
