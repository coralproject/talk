import { FunctionComponent } from "react";

import { version } from "../../package.json";

interface Props {
  className?: string;
}

const Version: FunctionComponent<Props> = ({ className }) => {
  return <span className={className}>{version}</span>;
};

export default Version;
