const fs = require("fs");
const { detectMissedHeartbeats } = require("./main");

function loadEvents(path) {
  try {
    const raw = fs.readFileSync(path, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error loading events:", err.message);
    return [];
  }
}

const events = loadEvents("./events.json");

const EXPECTED_INTERVAL_SECONDS = 60;
const ALLOWED_MISSES = 3;

const alerts = detectMissedHeartbeats(
  events,
  EXPECTED_INTERVAL_SECONDS,
  ALLOWED_MISSES
);

console.log("Alerts:", alerts);
