
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
    this.client.windowHandles((result) => {
      this.handles = result.value;
      if (this.handles.length > 2) {
        throw new Error('SortedWindowHandler must be created before new windows were created.');
      }
    });
  }

  /**
   * windowHandles will call given `callback` with an array of window handles.
   */
  windowHandles(callback) {
    this.client.windowHandles((result) => {
      if (Array.isArray(result.value)) {
        this.handles = this.handles.filter((handle) => {
          for (let i = 0; i < result.value.length; i++) {
            if (result.value[i] === handle) {
              return true;
            }
          }

          return false;
        });
      } else {
        this.handles = [];
      }
      const remaining = result.value.filter((handle) => {
        for (let i = 0; i < this.handles.length; i++) {
          if (this.handles[i] === handle) {
            return false;
          }
        }

        return true;
      });
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
