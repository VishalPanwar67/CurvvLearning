# Day 1: Node.js Runtime & Module Systems

**Focus:** Architectural foundations and modern modularity.

---

## 1. Node.js Runtime Architecture

Node.js is a cross-platform, JavaScript runtime environment that executes JavaScript code outside a web browser. It is built on the **Chrome V8 engine** and the **Libuv library**.

### Core Components

* **V8 Engine:** A high-performance open-source engine developed by Google that compiles JavaScript directly into machine code.
* **Libuv:** A C++ library that provides the event loop and handles asynchronous operations such as file system I/O, networking, and concurrency.

### The "Single-Threaded" Model

Node.js runs JavaScript on a single thread (the Main Thread). However, it achieves high throughput by offloading blocking operations to the **Worker Pool** or the **OS Kernel** through Libuv.

### The Event Loop Phases

The Event Loop is the mechanism that allows Node.js to perform non-blocking I/O operations. It rotates through several phases:

1. **Timers:** Executes `setTimeout()` and `setInterval()` callbacks.
2. **Pending Callbacks:** Executes I/O callbacks deferred from the previous loop iteration.
3. **Poll:** Retrieves new I/O events; Node will block here if nothing else is scheduled.
4. **Check:** Executes `setImmediate()` callbacks.
5. **Close Callbacks:** Executes "close" events (e.g., `socket.on('close')`).

---

## 2. Module Systems: CommonJS vs. ESM

JavaScript in Node.js can be organized using two primary module systems.

### Comparison Table

| Feature | CommonJS (CJS) | ECMAScript Modules (ESM) |
| --- | --- | --- |
| **Syntax** | `require()` / `module.exports` | `import` / `export` |
| **Loading** | Synchronous (at runtime) | Asynchronous (static analysis) |
| **Default in Node** | Yes (standard) | Requires `"type": "module"` in `package.json` |
| **Top-level Await** | No | Yes |
| **Best For** | Legacy Node apps, CLI tools | Modern Web, MERN Stack, Frontend-Backend parity |

### ESM Workarounds

```js
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

---

## 3. Implementation Strategy

For the **Sifar Grinds** repository, **ESM (ECMAScript Modules)** has been selected as the primary module strategy to ensure:

* Compatibility with modern frontend frameworks (React/Vite).
* Utilization of Tree Shaking for optimized production builds.
* Access to modern language features like Top-level Await.

### Repository Configuration (`package.json`)

```json
{
  "name": "sifar-node-grinds",
  "version": "1.0.0",
  "type": "module",
  "description": "Professional Node.js learning journey",
  "main": "index.js"
}
```

---

## 4. Key Takeaways

* **Never Block the Event Loop:** Heavy CPU-intensive tasks should be offloaded to child processes or worker threads.
* **Async by Default:** Prefer asynchronous APIs over synchronous ones.
* **Module Choice:** ESM is the professional standard for new SDE-1 projects in 2026.
