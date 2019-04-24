import { Match, Router, withRouter } from "found";
import React, {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useRef,
  useState,
} from "react";
import { graphql } from "react-relay";

import { ModerateSearchBarContainer_story as ModerationQueuesData } from "talk-admin/__generated__/ModerateSearchBarContainer_story.graphql";
import { useFetch, withFragmentContainer } from "talk-framework/lib/relay";
import { PropTypesOf } from "talk-framework/types";

import { SearchStoryFetch } from "talk-admin/fetches";
import { useEffectWhenChanged } from "talk-framework/hooks";
import { blur } from "talk-ui/helpers";
import {
  ListBoxOptionClickOrEnterHandler,
  ListBoxOptionElement,
} from "talk-ui/hooks/useComboBox";

import { Spinner } from "talk-ui/components";
import * as Search from "../components/Search";

interface Props {
  router: Router;
  match: Match;
  story: ModerationQueuesData | null;
  allStories: boolean;
}

function useLinkNavHandler(router: Router) {
  return useCallback(
    (evt: MouseEvent | KeyboardEvent, element: ListBoxOptionElement) => {
      if (element.props.href) {
        router.push(element.props.href);
        if (evt.preventDefault) {
          evt.preventDefault();
        }
        blur();
      }
    },
    [router]
  );
}

function getContextOptionsWhenModeratingAll(
  onClickOrEnter: ListBoxOptionClickOrEnterHandler
): PropTypesOf<typeof Search.Bar>["options"] {
  return [
    {
      element: (
        <Search.Option href="/admin/moderate">All stories</Search.Option>
      ),
      onClickOrEnter,
      group: "CONTEXT",
    },
  ];
}

function getContextOptionsWhenModeratingStory(
  onClickOrEnter: ListBoxOptionClickOrEnterHandler,
  story: ModerationQueuesData | null
): PropTypesOf<typeof Search.Bar>["options"] {
  if (story === null) {
    return [];
  }
  return [
    {
      element: (
        <Search.Option
          href={`/admin/moderate/${story.id}`}
          details={story.metadata && story.metadata.author}
        >
          {story.metadata && story.metadata.title}
        </Search.Option>
      ),
      onClickOrEnter,
      group: "CONTEXT",
    },
    {
      element: <Search.ModerateAllOption href="/admin/moderate" />,
      onClickOrEnter,
      group: "CONTEXT",
    },
  ];
}

function useSearchOptions(
  onClickOrEnter: ListBoxOptionClickOrEnterHandler,
  story: ModerationQueuesData | null
): [PropTypesOf<typeof Search.Bar>["options"], (search: string) => void] {
  const searchStory = useFetch(SearchStoryFetch);

  const [searchOptions, setSearchOptions] = useState<
    PropTypesOf<typeof Search.Bar>["options"]
  >([]);

  useEffectWhenChanged(() => {
    setSearchOptions([]);
  }, [story]);

  const searchCountRef = useRef(0);

  const onSearch = useCallback(
    async (search: string) => {
      const nextSearchOptions: PropTypesOf<typeof Search.Bar>["options"] = [];

      const searchCount = ++searchCountRef.current;

      setSearchOptions([
        {
          element: (
            <Search.Option>
              <Spinner size="xs" />
            </Search.Option>
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
              <Search.Option
                href={`/admin/moderate/${e.node.id}`}
                details={e.node.metadata && e.node.metadata.author}
              >
                {e.node.metadata && e.node.metadata.title}
              </Search.Option>
            ),
            onClickOrEnter,
            group: "SEARCH",
          });
        });
      } else {
        nextSearchOptions.push({
          element: <Search.Option>No results</Search.Option>,
          group: "SEARCH",
        });
      }
      if (stories.pageInfo.hasNextPage) {
        nextSearchOptions.push({
          element: (
            <Search.SeeAllOption
              href={`/admin/stories/search/${encodeURIComponent(search)}/`}
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
  const contextOptions: PropTypesOf<
    typeof Search.Bar
  >["options"] = props.allStories
    ? getContextOptionsWhenModeratingAll(linkNavHandler)
    : getContextOptionsWhenModeratingStory(linkNavHandler, props.story);

  const [searchOptions, onSearch] = useSearchOptions(
    linkNavHandler,
    props.story
  );

  if (!props.allStories && !props.story) {
    return (
      <Search.Bar
        title=""
        options={[...contextOptions, ...searchOptions]}
        onSearch={onSearch}
      />
    );
  }

  const title = props.allStories
    ? "All stories"
    : (props.story!.metadata && props.story!.metadata.title) ||
      "Title not available";

  return (
    <Search.Bar
      title={title}
      options={[...contextOptions, ...searchOptions]}
      onSearch={onSearch}
    />
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
