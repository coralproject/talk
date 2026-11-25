import fs from "fs-extra";
import path from "path";

import { I18n } from "./";

const localeRoots = [
  path.join(__dirname, "..", "..", "..", "..", "..", "..", "locales"),
  path.join(__dirname, "..", "..", "locales"),
];

it("loads the translations without error", async () => {
  const translation = new I18n("en-US");
  await translation.load();
  expect(translation.getBundle("en-US")).toBeDefined();
});

it("skips macOS metadata and other non-locale files", async () => {
  const planted: string[] = [];
  for (const root of localeRoots) {
    for (const name of [".DS_Store", "notes.txt"]) {
      const filePath = path.join(root, name);
      await fs.writeFile(filePath, "not a locale");
      planted.push(filePath);
    }
    const dotDirectory = path.join(root, ".hidden");
    await fs.ensureDir(dotDirectory);
    planted.push(dotDirectory);
    const insideLocale = path.join(root, "en-US", ".DS_Store");
    await fs.writeFile(insideLocale, "not a translation");
    planted.push(insideLocale);
  }

  try {
    const translation = new I18n("en-US");
    await translation.load();
    expect(translation.getBundle("en-US")).toBeDefined();
    expect(translation.getBundle("pt-BR")).toBeDefined();
  } finally {
    await Promise.all(planted.map((filePath) => fs.remove(filePath)));
  }
});
