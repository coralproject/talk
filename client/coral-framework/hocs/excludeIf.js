export default (condition) => (BaseComponent) => {
  BaseComponent.isExcluded = condition;
  return BaseComponent;
};
