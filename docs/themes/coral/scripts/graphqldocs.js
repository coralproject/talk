/* global hexo */

const path = require('path');
const fs = require('fs');
const { stripIndent } = require('common-tags');
const docsScript = fs.readFileSync(
  require.resolve('graphql-docs/dist/graphql-docs.min.js'),
  { encoding: 'utf8' }
);

hexo.extend.tag.register('graphqldocs', args => {
  const schema = args[0];
  let fetcher = '';

  if (schema.match(/^http[s]?/)) {
    fetcher = `
      function fetcher() {
        return fetch("${schema}").then((result) => result.json()).then((json) => {return {data: json}});
      }
    `;
  } else {
    const filename = path.resolve(hexo.source_dir, schema);
    const introspectionQuery = fs.readFileSync(filename, { encoding: 'utf8' });
    fetcher = `
      function fetcher() {
        return new Promise(function(resolve) {
            resolve({"data": ${introspectionQuery}});
        });
      }
    `;
  }

  return stripIndent`
    <div id="graphql-docs"></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/fetch/3.5.0/fetch.min.js" integrity="sha512-TXERecoxO85MPkCFqSG3LSe5nVimbZddhrPP2PwSMH5C5+kIoXi30bm1RgBckHQMkNCZN/i5FvHIvJuytp6ECw==" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.0.2/react.min.js" integrity="sha256-oj3q2t3QPvtdjo4M5gZfrAXyHEfTfvYdfRL2jA2ZfOY=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.0.2/react-dom.min.js" integrity="sha256-sqgMIZkGTh7B/tF2nSyXc+tGBYCsfWiTl2II167jrOQ=" crossorigin="anonymous"></script>
    <script>${docsScript}</script>
    <script>
        const rootElem = document.getElementById('graphql-docs');
        ${fetcher}
        ReactDOM.render(
            React.createElement(
                GraphQLDocs.GraphQLDocs,
                {
                    fetcher: fetcher,
                }),
            rootElem
        );
    </script>
    `;
});
