import React from 'react';
import hoistStatics from 'recompose/hoistStatics';

/**
 * WithHooks provides a property `hooks` to the wrapped component.
 */
export default hooks =>
  hoistStatics(WrappedComponent => {
    class WithHooks extends React.Component {
      hooks = hooks.reduce((map, key) => {
        map[key] = [];
        return map;
      }, {});

      registerHook = (hookType = '', hook) => {
        if (typeof hook !== 'function') {
          return console.warn(
            `Hooks must be functions. Please check your ${hookType} hooks`
          );
        }
        if (!hooks.includes(hookType)) {
          throw new Error(`Unknown hookType ${hookType}`);
        }

        this.hooks[hookType].push(hook);
        return {
          hookType,
          hook,
        };
      };

      unregisterHook = hookData => {
        const { hookType, hook } = hookData;
        const idx = this.hooks[hookType].indexOf(hook);
        if (idx !== -1) {
          this.hooks[hookType].splice(idx, 1);
        }
      };

      forEachHook = (hookType, callback) => {
        this.hooks[hookType].forEach(callback);
      };

      render() {
        return (
          <WrappedComponent
            {...this.props}
            registerHook={this.registerHook}
            unregisterHook={this.unregisterHook}
            forEachHook={this.forEachHook}
          />
        );
      }
    }

    return WithHooks;
  });
