import trimHTML from "./trimHTML";

const examples = [
  "<div>a</div><div><br></div><div><br></div><div><br></div><div>  <br></div>",
  "<div>a<br></div><div><br></div><div><b>b</b><br></div>",
];

it("trims HTML", () => {
  expect(trimHTML(examples[0])).toMatchInlineSnapshot(`"<div>a</div>"`);
  expect(trimHTML(examples[1])).toMatchInlineSnapshot(
    `"<div>a<br></div><div><br></div><div><b>b</b><br></div>"`
  );
});
