import { Localized } from "@fluent/react/compat";
import { Match, Router, withRouter } from "found";
import React, {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import { graphql } from "react-relay";

import { getModerationLink } from "coral-admin/helpers";
import { useEffectWhenChanged } from "coral-framework/hooks";
import { useFetch, withFragmentContainer } from "coral-framework/lib/relay";
import { PropTypesOf } from "coral-framework/types";
import { Flex, Spinner } from "coral-ui/components/v2";
import { blur } from "coral-ui/helpers";
import {
  ListBoxOptionClickOrEnterHandler,
  ListBoxOptionElement,
} from "coral-ui/hooks/useComboBox";

import { ModerateSearchBarContainer_story as ModerationQueuesData } from "coral-admin/__generated__/ModerateSearchBarContainer_story.graphql";

import Bar from "./Bar";
import GoToAriaInfo from "./GoToAriaInfo";
import ModerateAllOption from "./ModerateAllOption";
import Option from "./Option";
import SearchStoryFetch from "./SearchStoryFetch";
import SeeAllOption from "./SeeAllOption";

interface Props {
  router: Router;
  match: Match;
  story: ModerationQueuesData | null;
  allStories: boolean;
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
        blur();
      }
    },
    [router]
  );
}

function getContextOptionsWhenModeratingAll(
  onClickOrEnter: ListBoxOptionClickOrEnterHandler
): SearchBarOptions {
  return [
    {
      element: (
        <Option href="/admin/moderate">
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
  story: ModerationQueuesData | null
): SearchBarOptions {
  if (story === null) {
    return [];
  }
  return [
    {
      element: (
        <Option
          href={`/admin/moderate/${story.id}`}
          details={story.metadata && story.metadata.author}
        >
          <GoToAriaInfo /> {story.metadata && story.metadata.title}
        </Option>
      ),
      onClickOrEnter,
      group: "CONTEXT",
    },
    {
      element: <ModerateAllOption href="/admin/moderate" />,
      onClickOrEnter,
      group: "CONTEXT",
    },
  ];
}

type OnSearchCallback = (search: string) => void;

/**
 * useSearchOptions
 *
 * @param onClickOrEnter A handler that reacts to click or enter for the search options
 * @param story Current active story
 */
function useSearchOptions(
  onClickOrEnter: ListBoxOptionClickOrEnterHandler,
  story: ModerationQueuesData | null
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

      const stories = await searchStory({ query: search, limit: 5 });
      if (searchCount !== searchCountRef.current) {
        // This result is old, so we can discard it.
        return;
      }

      if (stories.edges.length > 0) {
        stories.edges.forEach(e => {
          // Don't show current story in search results.
          if (story && story.id === e.node.id) {
            return;
          }
          nextSearchOptions.push({
            element: (
              <Option
                href={getModerationLink("default", e.node.id)}
                details={e.node.metadata && e.node.metadata.author}
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
    [story, searchStory, setSearchOptions]
  );

  return [searchOptions, onSearch];
}

const ModerateSearchBarContainer: React.FunctionComponent<Props> = props => {
  const linkNavHandler = useLinkNavHandler(props.router);
  const contextOptions: PropTypesOf<typeof Bar>["options"] = props.allStories
    ? getContextOptionsWhenModeratingAll(linkNavHandler)
    : getContextOptionsWhenModeratingStory(linkNavHandler, props.story);

  const [searchOptions, onSearch] = useSearchOptions(
    linkNavHandler,
    props.story
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
        <Bar title="All stories" {...childProps} />
      </Localized>
    );
  }
  if (!props.story) {
    return <Bar title={""} {...childProps} />;
  }
  const t = props.story.metadata && props.story.metadata.title;
  if (t) {
    return <Bar title={t} {...childProps} />;
  }
  return (
    <Localized
      id="moderate-searchBar-titleNotAvailable"
      attrs={{ title: true }}
    >
      <Bar
        title={"Title not available"}
        options={options}
        onSearch={onSearch}
      />
    </Localized>
  );
};

const enhanced = withRouter(
  withFragmentContainer<Props>({
    story: graphql`
      fragment ModerateSearchBarContainer_story on Story {
        id
        metadata {
          title
          author
        }
      }
    `,
  })(ModerateSearchBarContainer)
);

export default enhanced;
