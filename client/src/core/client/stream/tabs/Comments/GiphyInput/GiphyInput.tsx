import { Localized } from "@fluent/react/compat";
import { GiphyFetch, SearchOptions } from "@giphy/js-fetch-api";
import { IGif } from "@giphy/js-types";
import { Grid } from "@giphy/react-components";
import React, {
  ChangeEventHandler,
  FunctionComponent,
  KeyboardEvent,
  Ref,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useDebounce from "react-use/lib/useDebounce";
import useResizeObserver from "use-resize-observer";

import { HorizontalGutter } from "coral-ui/components/v2";

import { GifSearchInput } from "../GifSearchInput/GifSearchInput";
import GiphyAttribution from "./GiphyAttribution";

import styles from "./GiphyInput.css";

const APPROX_COL_WIDTH = 120;

interface Props {
  onSelect: (gif: IGif) => void;
  forwardRef?: Ref<HTMLInputElement>;
  apiKey: string;
  maxRating: string;
}

const GiphyInput: FunctionComponent<Props> = ({
  onSelect,
  apiKey,
  maxRating,
}) => {
  const [query, setQuery] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const { ref, width = 1 } = useResizeObserver<HTMLDivElement>();

  const client = useMemo(() => new GiphyFetch(apiKey), [apiKey]);
  const fetchGifs = useCallback(
    async (offset: number) =>
      client.search(query, {
        offset,
        limit: 10,
        rating: maxRating as SearchOptions["rating"],
        sort: "relevant",
      }),
    [client, maxRating, query]
  );

  // Instead of updating the query with every keystroke, debounce the change to
  // that state parameter.
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [, cancelDebounce] = useDebounce(() => setQuery(debouncedQuery), 500, [
    debouncedQuery,
  ]);

  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setDebouncedQuery(e.target.value);
  }, []);

  // Focus on the input as soon as the input is available.
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const onKeyPress = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") {
      return;
    }

    e.preventDefault();
  }, []);

  const gridColumns = useMemo(() => {
    if (width < APPROX_COL_WIDTH * 2) {
      return 2;
    }
    return Math.floor(width / APPROX_COL_WIDTH);
  }, [width]);

  const onGifClick = useCallback(
    (gif: IGif) => {
      // Cancel any active timers that might cause the query to be changed.
      cancelDebounce();
      setQuery("");
      onSelect(gif);
    },
    [cancelDebounce, onSelect]
  );

  return (
    <div className={styles.root} ref={ref}>
      <HorizontalGutter>
        <GifSearchInput
          debouncedQuery={debouncedQuery}
          onChange={onChange}
          onKeyPress={onKeyPress}
          inputRef={inputRef}
        />
        <div className={styles.grid}>
          {query && (
            <Grid
              fetchGifs={fetchGifs}
              hideAttribution
              noLink={true}
              gutter={4}
              columns={gridColumns}
              noResultsMessage={
                <Localized
                  id="comments-postComment-gifSearch-no-results"
                  vars={{ query }}
                >
                  <p className={styles.noResults}>
                    No results found for "{query}"{" "}
                  </p>
                </Localized>
              }
              key={query}
              width={width}
              onGifClick={onGifClick}
            />
          )}
        </div>
        <GiphyAttribution />
      </HorizontalGutter>
    </div>
  );
};

export default GiphyInput;
