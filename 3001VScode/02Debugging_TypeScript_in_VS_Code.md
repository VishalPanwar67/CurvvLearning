# Comprehensive Guide to Debugging TypeScript in Visual Studio Code

Debugging TypeScript in Visual Studio Code is seamless because VS Code understands the relationship between TypeScript and the JavaScript it generates. Using **Source Maps**, you can debug `.ts` files while executing `.js` code.

---

## 1. The Core of TypeScript Debugging: Source Maps

TypeScript must be transpiled to JavaScript before execution. **Source Maps** connect compiled JavaScript back to the original TypeScript.

### Enabling Source Maps

Configure your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES5",
    "module": "CommonJS",
    "outDir": "out",
    "sourceMap": true
  }
}
```

---

## 2. Debugging Node.js Applications

VS Code includes a built-in Node.js debugger.

### Setting up `launch.json`

1. Open **Run and Debug** (`Ctrl+Shift+D`)
2. Click **Create a launch.json file**
3. Choose **Node.js**

Example configuration:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}/app.ts",
      "preLaunchTask": "tsc: build - tsconfig.json",
      "outFiles": ["${workspaceFolder}/out/**/*.js"]
    }
  ]
}
```

### Key Fields

- **program**: Entry TypeScript file
- **preLaunchTask**: Compiles TS before debugging
- **outFiles**: Location of generated JavaScript

---

## 3. Client-Side (Browser) Debugging

You can debug TypeScript in **Edge** or **Chrome** directly from VS Code.

### Example Setup

- `helloweb.ts`
- `helloweb.html` → references compiled JS
- `tsconfig.json` with source maps enabled

### Browser Debug Configuration

```json
{
  "type": "msedge",
  "request": "launch",
  "name": "Launch Edge",
  "url": "file:///${workspaceFolder}/helloweb.html",
  "webRoot": "${workspaceFolder}"
}
```

---

## 4. Advanced Mapping with `outFiles`

Typical structure:

- `src/` → TypeScript
- `out/` or `dist/` → JavaScript + maps

The debugger uses `outFiles` glob patterns to match `.js.map` files to `.ts` files.

---

## 5. Troubleshooting Common Issues

### Error: JavaScript Cannot Be Found

Possible reasons:
1. TypeScript not compiled
2. `sourceMap` disabled
3. Incorrect `outFiles` path

### Breakpoints Are Greyed Out

- JS file out of sync
- Source map not loaded properly

---

## 6. Integrated Debugging Tools

- **Debug Console**
- **Variables**
- **Call Stack**
- **Watch Expressions**

---

