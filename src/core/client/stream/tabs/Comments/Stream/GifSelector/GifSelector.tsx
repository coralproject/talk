// import { Localized } from "@fluent/react/compat";
import React, {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useState,
  useEffect,
  useRef,
} from "react";

import { useFetch } from "coral-framework/lib/relay";
import { BaseButton, Button, ButtonIcon, Flex } from "coral-ui/components/v2";

import { GifResult, GifSearchFetch, GIF_RESULTS_LIMIT } from "./GifSearchFetch";

// import styles from "./GifSelector.css";

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
      const query = evt.target.value;
      setQuery(query);
    },
    []
  );
  const searchInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (searchInput && searchInput.current) {
      searchInput.current.focus();
    }
  }, [searchInput]);
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
    <div>
      <input ref={searchInput} value={query} onChange={onSearchFieldChange} />
      <Flex wrap={true}>
        {results.map((result) => (
          <BaseButton key={result.id} onClick={() => onGifSelect(result)}>
            <img src={result.images.fixed_height_small.url} />
          </BaseButton>
        ))}
      </Flex>
      {results.length > 0 && page > 0 && (
        <Button onClick={prevPage}>
          <ButtonIcon>left</ButtonIcon>
          Previous
        </Button>
      )}
      {results.length > 0 && hasNextPage && (
        <Button onClick={nextPage}>
          <ButtonIcon>right</ButtonIcon>
          Next
        </Button>
      )}
    </div>
  );
};

export default GifSelector;
