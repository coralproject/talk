// TODO: revisit `filtering` after https://github.com/apollographql/graphql-anywhere/issues/38.
export default (fragments) => (BaseComponent) => {
  BaseComponent.fragments = fragments;
  return BaseComponent;
};
