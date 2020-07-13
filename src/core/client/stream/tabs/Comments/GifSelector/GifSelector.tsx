import { Localized } from "@fluent/react/compat";
import React, {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useFetch } from "coral-framework/lib/relay";
import {
  BaseButton,
  Button,
  ButtonIcon,
  Flex,
  HorizontalGutter,
  InputLabel,
  TextField,
} from "coral-ui/components/v2";

import { GIF_RESULTS_LIMIT, GifResult, GifSearchFetch } from "./GifSearchFetch";
import GiphyAttribution from "./GiphyAttribution";

import styles from "./GifSelector.css";

interface Props {
  onGifSelect: (gif: GifResult) => void;
  value: GifResult | null;
}

const GifSelector: FunctionComponent<Props> = (props) => {
  const gifSearchFetch = useFetch(GifSearchFetch);
  const [results, setResults] = useState<GifResult[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState<string>("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const onSearchFieldChange = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      setQuery(evt.target.value);
    },
    []
  );
  const searchInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    // TODO: why doesn't this work?
    if (searchInput && searchInput.current) {
      searchInput.current.focus();
    }
  }, []);
  useEffect(() => {
    async function search() {
      if (query && query.length > 1) {
        try {
          const res = await gifSearchFetch({ query, page });
          const { pagination, data } = res.results.data;
          if (pagination.total_count > pagination.offset * GIF_RESULTS_LIMIT) {
            setHasNextPage(true);
          } else {
            setHasNextPage(false);
          }
          setSearchError(null);
          return setResults(data);
        } catch (error) {
          setSearchError(error.message);
        }
      }
    }
    void search();
  }, [query, page]);
  const nextPage = useCallback(() => {
    setPage(page + 1);
  }, [page]);
  const prevPage = useCallback(() => {
    setPage(page - 1);
  }, [page]);
  const onGifSelect = useCallback((gif: GifResult) => {
    setResults([]);
    setPage(0);
    setHasNextPage(false);
    setQuery("");
    props.onGifSelect(gif);
  }, []);
  return (
    <div className={styles.root}>
      <HorizontalGutter>
        <HorizontalGutter>
          <Localized id="comments-postComment-gifSearch">
            <InputLabel>Search for a gif</InputLabel>
          </Localized>
          <TextField
            className={styles.input}
            value={query}
            onChange={onSearchFieldChange}
            fullWidth
            variant="seamlessAdornment"
            color="streamBlue"
            adornment={
              <Button color="stream" className={styles.searchButton}>
                <ButtonIcon>search</ButtonIcon>
              </Button>
            }
          />
        </HorizontalGutter>
        {results.length > 0 && (
          <>
            <div>
              <Flex className={styles.results} justifyContent="space-evenly">
                {results.slice(0, results.length / 2).map((result) => (
                  <BaseButton
                    key={result.id}
                    onClick={() => onGifSelect(result)}
                    className={styles.result}
                  >
                    <img
                      src={result.images.fixed_height_downsampled.url}
                      alt={result.title}
                      className={styles.resultImg}
                    />
                  </BaseButton>
                ))}
              </Flex>
              <Flex className={styles.results} justifyContent="space-evenly">
                {results
                  .slice(results.length / 2, results.length)
                  .map((result) => (
                    <BaseButton
                      className={styles.result}
                      key={result.id}
                      onClick={() => onGifSelect(result)}
                    >
                      <img
                        src={result.images.fixed_height_downsampled.url}
                        alt={result.title}
                        className={styles.resultImg}
                      />
                    </BaseButton>
                  ))}
              </Flex>
            </div>
            <GiphyAttribution />
          </>
        )}
        {results.length > 0 && (
          <Flex
            justifyContent={
              results.length > 0 && hasNextPage && page > 0
                ? "space-between"
                : "flex-end"
            }
          >
            {results.length > 0 && page > 0 && (
              <Button
                onClick={prevPage}
                variant="outline"
                color="stream"
                iconLeft
              >
                <ButtonIcon>keyboard_arrow_left</ButtonIcon>
                Previous
              </Button>
            )}
            {results.length > 0 && hasNextPage && (
              <Button
                onClick={nextPage}
                variant="outline"
                color="stream"
                iconRight
              >
                Next
                <ButtonIcon>keyboard_arrow_right</ButtonIcon>
              </Button>
            )}
          </Flex>
        )}
        {searchError && <p className={styles.error}>{searchError}</p>}
        {!searchError && results.length === 0 && query.length > 0 && (
          <Localized
            id="comments-postComment-gifSearch-no-results"
            $query={query}
          >
            <p className={styles.noResults}>No results found for "{query}" </p>
          </Localized>
        )}
      </HorizontalGutter>
    </div>
  );
};

export default GifSelector;
