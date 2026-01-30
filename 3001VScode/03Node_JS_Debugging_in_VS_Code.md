# Node.js Debugging in Visual Studio Code: The Definitive Guide

Visual Studio Code features a world-class, built-in debugger for the **Node.js** runtime. It allows you to debug JavaScript, TypeScript, and other transpiled languages without external tools.

---

## 1. Quick-Start Debugging Methods

### A. Auto Attach

Automatically attaches the debugger to Node.js processes launched from the integrated terminal.

- Enable via Command Palette → `Debug: Toggle Auto Attach`
- Modes:
  - **Smart**: Excludes `node_modules`
  - **Always**: Attaches to all Node processes
  - **OnlyWithFlag**: Requires `--inspect`

### B. JavaScript Debug Terminal

A special terminal that automatically debugs Node commands.

- Open via terminal dropdown → **Create JavaScript Debug Terminal**

### C. Launch Configurations

Use `launch.json` for full control over debugging.

---

## 2. The `launch.json` File

Located at `.vscode/launch.json`.

### Common Attributes

- `program`
- `args`
- `envFile`
- `stopOnEntry`
- `skipFiles`

---

## 3. Advanced Debugging Scenarios

### Attach to Existing Process

```bash
node --inspect app.js
```

Use **Attach to Node Process** in VS Code.

### Debugging with nodemon

```json
{
  "type": "node",
  "request": "launch",
  "name": "Nodemon",
  "runtimeExecutable": "nodemon",
  "program": "${workspaceFolder}/app.js",
  "restart": true,
  "console": "integratedTerminal"
}
```

### Remote Debugging

Use `localRoot` and `remoteRoot` for path mapping.

---

## 4. Source Maps and Transpiled Languages

Required for TypeScript, Babel, Webpack.

### Fix Unverified Breakpoints

1. Enable source maps
2. Correct `outFiles`
3. Configure `sourceMapPathOverrides`

---

## 5. Efficiency Features

### Smart Stepping

```json
"smartStep": true
```

### Environment Variables

```json
"env": { "NODE_ENV": "development" },
"envFile": "${workspaceFolder}/.env"
```

---

## 6. Output Control

- `internalConsole`
- `integratedTerminal`
- `externalTerminal`

---

# Advanced Node.js Debugging

## 1. Remote Debugging

```json
{
  "type": "node",
  "request": "attach",
  "name": "Attach to Remote",
  "address": "192.168.1.100",
  "port": 9229,
  "localRoot": "${workspaceFolder}",
  "remoteRoot": "/var/www/app"
}
```

---

## 2. Advanced Breakpoints

### Logpoints
- Log without stopping execution

### Conditional & Hit Count Breakpoints
- Pause only on specific conditions

### Triggered Breakpoints
- Activate only after another breakpoint fires

---

## 3. Productivity Tools

### Restart Frame
- Re-run function without restarting session

### Skip Unimportant Code

```json
"skipFiles": [
  "<node_internals>/**",
  "${workspaceFolder}/node_modules/**/*.js"
]
```

---

## 4. Breakpoint Validation

VS Code uses `--nolazy` by default to ensure stable breakpoints.

---

## 5. Debugging WebAssembly

Supports C++, Rust, Zig via DWARF debugging.

---

## Common Tips

- Use `--preserve-symlinks` with npm link
- Ensure correct ESM setup for `.mjs` files

---

Happy Debugging 🚀
