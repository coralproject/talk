import getHTMLCharacterLength from "./getHTMLCharacterLength";

const examples = [
  "<p>Hey whats up?</p><div><br></div><ul><li>Item 1</li></ul>",
  "<div>Hey<br></div><div> <br></div><div> <br></div><div> <br></div><div> <br></div>",
];

it("transforms HTML to text", () => {
  expect(getHTMLCharacterLength(examples[0])).toBe(21);
  expect(getHTMLCharacterLength(examples[1])).toBe(3);
});
