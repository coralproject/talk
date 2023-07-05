import { stripIndent } from "common-tags";
import fs from "fs";
import { kebabCase, trim } from "lodash";
import path from "path";
import ts from "typescript";

import colors from "../src/core/client/ui/theme/colors";

/** We collect inforamtion from the AST and put it into DocEntry */
interface DocEntry {
  /** Name of property */
  key: string;
  /** Documentation if available */
  docs?: string;
  /** Value if it is a leaf */
  value?: string;
  /** Children if it is a node */
  children?: DocEntry[];
}

/**
 * We use this regexp to find a previous block that we
 * are going to update in the readme file.
 */
const BLOCK_REGEXP =
  /<!-- START docs:css-variables -->(.|\n)*<!-- END docs:css-variables -->/gm;

/** Sort doc entries will sort childrenless entries first */
function sortDocEntries(data: DocEntry[]) {
  data.forEach((d) => {
    if (d.children) {
      d.children = sortDocEntries(d.children);
    }
  });
  return data.sort((a, b) => {
    if (a.children && !b.children) {
      return 1;
    }
    if (b.children && !a.children) {
      return -1;
    }
    return 0;
  });
}

/** Generate documentation for all classes in a set of .ts files */
function gatherEntries(
  fileName: string,
  options: ts.CompilerOptions
): DocEntry[] {
  // Build a program using the set of root file names in fileNames
  const program = ts.createProgram([fileName], options);

  // Get the checker, we will use it to find more about classes
  const checker = program.getTypeChecker();

  const data: DocEntry[] = [];
  const currentSourceFile = program.getSourceFile(fileName)!;

  ts.forEachChild(currentSourceFile, visit);

  return sortDocEntries(data);

  /** visit nodes finding css variables */
  function visit(node: ts.Node) {
    if (ts.isVariableStatement(node)) {
      // TODO (cvle) - Currently the variable name is hardcoded. We might want to change that.
      if (!node.getFullText().includes("streamVariables")) {
        return;
      }
      const firstChild = node.declarationList.declarations[0];
      if (ts.isVariableDeclaration(firstChild)) {
        const symbol = checker.getSymbolAtLocation(firstChild.name);
        if (symbol) {
          const type = checker.getTypeOfSymbolAtLocation(
            symbol,
            symbol.valueDeclaration
          );
          type.getProperties().forEach((property) => {
            serializePropertySymbol(property);
          });
        }
      }
    }
  }

  /** This will evaluate `symbol` and addthe doc entries */
  function serializePropertySymbol(symbol: ts.Symbol, parent?: DocEntry) {
    const entry: DocEntry = { key: symbol.name };
    const pt = checker.getTypeOfSymbolAtLocation(
      symbol,
      symbol.valueDeclaration
    );
    if (pt.symbol?.name === "__object") {
      pt.getProperties().forEach((p2) => {
        serializePropertySymbol(p2, entry);
      });
    } else {
      entry.value = symbol.valueDeclaration
        // Last child contains value.
        .getChildAt(symbol.valueDeclaration.getChildCount() - 1)!
        .getFullText();
    }
    entry.docs = ts.displayPartsToString(
      symbol.getDocumentationComment(checker)
    );
    if (parent) {
      if (parent.children) {
        parent.children.push(entry);
      } else {
        parent.children = [entry];
      }
    } else {
      data.push(entry);
    }
  }
}

/**
 * Finds any references to `object` by `variableName` and replaces the text
 * with the actual value.
 *
 * E.g. `replaceObjectVariablesInText("colors.teal100", colors, "colors") === "#E2FAF7"`;
 */
function replaceObjectVariablesInText(
  text: string,
  object: any,
  variableName: string
) {
  let result = text;
  Object.keys(object).forEach((c: string) => {
    if (typeof object[c] === "object") {
      result = replaceObjectVariablesInText(
        result,
        object[c],
        `${variableName}.${c}`
      );
    } else {
      result = result.replace(`${variableName}.${c}`, object[c]);
    }
  });
  return result;
}

/**
 * transforms value to be used in the documentation.
 */
