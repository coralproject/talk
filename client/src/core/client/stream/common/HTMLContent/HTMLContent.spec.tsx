import { SPOILER_CLASSNAME } from "coral-common/common/lib/constants";

import { transform } from "./HTMLContent";

it("transform spoiler tags", () => {
  const revealed = `<span aria-hidden="true">Spoiler</span>`;
  const input = `
    <span class="${SPOILER_CLASSNAME}">Spoiler</span>
  `;

  // Check for transformation of unrevealed spoiler.
  const html = transform(window, input);

  // Reveal on click.
  const div = document.createElement("div");
  div.innerHTML = html;
  (global as any).handleCoralSpoilerButton(div, new MouseEvent("click"));
  expect(div.innerHTML).toEqual(revealed);

  // Not reveal on unrelated keydown.
  div.innerHTML = html;
  (global as any).handleCoralSpoilerButton(
    div,
    new KeyboardEvent("keydown", { key: "a" })
  );
  expect(div.innerHTML).toEqual(html);

  // Reveal on enter.
  (global as any).handleCoralSpoilerButton(
    div,
    new KeyboardEvent("keydown", { key: "Enter" })
  );
  expect(div.innerHTML).toEqual(revealed);
});
