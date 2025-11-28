function parseTimestamp(ts) {
  const date = new Date(ts);
  return isNaN(date.getTime()) ? null : date;
}

function detectMissedHeartbeats(
  events,
  expectedIntervalSeconds,
  allowedMisses
) {
  const services = {};

  // Validate & group events
  for (const event of events) {
    if (!event.service || !event.timestamp) continue;

    const time = parseTimestamp(event.timestamp);
    if (!time) continue;

    if (!services[event.service]) {
      services[event.service] = [];
    }

    services[event.service].push(time);
  }

  // Sorting events per service
  for (const service in services) {
    services[service].sort((a, b) => a - b);
  }

  const alerts = [];

  // Detecting missed heartbeats
  for (const service in services) {
    const times = services[service];
    let missed = 0;

    let expectedTime = times[0];

    for (let i = 1; i < times.length; i++) {
      expectedTime = new Date(
        expectedTime.getTime() + expectedIntervalSeconds * 1000
      );

      while (times[i] > expectedTime) {
        missed++;

        if (missed === allowedMisses) {
          alerts.push({
            service,
            alert_at: expectedTime.toISOString()
          });
          break;
        }

        expectedTime = new Date(
          expectedTime.getTime() + expectedIntervalSeconds * 1000
        );
      }
      
      // Heartbeat arrived, reset counter
      missed = 0;
    }
  }

  return alerts;
}

module.exports = { detectMissedHeartbeats };
