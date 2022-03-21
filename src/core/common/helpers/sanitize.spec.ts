import { JSDOM } from "jsdom";

import { SPOILER_CLASSNAME } from "coral-common/constants";

import { ALL_FEATURES, createSanitize } from "./sanitize";

const window = new JSDOM("", {}).window;

it("sanitizes out tags not allowed", () => {
  const sanitize = createSanitize(window as any, {
    features: ALL_FEATURES,
  });
  expect(
    sanitize("<script type=\"text/javascript\">alert('ok');</script>")
  ).toMatchInlineSnapshot(`<body />`);

  expect(
    sanitize("<script src=malicious-code.js></script>")
  ).toMatchInlineSnapshot(`<body />`);
});

it("sanitizes out attributes not allowed", () => {
  const sanitize = createSanitize(window as any, {
    features: ALL_FEATURES,
  });
  expect(sanitize('<div id="test">Test</div>')).toMatchInlineSnapshot(`
    <body>
      <div>
        Test
      </div>
    </body>
  `);
});

it("sanitizes without features enabled", () => {
  const sanitize = createSanitize(window as any);
  expect(
    sanitize(
      `
    <div>
      <ul>
      <li><b>Strong<b></li>
      <li><strong>Strong<strong></li>
      <li><i>Italic<i></li>
      <li><em>Italic<em></li>
      </ul>
      <blockquote>Blockquote</blockquote>
      <s>Strike</s>
      <span class="${SPOILER_CLASSNAME}">Spoiler</span>
    </div>
  `
    )
  ).toMatchInlineSnapshot(`
    <body>
      
        
      <div>
        
          
        
          
        Strong
        
          
        Strong
        
          
        Italic
        
          
        Italic
        
          
        
          
        Blockquote
        
          
        Strike
        
          
        Spoiler
        
        
      </div>
      
      
    </body>
  `);
});

it("allows mailto links", () => {
  const sanitize = createSanitize(window as any);
  expect(sanitize('<a href="mailto:email@example.com">email@example.com</a>'))
    .toMatchInlineSnapshot(`
    <body>
      <a
        href="mailto:email@example.com"
        rel="noopener noreferrer ugc"
        target="_blank"
      >
        email@example.com
      </a>
    </body>
  `);
});

it("replaces anchor tags with their text", () => {
  const sanitize = createSanitize(window as any);
  const el = sanitize(
    `
    <div>
      <a href="http://test.com">This is a link</a>. This is <a target="_blank">another link with no href</a> in a comment.
    </div>
  `
  );
  expect(el.innerHTML).toMatchInlineSnapshot(`
    "
        <div>
          This is a link. This is another link with no href in a comment.
        </div>
      "
  `);
});

it("does not replace anchor tags with their text if href does match inner html", () => {
  const sanitize = createSanitize(window as any);
  const el = sanitize(
    `
    <div>
      This is a link where href matches <a href="http://test.com">http://test.com</a>.
    </div>
  `
  );
  expect(el.innerHTML).toMatchInlineSnapshot(`
    "
        <div>
          This is a link where href matches <a href=\\"http://test.com\\" target=\\"_blank\\" rel=\\"noopener noreferrer ugc\\">http://test.com</a>.
        </div>
      "
  `);
});

it("does not replace anchor tags with their text if href does match inner html and only one has a trailing slash", () => {
  const sanitize = createSanitize(window as any);
  const el = sanitize(
    `
    <div>
      This is a link where href matches <a href="http://test.com/">http://test.com</a>.
    </div>
  `
  );
  expect(el.innerHTML).toMatchInlineSnapshot(`
    "
        <div>
          This is a link where href matches <a href=\\"http://test.com/\\" target=\\"_blank\\" rel=\\"noopener noreferrer ugc\\">http://test.com</a>.
        </div>
      "
  `);
});

it("replaces anchor tags with their text if href is an invalid url and does not throw an error", () => {
  const sanitize = createSanitize(window as any);
  const el = sanitize(
    `
    <div>
      <a href="/en-US/docs">This is an invalid url</a>.
    </div>
  `
  );
  expect(el.innerHTML).toMatchInlineSnapshot(`
    "
        <div>
          This is an invalid url.
        </div>
      "
  `);
});

it("allows bolded tags", () => {
  const sanitize = createSanitize(window as any, {
    features: {
      bold: true,
    },
  });
  expect(sanitize("A <b>bolded comment!</b>")).toMatchInlineSnapshot(`
    <body>
      A 
      <b>
        bolded comment!
      </b>
    </body>
  `);
  expect(sanitize("A <strong>bolded comment!</strong>")).toMatchInlineSnapshot(`
    <body>
      A 
      <strong>
        bolded comment!
      </strong>
    </body>
  `);
});

it("allows italic tags", () => {
  const sanitize = createSanitize(window as any, {
    features: {
      italic: true,
    },
  });
  expect(sanitize("<em>italic!</em>")).toMatchInlineSnapshot(`
    <body>
      <em>
        italic!
      </em>
    </body>
  `);
  expect(sanitize("<i>italic!</i>")).toMatchInlineSnapshot(`
    <body>
      <i>
        italic!
      </i>
    </body>
  `);
});

it("allows bulleted list", () => {
  const sanitize = createSanitize(window as any, {
    features: {
      bulletList: true,
    },
  });
  expect(sanitize("<ul><li>bulleted list</li></ul>")).toMatchInlineSnapshot(`
    <body>
      <ul>
        <li>
          bulleted list
        </li>
      </ul>
    </body>
  `);
});

it("allows blockquote", () => {
  const sanitize = createSanitize(window as any, {
    features: {
      blockquote: true,
    },
  });
  expect(sanitize("<blockquote>bulleted list</blockquote>"))
    .toMatchInlineSnapshot(`
    <body>
      <blockquote>
        bulleted list
      </blockquote>
    </body>
  `);
});

it("allows strikthrough", () => {
  const sanitize = createSanitize(window as any, {
    features: {
      strikethrough: true,
    },
  });
  expect(sanitize("<s>strikethrough</s>")).toMatchInlineSnapshot(`
    <body>
      <s>
        strikethrough
      </s>
    </body>
  `);
});

it("allows spoiler", () => {
  const sanitize = createSanitize(window as any, {
    features: {
      spoiler: true,
    },
  });
  expect(sanitize(`<span class="${SPOILER_CLASSNAME}">Spoiler</span>`))
    .toMatchInlineSnapshot(`
    <body>
      <span
        class="coral-rte-spoiler"
      >
        Spoiler
      </span>
    </body>
  `);
});
