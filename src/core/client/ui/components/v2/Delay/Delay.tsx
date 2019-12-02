import React, { FunctionComponent, useEffect, useState } from "react";

interface Props {
  ms?: number;
  children: React.ReactNode;
}

const Delay: FunctionComponent<Props> = ({ ms, children }) => {
  const [render, setRender] = useState<boolean>(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setRender(true);
    }, ms);
    return () => {
      clearTimeout(timeout);
    };
  }, [ms]);
  if (!render) {
    return null;
  }
  return <>{children}</>;
};

Delay.defaultProps = {
  ms: 500,
};

export default Delay;
