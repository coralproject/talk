import React from "react";
import ContentLoader from "react-content-loader";

const LiveSkeleton = (props: any) => (
  <ContentLoader
    speed={2}
    width={476}
    height={45}
    viewBox="0 0 476 45"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="2" y="3" rx="3" ry="3" width="30" height="30" />
    <rect x="39" y="7" rx="3" ry="3" width="300" height="6" />
    <rect x="39" y="21" rx="3" ry="3" width="300" height="6" />
    <rect x="39" y="34" rx="3" ry="3" width="150" height="6" />
  </ContentLoader>
);
export default LiveSkeleton;
