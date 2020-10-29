import { Localized } from "@fluent/react/compat";
import { GiphyFetch, SearchOptions } from "@giphy/js-fetch-api";
import { IGif } from "@giphy/js-types";
import { Grid } from "@giphy/react-components";
import React, {
  ChangeEvent,
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

import {
  Button,
  ButtonIcon,
  HorizontalGutter,
  InputLabel,
  TextField,
} from "coral-ui/components/v2";

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
  const [query, setQuery] = useState<string>("");
  const [debouncedInput, setDebouncedInput] = useState<string>("");
  useDebounce(() => setQuery(debouncedInput), 500, [debouncedInput]);

  const inputRef = useRef<HTMLInputElement>(null);
  const { ref, width = 1 } = useResizeObserver<HTMLDivElement>();
  const fetchGifs = useMemo(() => {
    const gf = new GiphyFetch(apiKey);
    return async (offset: number) =>
      gf.search(query, {
        offset,
        limit: 10,
        rating: maxRating as SearchOptions["rating"],
        sort: "relevant",
      });
    }, [apiKey, maxRating]);
  const onChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    setDebouncedInput(evt.target.value);
  }, []);

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

  const onClick = useCallback(
    (gif: IGif) => {
      setQuery("");
      onSelect(gif);
    },
    [onSelect]
  );

  return (
    <div className={styles.root} ref={ref}>
      <HorizontalGutter>
        <HorizontalGutter>
          <Localized id="comments-postComment-gifSearch">
            <InputLabel htmlFor="coral-comments-postComment-gifSearch">
              Search for a GIF
            </InputLabel>
          </Localized>
          <TextField
            className={styles.input}
            value={debouncedInput}
            onChange={onChange}
            onKeyPress={onKeyPress}
            fullWidth
            variant="seamlessAdornment"
            color="streamBlue"
            id="coral-comments-postComment-gifSearch"
            adornment={
              <Localized
                id="comments-postComment-gifSearch-search"
                attrs={{ "aria-label": true }}
              >
                <Button
                  color="stream"
                  className={styles.searchButton}
                  aria-label="Search"
                >
                  <ButtonIcon>search</ButtonIcon>
                </Button>
              </Localized>
            }
            ref={inputRef}
          />
        </HorizontalGutter>
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
                  $query={query}
                >
                  <p className={styles.noResults}>
                    No results found for "{query}"{" "}
                  </p>
                </Localized>
              }
              key={query}
              width={width}
              onGifClick={(result) => onClick(result)}
            />
          )}
        </div>

        <GiphyAttribution />
      </HorizontalGutter>
    </div>
  );
};

export default GiphyInput;
