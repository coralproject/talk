/* eslint-disable no-bitwise */

import { codeBlock, stripIndent } from "common-tags";
import fs from "fs";
import path from "path";
import ts from "typescript";

interface DocEntry {
  name: string;
  docs?: string;
  type: "ViewerNetworkEvent" | "ViewerEvent";
  text?: string;
}

/**
 * We use this regexp to find a previous block that we
 * are going to update in the readme file.
 */
const BLOCK_REGEXP =
  /<!-- START docs:events -->(.|\n)*<!-- END docs:events -->/gm;

/** Build flags that affects AST generation */
const buildFlags =
  // Do not truncate output.
  ts.NodeBuilderFlags.NoTruncation |
  // Use multiline object literals format.
  ts.NodeBuilderFlags.MultilineObjectLiterals;

/** Generate documentation for all classes in a set of .ts files */
function gatherEntries(
  fileNames: string[],
  options: ts.CompilerOptions
): DocEntry[] {
  // Build a program using the set of root file names in fileNames
  const program = ts.createProgram(fileNames, options);

  const printer = ts.createPrinter({
    noEmitHelpers: true,
    omitTrailingSemicolon: true,
    removeComments: false,
  });

  // Get the checker, we will use it to find more about classes
  const checker = program.getTypeChecker();

  const data: DocEntry[] = [];

  /** Hold a pointer to the sourcefile we are currently processing. */
  let currentSourceFile: ts.SourceFile;

  // Visit every sourceFile in the program
  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile) {
      currentSourceFile = sourceFile;
      // Walk the tree to search for classes
      ts.forEachChild(sourceFile, visit);
    }
  }

  const sorted = data.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }
    if (b.name > a.name) {
      return -1;
    }
    return 0;
  });

  return sorted;

  /** visit nodes finding exported events */
  function visit(node: ts.Node) {
    // Only consider exported nodes
    if (!isNodeExported(node)) {
      return;
    }

    if (ts.isVariableStatement(node)) {
      if (
        !node.getFullText().includes("createViewerNetworkEvent") &&
        !node.getFullText().includes("createViewerEvent")
      ) {
        return;
      }
      const firstChild = node.declarationList.declarations[0];
      if (ts.isVariableDeclaration(firstChild)) {
        const symbol = checker.getSymbolAtLocation(firstChild.name);
        if (symbol) {
          serializeEventSymbol(symbol);
        }
      }
    }
  }

  function serializeEventSymbol(symbol: ts.Symbol) {
    const type = checker.getTypeOfSymbolAtLocation(
      symbol,
      symbol.valueDeclaration
    );
    const typeNode = checker.typeToTypeNode(type, undefined, buildFlags)!;
    const typeName = symbol.getName();
    const entry: DocEntry = {
      name: typeName,
      docs: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
      type: type.getSymbol()!.getName() as DocEntry["type"],
    };
    typeNode.forEachChild((ch) => {
      if (ts.isTypeLiteralNode(ch)) {
        const text = printer.printNode(
          ts.EmitHint.Unspecified,
          ch,
          currentSourceFile
        );
        if (text !== "{}") {
          entry.text = text;
        }
        /*
          Go through each parameter.
          ch.members.forEach(m => {
            if (ts.isPropertySignature(m)) {
              if (ts.isIdentifier(m.name)) {
                data.parameters[m.name.text] = printer.printNode(
                  ts.EmitHint.Unspecified,
                  m.type!,
                  currentSourceFile
                );
              }
            }
          });
        */
      }
    });
    data.push(entry);
  }

  /** True if this is visible outside this file, false otherwise */
  function isNodeExported(node: ts.Node): boolean {
    return (
      // eslint-disable-next-line no-bitwise, @typescript-eslint/no-unnecessary-type-assertion
      (ts.getCombinedModifierFlags(node as ts.Declaration) &
        ts.ModifierFlags.Export) !==
        0 ||
      (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
    );
  }
}

function prefixLines(text: string, prefix: string) {
  return text.split("\n").join(`\n${prefix}`);
}

function getEventName(typeName: string) {
  return (
    typeName[0].toLocaleLowerCase() +
    typeName.slice(1, typeName.length - "Event".length)
  );
}

/**
 * Removes "%future added value" from text. This is a placeholder type
 * added by Relay to help with future proofness.
 */
function removeFutureAddedValue(text: string) {
  return text
    .replace(': "%future added value" | ', ": ")
    .replace(' | "%future added value"', "");
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
  const summary = stripIndent`
    - ${entries
      .map(
        (e) => `<a href="#${getEventName(e.name)}">${getEventName(e.name)}</a>`
      )
      .join("\n    - ")}
  `;
  const list = entries
    .map(
      (e) =>
        codeBlock`
        - ${
          e.type === "ViewerEvent"
            ? `<a id="${getEventName(e.name)}">**${getEventName(e.name)}**</a>`
            : `<a id="${getEventName(e.name)}">**${getEventName(
                e.name
              )}.success**, **${getEventName(e.name)}.error**</a>`
        }: ${e.docs ? e.docs.replace("\n", " ") : ""}
          ${
            e.text
              ? codeBlock`
            \`\`\`ts
            ${removeFutureAddedValue(e.text)}
            \`\`\`
            `
              : ""
          }
      `
    )
    .join("\n");

  const output = stripIndent`
    <!-- START docs:events -->
    <!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN npm run docs:events -->
    ### Index
    ${prefixLines(summary, "    ")}

    ### Events
    ${prefixLines(list, "    ")}
    <!-- END docs:events -->
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
      `${markdownFile} is outdated, please run \`npm run docs:events\``
    );
    process.exit(1);
    return;
  }

  fs.writeFileSync(markdownFile, newContent);
  // eslint-disable-next-line no-console
  console.log(`Successfully injected documentation into ${markdownFile}`);
}

function main() {
  if (process.argv.length < 4) {
    throw new Error("Must provide path to events and a markdown file.");
  }

  const eventFile = process.argv[2];
  const markdownFile = process.argv[3];

  // Find tsconfig file.
  const configFile = ts.findConfigFile(eventFile, fs.existsSync);
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

  const entries = gatherEntries([eventFile], config.options);
  emitDocs(markdownFile, entries, process.argv[4] === "--verify");
}

main();
