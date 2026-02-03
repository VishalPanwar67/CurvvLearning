# Comprehensive Guide to ES6+ (ECMAScript 2015 and Beyond)

Modern JavaScript is built on ES6+ features that make code **cleaner, safer, and easier to maintain**. This guide is designed as a **ready-to-read markdown reference** for daily use in **React, Node.js, and TypeScript** projects.

---

## 1. Variable Declarations (`let` & `const`)

ES6 replaced `var` with **block-scoped variables**.

### Why `var` Is a Problem

- Function-scoped
- Hoisted (can be used before declaration)
- Causes accidental bugs

### `let` and `const`

- **Block-scoped**
- Safer and predictable

```js
// ❌ var leaks outside block
if (true) {
  var x = 10;
}
console.log(x); // 10

// ✅ block-scoped
if (true) {
  const y = 10;
  let z = 20;
}
// ReferenceError
```

**Best Practice**

- Use `const` by default
- Use `let` only when reassignment is required

---

## 2. Arrow Functions (`=>`)

Arrow functions provide **shorter syntax** and **lexical `this`**.

```js
// Traditional function
const add = function (a, b) {
  return a + b;
};

// Arrow function
const add = (a, b) => a + b;
```

### Lexical `this`

- Arrow functions **do not create their own `this`**
- Inherit `this` from surrounding scope

**Use for:** callbacks, array methods  
**Avoid for:** object methods, constructors

---

## 3. Template Literals

Template literals use backticks (`` ` ``) and support:

- Expression interpolation
- Multi-line strings

```js
const user = "Vishal";
const role = "SDE-1";

const message = `Hello ${user},
You are an ${role}.`;
```

---

## 4. Destructuring Assignment

Extract values from objects or arrays easily.

### Object Destructuring

```js
const person = { name: "Alice", age: 25 };
const { name, age } = person;

// Rename
const { name: userName } = person;
```

### Array Destructuring

```js
const coords = [10, 20];
const [x, y] = coords;
```

---

## 5. Default Parameters

```js
function multiply(a, b = 1) {
  return a * b;
}

multiply(5); // 5
```

---

## 6. Rest & Spread Operators (`...`)

### Spread (Expand)

```js
const arr = [1, 2];
const newArr = [...arr, 3];

const obj = { a: 1 };
const newObj = { ...obj, b: 2 };
```

### Rest (Collect)

```js
function sum(...nums) {
  return nums.reduce((a, b) => a + b, 0);
}
```

---

## 7. ES Modules (`import` / `export`)

### Named Export

```js
export const add = (a, b) => a + b;
export const PI = 3.14;
```

```js
import { add, PI } from "./utils.js";
```

### Default Export

```js
export default class User {}
```

```js
import User from "./User.js";
```

---

## 8. Promises & Async/Await

### Promises

```js
fetchData()
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
```

### Async/Await

```js
async function getUser() {
  try {
    const res = await fetch("/api/user");
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}
```

---

## 9. Classes

```js
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a noise.`);
  }
}

class Dog extends Animal {
  speak() {
    console.log(`${this.name} barks.`);
  }
}
```

---

## 10. Modern ES6+ Features (ES2020+)

### Optional Chaining (`?.`)

```js
const city = user?.profile?.address?.city;
```

### Nullish Coalescing (`??`)

```js
const count = 0;
const result = count ?? 10; // 0
```

---

## 11. New Data Structures

### Set (Unique Values)

```js
const unique = new Set([1, 2, 2, 3]);
```

### Map (Flexible Keys)

```js
const map = new Map();
map.set("key", "value");
map.set({ id: 1 }, "object key");
```

---

## Final Notes

- ES6+ is **mandatory** for modern JavaScript
- These features improve **readability, safety, and performance**
- Mastery of this guide = strong foundation for React, Node.js & TypeScript

---

**Happy Coding 🚀**
