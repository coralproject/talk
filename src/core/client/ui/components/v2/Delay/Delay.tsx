import { clearLongTimeout, setLongTimeout } from "long-settimeout";
import React, { FunctionComponent, useEffect, useState } from "react";

interface Props {
  ms?: number;
  children: React.ReactNode;
}

const Delay: FunctionComponent<Props> = ({ ms = 500, children }) => {
  const [render, setRender] = useState<boolean>(false);
  useEffect(() => {
    const timeout = setLongTimeout(() => {
      setRender(true);
    }, ms);
    return () => {
      clearLongTimeout(timeout);
    };
  }, [ms]);
  if (!render) {
    return null;
  }
  return <>{children}</>;
};

export default Delay;
