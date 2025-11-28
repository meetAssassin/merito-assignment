# Heartbeat Monitoring System (Node.js)

## Overview
This project implements a simple heartbeat monitoring system.

Each service is expected to emit a heartbeat at a fixed interval.
If a service misses a configured number of consecutive heartbeats,
the system triggers an alert at the timestamp of the missed heartbeat.

---

## Assumptions
- Heartbeat events may arrive out of order.
- Some events may be malformed (missing fields or invalid timestamps).
- Malformed events are skipped safely.
- Heartbeat monitoring is performed independently per service.

---

## How It Works
1. Events are loaded from a JSON file.
2. Invalid or malformed events are skipped.
3. Heartbeats are grouped by service.
4. Timestamps for each service are sorted chronologically.
5. Expected heartbeat times are simulated based on the interval.
6. Consecutive missed heartbeats are counted.
7. An alert is triggered when the allowed miss threshold is reached.

---

## Project Structure
heartbeat-monitor/
├── index.js # Entry point
├── main.js # Heartbeat detection logic
├── test.js # Test cases
├── events.json # Input events
├── package.json
└── README.md


---

## Requirements
- Node.js v16+

---

## Run the Program
```bash
npm install
npm start
```

Run Tests
```bash
npm test
```


## All required test cases from the assignment are included:
- Working alert
- Near-miss (no alert)
- Unordered input
- Malformed events

## Output Format
- Alerts are returned in the following format:

```json
[
  {
    "service": "email",
    "alert_at": "2025-08-04T10:03:00Z"
  }
]
```
