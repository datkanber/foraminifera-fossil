// Starts the actual API and frontend, captures figures, then stops only its own servers.
const path = require('node:path');
const fs = require('node:fs');
const { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '../../../../..');
const api = path.join(root, 'api');
const client = path.join(root, 'client');
require(path.join(api, 'node_modules/dotenv')).config({ path: path.join(api, '.env'), quiet: true });
const { driver } = require(path.join(api, 'src/db/neo4j'));
const app = require(path.join(api, 'src/app'));
const delay = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  let server, webpack;
  let logs = '';
  try {
    await driver.verifyConnectivity();
    console.log('Real Neo4j connection verified.');
    server = await new Promise((resolve, reject) => {
      const s = app.listen(5055, '127.0.0.1', () => resolve(s));
      s.on('error', reject);
    });
    webpack = spawn(process.execPath, [path.join(client, 'node_modules/webpack-cli/bin/cli.js'),
      'serve', '--mode', 'development', '--port', '3055', '--host', '127.0.0.1', '--no-open', '--no-hot'], {
      cwd: client, windowsHide: true,
      env: { ...process.env, REACT_APP_API_URL: 'http://127.0.0.1:5055' },
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    webpack.stdout.on('data', d => { logs += d; });
    webpack.stderr.on('data', d => { logs += d; });
    let ready = false;
    for (let i = 0; i < 120; i++) {
      if (webpack.exitCode !== null) throw new Error(`Frontend exited: ${logs.slice(-3000)}`);
      try {
        const res = await fetch('http://127.0.0.1:3055');
        if (res.ok) { ready = true; break; }
      } catch {}
      await delay(250);
    }
    if (!ready) throw new Error(`Frontend not ready: ${logs.slice(-3000)}`);
    console.log('Frontend ready; capturing English figures.');
    const code = await new Promise((resolve, reject) => {
      const capture = spawn(process.execPath, [path.join(__dirname, 'capture_figures.cjs')], {
        cwd: root, windowsHide: true, stdio: 'inherit',
        env: { ...process.env, CAPTURE_BASE_URL: 'http://127.0.0.1:3055', CAPTURE_API_URL: 'http://127.0.0.1:5055' },
      });
      capture.on('error', reject);
      capture.on('exit', resolve);
    });
    if (code !== 0) throw new Error(`Capture failed with exit code ${code}`);
  } finally {
    if (webpack) webpack.kill();
    if (server) await new Promise(r => server.close(r));
    await driver.close();
    const evidence = path.resolve(__dirname, '../evidence');
    fs.mkdirSync(evidence, { recursive: true });
    fs.writeFileSync(path.join(evidence, 'frontend_build.log'), logs);
  }
})().catch(e => { console.error(e.message); process.exitCode = 1; });
