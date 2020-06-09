// import { Localized } from "@fluent/react/compat";
import React, {
  ChangeEvent,
  FunctionComponent,
  useCallback,
  useState,
} from "react";

import { useFetch } from "coral-framework/lib/relay";
import { TextField } from "coral-ui/components/v2";

import { GifResult, GifSearchFetch } from "./GifSearchFetch";

// import styles from "./GifSelector.css";

interface Props {}

const GifSelector: FunctionComponent<Props> = () => {
  const gifSearchFetch = useFetch(GifSearchFetch);
  const [results, setResults] = useState<GifResult[]>([]);
  const onSearchFieldChange = useCallback(
    async (evt: ChangeEvent<HTMLInputElement>) => {
      const query = evt.target.value;
      if (query.length > 1) {
        const res = await gifSearchFetch({ query });
        setResults(res.results.data.data);
      }
    },
    []
  );
  return (
    <div>
      <TextField onChange={onSearchFieldChange} />
      {results.map((result) => (
        <div key={result.id}>
          <img src={result.images.original.url} />
        </div>
      ))}
    </div>
  );
};

export default GifSelector;
