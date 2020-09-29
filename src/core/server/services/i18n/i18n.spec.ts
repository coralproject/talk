import { I18n } from "./i18n";

it("loads the translations without error", async () => {
  const translation = new I18n("en-US");
  await translation.load();
  expect(translation.getBundle("en-US")).toBeDefined();
});
