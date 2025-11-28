const assert = require("assert");
const { detectMissedHeartbeats } = require("./main");

const INTERVAL = 60;
const MISSES = 3;


// 1. Working alert case

(() => {
  const events = [
    { service: "email", timestamp: "2025-08-04T10:00:00Z" },
    { service: "email", timestamp: "2025-08-04T10:06:00Z" }
  ];

  const result = detectMissedHeartbeats(events, INTERVAL, MISSES);

  assert.deepStrictEqual(result, [
    { service: "email", alert_at: "2025-08-04T10:03:00.000Z" }
  ]);
})();

// 2. Near Miss Case

(() => {
  const events = [
    { service: "db", timestamp: "2025-08-04T10:00:00Z" },
    { service: "db", timestamp: "2025-08-04T10:03:00Z" }
  ];

  const result = detectMissedHeartbeats(events, INTERVAL, MISSES);

  assert.deepStrictEqual(result, []);
})();

// 3. Unordered Inputs

(() => {
  const events = [
    { service: "cache", timestamp: "2025-08-04T10:06:00Z" },
    { service: "cache", timestamp: "2025-08-04T10:00:00Z" }
  ];

  const result = detectMissedHeartbeats(events, INTERVAL, MISSES);

  assert.deepStrictEqual(result, [
    { service: "cache", alert_at: "2025-08-04T10:03:00.000Z" }
  ]);
})();

// 4. Malformed Events

(() => {
  const events = [
    { service: "email" },
    { service: "email", timestamp: "not-a-date" },
    { timestamp: "2025-08-04T10:00:00Z" },
    { service: "email", timestamp: "2025-08-04T10:00:00Z" },
    { service: "email", timestamp: "2025-08-04T10:06:00Z" }
  ];

  const result = detectMissedHeartbeats(events, INTERVAL, MISSES);

  assert.deepStrictEqual(result, [
    { service: "email", alert_at: "2025-08-04T10:03:00.000Z" }
  ]);
})();

console.log("All tests passed");
