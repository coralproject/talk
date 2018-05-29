/**
 * SortedWindowHandler assists in making e2e tests more robust by returning
 * deterministic window handles. An instance must be created before new windows
 * are created and windowHandles must be called each time a window was created or
 * closed.
 */
class SortedWindowHandler {
  /**
   * Constructor, must be called before new windows were created.
   */
  constructor(client) {
    this.client = client;
    this.client.windowHandles(result => {
      this.handles = result.value;
      if (this.handles.length > 2) {
        throw new Error(
          'SortedWindowHandler must be created before new windows were created.'
        );
      }
    });
  }

  /**
   * windowHandles will call given `callback` with an array of window handles.
   */
  windowHandles(callback) {
    this.client.windowHandles(result => {
      if (result.value.message) {
        throw new Error(result.value.message);
      }

      this.handles = this.handles.filter(handle =>
        result.value.includes(handle)
      );
      const remaining = result.value.filter(
        handle => !this.handles.includes(handle)
      );

      if (remaining.length === 1) {
        this.handles.push(remaining[0]);
      }
      if (remaining.length > 1) {
        throw new Error(
          'Cannot detect new window handle, because more than one windows was created.'
        );
      }
      callback(this.handles);
    });
  }

  /**
   *  Switch to main window handle and remove latest handle.
   */
  pop() {
    this.client.switchWindow(this.handles[0]);
    this.handles.splice(-1, 1);
  }
}

module.exports = SortedWindowHandler;
