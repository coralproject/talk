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

it("sanitizes out empty anchors", () => {
  const sanitize = createSanitize(window as any, {
    features: ALL_FEATURES,
  });
  expect(
    sanitize(
      '<a href="https://genderbread.org/">genderbread.org</a>; <a target="_blank">no anchor</a>'
    )
  ).toMatchInlineSnapshot(`
    <body>
      <a
        href="https://genderbread.org/"
        rel="noopener noreferrer"
        target="_blank"
      >
        https://genderbread.org/
      </a>
      ; 
      <span>
        no anchor
      </span>
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

it("allows anchor links", () => {
  const sanitize = createSanitize(window as any);
  expect(sanitize('<a href="http://test.com">This is a link</a>'))
    .toMatchInlineSnapshot(`
    <body>
      <a
        href="http://test.com"
        rel="noopener noreferrer"
        target="_blank"
      >
        http://test.com
      </a>
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
        rel="noopener noreferrer"
        target="_blank"
      >
        email@example.com
      </a>
    </body>
  `);
});

it("allows anchor tags and counts them correctly", () => {
  const sanitize = createSanitize(window as any);
  const el = sanitize(
    `
    <div>
      <a href="https://mozilla.org/">Mozilla</a>
      <a href="https://mozilla.org/">Mozilla</a>
    </div>
  `
  );

  expect(el.innerHTML).toMatchInlineSnapshot(`
    "
        <div>
          <a href=\\"https://mozilla.org/\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://mozilla.org/</a>
          <a href=\\"https://mozilla.org/\\" target=\\"_blank\\" rel=\\"noopener noreferrer\\">https://mozilla.org/</a>
        </div>
      "
  `);
  expect(el.getElementsByTagName("a").length).toEqual(2);
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
