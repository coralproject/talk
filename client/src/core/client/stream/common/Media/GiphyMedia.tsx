import cn from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./GiphyMedia.css";

interface Props {
  url: string;
  width?: number | null;
  height?: number | null;
  video?: string | null;
  title?: string | null;
}

function calculateBottomPadding(width: number, height: number) {
  return `${(height / width) * 100}%`;
}

const GiphyMedia: FunctionComponent<Props> = ({
  url,
  title,
  video,
  width,
  height,
}) => {
  const paddingBottom =
    width && height ? calculateBottomPadding(width, height) : null;
  return video ? (
    <div style={{ maxWidth: `${width}px` }}>
      <div
        className={cn({
          [styles.responsiveContainer]: paddingBottom,
        })}
        style={paddingBottom ? { paddingBottom, maxWidth: `${width}px` } : {}}
      >
        <video
          className={cn({
            [styles.responsiveVideo]: paddingBottom,
          })}
          width={width || undefined}
          height={height || undefined}
          // TODO: (wyattjoh) auto pause when out of view
          autoPlay
          loop
          playsInline
        >
          <source src={video} type="video/mp4" />
        </video>
      </div>
    </div>
  ) : (
    <img
      src={url}
      loading="lazy"
      referrerPolicy="no-referrer"
      alt={title || ""}
    />
  );
};

export default GiphyMedia;
