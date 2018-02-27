export default class Action {
  listeners = [];

  listen = cb => {
    this.listeners.push(cb);
  };

  unlisten = cb => {
    this.listeners = this.listeners.filter(i => i !== cb);
  };

  event = { listen: this.listen, unlisten: this.unlisten };

  call(...args) {
    this.listeners.forEach(cb => cb(...args));
  }

  asEvent() {
    return this.event;
  }
}
