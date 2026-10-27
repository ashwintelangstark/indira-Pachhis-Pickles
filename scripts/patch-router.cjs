const fs = require("fs");
const path = require("path");

const filesToPatch = [
  path.join(
    __dirname,
    "../node_modules/@tanstack/router-plugin/dist/esm/core/code-splitter/compilers.js",
  ),
  path.join(
    __dirname,
    "../node_modules/@tanstack/router-plugin/dist/cjs/core/code-splitter/compilers.cjs",
  ),
];

for (const file of filesToPatch) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, "utf8");
    if (content.includes("import('${splitUrl}')")) {
      content = content.replaceAll("import('${splitUrl}')", "import(${JSON.stringify(splitUrl)})");
      fs.writeFileSync(file, content, "utf8");
      console.log(`[patch] Patched splitUrl quote issue in ${path.basename(file)}`);
    }
  }
}
