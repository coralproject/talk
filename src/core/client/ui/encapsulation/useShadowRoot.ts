import * as ReactShadow from "react-shadow";

const useShadowRoot: () => ShadowRoot | null = () => {
  return (ReactShadow as any).useShadowRoot();
};

export default useShadowRoot;
