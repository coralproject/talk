// Webpack emits actor-typeahead as a file of its own, and importing it gives
// the file's URL (see createWebpackConfig).
declare module "actor-typeahead/actor-typeahead.js" {
  const url: string;
  export default url;
}

// The <actor-typeahead> custom element, which wraps an <input>.
declare namespace JSX {
  interface IntrinsicElements {
    "actor-typeahead": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      host?: string;
      rows?: string;
    };
  }
}
