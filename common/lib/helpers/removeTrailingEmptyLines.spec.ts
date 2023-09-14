import removeTrailingEmptyLines from "./removeTrailingEmptyLines";

function createNodeWithHTML(html: string) {
  // eslint-disable-next-line no-restricted-globals
  const el = document.createElement("div");
  el.innerHTML = html;
  return el;
}

it("trims HTML", () => {
  const examples = [
    createNodeWithHTML(
      "<div>a</div><div><br></div><div><br></div><div><br></div><div>  <br></div>"
    ),
    createNodeWithHTML(
      "<div>a<br></div><div><br></div><div><b>b</b><br></div>"
    ),
  ];

  examples.forEach((e) => removeTrailingEmptyLines(e));
  expect(examples[0].innerHTML).toMatchInlineSnapshot(`"<div>a</div>"`);
  expect(examples[1].innerHTML).toMatchInlineSnapshot(
    `"<div>a<br></div><div><br></div><div><b>b</b><br></div>"`
  );
});
