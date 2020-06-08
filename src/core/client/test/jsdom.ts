// JSDOM is already injected from Jest.

// We replace `resizeTo` JSDOM implentation - which just returns an error -
// with a noop.
window.resizeTo = () => {};
