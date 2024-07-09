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
import useDebounce from "react-use/lib/useDebounce";
import { Environment } from "relay-runtime";
import useResizeObserver from "use-resize-observer";

import { createFetch } from "coral-framework/lib/relay";
import { useImmediateFetch } from "coral-framework/lib/relay/fetch";
import { ButtonSvgIcon, SearchIcon } from "coral-ui/components/icons";
import {
  Button,
  HorizontalGutter,
  InputLabel,
  TextField,
} from "coral-ui/components/v2";

import TenorAttribution from "./TenorAttribution";

import styles from "./TenorInput.css";

function createGifFetch<T>(name: string, url: string) {
  return createFetch(
    name,
    async (
      environment: Environment,
      variables: { query: string },
      { rest }
    ) => {
      const params = new URLSearchParams(variables);

      return rest.fetch<T>(`${url}?${params.toString()}`, {
        method: "GET",
      });
    }
  );
}

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

const GifFetch = createGifFetch<GifResult[]>("tenorGifFetch", "/tenor/search");

const TenorInput: FunctionComponent<Props> = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [lastUpdated, setLastUpdated] = useState<string>(
    new Date().toISOString()
  );

  const [gifs, loading] = useImmediateFetch(GifFetch, { query }, lastUpdated);

  const inputRef = useRef<HTMLInputElement>(null);

  const { ref } = useResizeObserver<HTMLDivElement>();

  const fetchGifs = useCallback(async () => {
    setLastUpdated(new Date().toISOString());
  }, [setLastUpdated]);

  // Instead of updating the query with every keystroke, debounce the change to
  // that state parameter.
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [, cancelDebounce] = useDebounce(
    () => {
      setQuery(debouncedQuery);
      void fetchGifs();
    },
    500,
    [debouncedQuery]
  );

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

  const onGifClick = useCallback(
    (gif: GifResult) => {
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
        <HorizontalGutter>
          <Localized id="comments-postComment-gifSearch">
            <InputLabel htmlFor="coral-comments-postComment-gifSearch">
              Search for a GIF
            </InputLabel>
          </Localized>
          <TextField
            className={styles.input}
            value={debouncedQuery}
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
                  <ButtonSvgIcon Icon={SearchIcon} />
                </Button>
              </Localized>
            }
            ref={inputRef}
          />
        </HorizontalGutter>
        <div className={styles.grid}>
          {query &&
            gifs &&
            !loading &&
            gifs.map((gif) => {
              return (
                <button
                  className={styles.gridItem}
                  key={gif.id}
                  onClick={() => onGifClick(gif)}
                >
                  <img
                    className={styles.gridImage}
                    alt={gif.title}
                    src={gif.preview}
                  ></img>
                </button>
              );
            })}
        </div>
        <TenorAttribution />
      </HorizontalGutter>
    </div>
  );
};

export default TenorInput;
