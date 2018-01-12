import { connect } from 'react-redux';

export default (mapStateToProps, ...rest) => BaseComponent => {
  BaseComponent.mapStateToProps = mapStateToProps;
  return connect(mapStateToProps, ...rest)(BaseComponent);
};
