import { Localized } from "@fluent/react/compat";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { Button } from "coral-ui/components/v2";

import { GifResult } from "./TenorInput";

import styles from "./TenorGrid.css";

interface GridItemProps {
  gif: GifResult;
  onSelect: (gif: GifResult) => void;
}

const TenorGridItem: FunctionComponent<GridItemProps> = ({ gif, onSelect }) => {
  const onClick = useCallback(() => {
    onSelect(gif);
  }, [gif, onSelect]);

  return (
    <button className={styles.gridItem} onClick={onClick}>
      <img className={styles.gridImage} alt={gif.title} src={gif.preview}></img>
    </button>
  );
};

interface GridColumnsProps {
  gifs: GifResult[];
  onSelectGif: (gif: GifResult) => void;
  numColumns: number;
}

const TenorGridColumns: FunctionComponent<GridColumnsProps> = ({
  gifs,
  onSelectGif,
  numColumns,
}) => {
  const columns = useMemo(() => {
    const resultColumns: GifResult[][] = [];
    for (let i = 0; i < numColumns; i++) {
      resultColumns.push(new Array<GifResult>());
    }

    let columnIndex = 0;
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let j = 0; j < gifs.length; j++) {
      const column = resultColumns[columnIndex];
      const gif = gifs[j];

      column.push(gif);

      columnIndex++;
      if (columnIndex >= numColumns) {
        columnIndex = 0;
      }
    }

    return resultColumns;
  }, [gifs, numColumns]);

  return (
    <div className={styles.gridColumns}>
      {columns.map((colGifs, colIndex) => {
        return (
          <div
            key={`tenor-gif-result-column-${colIndex}`}
            className={styles.gridColumn}
          >
            {colGifs &&
              colGifs.map((gif, index) => {
                return (
                  <TenorGridItem
                    key={`${gif.id}-${index}`}
                    gif={gif}
                    onSelect={onSelectGif}
                  />
                );
              })}
          </div>
        );
      })}
    </div>
  );
};

interface Props {
  gifs: GifResult[];
  showLoadMore?: boolean;

  onSelectGif: (gif: GifResult) => void;
  onLoadMore: () => void;
}

const TenorGrid: FunctionComponent<Props> = ({
  gifs,
  showLoadMore,
  onSelectGif,
  onLoadMore,
}) => {
  const { window } = useCoralContext();

  const gridRef = useRef<HTMLDivElement>(null);
  const [cols, setCols] = useState<number>(0);

  const resizeGrid = useCallback(() => {
    if (!gridRef || !gridRef.current) {
      setCols(0);
      return;
    }

    const rect = gridRef.current.getBoundingClientRect();
    const numCols = rect.width / 90;

    setCols(numCols);
  }, [gridRef, setCols]);

  useEffect(() => {
    window.requestAnimationFrame(resizeGrid);
    window.addEventListener("resize", resizeGrid);

    return () => {
      window.removeEventListener("resize", resizeGrid);
    };
    // include gifs so we re-calc grid col's on gif change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gifs]);

  return (
    <div className={styles.grid}>
      {gifs && cols > 0 && (
        <TenorGridColumns
          gifs={gifs}
          onSelectGif={onSelectGif}
          numColumns={cols}
        />
      )}
      {showLoadMore && (
        <div className={styles.gridControls} ref={gridRef}>
          <Localized id="comments-postComment-gifSearch-search-loadMore">
            <Button color="stream" onClick={onLoadMore}>
              Load More
            </Button>
          </Localized>
        </div>
      )}
    </div>
  );
};

export default TenorGrid;
