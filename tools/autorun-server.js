#!/usr/bin/env node
const http = require('http');
const { spawnSync, spawn } = require('child_process');
const os = require('os');
const fs = require('fs');

const PORT = process.env.FHEVM_AUTORUN_PORT || 8765;

function whichSync(cmd) {
  try {
    const res = spawnSync('which', [cmd]);
    if (res.status === 0) return res.stdout.toString().trim();
  } catch (e) {}
  return null;
}

function tryOpenTerminalAndRun(command) {
  const linuxTerms = [
    'gnome-terminal',
    'konsole',
    'xfce4-terminal',
    'x-terminal-emulator',
    'xterm',
    'tilix',
  ];

  if (os.platform() === 'linux') {
    for (const term of linuxTerms) {
      const path = whichSync(term);
      if (!path) continue;
      try {
        if (term === 'gnome-terminal') {
          spawn(term, ['--', 'bash', '-lc', `${command}; exec bash`], { detached: true, stdio: 'ignore' }).unref();
          return true;
        }
        if (term === 'konsole') {
          spawn(term, ['-e', 'bash', '-lc', `${command}; exec bash`], { detached: true, stdio: 'ignore' }).unref();
          return true;
        }
        if (term === 'xterm' || term === 'x-terminal-emulator' || term === 'xfce4-terminal' || term === 'tilix') {
          spawn(term, ['-e', 'bash', '-lc', `${command}; exec bash`], { detached: true, stdio: 'ignore' }).unref();
          return true;
        }
      } catch (e) {
        // continue trying
      }
    }
  }

  if (os.platform() === 'darwin') {
    // macOS: try osascript to open Terminal.app
    try {
      const osa = `tell application \"Terminal\" to do script \"${command.replace(/"/g, '\\"')}\"`;
      spawnSync('osascript', ['-e', osa]);
      return true;
    } catch (e) {}
  }

  if (os.platform() === 'win32') {
    try {
      spawn('cmd.exe', ['/c', 'start', 'cmd.exe', '/k', command], { detached: true, stdio: 'ignore' }).unref();
      return true;
    } catch (e) {}
  }

  return false;
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  if (req.url === '/run-guided' && req.method === 'POST') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    const cli = 'npx create-fhevm-playground-pro guided';
    const launched = tryOpenTerminalAndRun(cli);
    if (launched) {
      res.end(JSON.stringify({ ok: true, message: 'Launched interactive guided in a new terminal.' }));
      return;
    }

    // Fallback: run a non-interactive create (best-effort)
    const fallbackCmd = ['create-fhevm-playground-pro', 'create', '--name', 'codespace-example', '--category', 'confidential-stablecoin', '--pro'];
    // Use npx to guarantee resolution
    const child = spawn('npx', fallbackCmd, { stdio: 'inherit' });
    child.on('error', (err) => {
      res.end(JSON.stringify({ ok: false, message: 'Failed to spawn fallback create.', error: err.message }));
    });
    child.on('exit', (code) => {
      if (code === 0) {
        res.end(JSON.stringify({ ok: true, message: 'Ran non-interactive create (fallback).' }));
      } else {
        res.end(JSON.stringify({ ok: false, message: 'Fallback create exited with code ' + code }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
  res.end(JSON.stringify({ ok: false, message: 'Not found' }));
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`fhEVM autorun helper listening on http://127.0.0.1:${PORT}`);
  console.log('POST /run-guided to trigger interactive or fallback create');
});

process.on('SIGINT', () => process.exit());
