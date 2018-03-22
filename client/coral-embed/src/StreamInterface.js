export default class StreamInterface {
  constructor(stream) {
    this._stream = stream;
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

  enablePluginsDebug() {
    return this._stream.enablePluginsDebug();
  }

  disablePluginsDebug() {
    return this._stream.disablePluginsDebug();
  }
}
