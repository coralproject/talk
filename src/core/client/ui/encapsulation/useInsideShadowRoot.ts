import useShadowRoot from "./useShadowRoot";

const useInsideShadowRoot = () => {
  return Boolean(useShadowRoot());
};

export default useInsideShadowRoot;
