import getHTMLPlainText from "./getHTMLPlainText";

const example1 =
  '<p>Meat &amp; Fish<br></p><ul><li>Skinless white meat<br></li><li>Lean cuts of red meat<br></li><li><div>Oily fish<br></div><ul><li>Tuna<br></li><li>Salmon<br></li><li>Mackerel<br></li></ul></li><li>Luncheon meat<br></li></ul><div><b>Bold</b><br></div><div><br></div><div>Italic<br></div><div><br></div><blockquote><div>Blockquote</div></blockquote><div><span class="coral-rte-spoiler">Spoiler</span></div>';

it("transforms HTML to text", () => {
  expect(getHTMLPlainText(example1)).toMatchInlineSnapshot(`
    "Meat & Fish
    Skinless white meat
    Lean cuts of red meat
    Oily fish
    Tuna
    Salmon
    Mackerel


    Luncheon meat

    Bold

    Italic

    Blockquote
    Spoiler"
  `);
});
