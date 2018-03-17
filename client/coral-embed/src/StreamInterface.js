export default class StreamInterface {
  constructor(stream) {
    this._stream = stream;
  }

  dispatch(action) {
    return this._stream.dispatch(action);
  }

  on(eventName, callback) {
    return this._stream.emitter.on(eventName, callback);
  }

  off(eventName, callback) {
    return this._stream.emitter.off(eventName, callback);
  }

  login(token) {
    return this._stream.login(token);
  }

  logout() {
    return this._stream.logout();
  }

  remove() {
    return this._stream.remove();
  }
}
