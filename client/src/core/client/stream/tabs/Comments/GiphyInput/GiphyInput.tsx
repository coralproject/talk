import { GiphyFetch, SearchOptions } from "@giphy/js-fetch-api";
import { IGif } from "@giphy/js-types";
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
import useResizeObserver from "use-resize-observer";

import { useDebounce } from "coral-framework/hooks";
import { HorizontalGutter } from "coral-ui/components/v2";

import { GifGrid, GifResult } from "../GifGrid";
import { GifSearchInput } from "../GifSearchInput/GifSearchInput";
import GiphyAttribution from "./GiphyAttribution";

import styles from "./GiphyInput.css";

const DEBOUNCE_DELAY_MS = 1250;

interface Props {
  onSelect: (gif: GifResult) => void;
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
  const [gifs, setGifs] = useState<GifResult[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [isNext, setIsNext] = useState<boolean | null>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const { ref } = useResizeObserver<HTMLDivElement>();

  const client = useMemo(() => new GiphyFetch(apiKey), [apiKey]);

  useEffect(() => {
    setOffset(0);
  }, [query]);

  const fetchGifs = useCallback(async () => {
    const response = await client.search(query, {
      offset,
      limit: 10,
      rating: maxRating as SearchOptions["rating"],
      sort: "relevant",
    });
    if (!response) {
      return null;
    }
    return response;
  }, [client, maxRating, query, offset]);

  const mapGifs = useCallback((response: { data: IGif[] }) => {
    return response.data.map((gif) => {
      return {
        id: gif.id as string,
        preview: gif.images.preview_gif.url,
        title: gif.title,
        url: gif.images.original.url,
      };
    });
  }, []);

  const loadGifs = useCallback(async () => {
    const response = await fetchGifs();
    if (!response) {
      return;
    }

    const mappedResponse = mapGifs(response);

    setGifs(mappedResponse);
    setOffset(
      response.pagination.count + response.pagination.offset + 1 ?? null
    );
    setIsNext(
      response.pagination.total_count > response.pagination.count + offset
    );
  }, [fetchGifs, offset, mapGifs]);

  const loadMoreGifs = useCallback(async () => {
    const response = await fetchGifs();
    if (!response) {
      return;
    }

    const mappedResponse = mapGifs(response);

    setGifs([...gifs, ...mappedResponse]);
    setOffset(
      response.pagination.count + response.pagination.offset + 1 ?? null
    );
    setIsNext(
      response.pagination.total_count > response.pagination.count + offset
    );
  }, [fetchGifs, gifs, offset, mapGifs]);

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

  const onLoadMore = useCallback(async () => {
    await loadMoreGifs();
  }, [loadMoreGifs]);

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
        <GifSearchInput
          debouncedQuery={query}
          onChange={onChange}
          onKeyPress={onKeyPress}
          inputRef={inputRef}
        />
        <div className={styles.grid}>
          <GifGrid
            gifs={gifs}
            showLoadMore={
              !!(isNext && gifs && gifs.length > 0 && query?.length > 0)
            }
            onSelectGif={onGifClick}
            onLoadMore={onLoadMore}
          />
        </div>
        <GiphyAttribution />
      </HorizontalGutter>
    </div>
  );
};

export default GiphyInput;
