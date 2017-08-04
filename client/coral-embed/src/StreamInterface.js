export default class StreamInterface {
  constructor(stream) {
    this._stream = stream;
  }

  on(eventName, callback) {
    return this._stream.emitter.on(eventName, callback);
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
