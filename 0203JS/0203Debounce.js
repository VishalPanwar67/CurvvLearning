// Debounce function implementation
function debounce(func, delay) {
  let timerId;

  return function (...args) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Example usage:
const handleSearch = debounce((query) => {
  console.log("Searching for:", query);
}, 300);

//Throttle function implementation

function throttle(func, limit) {
  let inThrottle;

  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
// Example usage:
const handleResize = throttle(() => {
  console.log("Window resized");
}, 500);

//Deep Clone function implementation

function deepClone(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }
  const clonedObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clonedObj[key] = deepClone(obj[key]);
    }
  }
  return clonedObj;
}

// Example usage:
const original = { a: 1, b: { c: 2 } };
const cloned = deepClone(original);
cloned.b.c = 3;
console.log(original.b.c); // Outputs: 2

//Group By
function groupBy(array, key) {
  return array.reduce((result, currentItem) => {
    const groupKey = currentItem[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(currentItem);
    return result;
  }, {});
}

// Example usage:
const data = [
  { category: "fruit", name: "apple" },
  { category: "vegetable", name: "carrot" },
  { category: "fruit", name: "banana" },
];
const groupedData = groupBy(data, "category");
console.log(groupedData);
// Outputs:
// {
//   fruit: [{ category: "fruit", name: "apple" }, { category: "fruit", name: "banana" }],
//   vegetable: [{ category: "vegetable", name: "carrot" }]
// }