function transformValue(value: string) {
  let compat = "";
  value = trim(value);
  // Detect compat value.
  if (value.startsWith("compat")) {
    const result = /compat\((.*), *"(.*)"\)/.exec(value);
    if (!result) {
      throw new Error("Unrecognized compat format");
    }
    value = result[1];
    compat = result[2];
  }
  // If it's a raw string, evaluate it to get rid of the initial quotes.
  if (value[0] === '"' || value[0] === "'") {
    // eslint-disable-next-line no-eval
    value = eval(value);
  }
  // Replace all references to colors.
  value = replaceObjectVariablesInText(value, colors, "colors");
  if (compat) {
    // add compat information.
    return `${value};  /* Before 6.3.0: --${compat} */`;
  }
  return `${value};`;
}

function prefixLines(text: string, prefix: string) {
  return text.split("\n").join(`\n${prefix}`);
}

function entries2Summary(
  entries: DocEntry[],
  keyprefix = "",
  nestprefix = ""
): string {
  let doc = "";
  entries.forEach((entry) => {
    if (!entry.children) {
      return;
    }
    const header = kebabCase(keyprefix + entry.key);
    doc += `${nestprefix}- <a href="#${header}">${header}</a>\n`;
    if (entry.children) {
      doc += entries2Summary(
        entry.children,
        keyprefix + entry.key + "-",
        nestprefix + "  "
      );
    }
  });
  return doc;
}

function entries2Doc(entries: DocEntry[], header = "###", prefix = ""): string {
  let doc = "";
  entries.forEach((entry) => {
    if (entry.children) {
      doc += `\n${header} ${kebabCase(prefix + entry.key)}\n`;
      if (entry.docs) {
        doc += `\n${entry.docs}\n`;
      }
      doc += entries2Doc(
        entry.children,
        header + "#",
        `${prefix}${entry.key}-`
      );
    } else {
      if (entry.docs) {
        doc += `\n${entry.docs}\n`;
      }
      doc += `\n\`--${kebabCase(prefix + entry.key)}: ${transformValue(
        entry.value!
      )}\`\n`;
    }
  });
  return doc;
}

/**
 * Append or update previous documention in markdownFile.
 *
 * @param markdownFile The markdown file we want to inject the docs too.
 * @param entries data as returned by gatherEntries.
 */
function emitDocs(markdownFile: string, entries: DocEntry[], verify = false) {
  const previousContent = fs.existsSync(markdownFile)
    ? fs.readFileSync(markdownFile).toString()
    : "";

  const summary = entries2Summary(entries, "", "  ");
  const list = entries2Doc(entries);

  const output = stripIndent`
    <!-- START docs:css-variables -->
    <!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN npm run docs:css-variables -->
    ### Index
    - <a href="#variables">Variables</a>
    ${prefixLines(summary, "    ")}

    ### Variables
    ${prefixLines(list, "    ")}
    <!-- END docs:css-variables -->
  `;

  let newContent;
  // Find previous block.
  if (BLOCK_REGEXP.test(previousContent)) {
    newContent = previousContent.replace(BLOCK_REGEXP, output);
  } else {
    newContent = previousContent + "\n" + output;
  }
  if (previousContent === newContent) {
    // eslint-disable-next-line no-console
    console.log(`${markdownFile} is up to date`);
    return;
  }
  if (verify) {
    // eslint-disable-next-line no-console
    console.error(
      `${markdownFile} is outdated, please run \`npm run docs:css-variables\``
    );
    process.exit(1);
  }

  fs.writeFileSync(markdownFile, newContent);
  // eslint-disable-next-line no-console
  console.log(`Successfully injected documentation into ${markdownFile}`);
}

function main() {
  if (process.argv.length < 4) {
    throw new Error("Must provide path to css variables and a markdown file.");
  }

  const variableFile = process.argv[2];
  const markdownFile = process.argv[3];

  // Find tsconfig file.
  const configFile = ts.findConfigFile(variableFile, fs.existsSync);
  if (!configFile) {
    throw new Error("tsconfig file not found");
  }
  const configText = fs.readFileSync(configFile).toString();
  const result = ts.parseConfigFileTextToJson(configFile, configText);
  if (result.error) {
    throw result.error;
  }

  // Parse the JSON raw data into actual consumable compiler options.
  const config = ts.parseJsonConfigFileContent(
    result.config,
    ts.sys,
    path.dirname(configFile)
  );

  const entries = gatherEntries(variableFile, config.options);
  emitDocs(markdownFile, entries, process.argv[4] === "--verify");
}

main();
