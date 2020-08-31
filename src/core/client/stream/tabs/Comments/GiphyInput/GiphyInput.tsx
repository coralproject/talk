import { Localized } from "@fluent/react/compat";
import React, {
  ChangeEvent,
  FunctionComponent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

import { GiphyGif } from "coral-common/types/giphy";
import { useFetch } from "coral-framework/lib/relay";
import {
  BaseButton,
  Button,
  ButtonIcon,
  Flex,
  HorizontalGutter,
  Icon,
  InputLabel,
  TextField,
} from "coral-ui/components/v2";
import { CallOut } from "coral-ui/components/v3";

import { GIF_RESULTS_LIMIT, GifSearchFetch } from "./GifSearchFetch";
import GiphyAttribution from "./GiphyAttribution";

import styles from "./GiphyInput.css";

interface Props {
  onSelect: (gif: GiphyGif) => void;
}

const GiphyInput: FunctionComponent<Props> = ({ onSelect }) => {
  const gifSearchFetch = useFetch(GifSearchFetch);
  const [results, setResults] = useState<GiphyGif[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState<string>("");
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onChange = useCallback((evt: ChangeEvent<HTMLInputElement>) => {
    setQuery(evt.target.value);
  }, []);

  useEffect(() => {
    async function search() {
      try {
        const res = await gifSearchFetch({ query, page });
        const { pagination, data } = res;
        if (pagination.total_count > pagination.offset * GIF_RESULTS_LIMIT) {
          setHasNextPage(true);
        } else {
          setHasNextPage(false);
        }
        setError(null);
        setResults(data);
      } catch (err) {
        setError(err.message);
      }

      setIsLoading(false);
    }

    let timeout: any | null = null;

    if (query && query.length > 1) {
      setIsLoading(true);

      timeout = setTimeout(() => {
        timeout = null;
        void search();
      }, 200);
    } else {
      setPage(0);
      setResults([]);
      setIsLoading(false);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [query, page, setResults, setIsLoading, setPage, gifSearchFetch]);

  const nextPage = useCallback(() => {
    setPage((p) => p + 1);
  }, []);
  const prevPage = useCallback(() => {
    setPage((p) => p - 1);
  }, []);

  const onKeyPress = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") {
      return;
    }

    e.preventDefault();
  }, []);

  const onClick = useCallback(
    (gif: GiphyGif) => {
      setResults([]);
      setPage(0);
      setHasNextPage(false);
      setQuery("");
      onSelect(gif);
    },
    [onSelect]
  );

  return (
    <div className={styles.root}>
      <HorizontalGutter>
        <HorizontalGutter>
          <Localized id="comments-postComment-gifSearch">
            <InputLabel>Search for a GIF</InputLabel>
          </Localized>
          <TextField
            className={styles.input}
            value={query}
            onChange={onChange}
            onKeyPress={onKeyPress}
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
        {isLoading && (
          <Localized id="comments-postComment-gifSearch-loading">
            <p className={styles.loading}>Loading...</p>
          </Localized>
        )}
        {results.length > 0 && (
          <div>
            <Flex className={styles.results} justifyContent="space-evenly">
              {results.slice(0, results.length / 2).map((result) => (
                <BaseButton
                  key={result.id}
                  onClick={() => onClick(result)}
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
                    onClick={() => onClick(result)}
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
        )}
        {error && (
          <CallOut
            color="error"
            title={error}
            titleWeight="semiBold"
            icon={<Icon>error</Icon>}
          />
        )}
        <GiphyAttribution />
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
                variant="outlined"
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
                variant="outlined"
                color="stream"
                iconRight
              >
                Next
                <ButtonIcon>keyboard_arrow_right</ButtonIcon>
              </Button>
            )}
          </Flex>
        )}
        {!isLoading && !error && results.length === 0 && query.length > 1 && (
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

export default GiphyInput;
