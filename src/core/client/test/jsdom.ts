// JSDOM is already injected from Jest.

// We replace JSDOM implentation - which just returns an error - with a noop.
window.resizeTo = () => {};
