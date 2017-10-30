class SortedWindowHandler {

  constructor(client) {
    this.client = client;
    this.client.windowHandles((result) => {
      this.handles = result.value;
      if (this.handles.length > 2) {
        throw new Error('SortedWindowHandler must be created before new windows were created.');
      }
    });
  }

  windowHandles(callback) {
    this.client.windowHandles((result) => {
      this.handles = this.handles.filter((handle) => result.value.includes(handle));
      const remaining = result.value.filter((handle) => !this.handles.includes(handle));
      if (remaining.length === 1) {
        this.handles.push(remaining[0]);
      }
      if (remaining.length > 1) {
        throw new Error('Cannot detect new window handle, because more than one windows was created.');
      }
      callback(this.handles);
    });
  }
}

module.exports = SortedWindowHandler;
