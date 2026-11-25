const fs = require("fs");
const path = require("path");

const loader = require("./locales-loader");

const localesRoot = path.resolve(__dirname, "../../../../../locales");

// install/locales.ts and its siblings are stubs. Webpack runs this loader
// for each of them, so one scan covers every client locale bundle.
const targets = ["install", "stream", "auth", "account", "admin"];

function loadTarget(target) {
  return loader.call(
    {
      cacheable() {},
      resourcePath: path.resolve(
        __dirname,
        `../../client/${target}/locales.ts`
      ),
      query: {
        pathToLocales: localesRoot,
        defaultLocale: "en-US",
        fallbackLocale: "",
        availableLocales: null,
        commonFiles: ["framework.ftl", "common.ftl", "ui.ftl"],
        bundled: ["en-US"],
        target,
      },
    },
    ""
  );
}

it("skips macOS metadata and other non-locale files", () => {
  const planted = [];
  const plant = (filePath, contents) => {
    if (contents === undefined) {
      fs.mkdirSync(filePath);
    } else {
      fs.writeFileSync(filePath, contents);
    }
    planted.push(filePath);
  };

  plant(path.join(localesRoot, ".DS_Store"), "not a locale");
  plant(path.join(localesRoot, "notes.txt"), "not a locale");
  plant(path.join(localesRoot, ".hidden"));
  plant(path.join(localesRoot, "zz-extra"));
  plant(path.join(localesRoot, "en-US", ".DS_Store"), "not a translation");

  try {
    expect(() => fs.readdirSync(path.join(localesRoot, ".DS_Store"))).toThrow(
      /ENOTDIR|not a directory/
    );

    for (const target of targets) {
      const source = loadTarget(target);
      // Target files are emitted as a prefix plus the ".ftl" suffix.
      expect(source).toContain(
        `${path
          .join(localesRoot, "en-US", target)
          .replace(/\\/g, "/")}" + suffix`
      );
      expect(source).toContain('suffixes = [".ftl"]');
      expect(source).toContain(
        path.join(localesRoot, "en-US", "common.ftl").replace(/\\/g, "/")
      );
      expect(source).toContain('"en-US"');
      expect(source).toContain('"pt-BR"');
      expect(source).toContain('"zz-extra"');
      expect(source).not.toContain(".DS_Store");
      expect(source).not.toContain("notes.txt");
      expect(source).not.toContain(".hidden");
    }
  } finally {
    for (const filePath of planted.reverse()) {
      fs.rmSync(filePath, { recursive: true, force: true });
    }
  }
});
