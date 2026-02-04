// 1. HELPERS (Simulation & Utilities)

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock Fetch Function
 * Simulates an API that randomly fails with 500 errors or succeeds.
 */
async function mockFetch(url) {
  const random = Math.random();

  // Simulate network delay (between 500ms and 1500ms)
  await wait(500 + Math.random() * 1000);

  if (random < 0.2) {
    // 20% chance of 500 Server Error
    throw new Error("503 Service Unavailable");
  } else if (random < 0.3) {
    // 10% chance of 404 (Client Error - Should NOT retry)
    throw new Error("404 Not Found");
  } else {
    // Success
    return `Response data from ${url}`;
  }
}

// 2. RETRY LOGIC (Recursive with Exponential Backoff)

async function fetchWithRetry(url, retries = 3, delay = 1000) {
  try {
    console.log(`📡 Requesting: ${url}`);
    return await mockFetch(url);
  } catch (error) {
    // If we have retries left AND it's a 5xx error (simulated by checking message)
    const isServerError = error.message.includes("50"); // e.g. 500, 503

    if (retries > 0 && isServerError) {
      console.warn(
        `⚠️ Failed ${url} (${error.message}). Retrying in ${delay}ms...`,
      );
      await wait(delay);
      // Recursive call: decrease retries, double the delay (Exponential Backoff)
      return fetchWithRetry(url, retries - 1, delay * 2);
    } else {
      // No retries left OR it's a 4xx error -> Throw properly
      throw new Error(`❌ Final Failure for ${url}: ${error.message}`);
    }
  }
}

// 3. CONCURRENCY CONTROL (The Core Logic)

async function fetchWithConcurrency(urls, limit) {
  const results = [];
  const executing = []; // Tracks currently running promises

  for (const url of urls) {
    // Create the promise but don't await it yet (this starts execution)
    // We wrap it to ensure we capture the result (success or fail)
    const p = fetchWithRetry(url)
      .then((data) => {
        console.log(`✅ Success: ${url}`);
        results.push({ status: "fulfilled", value: data });
      })
      .catch((err) => {
        console.error(err.message);
        results.push({ status: "rejected", reason: err.message });
      })
      .finally(() => {
        // Remove THIS promise from the executing array when done
        executing.splice(executing.indexOf(p), 1);
      });

    executing.push(p);

    // If we hit the limit, wait for the FASTEST one to finish before starting next
    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }

  // Wait for the remaining trailing promises to finish
  await Promise.all(executing);
  return results;
}

// 4. MAIN EXECUTION

const apiUrls = [
  "API-1 (User Profile)",
  "API-2 (Dashboard Stats)",
  "API-3 (Notifications)",
  "API-4 (Settings)",
  "API-5 (Friends List)",
];

console.log("🚀 Starting requests with Concurrency Limit: 2\n");

fetchWithConcurrency(apiUrls, 2).then((finalResults) => {
  console.log("\n-----------------------------------");
  console.log("🏁 All requests finished!");
  console.log(finalResults);
});
