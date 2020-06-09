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

import styles from "./GifSelector.css";

interface Props {
  onGifSelect: (gif: GifResult) => void;
}

const GifSelector: FunctionComponent<Props> = (props) => {
  const gifSearchFetch = useFetch(GifSearchFetch);
  const [results, setResults] = useState<GifResult[]>([]);
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
        const res = await gifSearchFetch({ query, page });
        const { pagination, data } = res.results.data;
        if (pagination.total_count > pagination.offset * GIF_RESULTS_LIMIT) {
          setHasNextPage(true);
        } else {
          setHasNextPage(false);
        }
        return setResults(data);
      }
    }
    search();
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
            ref={searchInput}
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
          <Flex wrap={true}>
            {results.map((result) => (
              <BaseButton key={result.id} onClick={() => onGifSelect(result)}>
                <img
                  src={result.images.fixed_height_small.url}
                  alt={result.title}
                />
              </BaseButton>
            ))}
          </Flex>
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
      </HorizontalGutter>
    </div>
  );
};

export default GifSelector;
