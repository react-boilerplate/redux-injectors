const fs = require('fs');
const documentation = require('documentation');

async function main() {
  await syncTypingsDocsWithSourceCodeDocs();
  await outputMarkdownDocs();
}

/**
 * Copies all the source code documentation to the typings file. This helps keep
 * the typings in sync with the source code.
 */
async function syncTypingsDocsWithSourceCodeDocs() {
  const rawDocs = await documentation.build(['./src/index.js'], {});
  const docs = rawDocs.map(rawDoc => ({
    name: rawDoc.namespace,
    comment: getRawCommentFromAST(rawDoc),
  }));

  let source = fs.readFileSync('./index.d.ts').toString();
  docs.forEach(doc => {
    source = source.replace(
      // https://regex101.com/r/3JajXL/latest
      new RegExp(
        `(\\/\\*[^\n]*\n([^\n]*?\\*[^\n]*\n)+([^\n]*\\*\\/[^\n]*\n))?([^\n]*[^\`]${doc.name})`,
      ),
      `${doc.comment}\n$4`,
    );
  });

  fs.writeFileSync('./index.d.ts', source);
}

function outputMarkdownDocs() {
  return documentation
    .build(['./src/index.js'], { access: ['public'] })
    .then(comments => documentation.formats.md(comments, { markdownToc: true }))
    .then(output => {
      fs.writeFileSync('./docs/api.md', output);
    });
}

/**
 * Given an ast of a comment, returns the raw comment string
 *
 * @param ast The AST of the comment
 */
function getRawCommentFromAST(ast) {
  const { loc } = ast;
  const fileContent = fs.readFileSync(ast.context.file).toString();
  const lines = fileContent.split('\n');
  const commentLines = lines.slice(loc.start.line - 1, loc.end.line);
  return commentLines.join('\n');
}

main();
