import { Localized } from "@fluent/react/compat";
import React, {
  ChangeEventHandler,
  FunctionComponent,
  KeyboardEvent,
  Ref,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import useResizeObserver from "use-resize-observer";

import { useDebounce } from "coral-framework/hooks";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import useFetchWithAuth from "coral-stream/common/useFetchWithAuth";
import { ButtonSvgIcon, SearchIcon } from "coral-ui/components/icons";
import { Button, HorizontalGutter, TextField } from "coral-ui/components/v2";

import TenorAttribution from "./TenorAttribution";
import TenorGrid from "./TenorGrid";

import styles from "./TenorInput.css";

const DEBOUNCE_DELAY_MS = 1250;

interface Props {
  onSelect: (gif: GifResult) => void;
  forwardRef?: Ref<HTMLInputElement>;
}

export interface GifResult {
  id: string;
  url: string;
  preview: string;
  title?: string;
}

export interface SearchPayload {
  results: GifResult[];
  next?: string;
}

const TenorInput: FunctionComponent<Props> = ({ onSelect }) => {
  const { rootURL } = useCoralContext();
  const fetchWithAuth = useFetchWithAuth();

  const [query, setQuery] = useState("");
  const [next, setNext] = useState<string | null>(null);
  const [gifs, setGifs] = useState<GifResult[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const { ref } = useResizeObserver<HTMLDivElement>();

  const fetchGifs = useCallback(
    async (q: string, n?: string | null) => {
      if (!q || q.length === 0) {
        return null;
      }

      const url = new URL("/api/tenor/search", rootURL);
      url.searchParams.set("query", q);

      if (n) {
        url.searchParams.set("pos", n);
      }

      const response = await fetchWithAuth(url.toString());

      if (!response.ok) {
        return null;
      }

      const json = (await response.json()) as SearchPayload;
      if (!json) {
        return null;
      }

      return json;
    },
    [fetchWithAuth, rootURL]
  );

  const loadGifs = useCallback(async () => {
    const response = await fetchGifs(query);
    if (!response) {
      return;
    }

    setGifs(response.results);
    setNext(response.next ?? null);
  }, [query, fetchGifs]);

  const loadMoreGifs = useCallback(async () => {
    const response = await fetchGifs(query, next);
    if (!response) {
      return;
    }

    setGifs([...gifs, ...response.results]);
    setNext(response.next ?? null);
  }, [fetchGifs, gifs, query, next]);

  const debounceFetchGifs = useDebounce(loadGifs, DEBOUNCE_DELAY_MS);

  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(
    async (e) => {
      setQuery(e.target.value);
      setTimeout(debounceFetchGifs, 300);
    },
    [debounceFetchGifs, setQuery]
  );

  // Focus on the input as soon as the input is available.
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const onKeyPress = useCallback(
    async (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") {
        return;
      }

      debounceFetchGifs();

      e.preventDefault();
    },
    [debounceFetchGifs]
  );

  const onClickSearch = useCallback(async () => {
    setNext(null);
    await loadGifs();
  }, [loadGifs]);

  const onLoadMore = useCallback(async () => {
    if (!next) {
      return;
    }

    await loadMoreGifs();
  }, [loadMoreGifs, next]);

  const onGifClick = useCallback(
    (gif: GifResult) => {
      // Cancel any active timers that might cause the query to be changed.
      setQuery("");
      onSelect(gif);
    },
    [onSelect]
  );

  return (
    <div className={styles.root} ref={ref}>
      <HorizontalGutter>
        <TextField
          value={query}
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
                onClick={onClickSearch}
              >
                <ButtonSvgIcon Icon={SearchIcon} />
              </Button>
            </Localized>
          }
          ref={inputRef}
        />
        <TenorGrid
          gifs={query ? gifs : []}
          showLoadMore={
            !!(next && gifs && gifs.length > 0 && query?.length > 0)
          }
          onSelectGif={onGifClick}
          onLoadMore={onLoadMore}
        />
        <TenorAttribution />
      </HorizontalGutter>
    </div>
  );
};

export default TenorInput;
