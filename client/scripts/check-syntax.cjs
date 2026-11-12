// Usage (from client/):  node ../../../../.gemini/... (see DESIGN.md)  OR
//   node <path-to-this-file> src/pages/Home.js src/components/Footer.js
// Parses/compiles the given JS files with the project's Babel config to catch
// syntax errors without running a full webpack build.
const path = require("path");
const clientDir = process.cwd();
const babel = require(require.resolve("@babel/core", { paths: [clientDir] }));
let failed = 0;
for (const file of process.argv.slice(2)) {
  try {
    babel.transformFileSync(path.resolve(clientDir, file), { cwd: clientDir });
    console.log("OK   " + file);
  } catch (error) {
    failed += 1;
    console.log("FAIL " + file + "\n" + error.message);
  }
}
process.exit(failed ? 1 : 0);

