import React, { FunctionComponent } from "react";

interface Props {
  url: string;
  title?: string | null;
}

const TenorMedia: FunctionComponent<Props> = ({ url, title }) => {
  return (
    <div style={{ maxWidth: `${100}px` }}>
      <img
        src={url}
        loading="lazy"
        referrerPolicy="no-referrer"
        alt={title || ""}
      />
    </div>
  );
};

export default TenorMedia;
